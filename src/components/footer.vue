<script setup>
import LanguageSelector from "@/components/languageSelector.vue";
</script>

<script>

export default {
  data: () => ({
    icons: [
      'mdi-youtube',
      'mdi-instagram',
    ],
  }),
  methods: {
    openWebpage(page) {
      if(page === 0) {
        window.open("https://www.youtube.com/@BlackbirdIceFreestyle");
      }
      else if(page === 1) {
        window.open("https://www.instagram.com/blackbird_ice_freestyle/");
      }
    }
  }
}
</script>

<template>
  <v-footer class="d-flex align-center flex-column bg-black pb-16">
    <div class="d-flex align-center px-4">
      <v-btn
          icon='mdi-youtube'
          class="mx-4"
          size="medium"
          variant="plain"
          @click="openWebpage(0)"
      ></v-btn>
      <v-btn
          icon='mdi-instagram'
          class="mx-4"
          size="medium"
          variant="plain"
          @click="openWebpage(1)"
      ></v-btn>
    </div>
    <div>
      <v-btn
          variant="plain"
          to="/AboutUs"
      >
        {{ $t("aboutUs.aboutUs") }}
      </v-btn>
      <v-btn
          variant="plain"
          to="/Help"
      >
        {{ $t("footer.help") }}
      </v-btn>
      <language-selector/>
    </div>
    <div class="px-4 py-2 bg-black text-center w-100">
      {{ new Date().getFullYear() }} — <strong>Freestylepedia</strong>
      <br>
      <small>{{ $t("footer.byBlackbirdAndMISG") }}</small>
    </div>
  </v-footer>
</template>

<style scoped>
.v-footer {
  width: 100%;
}
</style>