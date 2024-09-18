<script setup>
import {VueFlow} from '@vue-flow/core'
import {useVideoStore} from "@/store.js";

import ClickableNode from '../components/mindMap/ClickableNode.vue'
import CategoryNode from '../components/mindMap/CategoryNode.vue'
import RootNode from '../components/mindMap/RootNode.vue'

const videoStore = useVideoStore();

function getOrientation(){
  return window.innerWidth > window.innerHeight ? "Landscape" : "Portrait";
}


const graph = videoStore.getConnectionsGraph(videoStore, getOrientation())
</script>

<template>
  <v-card class="ma-auto mt-5 text-center bg-grey-lighten-3" width="90%" height="90vh">
    <v-card-title class="font-weight-bold">
      {{ $t("navBar.categoryTree") }}
    </v-card-title>
    <v-card-text class="text-center bg-grey-lighten-3 pa-2">
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
          [(getOrientation() === 'Landscape') ? 5000 : 2000, 3000],
        ]"
        :min-zoom="0.2"
        :max-zoom="2"
        fit-view-on-init
    >
      <template #node-clickable="props">
        <ClickableNode v-bind="props.data"/>
      </template>
      <template #node-category="props">
        <CategoryNode v-bind="props.data" />
      </template>
      <template #node-root="props">
        <RootNode v-bind="props.data" />
      </template>
    </VueFlow>

  </v-card>
</template>

<style>
/* import the necessary styles for Vue Flow to work */
@import '@vue-flow/core/dist/style.css';

/* import the default theme, this is optional but generally recommended */
@import '@vue-flow/core/dist/theme-default.css';
</style>