# Features

Each feature explained by the problem it solves, how to use it, where the code lives, and what to watch out for.

## 1. Accounts

![Sign in](/images/01-login.png)

- Two tabs (sign in / sign up); pressing Enter submits
- New users are stored with bcrypt; the demo account `admin / 123456` is seeded in `sql/init.sql` and accepted as plain text
- Tokens last 24h; a 401 clears the token and redirects to login

Code: `views/Login.vue`, `controller/UserController.java`, `util/JwtUtil.java`

## 2. The three-pane workspace

![Workspace](/images/02-workspace.png)

| Pane | Contents |
| --- | --- |
| Left | Note list, search, all/recycle-bin switch, create, rename, delete |
| Middle | Markdown source with a toolbar (image / link / bold / code) |
| Right | WeChat-styled preview, ~760px wide — the same width as a WeChat article |

The top bar holds everything else: save state, create, import, save, export, theme, copy, sync-scroll, dark mode, history, sign out.

## 3. Live preview and sync scrolling

- Renders on every keystroke (markdown-it): headings, lists, tables, quotes, code blocks, inline code, KaTeX
- highlight.js for code; colours come from CSS variables and are inlined when copying
- “Sync scroll” proportionally drives the right pane as you scroll the left
- The bar shows `14 lines · 268 chars`; content saves 1.2s after you stop typing

## 4. Creating and renaming

Three entry points:

1. **Top-bar title field** — typing marks it dirty, saves after 0.9s debounce, Enter commits immediately and blurs
2. **List hover ✏️** — prompt dialog, validates non-empty and ≤80 chars
3. **Double-click a list title** — same dialog

Two details worth knowing:

- After creating a note, the title field is focused and fully selected
- If the first line of the body is exactly `# old title`, renaming rewrites that line so title and H1 never diverge

Code: `Editor.vue` (`commitTitle`, `renameNote`, `syncHeading`)

## 5. Importing Markdown

![Import](/images/03-import.png)

- Toolbar “导入 MD”: multi-select `.md / .markdown / .txt`, ≤5MB per file
- Drag files onto the list: a dashed blue zone appears, drop to import
- Title comes from the first `# H1`, otherwise the file name (extension stripped, capped at 80 chars)
- In-flight edits are flushed first, so nothing is lost
- Reuses `POST /note/add` — no backend changes

## 6. Image upload

![Image upload](/images/04-image.png)

Three entry points, one upload path (`uploadOne(file)`):

| Method | Action | Detail |
| --- | --- | --- |
| Toolbar | “🖼 图片” | Multi-select, inserted in cursor order |
| Drag | Drop onto the editor | Blue mask “release to upload” |
| Paste | Ctrl+V a screenshot | Clipboard image uploaded and inserted |

- MIME whitelist: png / jpg / jpeg / gif / webp / bmp / svg, ≤10MB each
- A spinner appears in the corner while uploading; multiple images keep their order
- Inserts `![name](url)`; “🔗 图片链接” inserts an external URL instead
- Backend prefers MinIO and falls back to `uploads/`, returning relative or absolute URLs depending on config

Code: `ImageController.java`, `MarkEditor.vue#uploadOne`, `api/image.js`

## 7. Ten editorial themes

![Themes](/images/05-theme.png)

| id | Name | Best for |
| --- | --- | --- |
| blue | Blue | general tutorials |
| green | Field | engineering notes |
| orange | Amber | experience sharing |
| purple | Violet | reading notes |
| ink | Ink | long-form, serif |
| minimal | Minimal | pure hierarchy |
| tech | Tech | API docs, architecture |
| paper | Paper | retrospectives, essays |
| night | Night | reviews, geek content |
| candy | Candy | light social posts |

- Selection is stored in `localStorage('mn_article_theme')`
- Themes declare CSS variables only — no pseudo-elements, because WeChat strips them
- Adding a theme is two edits: a variable block in `themes.css`, one entry in `themes.js`

## 8. Copy to WeChat (the core feature)

![Copy](/images/06-copy.png)

Clicking “复制公众号 HTML”:

1. Clones the preview DOM into an off-screen container for measurement
2. Inlines every computed style and strips classes
3. Converts `pre` to `section`, newlines to `<br>`, keeping hljs token colours
4. Degrades KaTeX to TeX text and reports the count
5. Writes `text/html` + `text/plain` via `ClipboardItem`, falling back to `execCommand`

Success message: “已复制「蓝调」主题（富文本 + 内联样式）”.

::: warning Three known behaviours
- Use `localhost` or `https`; on plain `http` LAN IPs the fallback path is used
- WeChat does not support KaTeX — formulas become TeX text
- WeChat must be able to fetch images, so private IPs produce broken images
:::

## 9. History and recycle bin

- Every save writes a `note_history` row and bumps `version`; the panel lists the last 50 and lets you restore
- Hover 🗑 moves a note to the recycle bin; restore or delete permanently from there
- “导出 MD” downloads the note as `.md`, named after the title

## 10. Details that matter

| Detail | Behaviour |
| --- | --- |
| Autosave | Content 1.2s debounce, title 0.9s, Enter commits instantly |
| Switching notes | Flushes pending edits first |
| Dark mode | UI only; it never changes the article theme |
| Word count | Live line and character counts in the top bar |
| 401 handling | Interceptor clears the token and redirects |

## Shortcuts

| Key | Action |
| --- | --- |
| `Ctrl+S` | Save now |
| `Ctrl+V` | Paste (screenshots upload automatically) |
| `Enter` (title field) | Commit the title immediately |
