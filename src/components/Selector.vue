<script setup>
</script>

<script>
const values = ['A', 'B', 'C', 'D'];
export default {
  data: () => ({
    extended: false,
    selected: values,
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
  <v-menu v-model="extended" :close-on-content-click="false">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props">
        {{ $t("calendar.country") }}
      </v-btn>
    </template>
    <v-card>
        <v-checkbox
            v-model="values"
            :rules="updateStore"
            v-for="item in values"
            v-bind:label="$t('categories.' + item)"
            :value="item"
            hide-details
        ></v-checkbox>
    </v-card>
  </v-menu>
</template>

<style scoped>

</style>