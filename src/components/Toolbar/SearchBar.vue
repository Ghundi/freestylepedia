<script setup>
import {useCurSearchStore} from "@/scripts/store.js";

const searchStore = useCurSearchStore();
const trickStore = useTrickStore();
</script>

<script>
import { useCurSearchStore } from "@/scripts/store.js";
import { useTrickStore} from "@/scripts/trickStore.js";

export default {
  data: () => ({
    value: useCurSearchStore().val,
    updateStore: [
      value => {
        const selCurSearchStore = useCurSearchStore();
        selCurSearchStore.update(value);
        return true
      }
    ]
  }),
}

function getSuggestions(state, search, lang) {
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