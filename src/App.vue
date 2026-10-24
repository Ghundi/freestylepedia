<script setup>

import 'vuetify/styles';
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import { useTheme } from 'vuetify';
import { useTrickStore } from "@/scripts/trickStore";
import { useThemeMode } from '@/scripts/theme';
import AppHeader from '@/components/layout/AppHeader.vue';
import AppFooter from '@/components/layout/AppFooter.vue';
import TabBar from '@/components/layout/TabBar.vue';
import LocaleLayout from './components/localeLayout.vue';

const route = useRoute();

// Transition only: keep the not-yet-migrated Vuetify pages in sync with the new theme (removed in Task 10).
const vuetifyTheme = useTheme();
watch(useThemeMode().resolved, v => vuetifyTheme.change(v), { immediate: true });

const trickStore = useTrickStore();
trickStore.loadTricks();

</script>


<template>
  <head>
    <title>Freestylepedia</title>
    <meta name="description" content=
        "This is a website where you can learn ice freestyle tricks and moves.
        You can learn about all of them here and see the connections between them.
        It is the page for the freestylepedia youtube series from Blackbirds Ice Freestyle.">
  </head>
  <!-- bare v-app kept for the Vuetify pages until Task 10 -->
  <v-app class="app-shell">
    <div class="frame" :class="{ 'frame--own-header': route.meta.ownHeader }">
      <AppHeader v-if="!route.meta.ownHeader"/>
      <TabBar/>
      <main class="main">
        <LocaleLayout/>
      </main>
      <AppFooter/>
    </div>
  </v-app>
</template>

<style>
:root {
  --header-h: 56px;
  --tabbar-h: 64px;
}
.app-shell.v-application, .app-shell .v-application__wrap {
  background: transparent !important;
  color: var(--text);
}
.frame--own-header { --header-h: 0px; }
.main {
  padding: 0 var(--space-4);
  padding-bottom: calc(var(--tabbar-h) + env(safe-area-inset-bottom));
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  overflow-x: clip;
}
@media (min-width: 900px) {
  .main { padding-bottom: 0; }
}
/* width */
::-webkit-scrollbar {
  width: 0;
}
</style>
