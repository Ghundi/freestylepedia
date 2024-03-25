<script setup>
import {useVideoStore} from "@/store.js";

const videoStore = useVideoStore()

function getEmbedURL(id) {
  return 'https://www.youtube.com/embed/' + id + '?si=9jysKI0zbGHvpMCD&mute=1'
}
const props = defineProps({
  isActive: Object,
  id: Array[String],
  title: Array[String],
  difficulty: Number,
  category: String,
  releaseDate: Date,
  requirements: Array[String],
  connections: Array[String],
});

function getTrickNames(id_list) {
  let res = videoStore.getTrickByID(id_list[0], videoStore).title[0];
  for (let i = 1; i < id_list.length; i++) {
    res += ", " + videoStore.getTrickByID(id_list[i], videoStore).title[0];
  }
  return res;
}
</script>

<template>
    <iframe width="100%" height="80%" :src="getEmbedURL(id[0])" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
    <v-container>
       <v-row >
        <v-col v-for="title in title">
          {{title}}
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          {{ $t('difficulty') }}: {{ difficulty }}
        </v-col>
        <v-col>
          {{ $t('category') }}: {{ $t('categories.' + category) }}
        </v-col>
        <v-col v-if="connections.length > 0">
          {{ $t('similarTricks') }}: {{ getTrickNames(connections) }}
        </v-col>
        <v-col v-if="requirements.length > 0">
          {{ $t('requirements') }}: {{ getTrickNames(requirements) }}
        </v-col>
      </v-row>
    </v-container>
</template>

<style scoped>
</style>