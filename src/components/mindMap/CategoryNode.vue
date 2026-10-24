<script setup lang="ts">
import { Handle } from '@vue-flow/core'
import { computed } from 'vue';
import { getOrientation, getPosition } from '@/scripts/helpers';
import { readableTextColor } from '@/scripts/contrast';
import { useThemeMode } from '@/scripts/theme';

const props = defineProps(['label', 'orientation', 'n_children', 'color'])
const { resolved } = useThemeMode()
// label sits on the page background: composite translucent category colours over it
const textColor = computed(() => readableTextColor(props.color, resolved.value === 'dark' ? '#111214' : '#f6f6f4'))
</script>

<template>
  <Handle type="source" :position="getPosition(props.orientation)" style="opacity: 0" />
  <Handle type="target" :position="getPosition(props.orientation)" style="opacity: 0" />
  <div class="tag" :style="{ backgroundColor: color, fontSize: getOrientation() === 'Portrait' ? '20px' : '40px', color: textColor }">
    {{ $t('categories.' + label) }}
  </div>
</template>

<style scoped>
.tag {
  padding: 10px 20px;
  border-radius: var(--radius-m);
  font-weight: 700;
  line-height: 1.2;
}
</style>
