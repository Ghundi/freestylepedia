<script setup>

import OrderBySelector from "@/components/OrderBySelector.vue";
import CategorySelector from "@/components/CategorySelector.vue";
import DifficultySlider from "@/components/DifficultySlider.vue";
import SearchBar from "@/components/SearchBar.vue";
</script>

<script>
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
      <v-col>
        <SearchBar/>
      </v-col>
      <v-col>
        <CategorySelector/>
      </v-col>
      <v-col>
        <OrderBySelector/>
      </v-col>
      <v-col cols="5" md="3">
        <DifficultySlider/>
      </v-col>
      <v-col>
        <v-btn elevation="2" @click="reset">
          Reset Filters
        </v-btn>
      </v-col>
      </v-row>
  </v-container>
</template>

<style scoped>

</style>