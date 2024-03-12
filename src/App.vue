<script setup>
import VideoList from "@/pages/VideoList.vue";
import NavBar from "@/components/navBar.vue";
import 'vuetify/styles';
import { useCurPage } from "@/store.js";
import Impressum from "@/pages/Impressum.vue";
import Help from "@/pages/Help.vue"
import Footer from "@/components/footer.vue"
const curPage = useCurPage();
</script>

<template>
  <v-app>
    <nav-bar/>
    <br>
    <v-main>
      <VideoList v-if="curPage.val==='VideoList'"/>
      <Impressum v-if="curPage.val==='About Us'"/>
      <Help v-if="curPage.val==='Help'"/>
    </v-main>
    <Footer/>
    </v-app>
</template>

<style scoped>
</style>
