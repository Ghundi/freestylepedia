<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRoute, useRouter } from 'vue-router';
  import { mdiTuneVariant } from '@mdi/js';
  import NextTrickCard from '@/components/home/NextTrickCard.vue';
  import FilterSheet from '@/components/home/FilterSheet.vue';
  import TrickRail from '@/components/ui/TrickRail.vue';
  import TrickThumb from '@/components/ui/TrickThumb.vue';
  import SegmentedControl from '@/components/ui/SegmentedControl.vue';
  import AppButton from '@/components/ui/AppButton.vue';
  import {
    resetFilters, useCategoryStore, useCurSearchStore, useMarkedStore, useMasteredStore, useSelCategoryStore,
    useSelDifficultyStore, useSelSortingOrderStore, useTodoStore,
  } from '@/scripts/store';
  import { useTrickStore } from "@/scripts/trickStore";
  import { getNextTrick, groupByCategory } from '@/scripts/collections';
  import { useHomeView } from '@/scripts/homeView';

  const trickStore = useTrickStore();

  const route = useRoute()
  if(route.query.todo) {
    useTodoStore().loadHash(route.query.todo.toString());
  }
  if(route.query.mastered) {
    useMasteredStore().loadHash(route.query.mastered.toString());
  }
  // Once loaded, the transfer link leaves the URL: coming back to this history entry
  // must not apply it again over marks made since.
  if(route.query.todo || route.query.mastered) {
    useRouter().replace({ query: {} });
  }

  const { t } = useI18n();
  const todoStore = useTodoStore();
  const masteredStore = useMasteredStore();
  const categoryStore = useCategoryStore();
  const selCategory = useSelCategoryStore();
  const selDifficulty = useSelDifficultyStore();
  const marked = useMarkedStore();
  const curSearch = useCurSearchStore();
  const sorting = useSelSortingOrderStore();
  const { view } = useHomeView();

  const nextTrick = computed(() => getNextTrick(
    trickStore.tricks, todoStore.list, trickStore.getRecommendedTricks(masteredStore), masteredStore.isMastered));
  const fromTodo = computed(() => !!nextTrick.value && todoStore.isOnTodo(nextTrick.value));

  const rows = computed(() => groupByCategory(trickStore.tricks, categoryStore.categories));

  const viewOptions = computed(() => [
    { value: 'category', label: t('home.byCategory') },
    { value: 'all', label: t('home.all') },
  ]);

  const filtersOpen = ref(false);
  // One per filter group that differs from its reset value.
  const activeFilters = computed(() => {
    const markers = [...marked.selMarkers].sort().join();
    return Number(selCategory.categories.length > 0)
      + Number(selDifficulty.val[0] !== 1 || selDifficulty.val[1] !== 5)
      + Number(markers !== 'mastered,non-mastered')
      + Number(!!curSearch.val);
  });
</script>

<template>
  <div class="home">
    <h1 class="sr-only">{{ t('tabs.tricks') }}</h1>

    <NextTrickCard :trick="nextTrick" :from-todo="fromTodo" />

    <SegmentedControl v-model="view" class="switch" :options="viewOptions" :label="t('home.view')" />

    <div v-if="view === 'category'" class="rails">
      <TrickRail
        v-for="row in rows"
        :key="row.category"
        :title="t('categories.' + row.category)"
        :count="row.tricks.length"
        :tricks="row.tricks"
      />
    </div>

    <section v-else class="all" :aria-label="t('home.all')">
      <div class="tools">
        <AppButton :icon="mdiTuneVariant" @click="filtersOpen = true">
          {{ t('home.filters') }}
          <template v-if="activeFilters">
            <span class="badge" aria-hidden="true">{{ activeFilters }}</span>
            <span class="sr-only">{{ t('home.active', { n: activeFilters }, activeFilters) }}</span>
          </template>
        </AppButton>
        <p class="sort">
          <span class="muted">{{ t('home.sort') }}</span>
          {{ t('sortOptions.' + sorting.by) }}
        </p>
        <p class="count">{{ t('home.count', { n: trickStore.shownTricks.length }, trickStore.shownTricks.length) }}</p>
      </div>

      <ul v-if="trickStore.shownTricks.length" class="grid">
        <li v-for="trick in trickStore.shownTricks" :key="trick.trickID"><TrickThumb :trick="trick" /></li>
      </ul>
      <div v-else class="empty">
        <h2>{{ t('error.noResults') }}</h2>
        <p>{{ t('error.noResultsSuggestions') }}</p>
        <AppButton @click="resetFilters">{{ t('home.reset') }}</AppButton>
      </div>
    </section>

    <FilterSheet v-model:open="filtersOpen" />
  </div>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  padding-top: var(--space-4);
}
.switch { align-self: flex-start; }
.rails { display: flex; flex-direction: column; gap: var(--space-6); }
.tools {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2) var(--space-4);
  margin-bottom: var(--space-4);
}
.badge {
  display: inline-grid;
  place-items: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 10px;
  background: var(--accent);
  color: var(--accent-text);
  font-size: var(--t-xs);
  font-weight: 700;
}
.sort, .count { margin: 0; font-size: var(--t-sm); }
.sort { display: flex; flex-wrap: wrap; gap: 0 var(--space-2); }
.muted, .count { color: var(--text-muted); }
.count { margin-left: auto; }
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: var(--space-5) var(--space-3);
  margin: 0;
  padding: 0;
  list-style: none;
}
.empty {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-3);
  max-width: 36rem;
  padding: var(--space-5) 0;
}
.empty h2 { margin: 0; font-size: var(--t-lg); font-weight: 600; }
.empty p { margin: 0; color: var(--text-muted); }
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
@media (min-width: 900px) {
  .home { gap: var(--space-6); padding-top: var(--space-5); }
}
</style>
