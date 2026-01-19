<script setup>
import {ref, watch} from 'vue';
import {VueFlow} from '@vue-flow/core';
import {useTrickStore} from '@/scripts/trickStore.js';
import {useTheme} from 'vuetify';
import {getBgColor} from "@/scripts/helpers.js";

import ClickableNode from '../components/mindMap/ClickableNode.vue';
import CategoryNode from '../components/mindMap/CategoryNode.vue';
import DifficultyNode from '../components/mindMap/DifficultyNode.vue';

const trickStore = useTrickStore();
trickStore.trickTree = trickStore.getTrickTreeGraph(trickStore, getOrientation());

function getOrientation() {
  return window.innerWidth > window.innerHeight ? "Landscape" : "Portrait";
}

const graph = ref(trickStore.trickTree);
const theme = useTheme();

// Function to update edge colors dynamically based on theme
function updateEdgeColorsBasedOnTheme() {
  const edgeColor = theme.global.current.value.dark ? 'white' : 'black';
  graph.value[1] = graph.value[1].map(edge => ({
    ...edge,
    style: {
      ...edge.style,
      stroke: edgeColor,
    }
  }));
}

watch(() => theme.global.current.value.dark, () => {
  updateEdgeColorsBasedOnTheme();
}, {immediate: true});
</script>

<template>
  <v-card
      class="ma-3 text-center"
      width="90%"
      height="90vh"
      :style="{backgroundColor: getBgColor(theme.global.current.value.dark)}"
      v-once
  >
    <v-card-title
        class="font-weight-bold"
        :style="{ backgroundColor: getBgColor(theme.global.current.value.dark) }">
      {{ $t("navBar.trickTree") }}
    </v-card-title>
    <v-card-text
        class="text-center pa-2"
        :style="{ backgroundColor: getBgColor(theme.global.current.value.dark) }">
      {{ $t('trickTree.description') }}
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
        [0, -200],
        [(getOrientation() === 'Landscape') ? 9000 : 7000, 5000]
      ]"
        :min-zoom="(getOrientation() === 'Landscape') ? 0.2 : 0.05"
        :max-zoom="1"
        fit-view-on-init
        :style="{backgroundColor: getBgColor(theme.global.current.value.dark)}"
    >
      <template #node-clickable="props">
        <ClickableNode v-bind="props.data"/>
      </template>
      <template #node-category="props">
        <CategoryNode v-bind="props.data"/>
      </template>
      <template #node-difficulty="props">
        <DifficultyNode v-bind="props.data"/>
      </template>
    </VueFlow>
  </v-card>
</template>

<style>
html::-webkit-scrollbar {
  width: 50px;
  background: red;
}
</style>
