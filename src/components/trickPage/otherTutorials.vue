<script setup lang="ts">
  const props = defineProps({
    id: Array<string>
  });

  function getThumbnailUrl(videoId: string) {
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  }
  function openVideo(id: string) {
    window.open("https://www.youtube.com/watch?v=" + id + "?mute=1");
  }
</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <p class="font-weight-bold">{{ $t('otherTutorials') }}:</p>
      </v-col>
    </v-row>
    <v-row justify="center" align="center">
      <v-col
          v-for="video in id!.slice(1)"
          :key="video"
          cols="auto"
      >
        <v-card elevation="3" width="150px">
          <v-img
              :src="getThumbnailUrl(video)"
              v-on:click="openVideo(video)"
              alt="Tutorial from different creator"
          />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>

</style>