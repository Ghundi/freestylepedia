<script setup lang="ts">
import { strToUrl, getOrientation, getPosition } from '@/scripts/helpers';
import { Handle } from '@vue-flow/core'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const props = defineProps(['label', 'orientation', 'n_children', 'color'])
const router = useRouter()
const { locale } = useI18n()

function open() {
  router.push({ name: 'Trick', params: { lang: locale.value, trickname: strToUrl(props.label) } })
}
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
