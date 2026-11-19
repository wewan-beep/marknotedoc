<script setup>
import { computed } from 'vue'

const props = defineProps({ lang: { type: String, default: 'zh' } })
const isZh = computed(() => props.lang !== 'en')

const rows = computed(() =>
  isZh.value
    ? [
        { t: '克隆到离屏容器', d: '把预览节点放进 fixed 定位、宽 760px 的 holder 里再量样式，保证与预览所见完全一致。' },
        { t: '计算样式全量内联', d: '对每个节点 getComputedStyle，拼 color / background / font / margin / padding / border / radius / list-style 等，写成 style 属性。' },
        { t: 'pre → section', d: '公众号过滤 <pre>，转成带背景的 <section>，换行转 <br>，hljs token 的颜色单独保留。' },
        { t: 'KaTeX 降级', d: '公式平台不支持，降级为等宽 TeX 文本并统计数量，复制后提示改用截图。' },
        { t: '两趟处理', d: '先采集全部节点再统一删 class、写 style，避免边删边采集导致 .markdown-body h1 这类后代选择器失效。' },
        { t: '写入剪贴板', d: 'ClipboardItem 写 text/html + text/plain；浏览器不支持时回落隐藏容器 + Range 选中 + execCommand。' }
      ]
    : [
        { t: 'Clone off-screen', d: 'The preview is cloned into a fixed, 760px-wide holder so computed styles match what you see.' },
        { t: 'Inline every computed style', d: 'For each node, getComputedStyle is flattened into color / background / font / margin / padding / border / radius / list-style.' },
        { t: 'pre → section', d: 'WeChat strips <pre>. Code blocks become styled <section> elements, newlines become <br>, hljs token colors are kept.' },
        { t: 'KaTeX fallback', d: 'Math is unsupported there, so it degrades to monospace TeX text and the UI warns you to use a screenshot instead.' },
        { t: 'Two-pass processing', d: 'Collect all nodes first, then strip class and write style — otherwise descendant selectors like .markdown-body h1 break mid-flight.' },
        { t: 'Clipboard write', d: 'ClipboardItem writes text/html + text/plain; if unavailable it falls back to a hidden container, Range selection and execCommand.' }
      ]
)
</script>

<template>
  <div class="mn-anatomy">
    <div v-for="(r, i) in rows" :key="r.t" class="mn-anatomy__row">
      <span class="mn-anatomy__idx">{{ String(i + 1).padStart(2, '0') }}</span>
      <div class="mn-anatomy__title">{{ r.t }}</div>
      <div class="mn-anatomy__desc">{{ r.d }}</div>
    </div>
  </div>
</template>
