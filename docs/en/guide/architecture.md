# Architecture

A decoupled front end and back end, four layers, no extra middleware. This page explains how a request travels, how data is stored, and why the copy pipeline is built the way it is.

## Stack and responsibilities

| Layer | Choice | Responsibility |
| --- | --- | --- |
| Presentation | Vue 3 + Vite + Element Plus | Three-pane workspace, editor and preview, themes, upload UX |
| API | Spring Boot 3.2 | REST endpoints, JWT auth, unified responses, static mapping |
| Data | MyBatis-Plus + MySQL 8 | Notes, history snapshots, users, image records |
| Storage | MinIO (S3 API) | Image objects, local-disk fallback |

## Request path

<PipelineFlow lang="en" />

In development all four paths are proxied by Vite, so the browser only ever sees one origin — no CORS headaches:

| Frontend path | Proxy target | Purpose |
| --- | --- | --- |
| `/api/**` | `http://127.0.0.1:8080` | Business API (prefix removed) |
| `/files/**` | `http://127.0.0.1:8080` | Local fallback images |
| `/oss/**` | `http://127.0.0.1:9000` | MinIO images (prefix removed) |

## Authentication

1. `POST /user/login` verifies credentials (bcrypt, plus plain-text demo account) and issues a JWT
2. The frontend stores the token; an axios interceptor attaches `Authorization: <token>`
3. `JwtInterceptor` guards `/**`, excluding `/user/login`, `/user/register`, `/error`, `/files/**`
4. On 401 the frontend clears the token and redirects to login

::: tip Why `/files/**` is excluded
Images are requested by `<img src>`, which cannot send custom headers. Without the exclusion every fallback image would 401.
:::

## Data model

```sql
note           -- id, title, content, version, is_deleted, create_time, update_time, user_id
note_history   -- id, note_id, content, version, create_time
user           -- id, username, password, nickname, create_time
image          -- id, user_id, file_name, url, bucket, object_name, size, create_time
```

The save path writes the snapshot **before** updating the note:

```java
// NoteServiceImpl#updateNoteWithHistory (essentials)
// 1) read the current version, insert one note_history row
// 2) update content, title, version + 1, updateTime
// 3) null out userId / updateTime so client values cannot overwrite them
```

History therefore forms a continuous `version` sequence, and restoring is a lookup by version.

## Two image paths

```
upload(file)
  ├─ validate: MIME whitelist + ≤10MB
  ├─ try MinIO: ensureBucket → putObject
  │    success → URL = {public-endpoint}/marknote/{userId}/{uuid}.ext
  └─ failure → write uploads/{uuid}.ext locally
               URL = {file-base-url}/files/{uuid}.ext
```

Both prefixes can be empty, in which case relative URLs are returned and the proxy handles them — the core reason IP or domain changes need no config edits.

## The “copy to WeChat” pipeline

This is the part that is easy to get wrong. The WeChat editor strips `class`, `<style>` and `<pre>`, honouring only inline `style` attributes.

<CopyAnatomy lang="en" />

Two extra details:

- Page background, padding and radius of the theme are read from the **preview root node**, so full-bleed themes such as Paper and Night carry over
- Relative image URLs are absolutised before copying, otherwise WeChat cannot fetch them

## Theme mechanism

A theme is a set of CSS variables plus a few structural overrides:

```css
.markdown-body.mn-t-green { --t-h2-text:#065f46; --t-h2-bl:#10b981; --t-quote-bg:#f0fdf4; }
.markdown-body.mn-t-night { --t-bg:#1c212b; --t-text:#e5e9f0; --t-pre-bg:#11151c; }
```

`MarkEditor.vue` puts `mn-theme mn-t-{id}` on the preview root; `Editor.vue` reads `background / padding / border-radius` from that root while copying. Switching a theme only changes `localStorage('mn_article_theme')` — content is untouched.

## Frontend structure

```
src/
├── views/
│   ├── Login.vue          # sign in / sign up
│   └── Editor.vue         # workspace: list, title, import, theme, copy, history
├── components/
│   └── MarkEditor.vue     # editor + preview + toolbar + upload
├── theme/themes.js        # metadata for the 10 themes
├── styles/
│   ├── editor.css         # layout and base rules
│   └── themes.css         # theme variables
├── api/                   # note / user / image
└── utils/request.js       # axios wrapper, 401 → login
```

## Design trade-offs

| Trade-off | Rationale |
| --- | --- |
| Full snapshots, no diffs | Articles are a few KB; snapshots make rollback trivial. Trim to the latest 50 per note when it grows |
| No Redis or message queue | Single-author writing has no concurrency pressure; fewer moving parts |
| MinIO failure degrades to disk | Upload is on the writing hot path — degrading beats blocking |
| Relative URLs plus proxies | IP, domain and HTTPS changes need no backend edits |
| CSS variables, no pseudo-elements | WeChat filters pseudo-element styles; only real boxes carry over |

## Known limitations

- WeChat does not support KaTeX; formulas degrade to TeX text
- Clipboard API is incomplete on plain `http` outside localhost (`execCommand` fallback)
- Preview width is fixed at ~760px (WeChat article width); very wide tables scroll
- Single instance, no real-time collaboration
