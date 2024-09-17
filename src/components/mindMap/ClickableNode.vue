<script setup>
import { Handle, Position, useHandleConnections, useNodesData } from '@vue-flow/core'

const connections = useHandleConnections({
  type: 'source',
})

const props = defineProps(['label', 'left', 'n_children', 'color'])

function getOrientation(){
  return window.innerWidth > window.innerHeight ? "Landscape" : "Portrait";
}

</script>

<template>
  <Handle type="source" :position="(props.left) ? Position.Left : Position.Right" style="opacity: 0" />
  <Handle type="target" :position="(!props.left) ? Position.Left : Position.Right" style="opacity: 0" />
  <v-btn
      @click="$router.push('/' + props.label)"
      variant="elevated"
      rounded="xl"
      min-width="200px"
      :style="{'border-style': 'solid', 'border-width': (getOrientation() === 'Portrait') ? '3px' : '7px', 'border-color': color,
      'font-weight': 'bolder', 'font-size': (getOrientation() === 'Portrait') ? '20px' : '40px'}"
      size="x-large">
      {{ props.label }}
  </v-btn>
</template>