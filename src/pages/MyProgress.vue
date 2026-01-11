<script setup>
import ProgressBar from '@/components/progressBar.vue';
import ProgressSpiderChart from '@/components/ProgressSpiderChart.vue';
import RecommendedTricks from '@/components/recommendedTricks.vue';
import VideoCard from '@/components/VideoCard.vue';
import { useMasteredStore } from '@/scripts/store';
import { useTrickStore } from '@/scripts/videoStore';
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
          <VideoCard
            class="ma-1"
            :id="hardestMasteredTrick.id"
            :title="hardestMasteredTrick.title"
            :difficulty="hardestMasteredTrick.difficulty"
            :category="hardestMasteredTrick.category"
            :releaseDate="hardestMasteredTrick.releaseDate"
            :thumbnailUrl="trickStore.getThumbnailUrl(hardestMasteredTrick.id[0])"
            :connections="hardestMasteredTrick.connections"
            :requirements="hardestMasteredTrick.requirements"
          />
        </v-col>
      </v-row>
    </v-container>
    <div class="text-center justify-center">
      <recommended-tricks/>
    </div>
  </v-card>

</template>

<style scoped>

</style>