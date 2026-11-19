---
layout: page
pageClass: home-page
title: MarkNote
titleTemplate: false
sidebar: false
aside: false
---

<HomeHero lang="en" />

<TechMarquee lang="en" />

<FeatureGrid lang="en" />

<ThemeLab lang="en" />

<section class="mn-section mn-section--tight">
  <div class="mn-section__head">
    <span class="mn-eyebrow">architecture</span>
    <h2 class="mn-section__title">The full journey of one request</h2>
    <p class="mn-section__desc">
      Browser → dev-server proxy → Spring Boot → MySQL / MinIO. Images have two paths: if MinIO is unreachable
      the backend silently falls back to local disk, so “upload failed” never turns into “can't write”.
    </p>
  </div>
  <PipelineFlow lang="en" />
</section>

<section class="mn-section mn-section--tight">
  <div class="mn-section__head">
    <span class="mn-eyebrow">screens</span>
    <h2 class="mn-section__title">The interface is the deliverable</h2>
    <p class="mn-section__desc">Six screens cover one writing loop: sign in → create → import → insert image → switch theme → copy to publish.</p>
  </div>
  <ScreenshotWall lang="en" />
</section>

<MpFollow lang="en" />

<ClientOnly>
  <MpPromoPopup />
</ClientOnly>


<section class="mn-section">
  <div class="mn-card" style="padding:40px;text-align:center;border-color:rgba(34,211,238,.26)">
    <h2 style="margin:0 0 10px;font-size:1.6rem;color:var(--mn-text)">Running it beats reading about it</h2>
    <p style="margin:0 auto 24px;max-width:640px;color:var(--mn-text-dim);line-height:1.75">
      Three commands bring up dependencies, backend and frontend. Demo account admin / 123456. MIT licensed — your data stays in your own database.
    </p>
    <div class="mn-hero__actions" style="justify-content:center">
      <a class="mn-btn mn-btn--primary" href="/en/guide/quick-start">Quick start</a>
      <a class="mn-btn mn-btn--ghost" href="/en/guide/deploy">Deployment guide</a>
    </div>
  </div>
</section>
