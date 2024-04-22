<script>
import {useVideoStore} from "@/store.js";
export default {
  data() {
    const videoStore = useVideoStore();
    const graph = videoStore.getTrickTreeGraph(videoStore);
    return {
      data: graph
    };
  },
};
</script>

<template>
<v-container>
  <v-row>
    <template v-for="(trick, tmp) in data">
      <v-col>
        <v-card class="ma-5" align="center">
          <v-card-title>
            {{ trick.name }}
          </v-card-title>
        <template v-if="trick.children.length > 0">
            |
          <v-list >
            <v-list-item v-for="(trick, idx) in trick.children">
              {{ trick.name }}
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
html::-webkit-scrollbar{
  width: 50px;
  background:red;
}
</style>