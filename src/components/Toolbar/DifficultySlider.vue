<script setup>
import { useSelDifficultyStore } from "@/store.js";
const selDifficultyStore = useSelDifficultyStore();
</script>

<script>
import { useSelDifficultyStore } from "@/store.js";

export default {
  data: () => ({
    valid: false,
    value: useSelDifficultyStore().val,
    updateStore: [
        value => {
          const selDifficultyStore = useSelDifficultyStore();
          selDifficultyStore.update(value);
          return true
        }
    ]
  }),
}
</script>

<template>
  <v-form v-model="valid">
    <v-range-slider
        v-model="selDifficultyStore.val"
        :rules="updateStore"
        strict
        :max="5"
        :min="1"
        :step="1"
        show-ticks="always"
        thumb-label="always"
        track-size="5"
        class="mt-3">
    </v-range-slider>
  </v-form>
</template>

<style scoped>
</style>