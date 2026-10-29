<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { getOrientation } from '@/scripts/helpers'

// graph layouts are computed for one orientation: a rotated wide screen gets the graph page rebuilt.
// Phones show lists there, which need no rebuild (it would close an open sheet).
const isWide = () => typeof window.matchMedia === 'function' && window.matchMedia('(min-width: 900px)').matches
const graphKey = () => isWide() ? getOrientation() : ''
const orientation = ref(graphKey())
const onResize = () => { orientation.value = graphKey() }
onMounted(() => window.addEventListener('resize', onResize))
onBeforeUnmount(() => window.removeEventListener('resize', onResize))
const GRAPH_PAGES = ['TrickTree', 'CategoryTree']
</script>

<template>
  <router-view :key="GRAPH_PAGES.includes($route.name) ? $route.fullPath + orientation : $route.fullPath"/>
</template>
