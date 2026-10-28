<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useVueFlow, type Edge } from '@vue-flow/core';
import { mdiFitToScreenOutline, mdiMagnifyMinusOutline, mdiMagnifyPlusOutline } from '@mdi/js';
import { useThemeMode } from '@/scripts/theme';
import { focusHeadingIfRequested, requestHeadingFocus } from '@/scripts/ui';
import AppIcon from '@/components/ui/AppIcon.vue';
import IconButton from '@/components/ui/IconButton.vue';
import SegmentedControl from '@/components/ui/SegmentedControl.vue';

const props = defineProps<{ active: 'TrickTree' | 'CategoryTree'; edges: Edge[]; description: string }>();

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const { resolved } = useThemeMode();
// the VueFlow in the slot carries the same id as the active view, so both use one store
const { zoomIn, zoomOut, fitView } = useVueFlow(props.active);

// Edge colours follow the theme (computed, so they update when `resolved` changes)
const themedEdges = computed(() => {
  const stroke = resolved.value === 'dark' ? '#5a5e66' : '#9a9ea6';
  return props.edges.map((edge: Edge) => ({ ...edge, style: { ...edge.style, stroke } }));
});

const views = computed(() => [
  { value: 'TrickTree', label: t('paths.byLevel') },
  { value: 'CategoryTree', label: t('paths.byCategory') },
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
      <p class="desc">{{ description }}</p>
    </header>
    <div class="zone">
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
  /* mobile: fixed tab bar at the bottom; desktop (below): tab row under the header */
  height: calc(100dvh - var(--header-h) - var(--tabbar-h) - env(safe-area-inset-bottom, 0px));
  padding-top: var(--space-3);
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
  .tree-page { height: calc(100dvh - var(--header-h)); }
}
</style>
