<script setup>

import { Handle, Position, useHandleConnections, useNodesData } from '@vue-flow/core'

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
  <div class="rounded" :style="{'font-size': (getOrientation() === 'Portrait') ? '20px' : '40px'}">
    <div class="text-h1">
      {{ $t('difficulty') + ' ' + label }}
    </div>
  </div>
  <div class="line" v-show="label !== '1'"></div>
</template>

<style scoped>
.rounded{
  padding: 10px 20px 10px 20px;
  z-index: 100;
  margin-left: 500px;
}
.line {
  position: relative;
  right: 20px;
  border-left: 1px solid black;
  height: 4000px;
  opacity: 0.1;
  z-index: -100;
}
</style>