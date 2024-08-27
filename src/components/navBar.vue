<script setup>
import { ref } from 'vue'

const drawer = ref(null)

</script>

<template>
  <v-app-bar :elevation="8" class="bg-black pa-3" prominent>
    <v-app-bar-nav-icon align="start" variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    <v-hover v-slot="{ hover }" disabled>
      <v-card
          to="/"
          class="font-weight-black title bg-black"
          :ripple="false"
          >
        Freestylepedia
      </v-card>
    </v-hover>
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