<script setup lang="ts">
import { computed } from 'vue'
import { mdiChartBoxOutline, mdiSitemapOutline, mdiViewGridOutline } from '@mdi/js'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import AppIcon from '@/components/ui/AppIcon.vue'

const { t, locale } = useI18n()
const route = useRoute()

const tabs = [
  { name: 'Home', label: 'tabs.tricks', icon: mdiViewGridOutline, also: [] as string[] },
  { name: 'TrickTree', label: 'tabs.paths', icon: mdiSitemapOutline, also: ['CategoryTree'] },
  { name: 'MyProgress', label: 'tabs.progress', icon: mdiChartBoxOutline, also: [] as string[] },
]
const active = computed(() => tabs.find(
  tab => route.name === tab.name || tab.also.includes(route.name as string),
)?.name)
</script>

<template>
  <nav class="tabs" :class="{ 'tabs--own-header': route.meta.ownHeader }" :aria-label="t('navBar.freestylepedia')">
    <router-link
      v-for="tab in tabs"
      :key="tab.name"
      class="tab"
      :to="{ name: tab.name, params: { lang: locale } }"
      :aria-current="active === tab.name ? 'page' : undefined"
    >
      <AppIcon :path="tab.icon" />
      <span>{{ t(tab.label) }}</span>
    </router-link>
  </nav>
</template>

<style scoped>
.tabs {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  display: flex;
  min-height: calc(var(--tabbar-h) + env(safe-area-inset-bottom));
  padding-bottom: env(safe-area-inset-bottom);
  background: var(--bg);
  border-top: 1px solid var(--line);
}
.tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  min-height: 44px;
  color: var(--text-muted);
  font-size: var(--t-xs);
  text-decoration: none;
}
.tab[aria-current='page'] { color: var(--accent); font-weight: 600; }
@media (forced-colors: active) { .tab[aria-current='page'] { text-decoration: underline; text-underline-offset: 4px; } }
/* the ring sits inside the tab: the tab is flush with the bar's edges */
.tab:focus-visible { outline-offset: -4px; border-radius: var(--radius-m); }
.tabs--own-header { display: none; }

@media (min-width: 900px) {
  /* inside the header row, centred between the brand and the actions */
  .tabs, .tabs--own-header {
    display: flex;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    right: auto;
    transform: translateX(-50%);
    height: auto;
    padding: 0;
    gap: var(--space-1);
    background: none;
    border-top: 0;
  }
  .tab {
    flex: 0 0 auto;
    flex-direction: row;
    gap: var(--space-2);
    padding: 0 var(--space-3);
    font-size: var(--t-md);
  }
}
</style>
