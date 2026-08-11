<script setup lang="ts">
import { ref, watch } from 'vue';
import { VueFlow, Edge, Node } from '@vue-flow/core';
import { useTrickStore } from "@/scripts/trickStore";
import { useTheme } from "vuetify";
import { getBgColor, getOrientation } from "@/scripts/helpers";

import ClickableNode from '../components/mindMap/ClickableNode.vue';
import CategoryNode from '../components/mindMap/CategoryNode.vue';

const trickStore = useTrickStore();
trickStore.categoryTree = trickStore.getConnectionsGraph(getOrientation());

const graph = ref(trickStore.categoryTree);
const theme = useTheme();

// Function to set edge color dynamically based on theme
function updateEdgeColorsBasedOnTheme() {
  const edgeColor = theme.global.current.value.dark ? 'white' : 'black';

  const newEdges = graph.value[1].map((edge: Edge) => ({
    ...edge,
    style: {
      ...edge.style,
      stroke: edgeColor,
    },
  }));

  graph.value = [graph.value[0], newEdges]; 
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
          [-3000, -2000],  // canvas x min, y min
          [3000, 13000]      // Canvas x max, y max
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
