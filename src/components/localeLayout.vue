<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { getOrientation } from '@/scripts/helpers'

// graph layouts are computed for one orientation: a rotated phone gets the graph page rebuilt
const orientation = ref(getOrientation())
const onResize = () => { orientation.value = getOrientation() }
onMounted(() => window.addEventListener('resize', onResize))
onBeforeUnmount(() => window.removeEventListener('resize', onResize))
const GRAPH_PAGES = ['TrickTree', 'CategoryTree']
</script>

<template>
  <router-view :key="GRAPH_PAGES.includes($route.name) ? $route.fullPath + orientation : $route.fullPath"/>
</template>
