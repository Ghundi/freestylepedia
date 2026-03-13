<script setup>
import ProgressBar from '@/components/progressBar.vue';
import ProgressSpiderChart from '@/components/ProgressSpiderChart.vue';
import RecommendedTricks from '@/components/recommendedTricks.vue';
import TrickCard from '@/components/TrickCard.vue';
import { useMasteredStore, useTodoStore } from '@/scripts/store';
import { useTrickStore } from '@/scripts/trickStore';
import { computed } from 'vue'
</script>

<script>
  const trickStore = useTrickStore()
  const masteredStore = useMasteredStore()
  const hardestMasteredTrick = computed(() => {
  return trickStore.getHardestMasteredTrick(
    masteredStore.getMasteredTricks(trickStore.tricks)
  )
})

  async function getExportUrl()  {
    try {
      const exportUrl = 'https://freestylepedia.org/en?todo=' + useTodoStore().getHash() + "&mastered=" + useMasteredStore().getHash();
      await navigator.clipboard.writeText(exportUrl);
    } catch($e) {
      console.log('failed copying to clipboard. Make sure you have a secure connection');
    }
  }

</script>

<template>
  <v-card class="ma-10 pa-5" elevation="3">
    <v-card-title class="text-center font-weight-bold">
      {{ $t("myProgress.myProgress") }}
    </v-card-title>
    <progress-bar/>
    <v-container>
      <v-row>
        <v-col>
            <progress-spider-chart/>
        </v-col>
        <v-col class="d-flex flex-column align-center">
          <v-card-title>
            {{ $t('myProgress.hardestTrick') }}
          </v-card-title>
          <div>
            <TrickCard
              class="ma-1"
              :trick="hardestMasteredTrick"
            />
          </div>
        </v-col>
      </v-row>
    </v-container>
    <div class="text-center">
      <v-btn variant="elevated" @click="getExportUrl()">
        {{ $t('myProgress.transferProgress') }}
      </v-btn>
    </div>
    <div class="text-center justify-center">
      <recommended-tricks/>
    </div>
  </v-card>

</template>

<style scoped>

</style>