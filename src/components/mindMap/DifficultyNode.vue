<script setup>
import {useTheme} from "vuetify";
import { getBgColor } from "@/scripts/helpers.js";
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
const theme = useTheme()
</script>

<template>
  <!-- Make the container non-interactive -->
  <div class="rounded" :style="{
    'font-size': (getOrientation() === 'Portrait') ? '20px' : '40px',
    'pointer-events': 'none'
  }">
    <div class="text-h1" :style="{
      'color': theme.global.current.value.dark ? '#ffffff' : '#000000',
      'pointer-events': 'none'
    }">
      {{ $t('difficulty') + ' ' + label }}
    </div>
  </div>

  <!-- The line div -->
  <div class="line"
       v-if="label !== '1'"
       :style="{
        'border-color': getBgColor(!theme.global.current.value.dark),
  }"></div>
</template>

<style scoped>
.rounded {
  padding: 10px 20px;
  z-index: 100;
  margin-left: 500px;
  pointer-events: none; /* Disable pointer events for the entire container */
}

.line {
  position: absolute;
  right: 1000px;
  border-left: 1px solid black;
  height: 4000px;
  pointer-events: none; /* Ensure clicks pass through this element */
}
</style>
