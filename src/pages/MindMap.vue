<script setup>

</script>

<script>
import mindmap from "vue3-mindmap";
import "vue3-mindmap/dist/style.css";
import {useVideoStore} from "@/store.js";
export default {
  name: "App",
  components: { mindmap },
  data() {
    const videoStore = useVideoStore();
    const graph = videoStore.getConnectionsGraph(videoStore);
    return {
      data: graph,
      locale: "en",
    };
  },
};
</script>

<template>
  <v-card class="ma-3
  text-center">
    <mindmap
        style="height: 100vh"
        v-model="data"
        :locale="locale"
        :branch="2"
        :x-gap="80"
        :y-gap="10"
        :zoom="false"
        :fit-btn="true"
        :center-btn="true"
        :download-btn="true"
        :drag="true"
        :edit="false"
        :add-node-btn="false"
        :sharp-corner="false"
        :ctm="true"
        :timetravel="false"
        :vertical="true"
    />
  </v-card>
</template>

<style scoped>

</style>