<template>
  <v-card outlined elevation="5" width="15em"  align="center" class="border" @click="props">
    <v-img
        :src="thumbnailUrl"
        id="thumbnail">
    </v-img>
    <v-card-subtitle class="smaller-font">
      {{releaseDate.toLocaleDateString("de-DE")}} <!-- TODO change to getLang() -->
    </v-card-subtitle>
    <v-divider></v-divider>
    <v-card-actions>
      <v-dialog fullscreen>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" width="100%">
            Open
          </v-btn>
        </template>

        <template v-slot:default="{ isActive }">
          <VideoPlayer
              :id="id"
          />
        </template>
      </v-dialog>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import VideoPlayer from "@/components/VideoPlayer.vue";

const props = defineProps({
  id: Array[String],
  title: String,
  difficulty: Number,
  category: String,
  releaseDate: Date,
  thumbnailUrl: String,
});

function getLang() {
  if (navigator.languages !== undefined)
    return navigator.languages[0];
  return navigator.language;
}

</script>

<style scoped>
.smaller-font {
  font-size: 0.6em;
  text-transform: none;
}
</style>