<script setup>
import VideoList from "@/pages/VideoList.vue";
import NavBar from "@/components/navBar.vue";
import 'vuetify/styles';
import { useCurPage } from "@/store.js";
import Impressum from "@/pages/Impressum.vue";
const curPage = useCurPage();
</script>

<template>
  <v-app>
    <nav-bar/>
    <br>
    <v-main>
      <VideoList v-if="curPage.val==='VideoList'"/>
      <Impressum v-if="curPage.val==='Impressum'"/>
    </v-main>
    </v-app>
</template>

<style scoped>
.v-mains {
  background-image: url('assets/blackbirdLogo.jpg');
  background-size: cover;
  background-repeat: no-repeat;
}
</style>
