<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js'
import AppIcon from './AppIcon.vue'
import IconButton from './IconButton.vue'
import TrickThumb from './TrickThumb.vue'
import { railScroll } from '../../scripts/railScroll'
import type { Trick } from '../../scripts/trickStore'

const props = defineProps<{ title: string; count: number; tricks: Trick[] }>()

// Back to this page finds each rail where it was left: the key holds the history entry,
// so a new visit of the same page starts at the beginning.
const route = useRoute()
const { t } = useI18n()
const list = ref<HTMLElement>()

// Arrow buttons (wide screens): greyed out at each end, hidden when everything fits.
const atStart = ref(true)
const atEnd = ref(true)
function update() {
  const el = list.value
  if (!el) return
  atStart.value = el.scrollLeft <= 1
  atEnd.value = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1
}
function page(dir: 1 | -1) {
  const el = list.value
  if (!el) return
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: reduce ? 'auto' : 'smooth' })
}
let resize: ResizeObserver | undefined
const key = `${window.history.state?.position ?? ''}|${route.fullPath}|${props.title}`
onMounted(() => {
  const left = railScroll.get(key)
  if (left && list.value) list.value.scrollLeft = left
  update()
  if (typeof ResizeObserver === 'function' && list.value) {
    resize = new ResizeObserver(update)
    resize.observe(list.value)
  }
})
onBeforeUnmount(() => {
  resize?.disconnect()
  if (list.value) railScroll.set(key, list.value.scrollLeft)
})
</script>

<template>
  <section class="rail">
    <header class="head">
      <h2>{{ title }}</h2>
      <span class="count">{{ count }}</span>
    </header>
    <div class="track">
      <ul ref="list" class="list" tabindex="-1" @scroll.passive="update">
        <li v-for="t in tricks" :key="t.trickID" class="item">
          <TrickThumb :trick="t" />
        </li>
      </ul>
      <div v-if="!(atStart && atEnd)" class="arrows">
        <IconButton class="arrow arrow--prev" :label="t('home.scrollPrev')" :disabled="atStart" @click="page(-1)"><AppIcon :path="mdiChevronLeft" /></IconButton>
        <IconButton class="arrow arrow--next" :label="t('home.scrollNext')" :disabled="atEnd" @click="page(1)"><AppIcon :path="mdiChevronRight" /></IconButton>
      </div>
    </div>
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
/* phones swipe; wide screens get round arrows over the edges of the row, centred on the pictures */
.track { position: relative; }
.arrows { display: none; }
.arrow {
  position: absolute;
  /* thumbnails are 200px wide at 16:10, so their middle sits 62.5px below the list's top padding */
  top: calc(var(--space-2) + 200px * 10 / 16 / 2 - 22px);
  z-index: 2;
  border: 1px solid var(--line);
  border-radius: 50%;
  background: var(--surface);
  color: var(--text);
  box-shadow: 0 2px 8px rgb(0 0 0 / 0.25);
}
.arrow--prev { left: calc(-1 * var(--space-3)); }
.arrow--next { right: calc(-1 * var(--space-3)); }
.arrow:disabled { opacity: 0; pointer-events: none; }
@media (hover: hover) { .arrow:not(:disabled):hover { background: var(--surface-2); } }
@media (min-width: 900px) {
  .item { flex-basis: 200px; }
  .arrows { display: block; }
}
</style>
