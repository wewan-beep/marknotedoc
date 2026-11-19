# 详细部署

从本机跑通到丢到服务器上给同事用，这一页把配置项、构建、Nginx、IP 访问的坑一次说清。

## 部署形态

```
                ┌───────────────────────────────────────────┐
  浏览器 :80 →  │ Nginx  /  → dist 静态文件                 │
                │        /api/  → 127.0.0.1:8080            │
                │        /files/ → 127.0.0.1:8080           │
                │        /oss/   → 127.0.0.1:9000           │
                └───────────────────────────────────────────┘
                              │
                    Spring Boot :8080 ── MySQL :3306
                              └──────  MinIO :9000
```

开发环境不用这么复杂：Vite dev server 已经把这四条路径都代理好了（`/api`、`/files`、`/oss`）。

## application.yml 全量配置

| 配置 | 默认值 | 说明 |
| --- | --- | --- |
| `server.port` | `8080` | 后端端口 |
| `spring.datasource.url` | `jdbc:mysql://localhost:3306/marknote` | 数据库地址，必改 |
| `spring.datasource.username/password` | `root` / `root` | 数据库账号 |
| `spring.servlet.multipart.max-file-size` | `10MB` | 单文件上限，与前端校验一致 |
| `minio.endpoint` | `http://127.0.0.1:9000` | 后端连 MinIO（服务端到服务端） |
| `minio.public-endpoint` | 空 | 浏览器访问图片的地址。**留空返回相对路径 `/oss/...`**，由代理转发 |
| `minio.access-key/secret-key` | `minioadmin` / `minioadmin` | MinIO 凭据 |
| `minio.bucket-name` | `marknote` | 首传自动建桶并设公开读 |
| `jwt.secret` | 内置长串 | 生产必须换成随机串 |
| `jwt.expire` | `86400000` | token 有效期（毫秒），默认 24h |
| `app.upload-dir` | `./uploads` | MinIO 不可用时的本地目录 |
| `app.file-base-url` | 空 | 本地图片前缀。留空返回 `/files/...` 相对路径 |

::: tip 两个「留空」
`minio.public-endpoint` 与 `app.file-base-url` 留空时，后端返回**相对路径**，浏览器按当前域名去请求，由前端代理或 Nginx 转发。这样换 IP、换域名都不用改配置，也不会出现「别人打开图片指向他自己 localhost」的问题。

要让**公众号后台**抓图，就必须给绝对地址（见下文）。
:::

## 后端打包

<CommandBlock label="powershell" code="cd marknote-server
mvn clean package -DskipTests
java -jar target/marknote-server-1.0.0.jar" />

Windows 后台常驻可以用 NSSM，或者简单点：

<CommandBlock label="powershell" code="start /min java -jar marknote-server-1.0.0.jar" />

## 前端构建与 Nginx

<CommandBlock label="powershell" code="cd marknote-web
npm install
npm run build" />

产物在 `dist/`，拷到服务器后配 Nginx：

```nginx
server {
    listen       80;
    server_name  notes.example.com;

    root /usr/share/nginx/html/marknote;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # 本地兜底图片：后端 /files/** 静态映射
    location /files/ {
        proxy_pass http://127.0.0.1:8080/files/;
    }

    # MinIO 图片：public-endpoint 留空时后端返回 /oss/{bucket}/{object}
    location /oss/ {
        proxy_pass http://127.0.0.1:9000/;
    }
}
```

::: warning 少一条 location 就会裂图
`/api`、`/files`、`/oss` 三条都要有。只配 `/api` 时，页面能打开、登录能成功，但图片全是裂的。
:::

## 用 IP 访问的四个坑

**1. 页面打不开** — Vite 默认只监听 `localhost`。仓库里已改成 `host: '0.0.0.0'`；改完必须重启 `npm run dev`，并放行防火墙：

<CommandBlock label="powershell (管理员)" code="netsh advfirewall firewall add rule name=MarkNote-3000 dir=in action=allow protocol=TCP localport=3000
netsh advfirewall firewall add rule name=MarkNote-8080 dir=in action=allow protocol=TCP localport=8080" />

**2. 图片裂图** — 老版本把 `file-base-url` 写死成 `http://localhost:8080`，别人访问时图片指向他自己机器的 localhost。现在默认留空走相对路径即可解决。

**3. 代理指向错** — `vite.config.js` 的代理 target 可用环境变量覆盖：

<CommandBlock label="powershell" code="$env:VITE_PROXY_TARGET='http://10.20.6.77:8080'
npm run dev" />

**4. 老图片地址是绝对路径** — 历史数据里存的是 `http://localhost:8080/files/xxx`，换 IP 后仍会裂。批量修正：

```sql
UPDATE image SET url = REPLACE(url, 'http://localhost:8080', '') WHERE url LIKE 'http://localhost:8080%';
```

正文里的引用也要一起改（markdown 内容存的是替换后的 URL）：

```sql
UPDATE note SET content = REPLACE(content, 'http://localhost:8080/files/', '/files/')
WHERE content LIKE '%http://localhost:8080/files/%';
```

## 让公众号能抓到图片

公众号后台粘贴富文本时，会**由微信服务器去下载图片**，所以图片必须是公网可达的绝对地址：

1. 把 `app.file-base-url` 改成 `http://公网IP或域名:8080`（或经 Nginx 的 `http://notes.example.com`）
2. 或把 `minio.public-endpoint` 改成公网可达的 MinIO 地址
3. 改完重启后端，**重新上传**图片；之前存相对路径的老图，复制时前端会按当前域名补全，但微信侧仍需要一个它能访问到的地址

::: danger 内网 IP 不行
`192.168.x.x`、`10.x.x.x` 这类地址微信服务器访问不到，粘过去是裂图。要么用公网域名，要么把图片先下载再手动上传到公众号素材库。
:::

## HTTPS 与证书

剪贴板 API 只在 `https` 或 `localhost` 下完整可用。用域名部署时建议挂证书：

```nginx
server {
    listen 443 ssl http2;
    server_name notes.example.com;

    ssl_certificate     /etc/nginx/cert/notes.pem;
    ssl_certificate_key /etc/nginx/cert/notes.key;

    # 其余 location 与 80 端口一致
}
```

`http://` 下复制会退化为 `execCommand` 兜底，功能仍可用，只是部分浏览器行为不一致。

## 备份

```bash
# 数据库
mysqldump -uroot -p marknote > /backup/marknote_$(date +%F).sql

# 图片（MinIO 数据目录 + 本地兜底目录）
tar -czf /backup/marknote-files_$(date +%F).tar.gz /data/minio /opt/marknote/uploads
```

建议：MySQL 每日 dump 保留 7 天；MinIO 数据目录挂到独立磁盘；`jwt.secret` 换随机长串并写进部署文档。

## 上线前检查表

- [ ] `jwt.secret` 已替换为随机长串
- [ ] MySQL / MinIO 端口未对公网开放
- [ ] `/api`、`/files`、`/oss` 三条 Nginx location 都存在
- [ ] `minio.bucket-name` 已建桶并设公开读（首传自动处理，可手动确认）
- [ ] 前端 `dist` 已替换，浏览器强刷验证
- [ ] 备份脚本已跑过一次并验证可恢复
