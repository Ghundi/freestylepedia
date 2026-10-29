<script lang="ts">
import { ref } from 'vue'

// Keys of the open groups ("cat:<name>", "lvl:<n>"); lives at module level so it survives a trip to a trick page.
const openGroups = ref<Set<string>>(new Set())

export function resetOpenGroups() { openGroups.value = new Set() }
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { mdiChevronRight } from '@mdi/js'
import AppIcon from '../ui/AppIcon.vue'
import YtThumb from '../ui/YtThumb.vue'
import TrickStatus from './TrickStatus.vue'
import { categoryRows, levelRows, type PathRow } from '../../scripts/paths'
import { useTrickStore, type Trick } from '../../scripts/trickStore'
import { useCategoryStore } from '../../scripts/store'
import { useMasteredStore } from '../../scripts/store'

const props = defineProps<{ mode: 'category' | 'level' }>()
const emit = defineEmits<{ open: [trick: Trick] }>()

const { t, locale } = useI18n()
const trickStore = useTrickStore()
const categoryStore = useCategoryStore()
const mastered = useMasteredStore()

interface Group { key: string; label: string; color: string | null; rows: PathRow[] }

const groups = computed<Group[]>(() => {
  const tricks = trickStore.tricks
  const cats = categoryStore.categories
  if (props.mode === 'category') {
    return cats.map(c => ({
      key: `cat:${c}`, label: t(`categories.${c}`), color: categoryStore.getDotColor(c),
      rows: categoryRows(tricks, c),
    }))
  }
  return [1, 2, 3, 4, 5].map(n => ({
    key: `lvl:${n}`, label: t('level', { n }), color: null,
    rows: levelRows(tricks, n, cats).map(trick => ({ trick, depth: 0 })),
  }))
})

const isOpen = (key: string) => openGroups.value.has(key)
function toggleGroup(key: string) {
  const next = new Set(openGroups.value)
  if (!next.delete(key)) next.add(key)
  openGroups.value = next
}

const doneCount = (g: Group) => g.rows.filter(r => mastered.isMastered(r.trick)).length
const name = (trick: Trick) => trickStore.getLocalTrickTitles(trick, locale.value)[0] ?? trick.title[0]
</script>

<template>
  <div class="path-list">
    <section v-for="g in groups" :key="g.key" class="group">
      <button type="button" class="gh" :aria-expanded="isOpen(g.key)" @click="toggleGroup(g.key)">
        <span class="gt">
          <span v-if="g.color" class="dot dot--lg" :style="{ background: g.color }" aria-hidden="true"></span>
          {{ g.label }}
        </span>
        <span class="gc" aria-hidden="true">{{ doneCount(g) }}/{{ g.rows.length }}</span><span class="sr-only">{{ t('paths.countLabel', { done: doneCount(g), total: g.rows.length }) }}</span>
        <AppIcon :path="mdiChevronRight" :size="20" class="car" :class="{ open: isOpen(g.key) }" />
      </button>
      <ul v-if="isOpen(g.key)" class="rows">
        <li v-for="r in g.rows" :key="r.trick.trickID">
          <button type="button" class="row" :class="{ root: props.mode === 'level' || r.depth === 0 }" :style="{ '--i': props.mode === 'category' ? r.depth : 0 }" @click="emit('open', r.trick)">
            <YtThumb :video-id="r.trick.videoID[0]" :alt="''" class="th" sizes="64px" />
            <span class="tx">
              <span class="nm">{{ name(r.trick) }}</span>
              <span class="mt">
                <span class="dot" :style="{ background: categoryStore.getDotColor(r.trick.category) }" aria-hidden="true"></span>
                {{ t('level', { n: r.trick.difficulty }) }}
              </span>
            </span>
            <TrickStatus :trick="r.trick" />
            <AppIcon :path="mdiChevronRight" :size="20" class="chev" />
          </button>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.group + .group { border-top: 1px solid var(--line); }
.gh {
  display: flex; align-items: center; gap: 12px; width: 100%; min-height: 56px; padding: 0 var(--space-1);
  border: 0; background: none; color: var(--text); font: inherit; font-weight: 600; font-size: var(--t-md);
  cursor: pointer;
}
.gt { display: flex; align-items: center; gap: 10px; flex: 1; text-align: left; }
.gc { color: var(--text-muted); font-weight: 500; font-size: var(--t-sm); font-variant-numeric: tabular-nums; }
.car { color: var(--text-muted); transition: transform .15s; }
.car.open { transform: rotate(90deg); }
.rows { list-style: none; margin: 0 0 12px; padding: 0; }
.row {
  position: relative; display: flex; align-items: center; gap: 12px; width: 100%; min-height: 60px;
  padding: 6px var(--space-1) 6px calc(var(--space-1) + var(--i, 0) * 18px);
  border: 0; background: none; color: var(--text); font: inherit; text-align: left; cursor: pointer;
}
.row::before {
  content: ''; position: absolute; left: calc(var(--i, 0) * 18px - 6px); top: 0; bottom: 50%; width: 10px;
  border-left: 2px solid var(--line); border-bottom: 2px solid var(--line); border-bottom-left-radius: 8px;
}
.row.root::before { display: none; }
.th { width: 64px; height: 40px; border-radius: 6px; overflow: hidden; background: var(--surface-2); flex: none; }
.tx { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
.nm { font-weight: 600; }
.mt { display: flex; align-items: center; gap: 6px; color: var(--text-muted); font-size: var(--t-sm); }
.dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; flex: none; }
.dot--lg { width: 10px; height: 10px; }
.chev { color: var(--text-muted); flex: none; }
.gh:focus-visible, .row:focus-visible { outline: 2px solid var(--focus); outline-offset: -2px; }
</style>
