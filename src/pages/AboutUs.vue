<script setup>
import BlackbirdLogo from "@/assets/blackbirdIconInverted.png"
import MISGLogo from "@/assets/MISG-Icon.png"
import WebpageIcon from "@/components/Frame/WebpageIcon.vue";

</script>

<template>
  <v-container>
    <v-row class="d-flex justify-center align-center">
      <v-col cols="9">
        <v-card class="text-center justify-center pa-5" elevation="5">
          <v-card-title>
            Our Story
          </v-card-title>
          <v-card-text>
            {{ $t('aboutUs.story') }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="text-center justify-center pa-5" elevation="5">
          <v-card-title>MISG</v-card-title>
          <v-container>
            <v-row>
              <v-col>
                <v-img
                    :src="MISGLogo"
                    aspect-ratio="1/1"
                    width="10vw"
                    alt="MISG Logo"
                ></v-img>
              </v-col>
              <v-col>
                {{ $t('aboutUs.MisgDescription') }}
              </v-col>
            </v-row>
          </v-container>
          {{ $t('aboutUs.findUs') }}
          <WebpageIcon
            page="https://www.instagram.com/mainziceskategroup/"
            icon="mdi-instagram"
          ></WebpageIcon>
        </v-card>
      </v-col>
      <v-col>
        <v-card class="text-center justify-center pa-5" elevation="5">
          <v-card-title>Blackbird Ice Freestyle</v-card-title>
          <v-container>
            <v-row>
              <v-col>
                <v-img
                    :src="BlackbirdLogo"
                    aspect-ratio="1/1"
                    width="10vw"
                    alt="Blackbird Logo"
                ></v-img>
              </v-col>
              <v-col>
                {{ $t('aboutUs.BlackbirdDescription') }}
              </v-col>
            </v-row>
          </v-container>
          {{ $t('aboutUs.findUs') }}
          <WebpageIcon
              page="https://www.instagram.com/blackbird_ice_freestyle"
              icon="mdi-instagram"
          ></WebpageIcon>
          <WebpageIcon
              page="https://www.youtube.com/@BlackbirdIceFreestyle"
              icon="mdi-youtube"
          ></WebpageIcon>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
/* Hide scrollbar for all elements */
::-webkit-scrollbar {
  display: none;
}

/* Optional: Disable scrollbar arrows */
::-webkit-scrollbar-button {
  display: none;
}
</style>