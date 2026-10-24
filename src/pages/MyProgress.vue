<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRoute } from 'vue-router'
  import CategoryBars from '@/components/progress/CategoryBars.vue'
  import TransferDialog from '@/components/progress/TransferDialog.vue'
  import AppButton from '@/components/ui/AppButton.vue'
  import TrickRail from '@/components/ui/TrickRail.vue'
  import TrickThumb from '@/components/ui/TrickThumb.vue'
  import { categoryProgress } from '@/scripts/collections'
  import { useCategoryStore, useMasteredStore } from '@/scripts/store'
  import { useTrickStore } from '@/scripts/trickStore'

  const { t } = useI18n()
  const route = useRoute()
  const trickStore = useTrickStore()
  const masteredStore = useMasteredStore()
  const categoryStore = useCategoryStore()

  const total = computed(() => trickStore.tricks.length)
  const count = computed(() => masteredStore.calcShareMastered(trickStore.tricks))
  const percent = computed(() => total.value ? Math.round((count.value / total.value) * 100) : 0)
  const rows = computed(() =>
    categoryProgress(trickStore.tricks, categoryStore.categories, masteredStore.isMastered)
      .filter(r => r.total > 0))
  const hardest = computed(() =>
    trickStore.getHardestMasteredTrick(masteredStore.getMasteredTricks(trickStore.tricks)))
  const recommended = computed(() => trickStore.getRecommendedTricks(masteredStore))
</script>

<template>
  <div class="page">
    <h1 class="sr-only">{{ t('myProgress.myProgress') }}</h1>

    <section class="summary">
      <p class="percent">{{ percent }}%</p>
      <p class="line">{{ t('myProgress.summary', { n: count, total }) }}</p>
    </section>

    <div v-if="count === 0" class="empty">
      <p>{{ t('myProgress.empty') }}</p>
      <AppButton variant="primary" :to="{ name: 'Home', params: { lang: route.params.lang } }">{{ t('myProgress.browse') }}</AppButton>
    </div>

    <template v-else>
      <section class="block" :aria-label="t('myProgress.byCategory')">
        <CategoryBars :rows="rows" />
      </section>

      <section v-if="hardest" class="block hardest">
        <h2>{{ t('myProgress.hardestTrick') }}</h2>
        <TrickThumb :trick="hardest" size="l" />
      </section>
    </template>

    <TrickRail
      v-if="recommended.length"
      :title="t('myProgress.recommendedTricks')"
      :count="recommended.length"
      :tricks="recommended"
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
.percent {
  margin: 0;
  font-size: 56px;
  font-weight: 700;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}
.line { margin: var(--space-2) 0 0; color: var(--text-muted); }
.empty { display: flex; flex-direction: column; align-items: flex-start; gap: var(--space-4); }
.empty p { margin: 0; max-width: 40ch; color: var(--text-muted); }
.block { max-width: 560px; }
.hardest { max-width: 480px; }
.hardest h2 { margin: 0 0 var(--space-3); font-size: var(--t-lg); font-weight: 600; }
.transfer { display: flex; }
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
</style>
