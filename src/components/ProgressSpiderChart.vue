<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCategoryStore, useMasteredStore } from '@/scripts/store'
import { useTrickStore } from '@/scripts/videoStore'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js'
import { Radar } from 'vue-chartjs'

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)

// ---------- Pinia ----------
const categoryStore = useCategoryStore()
const masteredStore = useMasteredStore()
const trickStore = useTrickStore()

// ---------- i18n ----------
const { t } = useI18n()

// ---------- Reactive translations ----------
const labels = computed(() =>
  categoryStore.categories.map(cat => t(`categories.${cat}`))
)

// ---------- Chart data ----------
const tricksMastered = computed(() =>
  masteredStore.calcCategoryShareMastered(
    trickStore.tricks,
    categoryStore.categories
  )
)

const chartData = computed(() => ({
  labels: labels.value,
  datasets: [
    {
      label: t('myProgress.progress'),
      data: tricksMastered.value.map(x => x * 100)
    }
  ]
}))

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    backgroundColor: 'rgba(0,100,0,0.2)',
    borderColor: 'rgba(0,150, 0, 0.5)',
    pointBackgroundColor: 'rgba(179,181,198,1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(179,181,198,1)',
    scales: {
    r: {
        angleLines: {
            display: false
        },
        suggestedMin: 0,
        suggestedMax: 100
    }
    }
}
</script>

<template>
  <Radar :data="chartData" :options="chartOptions">
    {{ $t('error.loadChartFailed') }}
  </Radar>
</template>