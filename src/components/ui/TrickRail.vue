<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import TrickThumb from './TrickThumb.vue'
import { railScroll } from '../../scripts/railScroll'
import type { Trick } from '../../scripts/trickStore'

const props = defineProps<{ title: string; count: number; tricks: Trick[] }>()

// Back to this page finds each rail where it was left: the key holds the history entry,
// so a new visit of the same page starts at the beginning.
const route = useRoute()
const list = ref<HTMLElement>()
const key = `${window.history.state?.position ?? ''}|${route.fullPath}|${props.title}`
onMounted(() => {
  const left = railScroll.get(key)
  if (left && list.value) list.value.scrollLeft = left
})
onBeforeUnmount(() => {
  if (list.value) railScroll.set(key, list.value.scrollLeft)
})
</script>

<template>
  <section class="rail">
    <header class="head">
      <h2>{{ title }}</h2>
      <span class="count">{{ count }}</span>
    </header>
    <ul ref="list" class="list">
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
  scrollbar-width: thin;
  scrollbar-color: var(--line) transparent;
  scroll-snap-type: x mandatory;
  scroll-padding-inline: var(--space-2);
}
.item { flex: 0 0 148px; scroll-snap-align: start; }
@media (min-width: 900px) {
  .item { flex-basis: 200px; }
}
</style>
