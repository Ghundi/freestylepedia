<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useCategoryStore } from '../../scripts/store'

defineProps<{ rows: { category: string; mastered: number; total: number }[] }>()

const { t } = useI18n()
const categories = useCategoryStore()
</script>

<template>
  <ul class="bars">
    <li v-for="row in rows" :key="row.category" class="row">
      <div class="label">
        <span class="name">
          <span class="dot" :style="{ background: categories.getDotColor(row.category) }" />
          {{ t('categories.' + row.category) }}
        </span>
        <span class="count">{{ row.mastered }} / {{ row.total }}</span>
      </div>
      <div
        class="track"
        role="progressbar"
        :aria-label="t('categories.' + row.category)"
        aria-valuemin="0"
        :aria-valuemax="row.total"
        :aria-valuenow="row.mastered"
      >
        <div
          class="fill"
          :style="{
            width: (row.total ? (row.mastered / row.total) * 100 : 0) + '%',
            background: categories.getDotColor(row.category, 'surface-2'),
          }"
        />
      </div>
    </li>
  </ul>
</template>

<style scoped>
.bars {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  margin: 0;
  padding: 0;
  list-style: none;
}
.label {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: var(--space-3);
  margin-bottom: var(--space-2);
  font-size: var(--t-sm);
}
.name { display: flex; align-items: center; gap: var(--space-2); color: var(--text); }
.dot { width: 10px; height: 10px; border-radius: 50%; flex: none; }
.count { color: var(--text-muted); font-variant-numeric: tabular-nums; }
.track {
  height: 8px;
  border-radius: var(--radius-s);
  background: var(--surface-2);
  overflow: hidden;
}
.fill { height: 100%; border-radius: var(--radius-s); }
</style>
