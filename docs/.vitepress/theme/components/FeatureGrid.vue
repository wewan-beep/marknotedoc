<script setup>
import { computed } from 'vue'

const props = defineProps({ lang: { type: String, default: 'zh' } })
const isZh = computed(() => props.lang !== 'en')

const icons = {
  pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  clipboard: '<rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4V3h6v1"/><path d="M9 11h6M9 15h4"/>',
  palette: '<circle cx="12" cy="12" r="9"/><circle cx="9" cy="10" r="1.2"/><circle cx="15" cy="10" r="1.2"/><circle cx="12" cy="16" r="1.2"/>',
  image: '<rect x="4" y="5" width="16" height="14" rx="2"/><circle cx="9" cy="10" r="1.4"/><path d="M5 17l5-5 4 4 3-3 2 2"/>',
  history: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/><path d="M4 12a8 8 0 0 1 3-6"/>',
  importIcon: '<path d="M12 4v10"/><path d="M8 10l4 4 4-4"/><rect x="5" y="17" width="14" height="3" rx="1"/>'
}

const items = computed(() =>
  isZh.value
    ? [
        {
          icon: 'pen',
          title: '双栏实时预览',
          desc: 'markdown-it 逐字渲染，代码高亮、表格、公式即时呈现。同步滚动开关一开，左边滚到哪右边跟到哪。',
          tag: 'markdown-it · hljs · katex'
        },
        {
          icon: 'clipboard',
          title: '富文本剪贴板',
          desc: '写进剪贴板的是 text/html，不是 HTML 字符串。粘到公众号后台，标题边框、引用底色、代码配色全部保留。',
          tag: 'ClipboardItem · execCommand fallback'
        },
        {
          icon: 'palette',
          title: '10 套排版主题',
          desc: '蓝调、青野、暖橙、紫罗兰、墨印、极简、科技、暖纸、夜色、糖果。换主题只改 CSS 变量，预览与复制同步。',
          tag: 'themes.css · localStorage'
        },
        {
          icon: 'image',
          title: '图片直传 MinIO',
          desc: '选图、拖拽、粘贴截图三条路都通。优先落 MinIO，连不上自动降级到本地磁盘，写文章不会被存储拖住。',
          tag: 'S3 API · local fallback'
        },
        {
          icon: 'history',
          title: '快照式历史版本',
          desc: '每次保存都写一条 note_history，version 自增。改崩了随时回滚到上一版，回收站里的笔记也能捞回来。',
          tag: 'note_history · version +1'
        },
        {
          icon: 'importIcon',
          title: '导入 / 导出 Markdown',
          desc: '多选 .md 文件或直接拖进笔记列表，标题自动取首个一级标题。写完也能导出 .md，数据始终在你手里。',
          tag: 'import · export · 5MB/file'
        }
      ]
    : [
        {
          icon: 'pen',
          title: 'Split-view live preview',
          desc: 'markdown-it renders as you type, with syntax highlighting, tables and math. Flip on sync-scroll and both panes stay in step.',
          tag: 'markdown-it · hljs · katex'
        },
        {
          icon: 'clipboard',
          title: 'True rich-text clipboard',
          desc: 'What lands on the clipboard is text/html — not an HTML string. Paste into the WeChat editor and borders, quote backgrounds and code colors survive.',
          tag: 'ClipboardItem · execCommand fallback'
        },
        {
          icon: 'palette',
          title: '10 editorial themes',
          desc: 'Blue, Field, Amber, Violet, Ink, Minimal, Tech, Paper, Night, Candy. Each theme is a set of CSS variables — preview and clipboard stay in sync.',
          tag: 'themes.css · localStorage'
        },
        {
          icon: 'image',
          title: 'Images straight to MinIO',
          desc: 'Pick, drop or paste a screenshot. Files go to MinIO first; if it is down, the backend silently falls back to local disk so writing never blocks.',
          tag: 'S3 API · local fallback'
        },
        {
          icon: 'history',
          title: 'Snapshot history',
          desc: 'Every save writes a note_history row and bumps the version. Roll back when an edit goes wrong, restore deleted notes from the recycle bin.',
          tag: 'note_history · version +1'
        },
        {
          icon: 'importIcon',
          title: 'Markdown in, Markdown out',
          desc: 'Batch-import .md files or drag them onto the list; the title comes from the first H1. Export any note back to .md — your data stays yours.',
          tag: 'import · export · 5MB/file'
        }
      ]
)
</script>

<template>
  <section class="mn-section">
    <div class="mn-section__head">
      <span class="mn-eyebrow">{{ isZh ? 'capabilities' : 'capabilities' }}</span>
      <h2 class="mn-section__title">{{ isZh ? '六个真正会用到的能力' : 'Six capabilities you will actually use' }}</h2>
      <p class="mn-section__desc">
        {{ isZh
          ? '不是功能清单堆砌——每一块都对应一个具体的写作痛点，代码里都能找到实现。'
          : 'Not a feature checklist — each one answers a concrete writing pain, and every piece is implemented in code.' }}
      </p>
    </div>

    <div class="mn-grid mn-grid--3">
      <article v-for="it in items" :key="it.title" class="mn-card">
        <div class="mn-card__icon">
          <svg viewBox="0 0 24 24" v-html="icons[it.icon]"></svg>
        </div>
        <h3>{{ it.title }}</h3>
        <p>{{ it.desc }}</p>
        <span class="mn-card__tag">{{ it.tag }}</span>
      </article>
    </div>
  </section>
</template>
