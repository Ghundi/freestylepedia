<script setup lang="ts">
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { VueFlow, Edge } from '@vue-flow/core';
import { useTrickStore } from '@/scripts/trickStore';
import { useThemeMode } from '@/scripts/theme';
import { getOrientation } from '@/scripts/helpers';
import SegmentedControl from '@/components/ui/SegmentedControl.vue';

import ClickableNode from '../components/mindMap/ClickableNode.vue';
import CategoryNode from '../components/mindMap/CategoryNode.vue';


const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const { resolved } = useThemeMode();
const trickStore = useTrickStore();
trickStore.categoryTree = trickStore.getConnectionsGraph(getOrientation());

const graph = trickStore.categoryTree;
const landscape = getOrientation() === 'Landscape';

// Edge colours follow the theme (computed, so they update when `resolved` changes)
const edges = computed(() => {
  const stroke = resolved.value === 'dark' ? '#5a5e66' : '#9a9ea6';
  return graph[1].map((edge: Edge) => ({ ...edge, style: { ...edge.style, stroke } }));
});

const views = computed(() => [
  { value: 'TrickTree', label: t('paths.byLevel') },
  { value: 'CategoryTree', label: t('paths.byCategory') },
]);
function switchView(name: string) {
  if (name !== 'CategoryTree') router.replace({ name, params: route.params });
}
</script>

<template>
  <section class="tree-page">
    <header class="tree-head">
      <SegmentedControl
        model-value="CategoryTree"
        :options="views"
        :label="t('tabs.paths')"
        @update:model-value="switchView"
      />
      <p class="desc">{{ $t('categoryTree.description') }}</p>
    </header>
    <div class="zone">
      <VueFlow
        :nodes="graph[0]"
        :edges="edges"
        :nodes-draggable="false"
        :nodes-connectable="false"
        :pan-on-drag="true"
        :zoom-on-pinch="true"
        :zoom-on-scroll="true"
        :zoom-on-double-click="false"
        :edges-focusable="false"
        :prevent-scrolling="true"
        class="basic-flow"
        :default-viewport="{ zoom: landscape ? 0.05 : 0.14 }"
        :translate-extent="[
          [-3000, -2000],
          [3000, 13000]
        ]"
        :min-zoom="landscape ? 0.2 : 0.12"
        :max-zoom="landscape ? 0.5 : 1"
      >
        <template #node-clickable="props">
          <ClickableNode v-bind="props.data"/>
        </template>
        <template #node-category="props">
          <CategoryNode v-bind="props.data"/>
        </template>
      </VueFlow>
    </div>
  </section>
</template>

<style scoped>
.tree-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  /* mobile: fixed tab bar at the bottom; desktop (below): 48px tab row under the header */
  height: calc(100dvh - var(--header-h) - var(--tabbar-h) - env(safe-area-inset-bottom, 0px));
  padding-top: var(--space-3);
}
.tree-head { display: flex; flex-direction: column; align-items: flex-start; gap: var(--space-2); }
.desc {
  margin: 0;
  max-width: 70ch;
  color: var(--text-muted);
  font-size: var(--t-sm);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.zone {
  flex: 1;
  min-height: 0;
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: var(--radius-m);
  overflow: hidden;
}
.basic-flow { background: var(--bg); }
@media (min-width: 900px) {
  .tree-page { height: calc(100dvh - var(--header-h) - 48px); }
}
</style>
