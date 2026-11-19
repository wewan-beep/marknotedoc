---
layout: page
pageClass: home-page
title: MarkNote
titleTemplate: false
sidebar: false
aside: false
---

<HomeHero lang="zh" />

<TechMarquee lang="zh" />

<FeatureGrid lang="zh" />

<ThemeLab lang="zh" />

<section class="mn-section mn-section--tight">
  <div class="mn-section__head">
    <span class="mn-eyebrow">architecture</span>
    <h2 class="mn-section__title">一条请求的完整旅程</h2>
    <p class="mn-section__desc">
      浏览器 → 前端 dev server 代理 → Spring Boot → MySQL / MinIO。图片有两条通道，MinIO 挂了自动降级本地磁盘，
      所以「上传失败」不会变成「写不下去」。
    </p>
  </div>
  <PipelineFlow lang="zh" />
</section>

<section class="mn-section mn-section--tight">
  <div class="mn-section__head">
    <span class="mn-eyebrow">screens</span>
    <h2 class="mn-section__title">界面就是交付物</h2>
    <p class="mn-section__desc">六张图走完一条写作链路：登录 → 新建 → 导入 → 插图 → 换主题 → 复制发布。</p>
  </div>
  <ScreenshotWall lang="zh" />
</section>

<MpFollow lang="zh" />

<ClientOnly>
  <MpPromoPopup />
</ClientOnly>


<section class="mn-section">
  <div class="mn-card" style="padding:40px;text-align:center;border-color:rgba(34,211,238,.26)">
    <h2 style="margin:0 0 10px;font-size:1.6rem;color:var(--mn-text)">自己跑一遍，比看十页介绍有用</h2>
    <p style="margin:0 auto 24px;max-width:620px;color:var(--mn-text-dim);line-height:1.75">
      三条命令起依赖与前后端，演示账号 admin / 123456。整套工程 MIT 协议，数据库和图片都在你手里。
    </p>
    <div class="mn-hero__actions" style="justify-content:center">
      <a class="mn-btn mn-btn--primary" href="/guide/quick-start">快速开始</a>
      <a class="mn-btn mn-btn--ghost" href="/guide/deploy">详细部署文档</a>
    </div>
  </div>
</section>
