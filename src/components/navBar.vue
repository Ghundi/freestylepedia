<script setup>
import { ref } from 'vue'

const drawer = ref(null)

</script>

<script>
import { useCurPage} from "@/store.js";

function openPage(page) {
  const curPage = useCurPage();
  curPage.update(page);
}
</script>

<template>
  <v-app-bar :elevation="8" class="bg-black pa-3" prominent>
    <v-app-bar-nav-icon align="start" variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    <v-app-bar-title class="font-weight-black">Freestylepedia</v-app-bar-title>
  </v-app-bar>

  <v-navigation-drawer
      v-model="drawer"
      temporary
      :elevation="5"
      class="bg-black mt-3 ma-3"
  >
    <v-list>
      <v-list-item class="bg-transparent" @click="openPage('VideoList')">
        <v-btn @click="drawer = !drawer" id="no-background-hover" class="bg-black font-weight-bold">
          {{ $t("navBar.freestylepedia") }}
        </v-btn>
      </v-list-item>
      <v-list-item @click="openPage('MindMap')">
        <v-btn @click="drawer = !drawer" id="no-background-hover" class="bg-black font-weight-bold">
          {{ $t("navBar.mindMap") }}
        </v-btn>
      </v-list-item>
      <v-list-item @click="openPage('TrickTree')">
        <v-btn @click="drawer = !drawer" id="no-background-hover" class="bg-black font-weight-bold">
          {{ $t("navBar.trickTree") }}
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