# 快速开始

10 分钟内把 MarkNote 跑起来：起依赖 → 起后端 → 起前端 → 打开浏览器写第一篇。

## 前置条件

| 依赖 | 版本 | 说明 |
| --- | --- | --- |
| JDK | 17+ | Spring Boot 3.2 要求；`java -version` 确认 |
| Maven | 3.8+ | 或直接用 IDE 内置 Maven |
| Node.js | 18+ | 前端构建与开发服务器 |
| Docker | 任意 | 用来起 MySQL 8 与 MinIO；不用也可以自建 |

::: tip 只想先看界面？
前端可以脱离后端跑起来（登录会失败，但能看布局）。完整流程仍建议把后端一起起。
:::

## 第一步：拉起依赖

<CommandBlock label="powershell" code="cd marknote
docker compose up -d
docker compose ps" />

起来之后：

- MySQL：`localhost:3306`，库 `marknote`，首次启动自动执行 `sql/init.sql`
- MinIO：API `localhost:9000`，控制台 `localhost:9001`，账号 `minioadmin / minioadmin`

`init.sql` 里已经建好 4 张表、演示账号 `admin / 123456` 和几篇示例笔记。

不用 Docker 的话：自己装 MySQL 8 与 MinIO，新建 `marknote` 库后执行 `sql/init.sql`，再改后端数据源。

## 第二步：起后端

<CommandBlock label="powershell" code="cd marknote-server
mvn spring-boot:run" />

Windows 也可以双击根目录的 `start-backend.bat`。

启动成功的关键日志：

```
Tomcat started on port(s): 8080 (http)
Started MarknoteApplication in 3.2 seconds
```

如果卡在数据库连接，检查 `src/main/resources/application.yml`：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/marknote?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai
    username: root
    password: root
```

::: warning 数据源必须与你的 MySQL 一致
这套工程经常被改成远程数据库（例如 `jdbc:mysql://10.20.6.77:3307/marknote`），改完记得同步账号密码，否则启动直接报 `Communications link failure`。
:::

## 第三步：起前端

<CommandBlock label="powershell" code="cd marknote-web
npm install
npm run dev" />

或双击 `start-frontend.bat`。

打开 <http://localhost:3000>，用 **admin / 123456** 登录。

::: tip 用 IP 访问
`vite.config.js` 已设置 `host: '0.0.0.0'`，同网段用 `http://<你的IP>:3000` 可以直接访问。首次换配置必须重启 `npm run dev`，并放行防火墙 3000 端口。
:::

## 验证清单

| 检查项 | 预期结果 |
| --- | --- |
| 登录 | 顶栏出现「已保存」状态，左栏列出 6 篇示例笔记 |
| 新建笔记 | 右侧出现 `# 无标题笔记`，光标自动落在标题框并全选 |
| 改标题 | 输入 0.9 秒后自动保存；回车立即落库，列表项同步改名 |
| 写正文 | 右侧实时渲染，代码块带高亮 |
| 上传图片 | 工具栏「🖼 图片」选一张，正文插入 `![](url)`，预览出图 |
| 复制公众号 | 顶栏「复制公众号 HTML」，提示「已复制（富文本 + 内联样式）」 |
| 换主题 | 顶栏主题下拉选「糖果」，右侧标题变粉色圆角 |

## 第一篇笔记的推荐写法

~~~markdown
# 文章标题

## 一、背景

正文段落，支持 **加粗**、`行内代码`、[链接](https://example.com)。

## 二、代码示例

```java
public class Demo {
    public static void main(String[] args) {
        System.out.println("hello");
    }
}
```

> 引用块：主题会自动给它加左侧色条。

## 三、结论

- 要点一
- 要点二
~~~

写完点「复制公众号 HTML」，到公众号后台 Ctrl+V，标题边框、引用底色、代码配色都会跟预览一致。

## 端口一览

| 服务 | 端口 | 用途 |
| --- | --- | --- |
| 前端 Vite | 3000 | 开发服务器，`/api` 代理到 8080 |
| 后端 Spring Boot | 8080 | REST 接口、`/files/**` 静态图片 |
| MySQL | 3306 | 数据 |
| MinIO API | 9000 | 图片对象读写 |
| MinIO Console | 9001 | 网页管理桶与对象 |

## 下一步

- [详细部署](/guide/deploy)：改配置、打 jar、Nginx 反代、IP 访问排障
- [系统架构](/guide/architecture)：请求链路、数据模型、复制流水线
- [功能详解](/guide/features)：每个功能怎么用、代码在哪
