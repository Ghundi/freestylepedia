<script setup lang="ts">
import { Handle } from '@vue-flow/core'
import { getOrientation, getPosition } from '@/scripts/helpers';

const props = defineProps(['label', 'orientation', 'n_children', 'color'])
</script>

<template>
  <Handle type="source" :position="getPosition(props.orientation)" style="opacity: 0" />
  <Handle type="target" :position="getPosition(props.orientation)" style="opacity: 0" />
  <div class="tag" :style="{ backgroundColor: color, fontSize: getOrientation() === 'Portrait' ? '20px' : '40px' }">
    {{ $t('categories.' + label) }}
  </div>
</template>

<style scoped>
.tag {
  padding: 10px 20px;
  border-radius: var(--radius-m);
  color: #111214;
  font-weight: 700;
  line-height: 1.2;
}
</style>
