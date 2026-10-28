<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AppDialog from '@/components/ui/AppDialog.vue'
import AppButton from '@/components/ui/AppButton.vue'
import {
  resetFilters, useCategoryStore, useMarkedStore, useSelCategoryStore,
  useSelDifficultyStore, useSelSortingOrderStore, useSortingOrderStore,
} from '@/scripts/store'
import { useTrickStore } from '@/scripts/trickStore'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ 'update:open': [value: boolean] }>()

const { t } = useI18n()
const categoryStore = useCategoryStore()
const selCategory = useSelCategoryStore()
const marked = useMarkedStore()
const difficulty = useSelDifficultyStore()
const sorting = useSelSortingOrderStore()
const sortingOrders = useSortingOrderStore().sortingOrders
const trickStore = useTrickStore()

const LEVELS = [1, 2, 3, 4, 5]

// min ≤ max: moving one bound past the other drags the other along.
const minLevel = computed({
  get: () => difficulty.val[0],
  set: (v: number) => difficulty.update([v, Math.max(v, difficulty.val[1])]),
})
const maxLevel = computed({
  get: () => difficulty.val[1],
  set: (v: number) => difficulty.update([Math.min(v, difficulty.val[0]), v]),
})
</script>

<template>
  <AppDialog :open="open" :title="t('home.filters')" @update:open="emit('update:open', $event)">
    <form class="sheet" @submit.prevent>
      <fieldset>
        <legend>{{ t('toolbar.categories') }}</legend>
        <div class="checks">
          <label v-for="c in categoryStore.categories" :key="c" class="check">
            <input v-model="selCategory.categories" type="checkbox" :value="c">
            <span class="dot" :style="{ background: categoryStore.getColor(c) }" />
            {{ t('categories.' + c) }}
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend>{{ t('home.status') }}</legend>
        <div class="checks">
          <label v-for="m in marked.markers" :key="m" class="check">
            <input v-model="marked.selMarkers" type="checkbox" :value="m">
            {{ t('marked.' + m) }}
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend>{{ t('home.level') }}</legend>
        <div class="pair">
          <label class="field">
            <span>{{ t('home.levelMin') }}</span>
            <select v-model.number="minLevel">
              <option v-for="n in LEVELS" :key="n" :value="n">{{ n }}</option>
            </select>
          </label>
          <label class="field">
            <span>{{ t('home.levelMax') }}</span>
            <select v-model.number="maxLevel">
              <option v-for="n in LEVELS" :key="n" :value="n">{{ n }}</option>
            </select>
          </label>
        </div>
      </fieldset>

      <label class="field">
        <span class="legend">{{ t('home.sort') }}</span>
        <select v-model="sorting.by">
          <option v-for="o in sortingOrders" :key="o" :value="o">{{ t('sortOptions.' + o) }}</option>
        </select>
      </label>

      <div class="foot">
        <AppButton @click="resetFilters">{{ t('home.reset') }}</AppButton>
        <p class="count" aria-live="polite">{{ t('home.count', { n: trickStore.shownTricks.length }, trickStore.shownTricks.length) }}</p>
      </div>
    </form>
  </AppDialog>
</template>

<style scoped>
.sheet { display: flex; flex-direction: column; gap: var(--space-5); }
fieldset { margin: 0; padding: 0; border: 0; min-width: 0; }
legend, .legend {
  display: block;
  margin-bottom: var(--space-2);
  padding: 0;
  color: var(--text-muted);
  font-size: var(--t-sm);
  font-weight: 600;
}
.checks { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 var(--space-3); }
.check {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-height: 44px;
  min-width: 0;
  /* long category names (Hydroblading, Akrobatyka) break inside their column on narrow phones */
  overflow-wrap: anywhere;
  hyphens: auto;
  cursor: pointer;
}
.check input {
  width: 20px;
  height: 20px;
  margin: 0;
  flex: none;
  accent-color: var(--accent);
}
.dot { width: 10px; height: 10px; border-radius: 50%; flex: none; }
.pair { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); }
.field { display: flex; flex-direction: column; gap: var(--space-1); min-width: 0; }
.pair .field span { font-size: var(--t-sm); }
select {
  min-height: 44px;
  width: 100%;
  padding: 0 var(--space-3);
  border: 1px solid var(--line);
  border-radius: var(--radius-s);
  background: var(--surface-2);
  color: var(--text);
  font: inherit;
}
select:focus-visible, .check input:focus-visible { outline: 2px solid var(--focus); outline-offset: 2px; }
/* reset and the live count stay in view while the filters scroll */
.foot {
  position: sticky;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-4) 0 var(--space-5);
  margin-bottom: calc(-1 * var(--space-5));
  border-top: 1px solid var(--line);
  background: var(--surface);
}
.count { margin: 0; color: var(--text-muted); font-size: var(--t-sm); }
</style>
