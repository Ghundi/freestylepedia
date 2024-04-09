<script setup>
import { useCategoryStore, useSelCategoryStore } from '@/store.js';
const categoryStore = useCategoryStore();
const selCategoryStore = useSelCategoryStore();
</script>

<script>

import {useSelCategoryStore} from "@/store.js";

export default {
  data: () => ({
    valid: true,
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
      {{ props["aria-expanded"] }}
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