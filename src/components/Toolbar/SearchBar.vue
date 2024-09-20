<script setup>
import {useCurSearchStore} from "@/store.js";

const searchStore = useCurSearchStore();
const videoStore = useVideoStore();
</script>

<script>
import { useVideoStore ,useCurSearchStore } from "@/store.js";
let searchEmpty = true;

export default {
  data: () => ({
    updateStore: [
      value => {
        searchEmpty = value == null;
      }
    ],
  getItems() {
    const videoStore = useVideoStore();
    if (searchEmpty) {
      return []
    }
    else {
      return videoStore.getTitles(videoStore);
    }
  }
  }),
}
</script>

<template>
  <v-autocomplete
      v-bind:label="$t('toolbar.search')"
      v-model="searchStore.val"
      :items="videoStore.getTitles(videoStore)"
      density="compact"
      class="mx-auto"
      hide-details
      hide-no-data
      variant="solo"
      single-line
      append-inner-icon="mdi-magnify"
      menu-icon=""
      clearable
      auto-select-first>
  </v-autocomplete>
</template>

<style scoped>
</style>