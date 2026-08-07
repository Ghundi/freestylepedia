<script setup lang="ts">
  import { useMarkedStore } from '@/scripts/store.js';
  import { ref } from 'vue';
  const markedStore = useMarkedStore()

  const extended = ref<boolean>(false)
  const updateStore: ((newVal: Array<string>) => boolean)[] = [
    (newVal: Array<string>) => {
      markedStore.update(newVal);
      return true;
    },
  ]
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