<script setup>
import WebpageIcon from "@/components/WebpageIcon.vue";
import Blackbird from "../assets/blackbirdIcon.png"
import MISG from "../assets/MISG-white-Icon.png"
import { useSupporters} from "@/scripts/store.js";
const supporters = useSupporters().images
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
        <v-container>
          <v-row justify="center">
            <v-col cols="auto">
              <a href="https://www.instagram.com/mainziceskategroup/" target="_blank">
                <v-avatar size="50">
                  <v-img
                      contain
                      :src="MISG"
                      aspect-ratio="1"
                      alt="MISG Logo"
                  ></v-img>
                </v-avatar>
              </a>
            </v-col>
            <v-col cols="auto">
              <a href="https://www.youtube.com/@BlackbirdIceFreestyle" target="_blank">
                <v-avatar size="50">
                  <v-img
                      contain
                      :src="Blackbird"
                      aspect-ratio="1"
                      alt="Blackbird Logo"
                  ></v-img>
                </v-avatar>
              </a>
            </v-col>
          </v-row>
        </v-container>
        <p class="supporters">
          {{ $t('footer.supportedBy') }}
          <v-container>
            <v-row justify="center">
              <v-col cols="auto" v-for="(team, index) in supporters" :key="index">
                <a :href="team.link" target="_blank">
                  <v-avatar size="50">
                    <v-img
                        contain
                        :src="team.imgSrc"
                        aspect-ratio="1"
                        alt="Supporter Logo"
                    ></v-img>
                  </v-avatar>
                </a>
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