<script setup lang="ts">

import { Handle } from '@vue-flow/core'
import { getOrientation, getPosition } from '@/scripts/helpers';

const props = defineProps(['label', 'orientation', 'n_children', 'color'])

</script>

<template>
  <Handle type="source" :position="getPosition(props.orientation)" style="opacity: 0" />
  <Handle type="target" :position="getPosition(props.orientation)" style="opacity: 0" />
  <div class="rounded" :style="{backgroundColor: color, 'font-size': (getOrientation() === 'Portrait') ? '20px' : '40px'}">
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