<script setup>

import OrderBySelector from "@/components/Toolbar/OrderBySelector.vue";
import CategorySelector from "@/components/Toolbar/CategorySelector.vue";
import DifficultySlider from "@/components/Toolbar/DifficultySlider.vue";
import SearchBar from "@/components/Toolbar/SearchBar.vue";
import { useCurSearchStore, useSelCategoryStore, useSelDifficultyStore, useCategoryStore, useMarkedStore} from "@/scripts/store.js";
import MarkedTricksSelector from "./MarkedTricksSelector.vue";
const selCategoriesStore = useSelCategoryStore()
const categoryStore = useCategoryStore();
</script>

<script>

function getOrientation() {
  return window.innerWidth > window.innerHeight ? "Landscape" : "Portrait";
}

export default {
  methods: {
    reset () {
      const selCategoryStore = useSelCategoryStore();
      const selDifficultyStore = useSelDifficultyStore();
      const curSearchStore = useCurSearchStore();
      const markedStore = useMarkedStore();

      selCategoryStore.reset();
      selDifficultyStore.reset();
      curSearchStore.reset();
      markedStore.reset();
    },
    removeCategory(category) {
      const selCategoryStore = useSelCategoryStore();
      selCategoryStore.remove(category);
    }
  },
}
</script>

<template>
  <!-- Mobile -->
  <template v-if="(getOrientation() == 'Portrait')">
    <v-container>
      <v-row class="ml-1 mr-1">
        <SearchBar/>
      </v-row>

      <v-row class="mb-5 mt-5">
        <v-expansion-panels variant="popout">
          <v-expansion-panel>
            <v-expansion-panel-title>
              {{ $t('toolbar.filters') }}
            </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-container>
              <v-row justify="center">
                <v-col>
                  <CategorySelector/>
                </v-col>
                <v-col>
                  <MarkedTricksSelector/>
                </v-col>
                <v-col class="minWidth">
                  <DifficultySlider/>
                </v-col>
                <v-col>
                  <v-btn elevation="2" @click="reset">
                    {{ $t('toolbar.resetFilters') }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-row>

      <v-row class="justify-center">
        
      </v-row>
    </v-container>
  </template>
  <template v-else>
    <v-container>
      <v-row justify="center">
        <v-col class="minWidth">
          <SearchBar/>
        </v-col>
        <v-col>
          <CategorySelector/>
        </v-col>
        <v-col>
          <MarkedTricksSelector/>
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
    </v-container>
  </template>

  <!-- category chips -->
   <v-container>
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