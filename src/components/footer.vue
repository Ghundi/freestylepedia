<script setup>
import WebpageIcon from "@/components/WebpageIcon.vue";
import AIF from "../assets/supporters/aif w.png";
import GlobalIce from '../assets/supporters/GlobalIce.png';
import IFO from "../assets/supporters/Logo_IFO_schwarz.webp";
import MunichEast from "../assets/supporters/RZ_freestyler_Logo_1-2.jpg";
</script>

<script>

export default {
  data() {
    return {
      images: [
        {
          src: IFO,
          link: ''
        },
        {
          src: GlobalIce,
          link: ''
        },
        {
          src: AIF,
          link: ''
        },
        {
          src: MunichEast,
          link: ''
        },
      ]
    };
  }
};

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
      <WebpageIcon
          page="https://github.com/Ghundi/freestylepedia"
          icon="mdi-github"
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
    </div>
    <div class="px-4 py-2 text-center w-100">
      {{ new Date().getFullYear() }} — <strong>Freestylepedia</strong>
      <br>
        <small>
          {{ $t("footer.byBlackbirdAndMISG") }}
        </small>
      <br>
      <br>
        <p class="supporters">
          supported by
          <v-container>
            <v-row justify="center">
              <v-col cols="auto" v-for="(image, index) in images" :key="index">
                <v-avatar size="50">
                  <v-img
                      contain
                      :src="image.src"
                      aspect-ratio="1"
                      alt="Supporter Logo"
                  ></v-img>
                </v-avatar>
              </v-col>
            </v-row>
          </v-container>
        </p>
    </div>
  </v-footer>
</template>

<style scoped>
.supporters {
  font-size: 0.8em;
}
</style>