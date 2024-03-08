<script setup>

import OrderBySelector from "@/components/OrderBySelector.vue";
import CategorySelector from "@/components/CategorySelector.vue";
import DifficultySlider from "@/components/DifficultySlider.vue";
import SearchBar from "@/components/SearchBar.vue";
</script>

<script>
import {useCurSearchStore, useSelCategoryStore, useSelDifficultyStore, useSelSortingOrder} from "@/store.js";

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
</script>

<template>
  <v-container>
    <v-row>
      <v-col class="minWidth">
        <SearchBar/>
      </v-col>
      <v-col>
        <CategorySelector/>
      </v-col>
      <v-col class="minWidth">
        <DifficultySlider/>
      </v-col>
      <v-col>
        <v-btn elevation="2" @click="reset">
          Reset Filters
        </v-btn>
      </v-col>
      <v-col>
        <OrderBySelector/>
      </v-col>
      </v-row>
  </v-container>
</template>

<style scoped>
.minWidth {
  min-width: 200px;
}
</style>