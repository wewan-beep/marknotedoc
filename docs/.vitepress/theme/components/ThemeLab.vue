<script setup>
import { computed, ref } from 'vue'

const props = defineProps({ lang: { type: String, default: 'zh' } })
const isZh = computed(() => props.lang !== 'en')

const themes = [
  { id: 'blue', zh: '蓝调', en: 'Blue', a: '#3b82f6', ink: '#1f2937', qb: '#eff6ff', cb: '#f4f8ff', bd: '#dbeafe', p: '#f8fbff' },
  { id: 'green', zh: '青野', en: 'Green', a: '#10b981', ink: '#134e4a', qb: '#ecfdf5', cb: '#f5fdfa', bd: '#d1fae5', p: '#f8fefa' },
  { id: 'orange', zh: '暖橙', en: 'Orange', a: '#f59e0b', ink: '#7c2d12', qb: '#fff7ed', cb: '#fffaf2', bd: '#fde68a', p: '#fffbf4' },
  { id: 'purple', zh: '紫罗兰', en: 'Purple', a: '#8b5cf6', ink: '#4c1d95', qb: '#f5f3ff', cb: '#faf8ff', bd: '#ede9fe', p: '#faf8ff' },
  { id: 'ink', zh: '墨印', en: 'Ink', a: '#111111', ink: '#111111', qb: '#f4f4f4', cb: '#fafafa', bd: '#e5e5e5', p: '#ffffff' },
  { id: 'minimal', zh: '极简', en: 'Minimal', a: '#59616e', ink: '#1f2937', qb: '#f6f7f9', cb: '#fafafa', bd: '#e6e9ee', p: '#fbfbfc' },
  { id: 'tech', zh: '科技', en: 'Tech', a: '#2563eb', ink: '#0f172a', qb: '#eef4ff', cb: '#f6f9ff', bd: '#dbeafe', p: '#f5f9ff' },
  { id: 'paper', zh: '暖纸', en: 'Paper', a: '#c08a3e', ink: '#4a3218', qb: '#fdf6e9', cb: '#fffaf0', bd: '#ead9bd', p: '#fffaf0' },
  { id: 'night', zh: '夜色', en: 'Night', a: '#60a5fa', ink: '#e5edf8', qb: '#141b26', cb: '#0f1620', bd: '#243044', p: '#0f1620' },
  { id: 'candy', zh: '糖果', en: 'Candy', a: '#ff5c8a', ink: '#831843', qb: '#fff1f5', cb: '#fff8fa', bd: '#ffe0e9', p: '#fff7fa' }
]

const idx = ref(0)
const cur = computed(() => themes[idx.value])

const previewStyle = computed(() => ({
  '--lab-a': cur.value.a,
  '--lab-ink': cur.value.ink,
  '--lab-qb': cur.value.qb,
  '--lab-cb': cur.value.cb,
  '--lab-bd': cur.value.bd,
  '--lab-paper': cur.value.p
}))

const t = computed(() =>
  isZh.value
    ? {
        eyebrow: 'playground',
        title: '十套主题，点一下就换',
        desc: '真实编辑器里的主题引擎就是这样：只切换 CSS 变量，正文一个字不动。下面这份预览用的是同一套变量，你可以随便点。',
        hint: '点击色块切换主题',
        previewTitle: '医保接口对接笔记',
        meta: '2026-11-19 · 3 分钟读完',
        lead: '接口联调最烦的不是签名，是字段对不上。这篇记一次真实的排障过程。',
        quote: '把能复现的最小请求先固定下来，再谈其他。',
        codeLabel: 'java',
        code: 'String sign = DigestUtils.hmacHex("HmacSHA256", body, key);',
        listA: '先确认 appId 与密钥属于同一环境',
        listB: '再把时间戳精度对齐到秒',
        badge: '已应用到预览',
        copyId: 'theme id'
      }
    : {
        eyebrow: 'playground',
        title: 'Ten themes, one click away',
        desc: 'The theme engine in the real editor works exactly like this: only CSS variables change, not a single word of the body. The preview below uses the same variables — click around.',
        hint: 'Click a swatch to switch',
        previewTitle: 'Insurance API integration notes',
        meta: 'Nov 19, 2026 · 3 min read',
        lead: 'The hard part of an integration is rarely the signature — it is the fields that refuse to line up.',
        quote: 'Lock down the smallest reproducible request first, then talk about anything else.',
        codeLabel: 'java',
        code: 'String sign = DigestUtils.hmacHex("HmacSHA256", body, key);',
        listA: 'Confirm appId and secret come from the same environment',
        listB: 'Then align timestamp precision to seconds',
        badge: 'Applied to preview',
        copyId: 'theme id'
      }
)
</script>

<template>
  <section class="mn-section mn-lab">
    <div class="mn-lab__grid">
      <div class="mn-lab__copy">
        <span class="mn-eyebrow">{{ t.eyebrow }}</span>
        <h2 class="mn-section__title">{{ t.title }}</h2>
        <p class="mn-section__desc">{{ t.desc }}</p>

        <div class="mn-lab__themes">
          <button
            v-for="(th, i) in themes"
            :key="th.id"
            type="button"
            class="mn-lab__swatch"
            :class="{ 'is-active': i === idx }"
            :style="{ background: `linear-gradient(135deg, ${th.a}, ${th.a}bb)` }"
            :aria-label="isZh ? th.zh : th.en"
            @click="idx = i"
          >
            <span class="mn-lab__swatch-dot"></span>
            <em>{{ isZh ? th.zh : th.en }}</em>
          </button>
        </div>

        <p class="mn-lab__hint">
          <span class="mn-dot mn-dot--live"></span>
          {{ t.hint }} · <span class="mn-mono">{{ t.copyId }} = {{ cur.id }}</span>
        </p>
      </div>

      <div class="mn-lab__preview" :style="previewStyle">
        <span :key="cur.id" class="mn-lab__flash" aria-hidden="true"></span>
        <div class="mn-lab__preview-bar">
          <span class="mn-dot"></span><span class="mn-dot"></span><span class="mn-dot mn-dot--live"></span>
          <span class="mn-lab__preview-theme">{{ cur.id }} · {{ isZh ? cur.zh : cur.en }}</span>
        </div>
        <article class="mn-lab__article">
          <h3>{{ t.previewTitle }}</h3>
          <div class="mn-lab__meta">{{ t.meta }}</div>
          <p>{{ t.lead }}</p>
          <blockquote>
            {{ t.quote }}
          </blockquote>
          <div class="mn-lab__code">
            <span>{{ t.codeLabel }}</span>
            <pre>{{ t.code }}</pre>
          </div>
          <ol>
            <li>{{ t.listA }}</li>
            <li>{{ t.listB }}</li>
          </ol>
          <div class="mn-lab__tag">{{ t.badge }}</div>
        </article>
      </div>
    </div>
  </section>
</template>

