<script setup>
import { ref, watch } from 'vue';
import { VueFlow } from '@vue-flow/core';
import { useTrickStore } from "@/scripts/trickStore.js";
import { useTheme } from "vuetify";
import { getBgColor } from "@/scripts/helpers.js";

import ClickableNode from '../components/mindMap/ClickableNode.vue';
import CategoryNode from '../components/mindMap/CategoryNode.vue';

const trickStore = useTrickStore();
trickStore.categoryTree = trickStore.getConnectionsGraph(trickStore, getOrientation());

function getOrientation() {
  return window.innerWidth > window.innerHeight ? "Landscape" : "Portrait";
}

const graph = ref(trickStore.categoryTree);
const theme = useTheme();

// Function to set edge color dynamically based on theme
function updateEdgeColorsBasedOnTheme() {
  const edgeColor = theme.global.current.value.dark ? 'white' : 'black';
  graph.value[1] = graph.value[1].map(edge => ({
    ...edge,
    style: {
      ...edge.style,
      stroke: edgeColor,  // Update stroke color based on theme
    }
  }));

}

watch(() => theme.global.current.value.dark, () => {
  updateEdgeColorsBasedOnTheme();
}, {immediate: true});
</script>

<template>
  <v-card
      class="ma-auto mt-5 text-center"
      width="90%"
      height="90vh"
      :style="{ backgroundColor: getBgColor(theme.global.current.value.dark) }"
      v-once
  >
    <v-card-title
        class="font-weight-bold"
        :style="{ backgroundColor: getBgColor(theme.global.current.value.dark) }">
      {{ $t("navBar.categoryTree") }}
    </v-card-title>
    <v-card-text
        class="text-center pa-2"
        :style="{ backgroundColor: getBgColor(theme.global.current.value.dark) }">
      {{ $t('categoryTree.description') }}
    </v-card-text>
    <div style="width: 100%; height: 200%">
      <VueFlow
          :nodes="graph[0]"
          :edges="graph[1]"
          :nodes-draggable="false"
          :nodes-connectable="false"
          :pan-on-drag="true"
          :zoom-on-pinch="true"
          :zoom-on-scroll="true"
          :zoom-on-double-click="false"
          :edges-focusable="false"
          :prevent-scrolling="true"
          class="basic-flow"
          :default-viewport="{ zoom: (getOrientation() === 'Landscape') ? 0.05 : 0.14 }"
          :translate-extent="[
          [-4000, -2000],  // canvas x min, y min
          [4000, 10000]      // Canvas x max, y max
        ]"
          :min-zoom="(getOrientation() === 'Landscape') ? 0.2 : 0.12"
          :max-zoom="(getOrientation() === 'Landscape') ? 0.5 : 1"
          :style="{ backgroundColor: getBgColor(theme.global.current.value.dark) }"
      >
        <template #node-clickable="props">
          <ClickableNode v-bind="props.data"/>
        </template>
        <template #node-category="props">
          <CategoryNode v-bind="props.data"/>
        </template>
      </VueFlow>
    </div>
  </v-card>
</template>

<style scoped>
.bg-color {
  background-color: v-bind(getBgColor(theme.global.current.value.dark));
}
</style>
