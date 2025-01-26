<script setup>
import { ref } from 'vue'
import LanguageSelector from "@/components/Frame/languageSelector.vue";
import ThemeSwitcher from "@/components/Frame/themeSwitcher.vue";

const drawer = ref(null)

function getOrientation(){
  return window.innerWidth > window.innerHeight ? "Landscape" : "Portrait";
}

</script>

<template>
  <v-app-bar :elevation="8" class="bg-black pa-3" prominent>
    <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    <v-card
        to="/"
        class="bg-black"
        :ripple="false"
        >
      <v-card-title
          class="font-weight-black"
          :style="{'font-size': getOrientation() === 'Landscape' ? '30px': '20px'}">
        Freestylepedia
      </v-card-title>
    </v-card>
    <v-spacer></v-spacer>
    <language-selector/>
    <theme-switcher/>
  </v-app-bar>

  <v-navigation-drawer
      v-model="drawer"
      temporary
      :elevation="5"
      class="bg-black mt-3"
  >
    <v-list>
      <v-list-item to="/">
        {{ $t("navBar.freestylepedia") }}
      </v-list-item>
      <v-list-item to="/calendar">
        {{ $t("navBar.calendar") }}
      </v-list-item>
      <v-list-item to="/CategoryTree">
        {{ $t("navBar.categoryTree") }}
      </v-list-item>
      <v-list-item to="/TrickTree">
        {{ $t("navBar.trickTree") }}
      </v-list-item>
      <v-list-item to="/Help">
        {{ $t("footer.help") }}
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped>
.title {
  line-height: 2em;
  font-size: 2em;
}
.v-list-item {
  font-weight: bolder;
  font-size: large;
}
</style>