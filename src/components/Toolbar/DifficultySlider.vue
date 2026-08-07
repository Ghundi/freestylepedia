<script setup lang="ts">
  import { useSelDifficultyStore } from "@/scripts/store.js";
  import { ref } from "vue";

  const selDifficultyStore = useSelDifficultyStore();

  const valid = ref<boolean>(false)
  const updateStore: ((newVal: Array<number>) => boolean)[] = [
    (newVal: Array<number>) => {
      selDifficultyStore.update(newVal);
      return true;
    },
  ]
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