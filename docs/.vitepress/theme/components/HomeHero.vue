<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  lang: { type: String, default: 'zh' }
})

const isZh = computed(() => props.lang !== 'en')

const t = computed(() =>
  isZh.value
    ? {
        eyebrow: 'v1.0 · 本地优先 · 自托管',
        titleA: '把排版，',
        titleB: '交给代码',
        sub: '左边写 Markdown，右边实时出公众号排版。写完点一下，',
        subStrong: '富文本 + 全内联样式',
        subTail: '直接进剪贴板，粘到公众号后台不掉格式。',
        ctaPrimary: '5 分钟跑起来',
        ctaGhost: '看系统架构',
        stats: [
          { n: 10, l: '套排版主题' },
          { n: 12, l: '个 REST 接口' },
          { n: 4, l: '张数据表' },
          { n: 1, l: '条 compose 命令' }
        ],
        tagA: 'text/html 剪贴板',
        tagB: 'getComputedStyle 内联',
        cardTitle: 'marknote / editor',
        scroll: '往下看，有能点的东西'
      }
    : {
        eyebrow: 'v1.0 · local-first · self-hosted',
        titleA: 'Ship the layout,',
        titleB: 'not the fiddling',
        sub: 'Write Markdown on the left, get WeChat-ready typography on the right. One click puts ',
        subStrong: 'rich text with fully inlined styles',
        subTail: ' on your clipboard — paste and nothing breaks.',
        ctaPrimary: 'Run it in 5 minutes',
        ctaGhost: 'See architecture',
        stats: [
          { n: 10, l: 'editorial themes' },
          { n: 12, l: 'REST endpoints' },
          { n: 4, l: 'tables' },
          { n: 1, l: 'compose cmd' }
        ],
        tagA: 'text/html clipboard',
        tagB: 'getComputedStyle inlining',
        cardTitle: 'marknote / editor',
        scroll: 'scroll — there is stuff to click'
      }
)

/* ---------- 鼠标跟随光斑 ---------- */
const root = ref(null)
const spot = ref({ x: 50, y: 50, on: false })

function onMove(e) {
  const el = root.value
  if (!el) return
  const r = el.getBoundingClientRect()
  spot.value = {
    x: ((e.clientX - r.left) / r.width) * 100,
    y: ((e.clientY - r.top) / r.height) * 100,
    on: true
  }
}

function onLeave() {
  spot.value = { ...spot.value, on: false }
}

/* ---------- stats 数字滚动 ---------- */
const counts = ref(t.value.stats.map((s) => s.n))
let raf = 0

function runCount() {
  const targets = t.value.stats.map((s) => s.n)
  counts.value = targets.map(() => 0)
  const start = performance.now()
  const dur = 900
  const step = (now) => {
    const p = Math.min(1, (now - start) / dur)
    const ease = 1 - Math.pow(1 - p, 3)
    counts.value = targets.map((n) => Math.round(n * ease))
    if (p < 1) raf = requestAnimationFrame(step)
  }
  raf = requestAnimationFrame(step)
}

onMounted(() => {
  runCount()
  window.addEventListener('pointermove', onMove, { passive: true })
  root.value?.addEventListener('pointerleave', onLeave)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('pointermove', onMove)
})
</script>

<template>
  <section
    ref="root"
    class="mn-hero"
    :style="{
      '--spot-x': spot.x + '%',
      '--spot-y': spot.y + '%',
      '--spot-on': spot.on ? 1 : 0
    }"
  >
    <div class="mn-hero__bg" aria-hidden="true">
      <span class="mn-hero__grid"></span>
      <span class="mn-hero__aurora mn-hero__aurora--a"></span>
      <span class="mn-hero__aurora mn-hero__aurora--b"></span>
      <span class="mn-hero__spot"></span>
    </div>

    <div class="mn-hero__inner">
      <div class="mn-hero__copy">
        <span class="mn-eyebrow">
          <span class="mn-dot mn-dot--live"></span>
          {{ t.eyebrow }}
        </span>

        <h1>
          {{ t.titleA }}<br />
          <span class="mn-grad">{{ t.titleB }}</span>
          <span class="mn-cursor"></span>
        </h1>

        <p class="mn-hero__sub">
          {{ t.sub }}<strong>{{ t.subStrong }}</strong>{{ t.subTail }}
        </p>

        <div class="mn-hero__actions">
          <a class="mn-btn mn-btn--primary" :href="isZh ? '/guide/quick-start' : '/en/guide/quick-start'">
            {{ t.ctaPrimary }}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </a>
          <a class="mn-btn mn-btn--ghost" :href="isZh ? '/guide/architecture' : '/en/guide/architecture'">
            {{ t.ctaGhost }}
          </a>
        </div>

        <div class="mn-stats">
          <div v-for="(s, i) in t.stats" :key="s.l" class="mn-stat">
            <b>{{ counts[i] }}</b>
            <span>{{ s.l }}</span>
          </div>
        </div>
      </div>

      <div class="mn-hero__visual">
        <div class="mn-hero__glow"></div>
        <div class="mn-shot-card">
          <div class="mn-shot-card__bar">
            <span class="mn-dot"></span>
            <span class="mn-dot"></span>
            <span class="mn-dot mn-dot--live"></span>
            <span style="margin-left: 8px">{{ t.cardTitle }}</span>
          </div>
          <img src="/images/02-workspace.png" alt="MarkNote workspace" loading="eager" />
          <span class="mn-shot-card__scan" aria-hidden="true"></span>
        </div>
        <span class="mn-float-tag mn-float-tag--a">{{ t.tagA }}</span>
        <span class="mn-float-tag mn-float-tag--b">{{ t.tagB }}</span>
        <span class="mn-orbit mn-orbit--a" aria-hidden="true"></span>
        <span class="mn-orbit mn-orbit--b" aria-hidden="true"></span>
      </div>
    </div>

    <div class="mn-hero__scroll" aria-hidden="true">
      <span>{{ t.scroll }}</span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M6 13l6 6 6-6"/></svg>
    </div>
  </section>
</template>
