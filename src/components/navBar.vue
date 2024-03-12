<script setup>
import { ref } from 'vue'

const drawer = ref(null)

import logo from '@/assets/blackbirdLogoInverted.jpg'
</script>

<script>
import { useCurPage} from "@/store.js";

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
      <v-list-item class="bg-transparent" @click="openPage('VideoList')">
        <v-btn @click="drawer = !drawer" id="no-background-hover" class="bg-black font-weight-bold">
          Freestylepedia
        </v-btn>
      </v-list-item>
      <v-list-item @click="openPage('Help')">
        <v-btn @click="drawer = !drawer" id="no-background-hover" class="bg-black font-weight-bold">
          PH Trick Families
        </v-btn>
      </v-list-item>
      <v-list-item @click="openPage('Impressum')">
        <v-btn @click="drawer = !drawer" id="no-background-hover" class="bg-black font-weight-bold">
          PH Trick Tree
        </v-btn>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped>
.v-app-bar-title {
  line-height: 2em;
  font-size: 2em;
}
</style>