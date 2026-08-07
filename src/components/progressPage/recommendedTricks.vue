<script setup lang="ts">
import { useMasteredStore } from '@/scripts/store';
import TrickCard from '../TrickCard.vue';
import { useTrickStore } from "@/scripts/trickStore.js";
import { isMobile } from '@/scripts/helpers.js';

const trickStore = useTrickStore();
const masteredTricks = useMasteredStore();
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
            :trick="trick"
          />
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<style scoped>
</style>