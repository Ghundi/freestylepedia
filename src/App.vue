<script setup>
import VideoList from "@/pages/VideoList.vue";
import NavBar from "@/components/navBar.vue";
import 'vuetify/styles';
import {useCurPage, useVideoStore} from "@/store.js";
import Impressum from "@/pages/AboutUs.vue";
import Help from "@/pages/Help.vue"
import Footer from "@/components/footer.vue"
import MindMap from "@/pages/MindMap.vue";
import TrickTree from "@/pages/TrickTree.vue";
const curPage = useCurPage();
const videoStore = useVideoStore();
videoStore.loadYAML();
</script>


<template>
  <v-app>
    <nav-bar/>
    <br>
    <v-main class="bg-grey-lighten-3">
      <router-view/>
    </v-main>
    <Footer/>
    </v-app>
</template>

<style scoped>
</style>
