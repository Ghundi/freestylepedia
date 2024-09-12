<script setup>
import { Handle, Position, useHandleConnections, useNodesData } from '@vue-flow/core'

const connections = useHandleConnections({
  type: 'source',
})

const props = defineProps(['label', 'left', 'n_children', 'color'])

</script>

<template>
  <Handle type="source" :position="(props.left) ? Position.Left : Position.Right" style="opacity: 0" />
  <Handle type="target" :position="(!props.left) ? Position.Left : Position.Right" style="opacity: 0" />
  <v-btn
      @click="$router.push('/' + props.label.replaceAll(' ', '-'))"
      variant="elevated"
      rounded="xl"
      :style="{backgroundColor: color}">
    {{ props.label }}
  </v-btn>
</template>