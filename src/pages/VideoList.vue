<script setup>
import VideoCard from '../components/VideoCard.vue';
import Toolbar from "@/components/Toolbar/Toolbar.vue";
import { useSelSortingOrderStore } from "@/scripts/store.js";
import { useTrickStore } from "@/scripts/videoStore.js";

const trickStore = useTrickStore();
</script>

<script>
  function isMobile() {
    return /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  const trickStore = useTrickStore();
  const selSortingOrderStore = useSelSortingOrderStore();
  trickStore.filteredVideos(trickStore.sortedVideos(trickStore, selSortingOrderStore.by))
</script>

<template>
  <v-container>
    <v-row class="mt-3" justify="center">
      <Toolbar/>
    </v-row>
    <v-row :justify="isMobile() ? 'center' : 'start'" align-content="center">
      <template
          v-for="trick in trickStore.shownTricks"
          :key="trick.title[0]">
        <v-col cols="auto">
            <VideoCard
                :id="trick.id"
                :title="trick.title"
                :difficulty="trick.difficulty"
                :category="trick.category"
                :releaseDate="trick.releaseDate"
                :thumbnailUrl="useTrickStore().getThumbnailUrl(trick.id[0])"
                :connections="trick.connections"
                :requirements="trick.requirements"
            />
        </v-col>
      </template>
      <template v-if="trickStore.tricks.length === 0">
        <v-col>
          <v-empty-state
              icon="mdi-magnify"
              :text="$t('noResultsSuggestions')"
              :title="$t('noResults')"
          ></v-empty-state>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<style scoped>
</style>