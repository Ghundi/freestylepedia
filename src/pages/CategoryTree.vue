<script setup>
import { ref, watch } from 'vue';
import { VueFlow } from '@vue-flow/core';
import { useVideoStore } from "@/scripts/videoStore.js";
import { useTheme } from "vuetify";
import { getBgColor } from "@/scripts/helpers.js";

import ClickableNode from '../components/mindMap/ClickableNode.vue';
import CategoryNode from '../components/mindMap/CategoryNode.vue';

const videoStore = useVideoStore();

function getOrientation() {
  return window.innerWidth > window.innerHeight ? "Landscape" : "Portrait";
}

const graph = ref(videoStore.categoryTree);
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
    <v-card-title class="font-weight-bold">
      {{ $t("navBar.categoryTree") }}
    </v-card-title>
    <v-card-text class="text-center pa-2">
      {{ $t('categoryTree.description') }}
    </v-card-text>

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
        :default-viewport="{ zoom: 1 }"
        :translate-extent="[
        [(getOrientation() === 'Landscape') ? -4000 : -2000, -2000],
        [(getOrientation() === 'Landscape') ? 5000 : 2000, 3000]
      ]"
        :min-zoom="(getOrientation() === 'Landscape') ? 0.2 : 0.2"
        :max-zoom="(getOrientation() === 'Landscape') ? 1.5 : 2"
        fit-view-on-init
        :style="{ backgroundColor: getBgColor(theme.global.current.value.dark) }"
    >
      <template #node-clickable="props">
        <ClickableNode v-bind="props.data"/>
      </template>
      <template #node-category="props">
        <CategoryNode v-bind="props.data"/>
      </template>
    </VueFlow>
  </v-card>
</template>

<style>
</style>
