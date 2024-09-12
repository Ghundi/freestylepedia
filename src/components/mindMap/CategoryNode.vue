<script setup>
import { Handle, Position, useHandleConnections, useNodesData } from '@vue-flow/core'
import {useCategoryStore} from "@/store.js";

const connections = useHandleConnections({
  type: 'source',
})

const props = defineProps(['label', 'left', 'n_children', 'color'])
</script>

<template>
  <Handle type="source" :position="(left) ? Position.Left : Position.Right" style="opacity: 0" />
  <div class="rounded" :style="{backgroundColor: color, 'box-shadow': `0px 0px 10px 5px ${color}`}">
    <h2>
      {{ $t('categories.' + label) }}
    </h2>
  </div>
</template>

<style scoped>
.rounded{
  padding: 10px 20px 10px 20px;
}
</style>