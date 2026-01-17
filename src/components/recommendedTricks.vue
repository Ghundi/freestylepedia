<script setup>
import { useMasteredStore } from '@/scripts/store';
import TrickCard from './TrickCard.vue';
import { useTrickStore } from "@/scripts/videoStore.js";

const trickStore = useTrickStore();
const masteredTricks = useMasteredStore();
</script>

<script>
  function isMobile() {
    return /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
</script>

<template>
  <v-card-title>
    {{ $t('myProgress.recommendedTricks') }}
  </v-card-title>

  <v-container>
    <v-row :justify="isMobile() ? 'center' : 'start'" align-content="center">
      <template
          v-for="trick in trickStore.getRecommendedTricks(trickStore, masteredTricks)"
          :key="trick.id">
        <v-col cols="auto">
          <TrickCard
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
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<style scoped>
</style>