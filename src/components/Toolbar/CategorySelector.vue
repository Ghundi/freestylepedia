<script setup>
import { useCategoryStore, useSelCategoryStore } from '@/scripts/store.js';
const categoryStore = useCategoryStore();
const selCategoryStore = useSelCategoryStore();
</script>

<script>

import {useSelCategoryStore} from "@/scripts/store.js";

export default {
  data: () => ({
    extended: false,
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
  <v-menu v-model="extended" :close-on-content-click="false">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props">
        {{ $t("toolbar.categories") }}
      </v-btn>
    </template>
    <v-card>
        <v-checkbox
            v-model="selCategoryStore.categories"
            :rules="updateStore"
            v-for="item in categoryStore.categories"
            v-bind:label="$t('categories.' + item)"
            :value="item"
            hide-details
        ></v-checkbox>
    </v-card>
  </v-menu>
</template>

<style scoped>

</style>