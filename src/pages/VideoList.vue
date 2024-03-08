<script setup>
import VideoCard from '../components/VideoCard.vue';
import { useSelCategoryStore, useSelDifficultyStore, useVideoStore, useCurSearchStore, useSelSortingOrder } from '../store.js';
import DifficultySlider from "@/components/DifficultySlider.vue";
import CategorySelector from "@/components/CategorySelector.vue";
import SearchBar from "@/components/SearchBar.vue";
import OrderBySelector from "@/components/OrderBySelector.vue";

const videoStore = useVideoStore();
const selDifficultyStore = useSelDifficultyStore();
const curSearchStore = useCurSearchStore();
const curSelSortingOrder = useSelSortingOrder();
</script>

<script>
export default {
  methods: {
    reset () {
      const selCategoryStore = useSelCategoryStore();
      const selDifficultyStore = useSelDifficultyStore();
      const curSearchStore = useCurSearchStore();
      const selSortingOrder = useSelSortingOrder()
      selCategoryStore.reset();
      selDifficultyStore.reset();
      curSearchStore.reset();
      selSortingOrder.reset();
    },
  },
}

function isMobile() {
  return window.screen.orientation.type === 'portrait-primary'
}
</script>

<template>
  <v-container>
    <v-row class="mt-3" justify="start">
      <v-col>
        <SearchBar/>
      </v-col>
      <v-col>
        <CategorySelector/>
      </v-col>
      <v-col>
        <OrderBySelector/>
      </v-col>
      <v-col>
        <DifficultySlider/>
      </v-col>
      <v-col>
        <v-btn elevation="2" @click="reset">
          Reset Filters
        </v-btn>
      </v-col>
    </v-row>
    <v-row :justify="(isMobile) ? 'center' : 'start'">
      <template
          v-for="video in videoStore.filteredVideos(videoStore.sortedVideos(videoStore, curSelSortingOrder.by))"
          :key="video.id">
        <v-col class="videoCard">
          <v-container>
            <VideoCard
                :id="video.id"
                :title="video.title"
                :difficulty="video.difficulty"
                :category="video.category"
                :releaseDate="video.releaseDate"
                :thumbnailUrl="videoStore.getThumbnailUrl(video.id)"
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