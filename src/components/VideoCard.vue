<template>
  <!-- TODO make card clickable -->
  <v-card outlined elevation="5" width="15em"  align="center" class="border" @click="props">
    <v-img
        :src="thumbnailUrl"
        id="thumbnail">
    </v-img>
    <v-card-subtitle class="smaller-font">
      {{releaseDate.toLocaleDateString(getLang())}} <!-- TODO change to getLang() -->
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
              :isActive="isActive"
              :id="id"
              :title="title"
              :difficulty="difficulty"
              :category="category"
              :releaseDate="releaseDate"
              :connections="connections"
              :requirements="requirements"
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
  title: Array[String],
  difficulty: Number,
  category: String,
  releaseDate: Date,
  thumbnailUrl: String,
  requirements: Array[String],
  connections: Array[String],
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