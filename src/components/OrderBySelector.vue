<script setup>
import { useSortingOrderStore, useSelSortingOrder} from '../store.js';
const selSortingOrder = useSelSortingOrder()
</script>

<script>

function createSortingOrderObject() {
  const items = {};
  const sortingOrders = useSortingOrderStore().sortingOrders;
  for (let x = 0; x < sortingOrders.length; x++) {
    items[x] = {
      title: sortingOrders[x]
    };
  }
  return items;
}
export default {
  data: () => ({
    valid: false,
    items: createSortingOrderObject(),
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
        id="menu-activator"
    >
      Sort By
      <v-card-subtitle class="smaller-font">
        {{ selSortingOrder.by }}
      </v-card-subtitle>
    </v-btn>
    <v-card-subtitle class="smaller-font">

    </v-card-subtitle>
  <v-form v-model="valid">
    <v-menu activator="#menu-activator">
      <v-list>
        <v-list-item
            v-for="(item, index) in items"
            :key="index"
            :value="index"
        >
          <v-btn block @click="updateStore(item.title)" class="smaller-font">{{ item.title }}</v-btn>
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