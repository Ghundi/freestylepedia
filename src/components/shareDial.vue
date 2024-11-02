<script>

import {useRoute} from "vue-router";
import {toPath} from "@/scripts/helpers.js";
import {getActivePinia} from "pinia";

export default {
  data() {
    return {
      dialShare: false,
      pageUrl: 'https://freestylepedia.org/' + toPath(useRoute().params.trickname.toString()),
      active: false,
    };
  },
  methods: {
    getActivePinia,
    async copyURL(url) {
      try {
        await navigator.clipboard.writeText(url);
      } catch($e) {
        console.log('failed copying to clipboard. Make sure you have a secure connection');
      }
    }
  }
};
</script>

<template>
  <v-speed-dial
      location="top center"
      transition="slide-y-transition"
  >
    <template v-slot:activator="{ active }">
      <v-fab
          v-bind="active"
          icon="mdi-share-variant"
      ></v-fab>
    </template>
    <v-btn
        key="1"
        icon="mdi-close"></v-btn>
    <v-btn
        key="2"
        icon="mdi-content-copy"
        @click="copyURL(pageUrl)"></v-btn>
    <v-btn
        key="3"
        icon="mdi-whatsapp"
        color="#25d366"
        :href="`https://wa.me/?text=Check%20out%20this%20trick%20${pageUrl}/`"
        target="_blank"></v-btn>
    <v-btn
        key="5"
        icon="mdi-facebook"
        color="#0866ff"
        :href="`https://www.facebook.com/sharer/sharer.php?u=${pageUrl}%2F&amp;src=sdkpreparse`"
        target="_blank"></v-btn>
    <v-btn
        key="6"
        icon="mdi-twitter"
        color="#1DA1F2"
        :href="`https://www.twitter.com/share?url=http://${pageUrl}/`"
        target="_blank"></v-btn>
  </v-speed-dial>
</template>

<style scoped>
</style>