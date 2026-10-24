<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  modelValue: string
  options: { value: string; label: string }[]
  label: string
}>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const buttons = ref<HTMLButtonElement[]>([])

function move(delta: number) {
  const n = props.options.length
  const i = props.options.findIndex(o => o.value === props.modelValue)
  const next = (i + delta + n) % n
  emit('update:modelValue', props.options[next].value)
  buttons.value[next]?.focus()
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); move(1) }
  else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); move(-1) }
}
</script>

<template>
  <div class="seg" role="radiogroup" :aria-label="label">
    <button
      v-for="o in options"
      :key="o.value"
      ref="buttons"
      type="button"
      role="radio"
      class="opt"
      :aria-checked="o.value === modelValue"
      :tabindex="o.value === modelValue ? 0 : -1"
      @click="emit('update:modelValue', o.value)"
      @keydown="onKey"
    >{{ o.label }}</button>
  </div>
</template>

<style scoped>
.seg {
  display: inline-flex;
  padding: var(--space-1);
  gap: var(--space-1);
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-m);
}
.opt {
  min-height: 44px;
  padding: 0 var(--space-4);
  border: 0;
  border-radius: var(--radius-s);
  background: transparent;
  color: var(--text-muted);
  font: inherit;
  font-size: var(--t-sm);
  cursor: pointer;
  transition: background var(--dur), color var(--dur);
}
.opt[aria-checked='true'] { background: var(--accent); color: var(--accent-text); font-weight: 600; }
.opt:focus-visible { outline: 2px solid var(--focus); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) { .opt { transition: none; } }
</style>
