<script setup>
import {useCurSearchStore, useSelCategoryStore} from "@/store.js";
const curSearchStore = useCurSearchStore();
</script>

<script>
import { useVideoStore ,useCurSearchStore } from "@/store.js";

export default {
  data: () => ({
    value: useCurSearchStore().val,
    updateStore: [
      value => {
        const selCurSearchStore = useCurSearchStore();
        selCurSearchStore.update(value);
        return true
      }
    ]
  }),
}
</script>

<template>
  <v-combobox
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
      :items="useVideoStore().getTitles(useVideoStore())"
  ></v-combobox>
</template>

<style scoped>
</style>