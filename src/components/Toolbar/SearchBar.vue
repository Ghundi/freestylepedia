<script setup>
import {useCurSearchStore} from "@/store.js";

const searchStore = useCurSearchStore();
const videoStore = useVideoStore();
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
      :rules="updateStore"
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
  </v-combobox>
</template>

<style scoped>
</style>