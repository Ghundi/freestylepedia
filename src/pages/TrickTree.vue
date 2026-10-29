<script setup lang="ts">
import { computed } from 'vue';
import { VueFlow } from '@vue-flow/core';
import { useTrickStore } from '@/scripts/trickStore';
import { getOrientation } from '@/scripts/helpers';
import { useWideScreen } from '@/scripts/useWideScreen';
import TreePage from '@/components/paths/TreePage.vue';

import ClickableNode from '../components/mindMap/ClickableNode.vue';
import CategoryNode from '../components/mindMap/CategoryNode.vue';
import DifficultyNode from '../components/mindMap/DifficultyNode.vue';

const trickStore = useTrickStore();
const wide = useWideScreen();
// the graph is only built where it is shown; phones get the list instead
const graph = computed(() => {
  if (!wide.value) return [[], []] as ReturnType<typeof trickStore.getTrickTreeGraph>;
  return trickStore.getTrickTreeGraph(getOrientation());
});
const landscape = getOrientation() === 'Landscape';

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
        :translate-extent="[
          [0, -200],
          [landscape ? 9000 : 7000, 5000]
        ]"
        :min-zoom="0.05"
        :max-zoom="1"
        :nodes-focusable="false"
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
