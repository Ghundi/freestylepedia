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
      treeConfig: { nodeWidth: 120, nodeHeight: 80, levelHeight: 200 }
    };
  },
};
</script>

<template>
  <v-card class="ma-3">
    <mindmap
        style="height: 100vh"
        v-model="data"
        :branch="4"
        :x-gap="84"
        :y-gap="18"
        :zoom="false"
        :fit-btn="true"
        :center-btn="true"
        :download-btn="true"
        :drag="false"
        :add-node-btn="true"
        :sharp-corner="false"
        :ctm="true"
        :timetravel="false"
        :vertical="true"/>
  </v-card>
</template>

<style scoped>

</style>