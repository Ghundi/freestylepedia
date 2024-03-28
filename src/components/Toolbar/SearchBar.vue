<script setup>
import { useCurSearchStore} from "@/store.js";
const curSearchStore = useCurSearchStore();
</script>

<script>
import { useCurSearchStore } from "@/store.js";

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
</script>

<template>
  <v-text-field
      v-model="curSearchStore.val"
      :rules="updateStore"
      density="compact"
      variant="solo"
      v-bind:label="$t('toolbar.search')"
      append-inner-icon="mdi-magnify"
      single-line
      hide-details
  >
  </v-text-field>
</template>

<style scoped>
</style>