<script setup>
import {useMembers} from "@/store.js";
import logo from "@/assets/blackbirdLogo.jpg"

const members = useMembers().val
</script>

<template>
  <v-container>
    <v-row>
      <v-col md="2">
        <v-img
            :src="logo"
            :width="500"
            aspect-ratio="1/1"
        ></v-img>
      </v-col>
      <v-col>
        <v-card align="center">
          Die Blackbirds sind eine Münchner Ice Freestyle-Gruppe mit acht Mitgliedern.
          <br>
          Wir sind im Olympia Eisstadion München, sowie im Weststadion anzutreffen.
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <v-card align="center">
    <v-card-title>Mitglieder</v-card-title>
    <v-list dense>
      <v-row>
        <v-col
            v-for="name in members"
            cols="2"
        >
        <v-list-item :to="name">
          <v-list-item-title>- {{ name }}</v-list-item-title>
        </v-list-item>
        </v-col>
      </v-row>
    </v-list>
  </v-card>
</template>

<style scoped>
.v-card {
  margin: 2em;
  padding: 2em;
  elevation: higher;
}
/* Hide scrollbar for all elements */
::-webkit-scrollbar {
  display: none;
}

/* Optional: Disable scrollbar arrows */
::-webkit-scrollbar-button {
  display: none;
}
.v-card {
  margin-left: 10vw;
  margin-right: 10vw;
}
</style>