<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: [number, number]
  min: number
  max: number
  step?: number
  minLabel: string
  maxLabel: string
}>(), { step: 1 })
const emit = defineEmits<{ 'update:modelValue': [value: [number, number]] }>()

const lo = computed(() => props.modelValue[0])
const hi = computed(() => props.modelValue[1])

const ticks = computed(() => {
  const list: number[] = []
  for (let n = props.min; n <= props.max; n += props.step) list.push(n)
  return list
})

// position of a value along the rail, 0 to 1, shared by the fill and the ticks
const ratio = (v: number) => (v - props.min) / (props.max - props.min)
const at = (v: number) => ({ '--p': ratio(v) })

// both thumbs on the same value: the one that can still move away sits on top
const loOnTop = computed(() => lo.value === hi.value && lo.value === props.max)

// a thumb stops at the other one; the input is reset so it does not run ahead of the value
function onInput(which: 0 | 1, e: Event) {
  const el = e.target as HTMLInputElement
  const v = Number(el.value)
  const next: [number, number] = which === 0 ? [Math.min(v, hi.value), hi.value] : [lo.value, Math.max(v, lo.value)]
  el.value = String(next[which])
  emit('update:modelValue', next)
}

// tapping a number moves the nearer thumb there: a way to choose without dragging
function pick(n: number) {
  const moveLo = n < lo.value || (n <= hi.value && n - lo.value <= hi.value - n)
  emit('update:modelValue', moveLo ? [n, hi.value] : [lo.value, n])
}
</script>

<template>
  <div class="range">
    <div class="track">
      <div class="rail" />
      <div class="fill" :style="{ '--from': ratio(lo), '--to': ratio(hi) }" />
      <input
        type="range"
        :class="{ 'on-top': loOnTop }"
        :min="min" :max="max" :step="step" :value="lo"
        :aria-label="minLabel"
        @input="onInput(0, $event)"
      >
      <input
        type="range"
        :class="{ 'on-top': !loOnTop && lo === hi }"
        :min="min" :max="max" :step="step" :value="hi"
        :aria-label="maxLabel"
        @input="onInput(1, $event)"
      >
    </div>
    <div class="ticks" aria-hidden="true">
      <button
        v-for="n in ticks"
        :key="n"
        type="button"
        tabindex="-1"
        class="tick"
        :class="{ 'tick--in': n >= lo && n <= hi }"
        :style="at(n)"
        @click="pick(n)"
      >{{ n }}</button>
    </div>
  </div>
</template>

<style scoped>
.range {
  --thumb: 28px;
  position: relative;
  min-width: 0;
}
.track, .ticks { position: relative; }
.track { height: 44px; }
.rail, .fill {
  position: absolute;
  top: 50%;
  height: 6px;
  margin-top: -3px;
  border-radius: 3px;
}
.rail { left: 0; right: 0; background: var(--line); }
.fill {
  left: calc(var(--thumb) / 2 + (100% - var(--thumb)) * var(--from));
  right: calc(var(--thumb) / 2 + (100% - var(--thumb)) * (1 - var(--to)));
  background: var(--accent);
}
input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  background: none;
  appearance: none;
  -webkit-appearance: none;
  /* only the thumbs catch the pointer, so each input leaves the other's thumb reachable */
  pointer-events: none;
}
input.on-top { z-index: 1; }
input::-webkit-slider-runnable-track { background: none; }
input::-moz-range-track { background: none; }
input::-webkit-slider-thumb {
  width: var(--thumb);
  height: var(--thumb);
  border: 3px solid var(--accent);
  border-radius: 50%;
  background: var(--surface);
  pointer-events: auto;
  cursor: grab;
  -webkit-appearance: none;
}
input::-moz-range-thumb {
  box-sizing: border-box;
  width: var(--thumb);
  height: var(--thumb);
  border: 3px solid var(--accent);
  border-radius: 50%;
  background: var(--surface);
  pointer-events: auto;
  cursor: grab;
}
input:active::-webkit-slider-thumb { cursor: grabbing; }
input:active::-moz-range-thumb { cursor: grabbing; }
input:focus { outline: none; }
input:focus-visible::-webkit-slider-thumb { outline: 2px solid var(--focus); outline-offset: 2px; }
input:focus-visible::-moz-range-thumb { outline: 2px solid var(--focus); outline-offset: 2px; }
.ticks { height: 44px; }
.tick {
  position: absolute;
  top: 0;
  /* centred under the thumb's middle at that value */
  left: calc(var(--thumb) / 2 + (100% - var(--thumb)) * var(--p));
  width: 44px;
  height: 44px;
  padding: 0;
  border: 0;
  border-radius: var(--radius-s);
  transform: translateX(-50%);
  background: none;
  color: var(--text-muted);
  font: inherit;
  font-size: var(--t-sm);
  font-variant-numeric: tabular-nums;
  cursor: pointer;
}
.tick--in { color: var(--text); font-weight: 600; }
@media (hover: hover) { .tick:hover { background: var(--surface-2); } }
@media (forced-colors: active) {
  .rail { background: GrayText; }
  .fill { background: Highlight; }
}
</style>
