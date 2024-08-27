<script setup>
import LanguageSelector from "@/components/languageSelector.vue";
import WebpageIcon from "@/components/WebpageIcon.vue";
</script>

<script>

</script>

<template>
  <v-footer class="d-flex align-center flex-column bg-black pb-16">
    <div class="d-flex align-center px-4">
      <WebpageIcon
          page="https://www.youtube.com/@BlackbirdIceFreestyle"
          icon="mdi-youtube"
      ></WebpageIcon>
      <WebpageIcon
          page="https://www.instagram.com/blackbird_ice_freestyle"
          icon="mdi-instagram"
      ></WebpageIcon>
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