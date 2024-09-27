<script setup>
import {VueFlow} from '@vue-flow/core'

import trickTreeYaml from '../DB/trickTree.yaml';

import { useTheme } from 'vuetify'
import { getBgColor } from "@/scripts/helpers.js";

import ClickableNode from '../components/mindMap/ClickableNode.vue'
import CategoryNode from '../components/mindMap/CategoryNode.vue'
import DifficultyNode from '../components/mindMap/DifficultyNode.vue'

function getOrientation(){
  return window.innerWidth > window.innerHeight ? "Landscape" : "Portrait";
}

const theme = useTheme()
</script>

<template>
  <v-card
      class="ma-3 text-center"
      width="90%"
      height="90vh"
      :style="{backgroundColor: getBgColor(theme.global.current.value.dark)}">
    <v-card-title
        class="font-weight-bold">
      {{ $t("navBar.trickTree") }}
    </v-card-title>
    <v-card-text
        class="text-center pa-2">
      {{ $t('trickTree.description') }}
    </v-card-text>

    <VueFlow
        :nodes="trickTreeYaml[0]"
        :edges="trickTreeYaml[1]"
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
          [9000, 5000],
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
        <CategoryNode v-bind="props.data" />
      </template>
      <template #node-difficulty="props">
        <DifficultyNode v-bind="props.data" />
      </template>
    </VueFlow>

  </v-card>
</template>

<style>
html::-webkit-scrollbar{
  width: 50px;
  background:red;
}
</style>