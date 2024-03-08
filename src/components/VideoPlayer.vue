<script setup>
function getEmbedURL(id) {
  return 'https://www.youtube.com/embed/' + id + '?si=9jysKI0zbGHvpMCD'
}
const props = defineProps({
  id: String
});
</script>

<template>
  <v-card>
    <iframe width="100%" height="90%" :src="getEmbedURL(id)" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

    <v-card-actions>
      <v-btn
          width="100%"
          text="Close Dialog"
          @click="isActive.value = false"
      ></v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>

</style>