<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ lang?: string }>()

const isEn = computed(() => props.lang === 'en')

const copy = computed(() =>
  isEn.value
    ? {
        eyebrow: 'wechat · official account',
        name: '夜入烟雨',
        suffix: '',
        lead:
          'A Chinese tech account that only writes what has actually been shipped. One conclusion per article, code included, no half-finished advice.',
        points: [
          {
            k: '01',
            t: 'Written from real projects',
            d: 'Every post starts from a repo that runs: MarkNote, RuoYi refactors, hospital interface work. If it did not work, it is not published.'
          },
          {
            k: '02',
            t: 'Long form, complete code',
            d: 'From requirement to production in one piece, with the traps named out loud instead of skipped.'
          },
          {
            k: '03',
            t: 'Publishing craft too',
            d: 'Markdown writing flows, official-account typography, tooling. Written to look good the moment it ships.'
          }
        ],
        topicsLabel: 'in the pipeline',
        topics: [
          'Why WeChat paste drops formatting',
          'Spring Boot 3 + JWT login loop',
          'Five causes of IP-access errors'
        ],
        scan: 'Scan with WeChat to follow',
        searchAlt: 'Search 夜入烟雨 in WeChat',
        searchHint: 'or 搜一搜 “夜入烟雨”',
        note: 'Chinese content · updated weekly',
        cadence: 'weekly long-form'
      }
    : {
        eyebrow: 'wechat · 公众号',
        lead:
          '不追热点，不写「据说」。每一篇都来自一个真跑过的工程：先跑通，再落笔，代码和坑一起给。',
        points: [
          {
            k: '01',
            t: '只写真跑过的',
            d: 'MarkNote 全栈、若依二次改造、医疗接口对接——能跑通的才发，跑不通的只写为什么跑不通。'
          },
          {
            k: '02',
            t: '长文配完整代码',
            d: '从需求到上线一次讲完，中间踩的坑点名说清，不给半截方案。'
          },
          {
            k: '03',
            t: '连排版一起管',
            d: 'Markdown 写作流、公众号排版、工具取舍，写完就能发得好看。'
          }
        ],
        topicsLabel: '最近在写',
        topics: [
          '公众号粘贴为什么掉格式',
          'Spring Boot 3 + JWT 的登录闭环',
          'IP 访问报错的五个常见坑'
        ],
        scan: '微信扫码关注',
        searchAlt: '微信搜一搜：夜入烟雨',
        searchHint: '或 微信「搜一搜」直接搜：夜入烟雨',
        note: '技术长文 · 周更 · 完整源码',
        cadence: '周更长文'
      }
)
</script>

<template>
  <section class="mpf">
    <div class="mpf__inner">
      <div class="mpf__left">
        <span class="mn-eyebrow">{{ copy.eyebrow }}</span>

        <h2 class="mpf__title">
          <span class="mpf__name">
            夜入<span class="mpf__grad">烟雨</span>
          </span>
          <span class="mpf__caret" aria-hidden="true"></span>
        </h2>

        <p class="mpf__lead">{{ copy.lead }}</p>

        <ul class="mpf__points">
          <li v-for="p in copy.points" :key="p.k">
            <span class="mpf__k">{{ p.k }}</span>
            <div>
              <b>{{ p.t }}</b>
              <p>{{ p.d }}</p>
            </div>
          </li>
        </ul>

        <div class="mpf__topics">
          <span class="mpf__topics-label">{{ copy.topicsLabel }}</span>
          <span v-for="t in copy.topics" :key="t" class="mpf__topic">{{ t }}</span>
        </div>
      </div>

      <div class="mpf__right">
        <div class="mpf__card">
          <div class="mpf__ring" aria-hidden="true"></div>
          <div class="mpf__badge">{{ copy.cadence }}</div>

          <div class="mpf__qr">
            <img src="/images/mp-qr.jpg" :alt="copy.searchAlt" loading="lazy" />
            <span class="mpf__scan" aria-hidden="true"></span>
          </div>

          <div class="mpf__scan-hint">
            <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
              <path
                d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5A1.5 1.5 0 0 1 18.5 20H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
              />
            </svg>
            {{ copy.scan }}
          </div>

          <div class="mpf__name-inline">夜入烟雨</div>
          <div class="mpf__note">{{ copy.note }}</div>
        </div>

        <a class="mpf__search" href="#mp-search" @click.prevent>
          <img src="/images/mp-search.png" :alt="copy.searchAlt" loading="lazy" />
          <span class="mpf__search-hint">{{ copy.searchHint }}</span>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.mpf {
  position: relative;
  padding: 88px 24px 72px;
  overflow: hidden;
}

.mpf__inner {
  position: relative;
  max-width: 1160px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr);
  gap: 56px;
  align-items: center;
  padding: 48px;
  border-radius: 22px;
  border: 1px solid var(--mn-border);
  background:
    radial-gradient(700px 320px at 12% 0%, rgba(34, 211, 238, 0.1), transparent 62%),
    radial-gradient(620px 320px at 92% 100%, rgba(167, 139, 250, 0.1), transparent 62%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.045), rgba(255, 255, 255, 0.015));
  box-shadow: 0 40px 90px -60px rgba(34, 211, 238, 0.55);
  overflow: hidden;
}

.mpf__inner::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: 22px;
  padding: 1px;
  background: linear-gradient(120deg, rgba(34, 211, 238, 0.55), transparent 38%, transparent 62%, rgba(167, 139, 250, 0.5));
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.mpf__left h2 {
  border: 0;
  padding: 0;
}

.mpf__title {
  margin: 16px 0 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 2.9rem;
  line-height: 1.1;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--mn-text);
}

.mpf__grad {
  background: linear-gradient(100deg, var(--mn-cyan), #7c9cff 55%, #a78bfa);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: drop-shadow(0 6px 22px rgba(34, 211, 238, 0.35));
}

.mpf__caret {
  width: 11px;
  height: 34px;
  border-radius: 2px;
  background: var(--mn-cyan);
  box-shadow: 0 0 18px rgba(34, 211, 238, 0.8);
  animation: mpf-blink 1.15s steps(1) infinite;
}

@keyframes mpf-blink {
  0%, 55% { opacity: 1; }
  56%, 100% { opacity: 0.15; }
}

.mpf__lead {
  margin: 0 0 26px;
  max-width: 560px;
  font-size: 1rem;
  line-height: 1.8;
  color: var(--mn-text-dim);
}

.mpf__points {
  list-style: none;
  margin: 0 0 26px;
  padding: 0;
  display: grid;
  gap: 14px;
}

.mpf__points li {
  display: grid;
  grid-template-columns: 46px minmax(0, 1fr);
  gap: 14px;
  align-items: start;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid var(--mn-border);
  background: rgba(255, 255, 255, 0.035);
  transition: border-color 0.25s ease, transform 0.25s ease, background 0.25s ease;
}

.mpf__points li:hover {
  transform: translateX(4px);
  border-color: rgba(34, 211, 238, 0.4);
  background: rgba(34, 211, 238, 0.07);
}

.mpf__k {
  font-family: var(--mn-mono);
  font-size: 12px;
  letter-spacing: 0.08em;
  color: var(--mn-cyan);
  padding-top: 3px;
}

.mpf__points b {
  display: block;
  font-size: 0.95rem;
  font-weight: 650;
  color: var(--mn-text);
  margin-bottom: 4px;
}

.mpf__points p {
  margin: 0;
  font-size: 0.84rem;
  line-height: 1.65;
  color: var(--mn-text-dim);
}

.mpf__topics {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.mpf__topics-label {
  font-family: var(--mn-mono);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--mn-cyan);
}

.mpf__topic {
  padding: 5px 11px;
  border-radius: 999px;
  border: 1px dashed var(--mn-border-strong);
  color: var(--mn-text-dim);
  font-size: 12px;
  transition: all 0.2s ease;
}

.mpf__topic:hover {
  color: var(--mn-text);
  border-style: solid;
  border-color: rgba(34, 211, 238, 0.45);
}

/* ---- 右侧二维码卡 ---- */
.mpf__right {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: stretch;
}

.mpf__card {
  position: relative;
  padding: 24px 24px 20px;
  border-radius: 18px;
  border: 1px solid var(--mn-border-strong);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.02));
  text-align: center;
  box-shadow: 0 30px 70px -46px rgba(34, 211, 238, 0.6);
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease;
}

.mpf__card:hover {
  transform: translateY(-6px);
  box-shadow: 0 44px 90px -46px rgba(34, 211, 238, 0.85);
}

.mpf__ring {
  position: absolute;
  inset: 8px;
  border-radius: 14px;
  border: 1px solid rgba(34, 211, 238, 0.16);
  pointer-events: none;
}

.mpf__badge {
  position: absolute;
  top: 14px;
  right: 14px;
  font-family: var(--mn-mono);
  font-size: 10px;
  letter-spacing: 0.1em;
  padding: 4px 10px;
  border-radius: 999px;
  color: var(--mn-cyan);
  border: 1px solid rgba(34, 211, 238, 0.35);
  background: rgba(34, 211, 238, 0.1);
}

.mpf__qr {
  position: relative;
  width: 196px;
  height: 196px;
  margin: 8px auto 14px;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 0 0 1px rgba(34, 211, 238, 0.25), 0 18px 40px -22px rgba(0, 0, 0, 0.7);
}

.mpf__qr img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.mpf__scan {
  position: absolute;
  left: 0;
  right: 0;
  height: 40%;
  top: -40%;
  background: linear-gradient(180deg, transparent, rgba(34, 211, 238, 0.28), transparent);
  animation: mpf-scan 2.8s ease-in-out infinite;
}

@keyframes mpf-scan {
  0% { top: -40%; }
  70%, 100% { top: 100%; }
}

.mpf__scan-hint {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--mn-cyan);
}

.mpf__name-inline {
  margin-top: 8px;
  font-size: 1.32rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  color: var(--mn-text);
}

.mpf__note {
  margin-top: 4px;
  font-family: var(--mn-mono);
  font-size: 11px;
  letter-spacing: 0.06em;
  color: var(--mn-text-dim);
}

.mpf__search {
  display: block;
  position: relative;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(7, 193, 96, 0.35);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease;
  text-decoration: none;
}

.mpf__search:hover {
  transform: translateY(-3px);
  box-shadow: 0 26px 50px -32px rgba(7, 193, 96, 0.7);
}

.mpf__search img {
  display: block;
  width: 100%;
  height: auto;
}

.mpf__search-hint {
  display: block;
  padding: 7px 10px;
  font-size: 11px;
  text-align: center;
  letter-spacing: 0.02em;
  color: var(--mn-text-dim);
  border-top: 1px solid var(--mn-border);
  background: rgba(255, 255, 255, 0.03);
}

@media (max-width: 1000px) {
  .mpf__inner {
    grid-template-columns: minmax(0, 1fr);
    gap: 34px;
    padding: 32px 24px;
  }

  .mpf__right {
    max-width: 420px;
    margin: 0 auto;
    width: 100%;
  }

  .mpf__title {
    font-size: 2.3rem;
  }
}

@media (max-width: 640px) {
  .mpf {
    padding: 56px 16px 40px;
  }

  .mpf__inner {
    padding: 24px 16px;
  }

  .mpf__title {
    font-size: 1.95rem;
  }

  .mpf__lead {
    font-size: 0.92rem;
  }

  .mpf__points li {
    grid-template-columns: 34px minmax(0, 1fr);
    padding: 12px;
  }

  .mpf__qr {
    width: 168px;
    height: 168px;
  }
}
</style>
