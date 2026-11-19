<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({ lang: { type: String, default: 'zh' } })
const isZh = computed(() => props.lang !== 'en')

const shots = computed(() =>
  isZh.value
    ? [
        { img: '/images/01-login.png', title: '登录', meta: 'JWT · bcrypt' },
        { img: '/images/02-workspace.png', title: '工作台', meta: '三栏 · 实时预览' },
        { img: '/images/03-import.png', title: '导入 MD', meta: '多选 · 拖拽' },
        { img: '/images/04-image.png', title: '图片上传', meta: 'MinIO · 拖拽' },
        { img: '/images/05-theme.png', title: '主题切换', meta: '10 套 · 即换即用' },
        { img: '/images/06-copy.png', title: '复制到公众号', meta: '富文本 · 内联' }
      ]
    : [
        { img: '/images/01-login.png', title: 'Sign in', meta: 'JWT · bcrypt' },
        { img: '/images/02-workspace.png', title: 'Workspace', meta: '3 panes · live preview' },
        { img: '/images/03-import.png', title: 'Import', meta: 'multi-select · drag' },
        { img: '/images/04-image.png', title: 'Image upload', meta: 'MinIO · drag' },
        { img: '/images/05-theme.png', title: 'Themes', meta: '10 sets · instant' },
        { img: '/images/06-copy.png', title: 'Copy', meta: 'rich text · inlined' }
      ]
)

const active = ref(null)

function close() {
  active.value = null
}

function onKey(e) {
  if (e.key === 'Escape') close()
}

watch(active, (v) => {
  if (typeof document === 'undefined') return
  document.body.style.overflow = v ? 'hidden' : ''
})

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  if (typeof document !== 'undefined') document.body.style.overflow = ''
})
</script>

<template>
  <div class="mn-shots">
    <figure
      v-for="s in shots"
      :key="s.img"
      role="button"
      tabindex="0"
      @click="active = s"
      @keydown.enter="active = s"
    >
      <div class="mn-shots__frame">
        <img :src="s.img" :alt="s.title" loading="lazy" />
        <span class="mn-shots__zoom">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.6-3.6"/><path d="M11 8v6M8 11h6"/></svg>
        </span>
      </div>
      <figcaption>
        <b>{{ s.title }}</b>
        <span class="mn-mono">{{ s.meta }}</span>
      </figcaption>
    </figure>

    <Teleport to="body">
      <div v-if="active" class="mn-lightbox" @click.self="close">
        <img :src="active.img" :alt="active.title" />
        <div class="mn-lightbox__cap">
          <b>{{ active.title }}</b>
          <span class="mn-mono">{{ active.meta }}</span>
        </div>
        <button class="mn-lightbox__close" type="button" @click="close" aria-label="close">Esc</button>
      </div>
    </Teleport>
  </div>
</template>
