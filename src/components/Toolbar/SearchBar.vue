<script setup>
import {useCurSearchStore} from "@/store.js";
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
    if (searchEmpty) {
      return []
    }
    else {
      return useVideoStore().getTitles(useVideoStore());
    }
  }
  }),
}
</script>

<template>
  <v-combobox
      @update:modelValue="updateStore"
      v-bind:label="$t('toolbar.search')"
      v-model="useCurSearchStore().val"
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