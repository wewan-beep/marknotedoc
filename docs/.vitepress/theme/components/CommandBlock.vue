<script setup>
import { ref } from 'vue'

const props = defineProps({
  code: { type: String, required: true },
  label: { type: String, default: 'shell' }
})

const copied = ref(false)

async function copy() {
  const text = props.code.replace(/^\s*\$\s*/gm, '').trim()
  try {
    await navigator.clipboard.writeText(text)
    copied.value = true
  } catch (e) {
    const ta = document.createElement('textarea')
    ta.value = text
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
    copied.value = true
  }
  setTimeout(() => (copied.value = false), 1600)
}
</script>

<template>
  <div class="mn-cmd">
    <div class="mn-cmd__bar">
      <span>{{ label }}</span>
      <button class="mn-cmd__copy" type="button" @click="copy">{{ copied ? '已复制' : '复制' }}</button>
    </div>
    <pre class="mn-cmd__body">{{ code }}</pre>
  </div>
</template>
