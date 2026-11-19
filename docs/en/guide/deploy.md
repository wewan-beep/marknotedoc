# Deployment

Everything from “it runs on my laptop” to “my colleagues use it through a domain”: configuration, packaging, Nginx, and the LAN pitfalls.

## Shape of a deployment

```
                ┌───────────────────────────────────────────┐
  browser :80 → │ Nginx  /  → dist (static build)           │
                │        /api/  → 127.0.0.1:8080            │
                │        /files/ → 127.0.0.1:8080           │
                │        /oss/   → 127.0.0.1:9000            │
                └───────────────────────────────────────────┘
                              │
                    Spring Boot :8080 ── MySQL :3306
                              └──────  MinIO :9000
```

In development you don't need this: the Vite dev server already proxies `/api`, `/files` and `/oss`.

## Configuration reference

| Key | Default | Notes |
| --- | --- | --- |
| `server.port` | `8080` | Backend port |
| `spring.datasource.url` | `jdbc:mysql://localhost:3306/marknote` | Must match your MySQL |
| `spring.datasource.username/password` | `root` / `root` | Credentials |
| `spring.servlet.multipart.max-file-size` | `10MB` | Matches the frontend limit |
| `minio.endpoint` | `http://127.0.0.1:9000` | Server-to-server MinIO endpoint |
| `minio.public-endpoint` | empty | Browser-facing MinIO base. **Empty = relative `/oss/...`** behind a proxy |
| `minio.access-key/secret-key` | `minioadmin` / `minioadmin` | MinIO credentials |
| `minio.bucket-name` | `marknote` | Bucket is created and set public-read on first upload |
| `jwt.secret` | built-in string | Replace with a random string in production |
| `jwt.expire` | `86400000` | Token lifetime in ms (24h) |
| `app.upload-dir` | `./uploads` | Local fallback directory |
| `app.file-base-url` | empty | Local image prefix. **Empty = relative `/files/...`** |

::: tip Why two values are empty by default
With both empty, the backend returns relative URLs and the browser requests them from the current origin — solved by the dev proxy or Nginx. Changing IPs or domains therefore requires no configuration changes, and nobody sees images pointing at their own `localhost`.
:::

## Build the backend

<CommandBlock label="powershell" code="cd marknote-server
mvn clean package -DskipTests
java -jar target/marknote-server-1.0.0.jar" />

## Build the frontend and serve with Nginx

<CommandBlock label="powershell" code="cd marknote-web
npm install
npm run build" />

```nginx
server {
    listen       80;
    server_name  notes.example.com;

    root /usr/share/nginx/html/marknote;
    index index.html;

    location / { try_files $uri $uri/ /index.html; }

    location /api/ {
        proxy_pass http://127.0.0.1:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # local fallback images served by the backend
    location /files/ { proxy_pass http://127.0.0.1:8080/files/; }

    # MinIO images when public-endpoint is empty
    location /oss/ { proxy_pass http://127.0.0.1:9000/; }
}
```

::: warning A missing location means broken images
You need `/api`, `/files` and `/oss`. With only `/api` the site loads and login works, but every image is broken.
:::

## Four LAN pitfalls

**1. The page doesn't load** — Vite binds to `localhost` by default. The repo sets `host: '0.0.0.0'`; restart `npm run dev` and open the firewall:

<CommandBlock label="powershell (admin)" code="netsh advfirewall firewall add rule name=MarkNote-3000 dir=in action=allow protocol=TCP localport=3000
netsh advfirewall firewall add rule name=MarkNote-8080 dir=in action=allow protocol=TCP localport=8080" />

**2. Broken images** — older versions hard-coded `http://localhost:8080` as the image base. Empty defaults plus relative paths fix it.

**3. Wrong proxy target** — override with an environment variable:

<CommandBlock label="powershell" code="$env:VITE_PROXY_TARGET='http://10.20.6.77:8080'
npm run dev" />

**4. Legacy absolute image URLs** — stored rows still contain `http://localhost:8080/files/...`. Fix them in bulk:

```sql
UPDATE image SET url = REPLACE(url, 'http://localhost:8080', '') WHERE url LIKE 'http://localhost:8080%';
UPDATE note SET content = REPLACE(content, 'http://localhost:8080/files/', '/files/')
WHERE content LIKE '%http://localhost:8080/files/%';
```

## Making images reachable by WeChat

When you paste rich text into the WeChat editor, **WeChat's servers download the images** — so the URL must be publicly reachable:

1. Set `app.file-base-url` to `http://public-host:8080` (or your Nginx domain)
2. Or point `minio.public-endpoint` at a public MinIO endpoint
3. Restart the backend and re-upload images

::: danger Private IPs won't work
`192.168.x.x` / `10.x.x.x` is unreachable from WeChat's servers. Use a public domain, or download images and upload them to the WeChat asset library manually.
:::

## HTTPS

The clipboard API is fully available only on `https` or `localhost`. Add a certificate for domain deployments:

```nginx
server {
    listen 443 ssl http2;
    server_name notes.example.com;

    ssl_certificate     /etc/nginx/cert/notes.pem;
    ssl_certificate_key /etc/nginx/cert/notes.key;

    # same locations as above
}
```

On plain `http` the copy feature falls back to `execCommand`, which still works but behaves slightly differently across browsers.

## Backups

```bash
mysqldump -uroot -p marknote > /backup/marknote_$(date +%F).sql
tar -czf /backup/marknote-files_$(date +%F).tar.gz /data/minio /opt/marknote/uploads
```

## Pre-flight checklist

- [ ] `jwt.secret` replaced with a random string
- [ ] MySQL / MinIO ports not exposed to the internet
- [ ] `/api`, `/files`, `/oss` all present in Nginx
- [ ] Bucket `marknote` exists and is public-read
- [ ] Fresh `dist` deployed and hard-refreshed
- [ ] Backup script executed once and a restore verified
