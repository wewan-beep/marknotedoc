# 系统架构

前后端分离，四层结构，没有额外的中间件。这一页讲清楚：一次请求怎么走、数据怎么存、复制到公众号的流水线为什么这么设计。

## 技术栈与职责

| 层 | 选型 | 职责 |
| --- | --- | --- |
| 表现层 | Vue 3 + Vite + Element Plus | 三栏工作台、编辑与预览、主题、图片上传交互 |
| 接口层 | Spring Boot 3.2 | REST 接口、JWT 鉴权、统一返回、静态资源映射 |
| 数据层 | MyBatis-Plus + MySQL 8 | 笔记、历史快照、用户、图片记录 |
| 存储层 | MinIO（S3 API） | 图片对象存储，失败降级本地磁盘 |

## 请求链路

<PipelineFlow lang="zh" />

开发环境下四条路径都由 Vite 代理，所以浏览器只会看到 `:3000` 一个源，也就没有跨域的麻烦：

| 前端路径 | 代理目标 | 用途 |
| --- | --- | --- |
| `/api/**` | `http://127.0.0.1:8080` | 业务接口（去掉 `/api` 前缀） |
| `/files/**` | `http://127.0.0.1:8080` | 本地兜底图片 |
| `/oss/**` | `http://127.0.0.1:9000` | MinIO 图片（去掉 `/oss` 前缀） |

## 鉴权

1. `POST /user/login` 校验账号密码（兼容 bcrypt 与明文演示账号），签发 JWT
2. 前端把 token 存起来，axios 拦截器统一加 `Authorization: <token>`
3. `JwtInterceptor` 拦 `/**`，只放行 `/user/login`、`/user/register`、`/error`、`/files/**`
4. 401 时前端清 token 并跳登录页

::: tip 为什么 `/files/**` 要放行
图片是 `<img src>` 直接请求的，浏览器不会带自定义头。如果不放行，所有本地兜底图片都会 401。
:::

## 数据模型

```sql
note            -- id, title, content, version, is_deleted, create_time, update_time, user_id
note_history    -- id, note_id, content, version, create_time
user            -- id, username, password, nickname, create_time
image           -- id, user_id, file_name, url, bucket, object_name, size, create_time
```

保存链路的关键点：**先写快照，再更新正文**。

```java
// NoteServiceImpl#updateNoteWithHistory（要点）
// 1) 取当前版本，写一条 note_history
// 2) 正文 update：content、title、version + 1、updateTime
// 3) 更新时把 userId / updateTime 置 null，避免被前端传入值覆盖
```

这样即使前端连续保存，历史版本也是连续的 `version` 序列，回滚时按版本号取内容即可。

## 图片双通道

```
upload(file)
  ├─ 校验：类型白名单 + ≤10MB
  ├─ 试 MinIO：ensureBucket → putObject
  │    成功 → URL = {public-endpoint}/marknote/{userId}/{uuid}.ext
  └─ 失败 → 落本地 uploads/{uuid}.ext
              URL = {file-base-url}/files/{uuid}.ext
```

两个 URL 前缀都可留空，留空时返回相对路径，由代理转发——这是「换 IP 不用改配置」的关键设计。

## 「复制到公众号」流水线

这是整个项目最不容易做对的地方。公众号编辑器会过滤 `class`、`<style>`、`<pre>`，只认元素上的内联 `style`。

<CopyAnatomy lang="zh" />

补充两个实现细节：

- 主题的整页底色、内边距、圆角从**预览根节点**的计算样式读取，所以「暖纸」「夜色」这类整页底色能一起带进公众号
- 相对路径图片在复制前会拼成绝对地址，否则公众号抓不到图

## 主题机制

一套主题 = 一组 CSS 变量 + 少量结构覆盖：

```css
/* themes.css 摘要 */
.markdown-body.mn-t-green { --t-h2-text:#065f46; --t-h2-bl:#10b981; --t-quote-bg:#f0fdf4; }
.markdown-body.mn-t-night { --t-bg:#1c212b; --t-text:#e5e9f0; --t-pre-bg:#11151c; }
```

`MarkEditor.vue` 给预览根节点挂 `mn-theme mn-t-{id}`；`Editor.vue` 复制时从根节点 `getComputedStyle` 取 `background / padding / border-radius`。切换主题只改 `localStorage('mn_article_theme')`，正文零改动。

## 前端结构

```
src/
├── views/
│   ├── Login.vue          # 登录 / 注册
│   └── Editor.vue         # 主工作台：列表、标题、导入、主题、复制、历史
├── components/
│   └── MarkEditor.vue     # 编辑区 + 预览区 + 工具栏 + 图片上传
├── theme/themes.js        # 10 套主题元数据
├── styles/
│   ├── editor.css         # 布局与基础规则
│   └── themes.css         # 主题变量
├── api/                   # note / user / image
└── utils/request.js       # axios 封装，401 跳登录
```

## 几个设计取舍

| 取舍 | 理由 |
| --- | --- |
| 保存时写全量快照，不做 diff | 笔记正文通常几 KB，全量最简单、回滚最可靠；量大后可按 `note_id` 只留最近 50 条 |
| 不引入 Redis / 消息队列 | 单人写作场景无并发压力，减少部署依赖 |
| MinIO 失败降级本地 | 图片上传是写作阻塞点，宁可降级也不能让人写不下去 |
| 相对路径 + 代理，而非写死绝对地址 | 换 IP、换域名、上 HTTPS 都不用改后端配置 |
| 主题用 CSS 变量而非伪元素 | 公众号会过滤伪元素样式，真实元素边框/背景才能带过去 |

## 已知限制

- 公众号不支持 KaTeX，公式降级为 TeX 文本
- `http://` 非 localhost 环境下剪贴板 API 不完整，走 `execCommand` 兜底
- 预览宽度固定约 760px（公众号正文宽度），超宽表格会横向滚动
- 单实例部署，未做多用户实时协同
