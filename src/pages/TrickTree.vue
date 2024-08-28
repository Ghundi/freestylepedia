<script>
import mindmap from "vue3-mindmap";
import "vue3-mindmap/dist/style.css";
import {useVideoStore} from "@/store.js";
export default {
  components: { mindmap },
  data() {
    const videoStore = useVideoStore();
    const graph = videoStore.getTrickTreeGraph(videoStore);
    return {
      data: graph,
      treeConfig: { nodeWidth: 120, nodeHeight: 80, levelHeight: 200 }
    };
  },
};
</script>

<template>
  <v-card class="ma-3">
    <v-card-text class="text-center bg-grey-lighten-3 pa-2">
      {{ $t('trickTree.description') }}
    </v-card-text>
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
  <!--
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
-->
</template>

<style scoped>
html::-webkit-scrollbar{
  width: 50px;
  background:red;
}
</style>