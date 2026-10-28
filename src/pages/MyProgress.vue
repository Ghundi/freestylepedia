<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRoute } from 'vue-router'
  import NextTrickCard from '@/components/home/NextTrickCard.vue'
  import CategoryBars from '@/components/progress/CategoryBars.vue'
  import TransferDialog from '@/components/progress/TransferDialog.vue'
  import AppButton from '@/components/ui/AppButton.vue'
  import TrickRail from '@/components/ui/TrickRail.vue'
  import { categoryProgress, getNextTrick } from '@/scripts/collections'
  import { useCategoryStore, useMasteredStore, useTodoStore } from '@/scripts/store'
  import { useTrickStore } from '@/scripts/trickStore'

  const { t } = useI18n()
  const route = useRoute()
  const trickStore = useTrickStore()
  const masteredStore = useMasteredStore()
  const todoStore = useTodoStore()
  const categoryStore = useCategoryStore()

  const total = computed(() => trickStore.tricks.length)
  const count = computed(() => masteredStore.calcShareMastered(trickStore.tricks))
  // width of the overall bar
  const percent = computed(() => total.value ? Math.round((count.value / total.value) * 100) : 0)
  const rows = computed(() =>
    categoryProgress(trickStore.tricks, categoryStore.categories, masteredStore.isMastered)
      .filter(r => r.total > 0))
  const recommended = computed(() => trickStore.getRecommendedTricks(masteredStore))
  const nextTrick = computed(() =>
    getNextTrick(trickStore.tricks, todoStore.list, recommended.value, masteredStore.isMastered))
  const fromTodo = computed(() => !!nextTrick.value && todoStore.isOnTodo(nextTrick.value))
  // the next-trick card already shows that one
  const moreRecommended = computed(() => recommended.value.filter(trick => trick !== nextTrick.value))
</script>

<template>
  <div class="page">
    <section class="summary">
      <h1>{{ t('myProgress.myProgress') }}</h1>
      <p class="line">{{ t('myProgress.summary', { n: count, total }, count) }}</p>
      <div
        v-if="count > 0"
        class="overall"
        role="progressbar"
        :aria-label="t('myProgress.myProgress')"
        aria-valuemin="0"
        :aria-valuemax="total"
        :aria-valuenow="count"
      >
        <div class="fill" :style="{ width: percent + '%' }" />
      </div>
    </section>

    <div v-if="count === 0" class="empty">
      <p>{{ t('myProgress.empty') }}</p>
      <AppButton variant="primary" :to="{ name: 'Home', params: { lang: route.params.lang } }">{{ t('myProgress.browse') }}</AppButton>
    </div>

    <p v-else-if="count === total" class="done">{{ t('myProgress.allDone') }}</p>

    <section v-if="count > 0" class="block" :aria-label="t('myProgress.byCategory')">
      <CategoryBars :rows="rows" />
    </section>

    <section v-if="nextTrick" class="block up-next">
      <h2>{{ t('myProgress.nextTrick') }}</h2>
      <NextTrickCard :trick="nextTrick" :from-todo="fromTodo" :started="count > 0" />
    </section>

    <TrickRail
      v-if="moreRecommended.length"
      :title="t('myProgress.recommendedTricks')"
      :count="moreRecommended.length"
      :tricks="moreRecommended"
    />

    <div class="transfer"><TransferDialog /></div>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  padding-top: var(--space-5);
}
.summary { display: flex; flex-direction: column; gap: var(--space-2); }
.summary h1 { margin: 0; font-size: var(--t-xl); font-weight: 700; line-height: 1.15; }
.line { margin: 0; color: var(--text-muted); font-size: var(--t-lg); font-variant-numeric: tabular-nums; }
/* same track as the category bars */
.overall { max-width: 560px; height: 8px; margin-top: var(--space-2); border-radius: var(--radius-s); background: var(--surface-2); overflow: hidden; }
.fill { height: 100%; border-radius: var(--radius-s); background: var(--accent); }
@media (forced-colors: active) {
  .overall { border: 1px solid CanvasText; }
  .fill { background: Highlight; forced-color-adjust: none; }
}
.empty { display: flex; flex-direction: column; align-items: flex-start; gap: var(--space-4); }
.empty p { margin: 0; max-width: 40ch; color: var(--text-muted); }
.done { margin: 0; max-width: 40ch; font-size: var(--t-lg); }
.block { max-width: 560px; }
.up-next h2 { margin: 0 0 var(--space-3); font-size: var(--t-lg); font-weight: 600; }
.transfer { display: flex; }
</style>
