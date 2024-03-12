<script setup>
import VideoCard from '../components/VideoCard.vue';
import { useSelDifficultyStore, useVideoStore, useCurSearchStore, useSelSortingOrder } from '../store.js';
import Toolbar from "@/components/Toolbar.vue";

const videoStore = useVideoStore();
videoStore.loadYAML();
const selDifficultyStore = useSelDifficultyStore();
const curSearchStore = useCurSearchStore();
const curSelSortingOrder = useSelSortingOrder();
</script>

<script>
function isMobile() {
  return window.screen.orientation.type === 'portrait-primary'
}
</script>

<template>
  <v-container>
    <v-row class="mt-3" justify="start">
      <Toolbar/>
    </v-row>
    <v-row :justify="(isMobile) ? 'start' : 'center'">
      <template
          v-for="video in videoStore.filteredVideos(videoStore.sortedVideos(videoStore, curSelSortingOrder.by))"
          :key="video.title[0]">
        <v-col class="videoCard">
          <v-container>
            <VideoCard
                :id="video.id[0]"
                :title="video.title[0]"
                :difficulty="video.difficulty"
                :category="video.category"
                :releaseDate="video.releaseDate"
                :thumbnailUrl="videoStore.getThumbnailUrl(video.id[0])"
            />
          </v-container>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<style scoped>
  .videoCard{
    max-width: 300px;
  }
</style>