<script setup>
import {useCurSearchStore} from "@/store.js";
const searchStore = useCurSearchStore();
</script>

<script>
import { useVideoStore ,useCurSearchStore } from "@/store.js";
let searchEmpty = true;

import { ref } from 'vue'
import debounce from 'lodash/debounce'

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
  <v-combobox
      @update:modelValue="updateStore"
      v-bind:label="$t('toolbar.search')"
      v-model="searchStore.val"
      hide-no-data
      hide-details
      density="compact"
      variant="solo"
      single-line
      append-inner-icon="mdi-magnify"
      menu-icon=""
      clearable
      :items="getItems()"
  ></v-combobox>
</template>

<style scoped>
</style>