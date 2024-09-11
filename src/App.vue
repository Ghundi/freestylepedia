<script setup>
import NavBar from "@/components/navBar.vue";
import 'vuetify/styles';
import {useVideoStore} from "@/store.js";
import Footer from "@/components/footer.vue"

const videoStore = useVideoStore();
videoStore.videos = videoStore.loadYAML();
</script>


<template>
  <v-app>
    <nav-bar/>
    <br>
    <v-main class="bg-grey-lighten-3 pb-5">
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
