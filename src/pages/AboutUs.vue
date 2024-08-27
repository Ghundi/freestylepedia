<script setup>
import {useMembers} from "@/store.js";
import logo from "@/assets/blackbirdIconInverted.png"

const members = useMembers().val
</script>

<template>
  <v-container>
      <v-row>
        <v-col>
          <v-card class="text-center justify-center pa-5" elevation="5">
            <v-card-title>MISG</v-card-title>
            <v-container>
              <v-row>
                <v-col>
                  <v-img
                      :src="logo"
                      aspect-ratio="1/1"
                      width="100px"
                  ></v-img>
                </v-col>
                <v-col>
                  {{ $t('aboutUs.MisgDescription') }}
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>
        <v-col>
          <v-card class="text-center justify-center pa-5" elevation="5">
            <v-card-title>Blackbird Ice Freestyle</v-card-title>
            <v-img
                :src="logo"
                aspect-ratio="1/1"
            ></v-img>
            {{ $t('aboutUs.BlackbirdDescription') }}
            <v-card-title>{{ $t('aboutUs.members') }}</v-card-title>
            <v-list-item v-for="name in members">
              <v-list-item-title>- {{ name }}</v-list-item-title>
            </v-list-item>
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