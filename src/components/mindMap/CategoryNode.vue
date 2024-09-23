<script setup>

import { Handle, Position} from '@vue-flow/core'

const props = defineProps(['label', 'orientation', 'n_children', 'color'])

function getOrientation(){
  return window.innerWidth > window.innerHeight ? "Landscape" : "Portrait";
}

function getPosition(orientation) {
  switch (orientation) {
    case 0:
      return Position.Top;
    case 1:
      return Position.Right;
    case 2:
      return Position.Bottom;
    case 3:
      return Position.Left;
  }
}

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