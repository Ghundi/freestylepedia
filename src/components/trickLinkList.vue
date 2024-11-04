<script setup>
import {useVideoStore} from "@/scripts/videoStore.js";

const videoStore = useVideoStore()
const props = defineProps({
  title: String,
  list: Array[String],
});

function getTrickNames(id_list) {
  let res = [videoStore.getTrickByID(id_list[0], videoStore).title[0]];
  for (let i = 1; i < id_list.length; i++) {
    res.push(videoStore.getTrickByID(id_list[i], videoStore).title[0]);
  }
  return res;
}
</script>

<template>
  <v-card class="pa-3" elevation="5" max-width="300px" justify-center align-center>
    <p class="font-weight-bold">{{ title }}:</p>
    <template v-for="name in getTrickNames(list, videoStore)">
      <v-btn :to="'/trick/' + name" variant="flat" class="ma-2">
        {{ name }}
      </v-btn>
    </template>
  </v-card>
</template>

<style scoped>

</style>