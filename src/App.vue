<script setup>
import NavBar from "@/components/navBar.vue";
import 'vuetify/styles';
import {useVideoStore} from "@/scripts/store.js";
import Footer from "@/components/footer.vue"
import { useTheme } from 'vuetify'
import { getBgColor } from "@/scripts/helpers.js";

const theme = useTheme()

const videoStore = useVideoStore();
videoStore.videos = videoStore.loadYAML();
</script>


<template>
  <v-app>
    <nav-bar/>
    <br>
    <v-main class="pb-5" :style="{backgroundColor: getBgColor(theme.global.current.value.dark)}">
      <router-view :key="$route.fullPath"/>
    </v-main>
    <Footer/>
    </v-app>
</template>

<style>
/* width */
::-webkit-scrollbar {
  width: 0;
}
</style>
