<<<<<<< HEAD
# marknotedoc
=======
# MarkNote 文档站（VitePress）

MarkNote 项目的官网 + 文档站，中英双语，深色科技风。内容与 `marknote/` 工程保持一致，图与代码都取自真实实现。

## 开发

```bash
cd marknote-site
npm install
npm run dev      # http://localhost:5173
```

## 构建

```bash
npm run build    # 产物在 docs/.vitepress/dist
npm run preview  # 本地预览构建结果
```

## 部署

产物是纯静态文件，丢给任意静态服务器即可。Nginx：

```nginx
server {
    listen 80;
    server_name notes-docs.example.com;
    root /usr/share/nginx/html/marknote-site;
    index index.html;
    location / { try_files $uri $uri/ /index.html; }
}
```

子路径部署（例如 `https://example.com/marknote/`）需要改 `docs/.vitepress/config.mts` 的 `base: '/marknote/'`，然后重新构建。

## 目录

```
marknote-site/
├── package.json
└── docs/
    ├── .vitepress/
    │   ├── config.mts                 # 站点配置、导航、侧边栏、i18n
    │   └── theme/
    │       ├── index.ts               # 注册全局组件
    │       ├── custom.css             # 科技风主题（深空底 + 网格 + 玻璃卡片）
    │       └── components/
    │           ├── HomeHero.vue       # 首屏：渐变标题、悬浮标签、倾斜截图卡
    │           ├── FeatureGrid.vue    # 六能力卡片（SVG 图标，无 emoji）
    │           ├── PipelineFlow.vue   # 请求链路四节点
    │           ├── ScreenshotWall.vue # 界面墙
    │           ├── ThemeSwatches.vue  # 10 套主题色板
    │           ├── CommandBlock.vue   # 带复制按钮的命令块
    │           └── CopyAnatomy.vue    # 复制流水线六步
    ├── public/
    │   ├── logo.svg
    │   └── images/                    # 6 张界面图
    ├── index.md                       # 中文首页
    ├── guide/                         # 中文文档：quick-start / deploy / architecture / features / faq
    └── en/
        ├── index.md                   # English home
        └── guide/                     # English docs
```

## 加一篇文档

1. 在 `docs/guide/` 新建 `xxx.md`，写 `# 标题`
2. 在 `docs/.vitepress/config.mts` 的 `zhSidebar['/guide/']` 里加一条 `{ text, link }`
3. 英文版同样在 `docs/en/guide/xxx.md` 写一份，并在 `enSidebar` 里加一条

首页自定义区块直接在 `index.md` 里用已注册的全局组件（`HomeHero`、`FeatureGrid` 等）。

## 设计说明

- 深色是默认外观（`appearance: 'dark'`），强调色分层：cyan `#22d3ee` / blue `#4f7cff` / violet `#a78bfa`
- 全局背景用 fixed 网格 + 三处径向光晕，`mask-image` 让网格在顶部渐隐
- 卡片、代码块统一 1px 半透明描边 + hover 微光，动效只用 transform / opacity
- 所有交互组件零外部依赖，不加载远程字体或 CDN，离线可跑
>>>>>>> a558e75 (初始化VitePress站点项目)
