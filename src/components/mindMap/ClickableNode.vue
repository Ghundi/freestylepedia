<script setup lang="ts">
import { strToUrl, getOrientation, getPosition } from '@/scripts/helpers';
import { Handle, useVueFlow } from '@vue-flow/core'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const props = defineProps(['label', 'orientation', 'n_children', 'color'])
const router = useRouter()
const { locale } = useI18n()

// Tabbing onto a node outside the visible part of the graph brings it to the centre.
const { findNode, setCenter, viewport } = useVueFlow()
function reveal(e: FocusEvent) {
  const el = e.currentTarget as HTMLElement
  const flow = el.closest('.vue-flow') as HTMLElement | null
  if (!flow) return
  // focusing can scroll the clipped pane itself; the viewport transform does the moving instead
  flow.scrollTop = 0
  flow.scrollLeft = 0
  const pane = flow.getBoundingClientRect()
  const r = el.getBoundingClientRect()
  if (r.left >= pane.left && r.right <= pane.right && r.top >= pane.top && r.bottom <= pane.bottom) return
  const node = findNode(props.label)
  if (!node) return
  setCenter(node.position.x + node.dimensions.width / 2, node.position.y + node.dimensions.height / 2,
    { zoom: viewport.value.zoom, duration: reduceMotion() ? 0 : 200 })
}

function open() {
  router.push({ name: 'Trick', params: { lang: locale.value, trickname: strToUrl(props.label) } })
}
function reduceMotion() { return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false }
</script>

<template>
  <Handle type="source" :position="getPosition(props.orientation)" style="opacity: 0" />
  <Handle type="target" :position="getPosition((props.orientation + 2) % 4)" style="opacity: 0" />
  <button
    type="button"
    class="node"
    :style="{
      borderWidth: getOrientation() === 'Portrait' ? '3px' : '4px',
      borderColor: color,
      fontSize: getOrientation() === 'Portrait' ? '20px' : '28px',
    }"
    @click="open"
    @focus="reveal"
  >{{ label }}</button>
</template>

<style scoped>
.node {
  min-width: 200px;
  padding: 0.6em 1em;
  border-style: solid;
  border-radius: var(--radius-m);
  background: var(--surface);
  color: var(--text);
  font: inherit;
  font-size: inherit;
  font-weight: 700;
  cursor: pointer;
}
.node:focus-visible { outline: 2px solid var(--focus); outline-offset: 2px; }
</style>
