<script setup>

import OrderBySelector from "@/components/Toolbar/OrderBySelector.vue";
import CategorySelector from "@/components/Toolbar/CategorySelector.vue";
import DifficultySlider from "@/components/Toolbar/DifficultySlider.vue";
import SearchBar from "@/components/Toolbar/SearchBar.vue";
import { useCurSearchStore, useSelCategoryStore, useSelDifficultyStore, useSelSortingOrder, useCategoryStore} from "@/store.js";
const selCategoriesStore = useSelCategoryStore()
const categoryStore = useCategoryStore();
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
    removeCategory(category) {
      const selCategoryStore = useSelCategoryStore();
      selCategoryStore.remove(category);
    }
  },
}
</script>

<template>
  <v-container>
    <v-row justify="center">
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
          {{ $t('toolbar.resetFilters') }}
        </v-btn>
      </v-col>
      <v-col>
        <OrderBySelector/>
      </v-col>
    </v-row>
    <v-row>
      <v-chip
          v-for="category in selCategoriesStore.categories"
          class="ma-1 text-black"
          @click="removeCategory(category)"
          variant="elevated"
          :color="categoryStore.getColor(category)"
      >
        {{ $t("categories." + category) }}
        <span style="display:inline-block; width: 5px;"></span>
        <v-icon>mdi-close-circle</v-icon>
      </v-chip>
    </v-row>
  </v-container>
</template>

<style scoped>
.minWidth {
  min-width: 200px;
}
</style>