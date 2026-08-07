<script setup lang="ts">
  import { useCurSearchStore } from "@/scripts/store";
  import { useTrickStore } from "@/scripts/trickStore";
  import { Store } from "pinia";

  const searchStore = useCurSearchStore();
  const trickStore = useTrickStore();

  const updateStore: ((newVal: Array<number>) => boolean)[] = [
    (newVal: Array<number>) => {
      searchStore.update(newVal);
      return true;
    },
  ]

  function getSuggestions(state: Store<'curSearchStore', any>, search: string | null, lang: string): Array<string> {
    if(search) {
      return state.getTitlesStr(state, lang);
    }
    return [];
  }

</script>

<template>
  <v-combobox
      v-bind:label="$t('toolbar.search')"
      :rules="updateStore"
      v-model="searchStore.val"
      :items="getSuggestions(trickStore, searchStore.val, $i18n.locale)"
      density="compact"
      class="mx-auto"
      hide-details
      hide-no-data
      variant="solo"
      single-line
      append-inner-icon="mdi-magnify"
      menu-icon=""
      clearable
      auto-select-first>
  </v-combobox>
</template>

<style scoped>
</style>