<script setup>
import { useCategoryStore, useSelCategoryStore } from '../store.js';
const categoryStore = useCategoryStore();
const selCategoryStore = useSelCategoryStore();
</script>

<script>

export default {
  data: () => ({
    valid: false,
    selected: useSelCategoryStore().categories,
    updateStore: [
      value => {
        const selCategoryStore = useSelCategoryStore();
        selCategoryStore.update(value);
        return true
      }
    ]
  }),
}
</script>

<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props">
        Categories
      </v-btn>
    </template>
    <v-card>
      <v-form v-model="valid">
        <v-checkbox
            v-model="selCategoryStore.categories"
            :rules="updateStore"
            v-for="item in categoryStore.categories"
            :label="item"
            :value="item"
            hide-details
        ></v-checkbox>
      </v-form>
    </v-card>
  </v-menu>
</template>

<style scoped>

</style>