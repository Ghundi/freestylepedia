<script setup>
import VideoCard from '../components/VideoCard.vue';
import Toolbar from "@/components/Toolbar/Toolbar.vue";
import {useSelSortingOrderStore} from "@/scripts/store.js";
import {useVideoStore} from "@/scripts/videoStore.js";

const videoStore = useVideoStore();
const selSortingOrderStore = useSelSortingOrderStore();
</script>

<script>

function isMobile() {
  return window.screen.orientation.type === 'portrait-primary'
}
</script>

<template>
  <v-container>
    <v-row class="mt-3" justify="center">
      <Toolbar/>
    </v-row>
    <v-row :justify="(isMobile()) ? 'center' : 'start'" :align-content="(isMobile()) ? 'center' : 'start'">
      <template
          v-for="video in videoStore.filteredVideos(videoStore.sortedVideos(videoStore, selSortingOrderStore.by))"
          :key="video.title[0]">
        <v-col class="videoCard">
            <VideoCard
                :id="video.id"
                :title="video.title"
                :difficulty="video.difficulty"
                :category="video.category"
                :releaseDate="video.releaseDate"
                :thumbnailUrl="useVideoStore().getThumbnailUrl(video.id[0])"
                :connections="video.connections"
                :requirements="video.requirements"
            />
        </v-col>
      </template >
      <template v-if="videoStore.filteredVideos(videoStore.sortedVideos(videoStore, selSortingOrderStore.by)).length === 0">
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