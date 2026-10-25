<script setup lang="ts">
import { VueFlow, type VueFlowStore } from '@vue-flow/core';
import { useTrickStore } from '@/scripts/trickStore';
import { getOrientation } from '@/scripts/helpers';
import TreePage from '@/components/paths/TreePage.vue';

import ClickableNode from '../components/mindMap/ClickableNode.vue';
import CategoryNode from '../components/mindMap/CategoryNode.vue';
import DifficultyNode from '../components/mindMap/DifficultyNode.vue';

const trickStore = useTrickStore();
trickStore.trickTree = trickStore.getTrickTreeGraph(getOrientation());

const graph = trickStore.trickTree;
const landscape = getOrientation() === 'Landscape';

// Portrait: fitting the whole graph shrinks the labels to a few pixels. Start at a zoom where a 20px node
// label is 12px on screen, anchored on the first level column (x = 1 * 1500 * 0.7), with its heading at the top.
const START_ZOOM = 0.6;
const FIRST_COLUMN_X = 1500 * 0.7;
function onInit(flow: VueFlowStore) {
  if (landscape) return;
  flow.setViewport({ x: 16 - FIRST_COLUMN_X * START_ZOOM, y: 200 * START_ZOOM + 8, zoom: START_ZOOM });
}
</script>

<template>
  <TreePage active="TrickTree" :edges="graph[1]" :description="$t('trickTree.description')">
    <template #default="slotProps">
      <VueFlow
        :nodes="graph[0]"
        :edges="slotProps.edges"
        :nodes-draggable="false"
        :nodes-connectable="false"
        :pan-on-drag="true"
        :zoom-on-pinch="true"
        :zoom-on-scroll="true"
        :zoom-on-double-click="false"
        :edges-focusable="false"
        :prevent-scrolling="true"
        id="TrickTree"
        class="basic-flow"
        :default-viewport="{ zoom: 1 }"
        :translate-extent="[
          [0, -200],
          [landscape ? 9000 : 7000, 5000]
        ]"
        :min-zoom="landscape ? 0.2 : 0.05"
        :max-zoom="1"
        :fit-view-on-init="landscape"
        :nodes-focusable="false"
        @init="onInit"
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
    </template>
  </TreePage>
</template>
