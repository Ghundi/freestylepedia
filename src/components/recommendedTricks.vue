<script setup>
import { useMasteredStore } from '@/scripts/store';
import VideoCard from '../components/VideoCard.vue';
import { useTrickStore } from "@/scripts/videoStore.js";

const trickStore = useTrickStore();
const masteredTricks = useMasteredStore();
</script>

<script>

</script>

<template>
  <v-card-title>
    {{ $t('myProgress.recommendedTricks') }}
  </v-card-title>

  <v-list class="d-flex flex-row flex-wrap justify-center">
    <v-list-item
      v-for="trick in trickStore.getRecommendedTricks(trickStore, masteredTricks)"
      :key="trick.id"
    >
      <VideoCard
        class="ma-1"
        :id="trick.id"
        :title="trick.title"
        :difficulty="trick.difficulty"
        :category="trick.category"
        :releaseDate="trick.releaseDate"
        :thumbnailUrl="trickStore.getThumbnailUrl(trick.id[0])"
        :connections="trick.connections"
        :requirements="trick.requirements"
      />
    </v-list-item>
  </v-list>
</template>

<style scoped>
</style>