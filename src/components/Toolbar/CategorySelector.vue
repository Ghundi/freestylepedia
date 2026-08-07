<script setup lang="ts">
  import { useCategoryStore, useSelCategoryStore } from '@/scripts/store';
  import { ref } from 'vue';
  const categoryStore = useCategoryStore();
  const selCategoryStore = useSelCategoryStore();

  const extended = ref<boolean>(false)
  const updateStore: ((newVal: Array<string>) => boolean)[] = [
    (newVal: Array<string>) => {
      selCategoryStore.update(newVal);
      return true;
    },
  ]

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