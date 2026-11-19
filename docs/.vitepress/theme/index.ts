import DefaultTheme from 'vitepress/theme'
import './custom.css'
import Layout from './Layout.vue'

import HomeHero from './components/HomeHero.vue'
import TechMarquee from './components/TechMarquee.vue'
import FeatureGrid from './components/FeatureGrid.vue'
import ThemeLab from './components/ThemeLab.vue'
import PipelineFlow from './components/PipelineFlow.vue'
import ScreenshotWall from './components/ScreenshotWall.vue'
import ThemeSwatches from './components/ThemeSwatches.vue'
import CommandBlock from './components/CommandBlock.vue'
import CopyAnatomy from './components/CopyAnatomy.vue'
import MpFollow from './components/MpFollow.vue'
import MpPromoPopup from './components/MpPromoPopup.vue'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('HomeHero', HomeHero)
    app.component('TechMarquee', TechMarquee)
    app.component('FeatureGrid', FeatureGrid)
    app.component('ThemeLab', ThemeLab)
    app.component('PipelineFlow', PipelineFlow)
    app.component('ScreenshotWall', ScreenshotWall)
    app.component('ThemeSwatches', ThemeSwatches)
    app.component('CommandBlock', CommandBlock)
    app.component('CopyAnatomy', CopyAnatomy)
    app.component('MpFollow', MpFollow)
    app.component('MpPromoPopup', MpPromoPopup)
  }
}
