<script setup>
import { useCurSearchStore} from "@/store.js";
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
  <v-autocomplete
      v-bind:label="$t('toolbar.search')"
      :rules="updateStore"
      @update:search="updateStore"
      hide-no-data
      hide-details
      density="compact"
      variant="solo"
      single-line
      append-inner-icon="mdi-magnify"
      menu-icon=""
      :items="useVideoStore().getTitles(useVideoStore())"
  ></v-autocomplete>
</template>

<style scoped>
</style>