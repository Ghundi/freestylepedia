<script setup lang="ts">
import TrickThumb from './TrickThumb.vue'
import type { Trick } from '../../scripts/trickStore'

defineProps<{ title: string; count: number; tricks: Trick[] }>()
</script>

<template>
  <section class="rail">
    <header class="head">
      <h2>{{ title }}</h2>
      <span class="count">{{ count }}</span>
    </header>
    <ul class="list">
      <li v-for="t in tricks" :key="t.trickID" class="item">
        <TrickThumb :trick="t" />
      </li>
    </ul>
  </section>
</template>

<style scoped>
.rail { min-width: 0; }
.head {
  display: flex;
  align-items: baseline;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
}
h2 { margin: 0; font-size: var(--t-lg); font-weight: 600; color: var(--text); }
.count { color: var(--text-muted); font-size: var(--t-sm); }
.list {
  display: flex;
  gap: var(--space-3);
  /* room for the 2px focus ring + 3px offset of each thumbnail, which overflow-x would clip */
  padding: var(--space-2);
  margin: calc(-1 * var(--space-2));
  list-style: none;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-padding-inline: var(--space-2);
}
.item { flex: 0 0 148px; scroll-snap-align: start; }
@media (min-width: 900px) {
  .item { flex-basis: 200px; }
}
</style>
