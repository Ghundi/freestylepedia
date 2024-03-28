<script setup>
import VideoCard from '../components/VideoCard.vue';
import { useSelDifficultyStore, useVideoStore, useCurSearchStore, useSelSortingOrder } from '../store.js';
import Toolbar from "@/components/Toolbar/Toolbar.vue";

const videoStore = useVideoStore();
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
            <VideoCard
                :id="video.id"
                :title="video.title"
                :difficulty="video.difficulty"
                :category="video.category"
                :releaseDate="video.releaseDate"
                :thumbnailUrl="videoStore.getThumbnailUrl(video.id[0])"
                :connections="video.connections"
                :requirements="video.requirements"
            />
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