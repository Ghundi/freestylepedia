<script setup>
import {useVideoStore} from "@/store.js";

const videoStore = useVideoStore()

function getEmbedURL(id) {
  return 'https://www.youtube.com/embed/' + id + '?si=9jysKI0zbGHvpMCD'
}
const props = defineProps({
  isActive: Object,
  id: Array[String],
  title: Array[String],
  difficulty: Number,
  category: String,
  releaseDate: Date,
  requirements: Array[String],
  connections: Array[String],
});

function getDescription() {
  let descr = `The ${props.title[0]} from the category ${ props.category } has a difficulty of ${ props.difficulty }. `
  if(props.connections && props.connections.length > 0) {
    let connections = [];
    for (let i = 0; i < props.connections.length; i++) {
      connections += videoStore.getTrickByID(props.connections[i], videoStore).title[0] + ", ";
    }
    connections = connections.slice(0, -2);
    descr += `The Trick is similar to ${ connections }. `
  }
  if(props.requirements && props.requirements.length > 0) {
    let requirements = [];
    for (let i = 0; i < props.requirements.length; i++) {
      requirements += videoStore.getTrickByID(props.requirements[i], videoStore).title[0] + ", ";
    }
    requirements = requirements.slice(0, -2);
    descr += `The Trick builds upon ${ requirements }.`
  }
  return descr
}
</script>

<template>
  <v-card>
    <iframe width="100%" height="90%" :src="getEmbedURL(id[0])" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
    <v-card align="center">
        <v-container>
          <v-row >
            <v-col v-for="title in title">
              <v-card-subtitle>
                {{title}}
              </v-card-subtitle>
            </v-col>
          </v-row>
          <v-row>
            <v-card-text>
              {{ getDescription() }}
            </v-card-text>
          </v-row>
        </v-container>
    </v-card>
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