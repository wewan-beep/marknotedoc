<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { lang } = useData()
const isEn = computed(() => lang.value === 'en-US')

const text = computed(() =>
  isEn.value
    ? {
        eyebrow: 'official account',
        title: '夜入烟雨',
        desc: 'Chinese long-form posts on real projects — full code, real traps, weekly.',
        hint: 'Scan with WeChat to follow',
        search: 'or search “夜入烟雨”'
      }
    : {
        eyebrow: '公众号',
        title: '夜入烟雨',
        desc: '只写真跑过的工程：完整代码、真实坑点、周更长文。',
        hint: '微信扫码关注',
        search: '或搜一搜「夜入烟雨」'
      }
)
</script>

<template>
  <div class="mpfb">
    <div class="mpfb__left">
      <span class="mpfb__eyebrow">{{ text.eyebrow }}</span>
      <h3 class="mpfb__title">{{ text.title }}</h3>
      <p class="mpfb__desc">{{ text.desc }}</p>
    </div>
    <div class="mpfb__right">
      <div class="mpfb__qr">
        <img src="/images/mp-qr.jpg" :alt="text.title" loading="lazy" />
      </div>
      <div class="mpfb__meta">
        <span class="mpfb__hint">{{ text.hint }}</span>
        <span class="mpfb__search">{{ text.search }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mpfb {
  margin: 40px 0 8px;
  padding: 18px 22px;
  border-radius: 14px;
  border: 1px solid var(--mn-border-strong);
  background:
    radial-gradient(420px 200px at 8% 0%, rgba(34, 211, 238, 0.09), transparent 65%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.015));
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.mpfb:hover {
  border-color: rgba(34, 211, 238, 0.4);
  box-shadow: 0 24px 50px -38px rgba(34, 211, 238, 0.65);
}

.mpfb__left {
  min-width: 0;
  flex: 1 1 260px;
}

.mpfb__eyebrow {
  font-family: var(--mn-mono);
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--mn-cyan);
}

.mpfb__title {
  margin: 4px 0 4px;
  font-size: 1.12rem;
  font-weight: 800;
  letter-spacing: 0.02em;
  color: var(--mn-text);
  border: 0;
  padding: 0;
}

.mpfb__desc {
  margin: 0;
  font-size: 0.82rem;
  line-height: 1.6;
  color: var(--mn-text-dim);
}

.mpfb__right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mpfb__qr {
  width: 76px;
  height: 76px;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 0 0 1px rgba(34, 211, 238, 0.28), 0 10px 24px -14px rgba(0, 0, 0, 0.6);
  flex: none;
}

.mpfb__qr img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.mpfb__meta {
  display: flex;
  flex-direction: column;
  gap: 3px;
  font-size: 11px;
  white-space: nowrap;
}

.mpfb__hint {
  color: var(--mn-cyan);
}

.mpfb__search {
  color: var(--mn-text-dim);
}

@media (max-width: 640px) {
  .mpfb {
    padding: 14px 16px;
  }

  .mpfb__right {
    width: 100%;
  }

  .mpfb__qr {
    width: 64px;
    height: 64px;
  }
}
</style>
