<script setup lang="ts">
import { VueFlow } from '@vue-flow/core';
import { useTrickStore } from '@/scripts/trickStore';
import { getOrientation } from '@/scripts/helpers';
import TreePage from '@/components/paths/TreePage.vue';

import ClickableNode from '../components/mindMap/ClickableNode.vue';
import CategoryNode from '../components/mindMap/CategoryNode.vue';

const trickStore = useTrickStore();
trickStore.categoryTree = trickStore.getConnectionsGraph(getOrientation());

const graph = trickStore.categoryTree;
</script>

<template>
  <TreePage active="CategoryTree" :edges="graph[1]" :description="$t('categoryTree.description')">
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
        :nodes-focusable="false"
        :prevent-scrolling="true"
        id="CategoryTree"
        class="basic-flow"
        :translate-extent="[
          [-3000, -2000],
          [3000, 13000]
        ]"
        :min-zoom="0.05"
        :max-zoom="1"
      >
        <template #node-clickable="props">
          <ClickableNode v-bind="props.data"/>
        </template>
        <template #node-category="props">
          <CategoryNode v-bind="props.data"/>
        </template>
      </VueFlow>
    </template>
  </TreePage>
</template>
