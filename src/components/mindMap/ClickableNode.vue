<script setup>
import { Handle, Position} from '@vue-flow/core'
import { useTheme } from 'vuetify'
const theme = useTheme()

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
  <Handle type="target" :position="getPosition((props.orientation + 2) % 4)" style="opacity: 0" />
  <v-btn
      @click="$router.push('/trick/' + props.label)"
      variant="elevated"
      rounded="xl"
      min-width="200px"
      :style="{
      'border-style': 'solid',
      'border-width': (getOrientation() === 'Portrait') ? '3px' : '7px',
      'border-color': color,
      'font-weight': 'bolder',
      'font-size': (getOrientation() === 'Portrait') ? '20px' : '40px',
      'color': theme.global.current.value.dark ? '#ffffff' : '#000000'  // Set font color dynamically based on theme
    }"
      size="x-large"
  >
    {{ props.label }}
  </v-btn>
</template>

<style scoped>
</style>