# Quick Start

Get MarkNote running in under ten minutes: dependencies → backend → frontend → first article.

## Prerequisites

| Requirement | Version | Notes |
| --- | --- | --- |
| JDK | 17+ | Required by Spring Boot 3.2; verify with `java -version` |
| Maven | 3.8+ | Or use your IDE's bundled Maven |
| Node.js | 18+ | Frontend dev server and build |
| Docker | any | Runs MySQL 8 and MinIO; optional if you self-host both |

## Step 1 — Dependencies

<CommandBlock label="powershell" code="cd marknote
docker compose up -d
docker compose ps" />

- MySQL: `localhost:3306`, database `marknote`, `sql/init.sql` runs automatically on first boot
- MinIO: API `localhost:9000`, console `localhost:9001`, credentials `minioadmin / minioadmin`

`init.sql` creates the four tables, the demo account `admin / 123456` and a few sample notes.

## Step 2 — Backend

<CommandBlock label="powershell" code="cd marknote-server
mvn spring-boot:run" />

On Windows you can also double-click `start-backend.bat`. A healthy start logs:

```
Tomcat started on port(s): 8080 (http)
Started MarknoteApplication in 3.2 seconds
```

If startup hangs on the database, check `application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/marknote?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai
    username: root
    password: root
```

## Step 3 — Frontend

<CommandBlock label="powershell" code="cd marknote-web
npm install
npm run dev" />

Open <http://localhost:3000> and sign in with **admin / 123456**.

::: tip Accessing over LAN
`vite.config.js` sets `host: '0.0.0.0'`, so `http://<your-ip>:3000` works from another machine. Restart `npm run dev` after changing the config, and allow port 3000 through the firewall.
:::

## Verification checklist

| Check | Expected |
| --- | --- |
| Sign in | “Saved” indicator appears; six sample notes listed |
| New note | `# 无标题笔记` appears; cursor focuses and selects the title field |
| Rename | Saves after 0.9s; Enter saves immediately and the list updates |
| Typing | Preview renders live, code blocks highlighted |
| Image upload | Toolbar “🖼 图片” inserts `![](url)`, preview shows the image |
| Copy | “复制公众号 HTML” reports rich text + inlined styles |
| Theme | Picking “Candy” turns headings pink and rounded |

## Ports

| Service | Port | Purpose |
| --- | --- | --- |
| Vite dev server | 3000 | Dev UI, proxies `/api` to 8080 |
| Spring Boot | 8080 | REST API and `/files/**` images |
| MySQL | 3306 | Data |
| MinIO API | 9000 | Object storage |
| MinIO console | 9001 | Bucket management UI |

## Next

- [Deployment](/en/guide/deploy) — configuration, jar packaging, Nginx, LAN/IP pitfalls
- [Architecture](/en/guide/architecture) — request path, data model, copy pipeline
- [Features](/en/guide/features) — what each feature does and where the code lives
