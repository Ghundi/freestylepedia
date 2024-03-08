<script setup>
import { ref } from 'vue'

const drawer = ref(null)

import logo from '@/assets/blackbirdLogoInverted.jpg'
</script>

<script>
import { useCurPage} from "@/store.js";

export default {
  name: "app",
  methods: {
    openYoutube() {
      window.open("https://www.youtube.com/@BlackbirdIceFreestyle");
    },
    openInstagram() {
      window.open("https://www.instagram.com/blackbird_ice_freestyle/");
    },
  },
};

function openPage(page) {
  const curPage = useCurPage();
  curPage.update(page);

}
</script>

<template>
  <v-app-bar :elevation="8" class="bg-black pa-3">
    <template v-slot:prepend>
      <v-img :src="logo" @click="drawer = !drawer" width="100"> </v-img>
    </template>
    <v-app-bar-title class="font-weight-black">Freestylepedia</v-app-bar-title>
  </v-app-bar>

  <v-navigation-drawer
      v-model="drawer"
      temporary
      :elevation="5"
      class="bg-black mt-3"
  >
    <v-list>
      <v-list-item @click="openPage('VideoList')">
        Freestylepedia
      </v-list-item>
      <v-list-item @click="openYoutube()">
        Youtube
      </v-list-item>
      <v-list-item @click="openInstagram()">
        Instagram
      </v-list-item>
      <v-list-item @click="openPage('Impressum')">
        Impressum
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped>
/* TODO Buchstaben abgeschnitten; */
.v-app-bar-title {
  font-size: 2em;
}
</style>