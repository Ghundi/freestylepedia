<script setup>

import 'vuetify/styles';
import NavBar from "@/components/Frame/navBar.vue";
import { useTrickStore } from "@/scripts/videoStore.js";
import Footer from "@/components/Frame/footer.vue"
import { useTheme } from 'vuetify'
import { getBgColor } from "@/scripts/helpers.js";
import LocaleLayout from './components/localeLayout.vue';

const theme = useTheme();

const videoStore = useTrickStore();
videoStore.loadYAML();

</script>


<template>
  <head>
    <title>Freestylepedia</title>
    <meta name="description" content=
        "This is a website where you can learn ice freestyle tricks and moves.
        You can learn about all of them here and see the connections between them.
        It is the page for the freestylepedia youtube series from Blackbirds Ice Freestyle.">
  </head>
  <v-app>
    <nav-bar/>
    <br>
    <v-main class="pb-5" :style="{backgroundColor: getBgColor(theme.global.current.value.dark)}">
      <!-- <router-view :key="$route.fullPath"/> -->
       <LocaleLayout/>
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
