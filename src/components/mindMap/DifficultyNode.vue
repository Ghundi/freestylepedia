<script setup lang="ts">
import { getPosition, getOrientation } from "@/scripts/helpers";
import { computed } from 'vue'
import { Handle, useVueFlow } from '@vue-flow/core'

const props = defineProps(['label', 'orientation', 'n_children', 'color'])
const { viewport } = useVueFlow()
// keep the separator about 1.5 device px wide whatever the zoom
const lineWidth = computed(() => Math.max(1, 1.5 / (viewport.value.zoom || 1)) + 'px')
</script>

<template>
  <Handle type="source" :position="getPosition(props.orientation)" style="opacity: 0" />
  <Handle type="target" :position="getPosition(props.orientation)" style="opacity: 0" />

  <div class="level" :style="{ fontSize: getOrientation() === 'Portrait' ? '20px' : '40px' }">
    {{ $t('level', { n: label }) }}
  </div>

  <div class="line" v-if="label !== '1'" :style="{ width: lineWidth }"></div>
</template>

<style scoped>
.level {
  padding: 10px 20px;
  z-index: 100;
  margin-left: 500px;
  pointer-events: none;
  color: var(--text-muted);
  font-weight: 700;
}
.line {
  position: absolute;
  right: 1000px;
  background: var(--line);
  height: 4000px;
  pointer-events: none;
}
</style>
