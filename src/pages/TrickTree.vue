<script setup>
import {useVideoStore} from "@/store.js";

const videoStore = useVideoStore();
</script>

<template>
<v-container>
  <v-row>
    <template v-for="(trick, tmp) in videoStore.getTrickTreeGraph(videoStore)">
      <v-col>
        <v-card class="ma-5" align="center">
          <v-card-title>
            {{ trick.name }}
          </v-card-title>
        <template v-if="trick.children.length > 0">
            Requirements:
          <v-list >
            <v-list-item v-for="(trick, idx) in trick.children">
              {{idx + 1}}. {{ trick.name }}
            </v-list-item>
          </v-list>
        </template>
        </v-card>
      </v-col>
    </template>
  </v-row>
</v-container>
</template>

<style scoped>

</style>