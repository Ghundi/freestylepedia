<script setup lang="ts">
  import { useSortingOrderStore, useSelSortingOrderStore} from '@/scripts/store.js';
  import { ref } from 'vue';
  interface Dictionary<T> {
      [key: string]: T;
  }

  const selSortingOrder = useSelSortingOrderStore()

  const extended = ref<boolean>(true);
  const translated = ref(createSortingOrderObject());

  function updateStore(newVal: string): void {
    selSortingOrder.update(newVal)
  }

  function createSortingOrderObject(): Dictionary<string> {
    const translated: Dictionary<string>  = {};
    const sortingOrders = useSortingOrderStore().sortingOrders;
    for (let x = 0; x < sortingOrders.length; x++) {
      translated[x] = sortingOrders[x];
    }
    return translated;
  }

</script>

<template>
    <v-btn
        id="list-activator"
    >
      {{ $t("toolbar.sortBy") }}
      <v-card-subtitle class="smaller-font">
        {{ $t("sortOptions." + selSortingOrder.by)  }}
      </v-card-subtitle>
    </v-btn>
    <v-card-subtitle class="smaller-font">

    </v-card-subtitle>
  <v-form v-model="extended">
    <v-menu activator="#list-activator">
      <v-list>
        <v-list-item
            v-for="(item, index) in translated"
            :key="index"
            :value="item"
        >
          <v-btn block @click="updateStore(item)" class="smaller-font">
            {{ $t("sortOptions." + item) }}
          </v-btn>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-form>
</template>

<style scoped>
.smaller-font {
  font-size: 0.8em;
  text-transform: none;
}
</style>