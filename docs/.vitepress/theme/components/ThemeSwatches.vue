<script setup>
import { computed } from 'vue'

const props = defineProps({ lang: { type: String, default: 'zh' } })
const isZh = computed(() => props.lang !== 'en')

const themes = computed(() => [
  { id: 'blue', zh: '蓝调', en: 'Blue', color: '#3b82f6', bg: 'linear-gradient(135deg,#2255cc,#3b82f6)' },
  { id: 'green', zh: '青野', en: 'Field', color: '#10b981', bg: 'linear-gradient(135deg,#0b7c5a,#10b981)' },
  { id: 'orange', zh: '暖橙', en: 'Amber', color: '#f59e0b', bg: 'linear-gradient(135deg,#c27405,#f59e0b)' },
  { id: 'purple', zh: '紫罗兰', en: 'Violet', color: '#8b5cf6', bg: 'linear-gradient(135deg,#6438c9,#8b5cf6)' },
  { id: 'ink', zh: '墨印', en: 'Ink', color: '#3d3d3d', bg: 'linear-gradient(135deg,#101010,#3d3d3d)' },
  { id: 'minimal', zh: '极简', en: 'Minimal', color: '#7c8798', bg: 'linear-gradient(135deg,#59616e,#7c8798)' },
  { id: 'tech', zh: '科技', en: 'Tech', color: '#2563eb', bg: 'linear-gradient(135deg,#12306f,#2563eb)' },
  { id: 'paper', zh: '暖纸', en: 'Paper', color: '#c08a3e', bg: 'linear-gradient(135deg,#8a6224,#c08a3e)' },
  { id: 'night', zh: '夜色', en: 'Night', color: '#1c212b', bg: 'linear-gradient(135deg,#0b0e14,#2b3340)' },
  { id: 'candy', zh: '糖果', en: 'Candy', color: '#ff5c8a', bg: 'linear-gradient(135deg,#c9215a,#ff5c8a)' }
])
</script>

<template>
  <div>
    <div class="mn-swatches">
      <div
        v-for="t in themes"
        :key="t.id"
        class="mn-swatch"
        :style="{ background: t.bg, color: t.color }"
      >
        <div style="position:relative;z-index:1;color:#fff">{{ isZh ? t.zh : t.en }}</div>
        <span>{{ t.id }}</span>
      </div>
    </div>
    <p class="mn-section__desc" style="margin-top:14px;font-size:12px">
      <span class="mn-mono">{{ isZh ? 'localStorage key = mn_article_theme' : 'localStorage key = mn_article_theme' }}</span>
      <template v-if="isZh"> · 换主题只改 CSS 变量，预览与复制取同一份计算样式</template>
      <template v-else> · themes are CSS variables only; preview and clipboard read the same computed styles</template>
    </p>
  </div>
</template>
