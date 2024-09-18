<script setup>
import {VueFlow} from '@vue-flow/core'
import {useVideoStore} from "@/store.js";

const videoStore = useVideoStore();

import ClickableNode from '../components/mindMap/ClickableNode.vue'
import CategoryNode from '../components/mindMap/CategoryNode.vue'
import RootNode from '../components/mindMap/RootNode.vue'

function getOrientation(){
  return window.innerWidth > window.innerHeight ? "Landscape" : "Portrait";
}
const graph = videoStore.getTrickTreeGraph(videoStore, getOrientation())
</script>

<template>
  <v-card class="ma-3 text-center bg-grey-lighten-3" width="90%" height="90vh">
    <v-card-title class="font-weight-bold">
      {{ $t("navBar.trickTree") }}
    </v-card-title>
    <v-card-text class="text-center bg-grey-lighten-3 pa-2">
      {{ $t('trickTree.description') }}
    </v-card-text>

    <VueFlow
        :nodes="graph[0]"
        :edges="graph[1]"
        :nodes-draggable="true"
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
          [(getOrientation() === 'Landscape') ? -4000 : -2000, -4000],
          [(getOrientation() === 'Landscape') ? 15000 : 12000, 5000],
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

<style scoped>
html::-webkit-scrollbar{
  width: 50px;
  background:red;
}
</style>