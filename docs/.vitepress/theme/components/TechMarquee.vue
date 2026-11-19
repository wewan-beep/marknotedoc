<script setup>
import { computed } from 'vue'

const props = defineProps({ lang: { type: String, default: 'zh' } })
const isZh = computed(() => props.lang !== 'en')

const stack = [
  { name: 'Vue 3', meta: 'Composition API' },
  { name: 'Vite', meta: 'dev server' },
  { name: 'Element Plus', meta: 'UI kit' },
  { name: 'Spring Boot 3', meta: 'JDK 17' },
  { name: 'MyBatis-Plus', meta: 'MySQL 8' },
  { name: 'MinIO', meta: 'S3 API' },
  { name: 'JWT', meta: 'stateless auth' },
  { name: 'markdown-it', meta: 'renderer' },
  { name: 'highlight.js', meta: 'code theme' },
  { name: 'KaTeX', meta: 'math' },
  { name: 'ClipboardItem', meta: 'text/html' },
  { name: 'Docker', meta: 'one command' }
]

const title = computed(() => (isZh.value ? '整条链路都是可替换的常见件' : 'Every link in the chain is a common, replaceable part'))
const note = computed(() => (isZh.value ? '没有自研框架，没有黑盒 SDK。' : 'No bespoke framework, no black-box SDK.'))
const doubled = computed(() => [...stack, ...stack])
</script>

<template>
  <section class="mn-marquee-wrap">
    <p class="mn-marquee__note"><b>{{ title }}</b> · {{ note }}</p>
    <div class="mn-marquee">
      <div class="mn-marquee__track">
        <span v-for="(s, i) in doubled" :key="s.name + i" class="mn-chip">
          <b>{{ s.name }}</b>
          <em>{{ s.meta }}</em>
        </span>
      </div>
    </div>
  </section>
</template>
