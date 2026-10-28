<script setup>

import { useRoute } from 'vue-router';
import { useTrickStore } from "@/scripts/trickStore";
import AppHeader from '@/components/layout/AppHeader.vue';
import AppFooter from '@/components/layout/AppFooter.vue';
import SearchOverlay from '@/components/home/SearchOverlay.vue';
import { useSearchOpen } from '@/scripts/ui';
import LocaleLayout from './components/localeLayout.vue';

const route = useRoute();
const searchOpen = useSearchOpen();

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
  <div class="frame" :class="{ 'frame--own-header': route.meta.ownHeader }">
    <AppHeader class="global-header"/>
    <main class="main">
      <LocaleLayout/>
    </main>
    <AppFooter/>
    <SearchOverlay v-model:open="searchOpen"/>
  </div>
</template>

<style>
:root {
  --header-h: 56px;
  --tabbar-h: 64px;
}
/* own-header pages (a trick) bring their own bar below 900px: no global header or tab bar there.
   From 900px up they get the normal header, tabs included. */
@media (max-width: 899.98px) {
  .frame--own-header { --header-h: 0px; --tabbar-h: 0px; }
  .frame--own-header .global-header { display: none; }
}
.main {
  /* the fixed tab bar's offset is the footer's job: it is the last thing above the bar */
  padding: 0 var(--space-4);
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  overflow-x: clip;
}
</style>
