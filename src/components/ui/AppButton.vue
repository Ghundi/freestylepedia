<script setup lang="ts">
import { computed } from 'vue'
import AppIcon from './AppIcon.vue'

const props = withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost'
  pressed?: boolean
  icon?: string
  to?: string | Record<string, unknown>
  href?: string
}>(), { variant: 'secondary', pressed: undefined, icon: undefined, to: undefined, href: undefined })

const tag = computed(() => props.to ? 'router-link' : props.href ? 'a' : 'button')
const attrs = computed(() => {
  if (props.to) return { to: props.to }
  if (props.href) return { href: props.href }
  return { type: 'button' }
})
</script>

<template>
  <component
    :is="tag"
    v-bind="attrs"
    class="btn"
    :class="`btn--${variant}`"
    :aria-pressed="pressed === undefined ? undefined : String(pressed)"
  >
    <AppIcon v-if="icon" :path="icon" :size="20" />
    <slot />
  </component>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  min-height: 44px;
  min-width: 44px;
  padding: 0 var(--space-4);
  border: 1px solid transparent;
  border-radius: var(--radius-m);
  font: inherit;
  font-size: var(--t-md);
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: background var(--dur), border-color var(--dur);
}
.btn--primary { background: var(--accent); color: var(--accent-text); }
.btn--secondary { background: var(--surface-2); color: var(--text); border-color: var(--line); }
.btn--ghost { background: transparent; color: var(--text); }
@media (hover: hover) { .btn--ghost:hover:not(:disabled), .btn--secondary:hover:not(:disabled) { background: var(--line); } }
@media (hover: hover) { .btn--primary:hover:not(:disabled) { filter: brightness(1.08); } }
.btn[aria-pressed='true'] { border-color: var(--accent); color: var(--accent); }
.btn--primary[aria-pressed='true'] { color: var(--accent-text); outline: 2px solid var(--text); outline-offset: 2px; }
.btn:focus-visible { outline: 2px solid var(--focus); outline-offset: 2px; }
/* disabled: dimmed, and the hover rules above do not apply */
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
@media (prefers-reduced-motion: reduce) { .btn { transition: none; } }
</style>
