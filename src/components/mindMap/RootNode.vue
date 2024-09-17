<script setup>
import { Handle, Position, useHandleConnections, useNodesData } from '@vue-flow/core'

const props = defineProps(['label', 'left', 'n_children', 'color'])

function getOrientation(){
  return window.innerWidth > window.innerHeight ? "Landscape" : "Portrait";
}

</script>

<template>
  <Handle id="rootR" type="source" :position="Position.Right" style="opacity: 0" />
  <Handle id="rootL" type="source" :position="Position.Left" style="opacity: 0" />
  <div class="rounded" :style="{backgroundColor: color, 'color': 'white', 'font-size': (getOrientation() === 'Portrait') ? '20px' : '40px'}">
    <h2>
      {{ label }}
    </h2>
  </div>
</template>

<style scoped>
.rounded{
  padding: 10px 20px 10px 20px;
}
</style>