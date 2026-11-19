<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, computed } from 'vue'
import { useData } from 'vitepress'

const { lang } = useData()

const STORE_KEY = 'mn_mp_promo'
const visible = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

const isEn = computed(() => lang.value === 'en-US')

const text = computed(() =>
  isEn.value
    ? {
        label: 'official account',
        title: '夜入烟雨',
        desc: 'Long-form notes from real repositories — full code, real traps, weekly.',
        scan: 'Scan with WeChat to follow',
        more: 'Learn more',
        never: 'Do not show again'
      }
    : {
        label: '公众号',
        title: '夜入烟雨',
        desc: '只写真跑过的技术长文：完整代码、真实坑点、周更。',
        scan: '微信扫码关注',
        more: '看看写了什么',
        never: '不再提示'
      }
)

const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') close()
}

const close = () => {
  visible.value = false
}

const dismissForever = () => {
  try {
    localStorage.setItem(STORE_KEY, 'never')
  } catch {}
  visible.value = false
}

onMounted(() => {
  let state: string | null = null
  try {
    state = localStorage.getItem(STORE_KEY)
  } catch {}
  if (state === 'never') return

  timer = setTimeout(() => {
    visible.value = true
    window.addEventListener('keydown', onKey)
  }, 2600)
})

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
  window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <Transition name="mpop">
    <aside v-if="visible" class="mpop" role="dialog" aria-label="公众号推荐">
      <button class="mpop__close" type="button" aria-label="关闭" @click="close">×</button>

      <span class="mpop__label">{{ text.label }}</span>
      <h4 class="mpop__title">夜入<span class="mpop__grad">烟雨</span></h4>
      <p class="mpop__desc">{{ text.desc }}</p>

      <div class="mpop__row">
        <div class="mpop__qr">
          <img src="/images/mp-qr.jpg" alt="夜入烟雨 公众号二维码" />
        </div>
        <div class="mpop__meta">
          <span class="mpop__scan">
            <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true">
              <path
                d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5A1.5 1.5 0 0 1 18.5 20H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
              />
            </svg>
            {{ text.scan }}
          </span>
          <a class="mpop__more" :href="isEn ? '/en/wechat' : '/wechat'" @click="close">
            {{ text.more }} →
          </a>
        </div>
      </div>

      <button class="mpop__never" type="button" @click="dismissForever">{{ text.never }}</button>
    </aside>
  </Transition>
</template>

<style scoped>
.mpop {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 60;
  width: 344px;
  padding: 18px 20px 14px;
  border-radius: 16px;
  border: 1px solid rgba(34, 211, 238, 0.3);
  background:
    radial-gradient(300px 160px at 100% 0%, rgba(34, 211, 238, 0.16), transparent 66%),
    rgba(8, 13, 22, 0.92);
  backdrop-filter: blur(14px);
  box-shadow: 0 30px 70px -30px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(34, 211, 238, 0.08),
    0 0 50px -20px rgba(34, 211, 238, 0.5);
  color: #dfe9f7;
}

.mpop__close {
  position: absolute;
  top: 8px;
  right: 10px;
  width: 24px;
  height: 24px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: #7f93ad;
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mpop__close:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
}

.mpop__label {
  font-family: var(--mn-mono);
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #22d3ee;
}

.mpop__title {
  margin: 4px 0 6px;
  font-size: 1.28rem;
  font-weight: 800;
  letter-spacing: 0.02em;
  color: #fff;
}

.mpop__grad {
  background: linear-gradient(100deg, #22d3ee, #7c9cff 55%, #a78bfa);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.mpop__desc {
  margin: 0 0 14px;
  font-size: 0.78rem;
  line-height: 1.6;
  color: #93a6bd;
}

.mpop__row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.mpop__qr {
  width: 96px;
  height: 96px;
  flex: none;
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 0 0 1px rgba(34, 211, 238, 0.4), 0 12px 30px -16px rgba(0, 0, 0, 0.9);
}

.mpop__qr img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.mpop__meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
}

.mpop__scan {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: #22d3ee;
}

.mpop__more {
  padding: 0;
  border: 0;
  background: transparent;
  font-size: 11px;
  color: #93a6bd;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.2s ease;
}

.mpop__more:hover {
  color: #fff;
}

.mpop__never {
  display: block;
  margin: 12px 0 0;
  padding: 6px 0 0;
  width: 100%;
  border: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: transparent;
  font-size: 10px;
  color: #6b7f97;
  cursor: pointer;
  transition: color 0.2s ease;
}

.mpop__never:hover {
  color: #b9c8da;
}

.mpop-enter-active,
.mpop-leave-active {
  transition: opacity 0.35s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.mpop-enter-from,
.mpop-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.97);
}

@media (max-width: 640px) {
  .mpop {
    right: 12px;
    left: 12px;
    bottom: 12px;
    width: auto;
    padding: 16px 16px 12px;
  }

  .mpop__qr {
    width: 82px;
    height: 82px;
  }
}
</style>
