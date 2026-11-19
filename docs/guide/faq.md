# 常见问题

## 启动相关

### 后端启动报 `Communications link failure`

数据源地址、端口、账号密码与实际 MySQL 不一致。检查 `application.yml` 的 `spring.datasource`，尤其是改成远程库后忘了同步密码的情况。

### 前端起来了，登录提示网络错误

后端没起，或 `vite.config.js` 的代理 target 指错了地址。默认是 `http://127.0.0.1:8080`，后端在别的机器时用环境变量覆盖：

```powershell
$env:VITE_PROXY_TARGET="http://10.20.6.77:8080"
npm run dev
```

### 用局域网 IP 打不开页面

1. `vite.config.js` 必须有 `host: '0.0.0.0'`（仓库已配）
2. 改完配置后**重启** `npm run dev`，热更新不会重新绑定监听地址
3. 防火墙放行 3000 / 8080

## 图片相关

### 图片全部裂开

先看 `<img src>` 是什么：

| URL 形态 | 排查方向 |
| --- | --- |
| `/files/xxx.png` | Nginx 或 Vite 是否配了 `/files` 转发到后端 8080 |
| `/oss/marknote/xxx` | 是否配了 `/oss` 转发到 MinIO 9000；桶是否公开读 |
| `http://localhost:8080/...` | 老数据写死了 localhost，换 IP 后必然裂；批量改库或重传 |

### MinIO 起了但上传仍然落到本地

后端日志会打「MinIO 上传失败，改用本地存储」。常见原因：`minio.endpoint` 端口不对、密钥不对、容器还没 ready。功能不受影响，修好后重传即可。

### 公众号里图片不显示

微信服务器要能下载到这个 URL。`192.168.x.x` / `10.x.x.x` 这类内网地址它访问不到。解决：把 `app.file-base-url` 或 `minio.public-endpoint` 配成公网可达地址。

## 复制相关

### 复制到公众号后排版全丢

- 确认点的是「复制公众号 HTML」，不是「导出 MD」
- 确认用 `localhost` 或 `https` 打开；`http://` 局域网 IP 下浏览器禁用剪贴板 API
- 粘贴时用 `Ctrl+V`，不要用「粘贴为纯文本」（`Ctrl+Shift+V`）

### 代码块粘过去没有高亮

公众号会过滤 `pre`，项目已把它转成 `<section>` 并保留 hljs token 的颜色。如果仍然没色，检查是否用了旧版本代码（`buildWechatHtml` 里应有 `pre` 替换逻辑）。

### 公式粘过去变成 `$...$` 文本

平台限制。KaTeX 依赖 CSS 与 DOM 结构，公众号不支持。建议公式截图后作为图片插入。

## 数据相关

### 历史版本太多占空间

`note_history` 每次保存写一条全量快照。生产环境建议按 `note_id` 只保留最近 N 条：

```sql
DELETE h FROM note_history h
JOIN (
  SELECT id FROM note_history
  WHERE note_id = ?
  ORDER BY version DESC
  LIMIT 50, 1000
) t ON t.id = h.id;
```

### 误删笔记怎么恢复

回收站里还在：左栏切到「回收站」→ 选中 →「恢复」。彻底删除后只能从数据库备份恢复。

### 数据库迁移到新机器

1. `mysqldump -uroot -p marknote > dump.sql`
2. 新机器建库后导入
3. 同步 `uploads/` 目录与 MinIO 数据目录
4. 更新 `application.yml` 数据源与图片地址配置

## 主题相关

### 换主题后复制到公众号底色没变

底色来自预览根节点的计算样式。确认用的是当前版本（`Editor.vue` 里 `rootParts` 会读取 `background / padding / border-radius`），并且复制前主题已生效。

### 想加一套自己的主题

1. `src/styles/themes.css` 加 `.mn-t-yourid { --t-h2-bl:#xxx; ... }`
2. `src/theme/themes.js` 加一条 `{ id:'yourid', name:'你的主题', color:'#xxx', desc:'...' }`
3. 刷新页面即可在主题下拉里看到

## 部署相关

### Nginx 反代后接口 404

`location /api/` 的 `proxy_pass` 末尾要有 `/`，否则路径不会被去前缀：

```nginx
location /api/ { proxy_pass http://127.0.0.1:8080/; }   # 正确
location /api/ { proxy_pass http://127.0.0.1:8080; }    # 会把 /api 一起带过去
```

### HTTPS 后复制又失效了

混合内容（http 图片）会被浏览器拦截。把图片地址统一改成 https，或让 Nginx 同时代理 `/files` 与 `/oss`。
