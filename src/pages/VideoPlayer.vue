<script setup>
import {useVideoStore} from "@/store.js";
import { useRoute } from "vue-router";

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

function getTrickNames(id_list) {
  let res = [videoStore.getTrickByID(id_list[0], videoStore).title[0]];
  for (let i = 1; i < id_list.length; i++) {
    res.push(videoStore.getTrickByID(id_list[i], videoStore).title[0]);
  }
  return res;
}

const trick = videoStore.getTrickByTitle(useRoute().params.trickname.replaceAll("-", " "), videoStore)

</script>

<script>
function hasHistory () { return window.history.length > 2 }
</script>

<template>
  <div class="text-center">
    <iframe class="responsive-iframe" :src="getEmbedURL(trick.id[0])" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
    <v-container>
     <v-row >
      <v-col v-for="title in trick.title">
        {{title}}
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="pa-3" elevation="5">
          <p class="font-weight-bold">{{ $t('difficulty') }}:</p>
           {{ trick.difficulty }}
          <br>
          <p class="font-weight-bold">{{ $t('category') }}:</p>
          {{ $t('categories.' + trick.category) }}
        </v-card>
      </v-col>
      <v-col v-if="trick.connections.length > 0">
        <v-card class="pa-3" elevation="5">
          <p class="font-weight-bold">{{ $t('similarTricks') }}:</p>
          <template v-for="name in getTrickNames(trick.connections, videoStore)">
            <v-btn :to="'/' + name.replaceAll(' ', '-')" variant="flat" class="ma-2">
              {{ name }}
            </v-btn>
          </template>
        </v-card>
      </v-col>
      <v-col v-if="trick.requirements.length > 0">
        <v-card class="pa-3" elevation="5">
          <p class="font-weight-bold">{{ $t('requirements') }}:</p>
          <template v-for="r_name in getTrickNames(trick.requirements, videoStore)">
            <v-btn
              @click="$router.push('/' + r_name.replaceAll(' ', '-'))" variant="flat" class="ma-2">
              {{ r_name }}
            </v-btn>
          </template>
        </v-card>
      </v-col>
      <template v-if="trick.id.length > 1">
        <v-container>
          <v-row>
            <v-col>
              <p class="font-weight-bold">{{ $t('otherTutorials') }}:</p>
            </v-col>
          </v-row>
          <v-row>
            <v-col v-for="video in trick.id.slice(1)">
              <v-card elevation="3" width="150px">
                <v-img
                    :src="getThumbnailUrl(video)"
                    v-on:click="openVideo(video)"
                />
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </template>
    </v-row>
    <v-row>
      <v-col>
        <v-btn
            variant="elevated"
            width="80vw"
            height="50px"
            @click="hasHistory()
                ? $router.back()
                : $router.push('/')">
          {{ $t('close') }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
  </div>
</template>

<style scoped>
/* Then style the iframe to fit in the container div with full height and width */
.responsive-iframe {
  width: 80vw;
  aspect-ratio: 16 / 9;
}
</style>