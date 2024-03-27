<script setup>
import {useVideoStore} from "@/store.js";

const videoStore = useVideoStore()

function getEmbedURL(id) {
  return 'https://www.youtube.com/embed/' + id + '?si=9jysKI0zbGHvpMCD&mute=1'
}

function getThumbnailUrl(videoId) {
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
}

function openVideo(id) {
  window.open("https://www.youtube.com/watch?v=" + id + "?mute=1");
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
  thumbnailUrl: String
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
          <v-card class="pa-3" elevation="5">
            <p class="font-weight-bold">{{ $t('difficulty') }}:</p>
             {{ difficulty }}
            <br>
            <p class="font-weight-bold">{{ $t('category') }}:</p>
            {{ $t('categories.' + category) }}
          </v-card>
        </v-col>
        <v-col v-if="connections.length > 0">
          <v-card class="pa-3" elevation="5">
            <p class="font-weight-bold">{{ $t('similarTricks') }}:</p>
            <br>
            {{ getTrickNames(connections) }}
          </v-card>
        </v-col>
        <v-col v-if="requirements.length > 0">
          <v-card class="pa-3" elevation="5">
            <p class="font-weight-bold">{{ $t('requirements') }}:</p>
            <br>
            {{ getTrickNames(requirements) }}
          </v-card>
        </v-col>
        <template v-if="id.length > 1">
          <v-col>
            <p class="font-weight-bold">{{ $t('otherTutorials') }}:</p>
          </v-col>
          <v-col v-for="video in id.slice(1)">
            <v-card elevation="3" width="150px" class="ma-2" rounded>
              <v-img
                  :src="getThumbnailUrl(video)"
                  v-on:click="openVideo(video)"
              />
            </v-card>
          </v-col>
        </template>
      </v-row>
    </v-container>
</template>

<style scoped>
</style>