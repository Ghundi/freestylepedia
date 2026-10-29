<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { getRectOfNodes, useVueFlow, type Edge } from '@vue-flow/core';
import { getOrientation } from '@/scripts/helpers';
import { mdiFitToScreenOutline, mdiMagnifyMinusOutline, mdiMagnifyPlusOutline } from '@mdi/js';
import { useThemeMode } from '@/scripts/theme';
import { useWideScreen } from '@/scripts/useWideScreen';
import type { Trick } from '@/scripts/trickStore';
import { focusHeadingIfRequested, requestHeadingFocus } from '@/scripts/ui';
import AppIcon from '@/components/ui/AppIcon.vue';
import IconButton from '@/components/ui/IconButton.vue';
import SegmentedControl from '@/components/ui/SegmentedControl.vue';
import PathList from '@/components/paths/PathList.vue';
import PathSheet from '@/components/paths/PathSheet.vue';

const props = defineProps<{ active: 'TrickTree' | 'CategoryTree'; edges: Edge[]; description: string }>();

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const { resolved } = useThemeMode();
const wide = useWideScreen();
const sheetTrick = ref<Trick | null>(null);
// a sheet left open when the screen turns wide would be an orphan modal over the graph
watch(wide, w => { if (w) sheetTrick.value = null; });
// the VueFlow in the slot carries the same id as the active view, so both use one store
const { zoomIn, zoomOut, fitView, onNodesInitialized, setViewport, getNodes } = useVueFlow(props.active);

// The whole graph only fits at a zoom where labels are a few pixels high, so it opens on its
// top-left corner at a readable size (12-14px labels); the fit button still shows all of it.
const START_ZOOM = getOrientation() === 'Portrait' ? 0.6 : 0.5;
let placed = false;
onNodesInitialized(() => {
  if (placed) return;
  placed = true;
  const rect = getRectOfNodes(getNodes.value);
  setViewport({ x: 16 - rect.x * START_ZOOM, y: 16 - rect.y * START_ZOOM, zoom: START_ZOOM });
});

// Edge colours follow the theme (computed, so they update when `resolved` changes)
const themedEdges = computed(() => {
  const stroke = resolved.value === 'dark' ? '#5a5e66' : '#9a9ea6';
  return props.edges.map((edge: Edge) => ({ ...edge, style: { ...edge.style, stroke } }));
});

const views = computed(() => [
  { value: 'CategoryTree', label: t('paths.byCategory') },
  { value: 'TrickTree', label: t('paths.byLevel') },
]);
const heading = ref<HTMLElement>();
onMounted(() => focusHeadingIfRequested(heading.value));

function switchView(name: string) {
  if (name === props.active) return;
  requestHeadingFocus();
  router.replace({ name, params: route.params });
}
</script>

<template>
  <section class="tree-page">
    <header class="tree-head">
      <h1 ref="heading" tabindex="-1">{{ t('tabs.paths') }}</h1>
      <SegmentedControl :model-value="active" :options="views" :label="t('tabs.paths')" @update:model-value="switchView" />
      <p v-if="wide" class="desc">{{ description }}</p>
      <p v-else class="desc">{{ t('paths.hint') }}</p>
    </header>
    <template v-if="!wide">
      <PathList :mode="active === 'CategoryTree' ? 'category' : 'level'" @open="sheetTrick = $event" />
      <PathSheet v-model:trick="sheetTrick" />
    </template>
    <div v-else class="zone">
      <slot :edges="themedEdges" />
      <div class="controls">
        <IconButton :label="t('paths.zoomIn')" @click="zoomIn()"><AppIcon :path="mdiMagnifyPlusOutline" /></IconButton>
        <IconButton :label="t('paths.zoomOut')" @click="zoomOut()"><AppIcon :path="mdiMagnifyMinusOutline" /></IconButton>
        <IconButton :label="t('paths.fit')" @click="fitView({ padding: 0.1 })"><AppIcon :path="mdiFitToScreenOutline" /></IconButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
.tree-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  /* phone: the page scrolls and keeps room for the fixed tab bar */
  padding-top: var(--space-3);
  padding-bottom: calc(var(--tabbar-h) + env(safe-area-inset-bottom, 0px) + var(--space-3));
}
.tree-head { display: flex; flex-direction: column; align-items: flex-start; gap: var(--space-2); }
.tree-head h1 { margin: 0; font-size: var(--t-xl); }
.tree-head h1:focus { outline: none; }
.desc {
  margin: 0;
  max-width: 70ch;
  color: var(--text-muted);
  font-size: var(--t-sm);
  line-height: 1.5;
}
.zone {
  position: relative;
  flex: 1;
  min-height: 0;
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: var(--radius-m);
  overflow: hidden;
}
.controls {
  position: absolute;
  top: var(--space-2);
  right: var(--space-2);
  z-index: 5;
  display: flex;
  flex-direction: column;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-m);
}
.zone :deep(.basic-flow) { background: var(--bg); }
@media (min-width: 900px) {
  /* the graph ends a step above the window edge rather than flush with it */
  .tree-page { height: calc(100dvh - var(--header-h)); padding-bottom: var(--space-4); }
}
/* short wide window: title and switch share one row and the description goes, so the graph keeps its room */
@media (min-width: 900px) and (max-height: 560px) {
  .tree-head { flex-direction: row; flex-wrap: wrap; align-items: center; column-gap: var(--space-4); }
  .tree-head h1 { font-size: var(--t-lg); }
  .desc { display: none; }
  .controls { flex-direction: row; }
}
</style>
