<script setup>
import { computed } from 'vue'

const props = defineProps({ lang: { type: String, default: 'zh' } })
const isZh = computed(() => props.lang !== 'en')

const nodes = computed(() =>
  isZh.value
    ? [
        { i: '01', name: 'Vue 3 前端', meta: ':3000', desc: 'Vite + Element Plus，编辑器与预览分栏，/api 由 dev server 代理。' },
        { i: '02', name: 'Spring Boot 3', meta: ':8080', desc: 'JWT 拦截、统一返回、笔记与图片接口，MyBatis-Plus 读写 MySQL。' },
        { i: '03', name: 'MySQL 8', meta: 'marknote', desc: 'note / note_history / user / image 四表，保存即写快照。' },
        { i: '04', name: 'MinIO', meta: ':9000', desc: '图片对象存储；不可用时自动落本地 uploads/，经 /files/** 暴露。' }
      ]
    : [
        { i: '01', name: 'Vue 3 frontend', meta: ':3000', desc: 'Vite + Element Plus, split editor/preview panes, /api proxied by the dev server.' },
        { i: '02', name: 'Spring Boot 3', meta: ':8080', desc: 'JWT interceptor, unified responses, note and image APIs over MyBatis-Plus.' },
        { i: '03', name: 'MySQL 8', meta: 'marknote', desc: 'note / note_history / user / image — every save writes a snapshot row.' },
        { i: '04', name: 'MinIO', meta: ':9000', desc: 'Object storage for images; falls back to local uploads/ served by /files/**.' }
      ]
)
</script>

<template>
  <div class="mn-flow">
    <div v-for="n in nodes" :key="n.i" class="mn-flow__node">
      <div class="mn-flow__idx">{{ n.i }} / REQUEST PATH</div>
      <div class="mn-flow__name">{{ n.name }}</div>
      <div class="mn-flow__meta">{{ n.meta }}</div>
      <div class="mn-flow__desc">{{ n.desc }}</div>
    </div>
  </div>
</template>
