<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import MpFooterBand from './components/MpFooterBand.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #doc-footer-before>
      <MpFooterBand />
    </template>
  </Layout>
</template>
