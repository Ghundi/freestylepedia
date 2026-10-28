<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

// A 44px square icon-only control; `label` is its accessible name. A button, or a link when `to` is set.
defineProps<{ label: string; to?: RouteLocationRaw }>()
</script>

<template>
  <router-link v-if="to" :to="to" class="icon-btn" :aria-label="label"><slot /></router-link>
  <button v-else type="button" class="icon-btn" :aria-label="label"><slot /></button>
</template>

<style scoped>
.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 0;
  border-radius: var(--radius-m);
  background: transparent;
  color: var(--text);
  cursor: pointer;
  transition: background var(--dur);
}
@media (hover: hover) { .icon-btn:hover { background: var(--surface-2); } }
@media (prefers-reduced-motion: reduce) { .icon-btn { transition: none; } }
</style>
