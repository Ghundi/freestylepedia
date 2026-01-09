<script setup>
  import { useMarkedStore } from '@/scripts/store.js';
  const markedStore = useMarkedStore()
</script>

<script>

import { useMarkedStore} from "@/scripts/store.js";

export default {
  data: () => ({
    extended: false,
    selected: useMarkedStore().selMarkers,
    updateStore: [
      value => {
        const markedStore = useMarkedStore();
        markedStore.update(value);
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
        {{ $t("toolbar.marked") }}
      </v-btn>
    </template>
    <v-card>
        <v-checkbox
            v-model="markedStore.selMarkers"
            :rules="updateStore"
            v-for="item in markedStore.markers"
            v-bind:label="$t('marked.' + item)"
            :value="item"
            hide-details
        ></v-checkbox>
    </v-card>
  </v-menu>
</template>

<style scoped>

</style>