<script setup>
import {useMembers} from "@/store.js";
import BlackbirdLogo from "@/assets/blackbirdIconInverted.png"
import MISGLogo from "@/assets/MISG-Icon.png"
import WebpageIcon from "@/components/WebpageIcon.vue";

const members = useMembers().val
</script>

<template>
  <v-container>
    <v-row class="d-flex justify-center align-center">
      <v-col cols="9">
        <v-card class="text-center justify-center pa-10" width="60vw" elevation="5">
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
                ></v-img>
              </v-col>
              <v-col>
                {{ $t('aboutUs.BlackbirdDescription') }}
              </v-col>
            </v-row>
          </v-container>
          <v-card-title>{{ $t('aboutUs.members') }}</v-card-title>
          <v-container>
            <v-row>
              <v-col>
                <v-list-item v-for="name in members.slice(0, members.length / 2)">
                  <v-list-item-title>- {{ name }}</v-list-item-title>
                </v-list-item>
              </v-col>
              <v-col>
                <v-list-item v-for="name in members.slice(members.length / 2)">
                  <v-list-item-title>- {{ name }}</v-list-item-title>
                </v-list-item>
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