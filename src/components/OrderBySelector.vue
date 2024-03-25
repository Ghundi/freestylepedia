<script setup>
import { useSortingOrderStore, useSelSortingOrder} from '../store.js';
const selSortingOrder = useSelSortingOrder()
</script>

<script>
function createSortingOrderObject() {
  const translated = {};
  const sortingOrders = useSortingOrderStore().sortingOrders;
  for (let x = 0; x < sortingOrders.length; x++) {
    translated[x] = {
      title: sortingOrders[x]
    };
  }
  return translated;
}
export default {
  data: () => ({
    extended: true,
    translated: createSortingOrderObject(),
  }),
  methods: {
    updateStore(title) {
      const selSortingOrder = useSelSortingOrder();
      selSortingOrder.update(title);
    }
  }
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
          <v-btn block @click="updateStore(item.title)" class="smaller-font">
            {{ $t("sortOptions." + item.title) }}
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