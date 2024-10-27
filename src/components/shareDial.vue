<script>

export default {
  data() {
    return {
      dialShare: false,
      pageUrl: 'https://freestylepedia.org/trick/' + this.$route.fullPath.replace(' ', '%20'),
    };
  },
  methods: {
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
    <template v-slot:activator="{ props: activatorProps }">
      <v-fab
          v-bind="activatorProps"
          icon="mdi-share-variant"
      ></v-fab>
    </template>

    <v-btn
        key="1"
        icon="mdi-close"></v-btn>
    <v-btn
        key="2"
        icon="mdi-content-copy"
        @click="copyURL(pageUrl + '/')"></v-btn>
    <v-btn
        key="3"
        icon="mdi-whatsapp"
        color="#25d366"
        :href="`https://wa.me/?text=Checkout%20this%20page.%20${pageUrl}/`"></v-btn>
    <v-btn
        key="5"
        icon="mdi-facebook"
        color="#0866ff"
        :href="`https://www.facebook.com/sharer/sharer.php?u=${pageUrl}%2F&amp;src=sdkpreparse`"></v-btn>
    <v-btn
        key="6"
        icon="mdi-twitter"
        color="#1DA1F2"
        :href="`https://www.twitter.com/share?url=http://${pageUrl}/`"></v-btn>
  </v-speed-dial>
</template>

<style scoped>
</style>