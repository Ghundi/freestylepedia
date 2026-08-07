<script setup lang="ts">
import { strToUrl } from "@/scripts/helpers";
import { useTrickStore } from "@/scripts/trickStore.js";

const trickStore = useTrickStore()
const props = defineProps({
  title: String,
  list: Array<string>,
});

function getTrickNames(id_list: Array<string>) {
  let res = [trickStore.getTrickByID(id_list[0], trickStore).title[0]];
  for (let i = 1; i < id_list.length; i++) {
    res.push(trickStore.getTrickByID(id_list[i], trickStore).title[0]);
  }
  return res;
}
</script>

<template>
  <v-card class="pa-3" elevation="5" max-width="300px" justify-center align-center>
    <p class="font-weight-bold">{{ title }}:</p>
    <template v-for="name in getTrickNames(list!)">
      <v-btn 
        :to="{ name: 'Trick', params: { lang: $i18n.locale, trickname: strToUrl(name) } }"
        variant="flat" 
        class="ma-2">
        {{ name }}
      </v-btn>
    </template>
  </v-card>
</template>

<style scoped>

</style>