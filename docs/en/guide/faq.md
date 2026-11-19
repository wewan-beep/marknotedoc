# FAQ

## Startup

### `Communications link failure` on boot

The datasource doesn't match your MySQL. Check `spring.datasource` in `application.yml` — the most common cause is a remote database address with the old password.

### Frontend runs, but login fails with a network error

Either the backend isn't running or the proxy target is wrong. Default is `http://127.0.0.1:8080`:

```powershell
$env:VITE_PROXY_TARGET="http://10.20.6.77:8080"
npm run dev
```

### The page won't open over a LAN IP

1. `vite.config.js` must contain `host: '0.0.0.0'` (already in the repo)
2. **Restart** `npm run dev` after changing it — hot reload does not rebind the socket
3. Allow 3000 and 8080 through the firewall

## Images

### Every image is broken

Inspect the `<img src>` value:

| URL shape | What to check |
| --- | --- |
| `/files/xxx.png` | Is `/files` proxied to the backend on 8080? |
| `/oss/marknote/xxx` | Is `/oss` proxied to MinIO on 9000? Is the bucket public-read? |
| `http://localhost:8080/...` | Legacy rows with a hard-coded host — bulk-fix or re-upload |

### MinIO is up but uploads still land locally

The backend logs “MinIO 上传失败，改用本地存储”. Usual causes: wrong endpoint port, wrong credentials, container not ready. Functionality is unaffected; re-upload after fixing.

### Images are missing inside WeChat

WeChat's servers must be able to download the URL. Private ranges (`192.168.x.x`, `10.x.x.x`) fail. Configure `app.file-base-url` or `minio.public-endpoint` with a public address.

## Copying

### All formatting is lost after pasting

- Make sure you clicked “复制公众号 HTML”, not “导出 MD”
- Use `localhost` or `https`; the clipboard API is disabled on plain `http`
- Paste with `Ctrl+V`, never “paste as plain text” (`Ctrl+Shift+V`)

### Code blocks lose their colours

WeChat strips `pre`; the project converts it to `<section>` and keeps hljs token colours. If colours are gone, you're on an older build.

### Formulas become `$...$` text

A platform limitation — KaTeX needs CSS and DOM structures WeChat doesn't allow. Use a screenshot instead.

## Data

### History grows too large

`note_history` stores a full snapshot per save. Keep the latest N per note:

```sql
DELETE h FROM note_history h
JOIN (
  SELECT id FROM note_history WHERE note_id = ? ORDER BY version DESC LIMIT 50, 1000
) t ON t.id = h.id;
```

### How do I restore a deleted note?

It's still in the recycle bin: switch to the “回收站” tab, select it, hit restore. Permanently deleted notes require a database backup.

### Moving to a new server

1. `mysqldump -uroot -p marknote > dump.sql` and import on the new host
2. Copy `uploads/` and the MinIO data directory
3. Update the datasource and image base configuration

## Themes

### Background colour doesn't carry over

Background comes from the preview root's computed styles. Confirm you're on a current build (`rootParts` in `Editor.vue` reads `background / padding / border-radius`) and that the theme is applied before copying.

### Adding my own theme

1. Add `.mn-t-yourid { --t-h2-bl:#xxx; ... }` to `src/styles/themes.css`
2. Add `{ id:'yourid', name:'Your theme', color:'#xxx', desc:'...' }` to `src/theme/themes.js`
3. Refresh — the theme appears in the dropdown

## Deployment

### 404 after Nginx reverse proxying

`proxy_pass` needs the trailing slash, otherwise the `/api` prefix is forwarded:

```nginx
location /api/ { proxy_pass http://127.0.0.1:8080/; }   # correct
location /api/ { proxy_pass http://127.0.0.1:8080; }    # keeps /api
```

### Copy stops working behind HTTPS

Mixed content (http images) is blocked by the browser. Serve images over https too, or proxy `/files` and `/oss` through the same domain.
