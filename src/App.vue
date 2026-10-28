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
  <div class="frame" :class="{ 'frame--own-header': route.meta.ownHeader }">
    <a class="skip" href="#main">{{ $t('skipToContent') }}</a>
    <AppHeader class="global-header"/>
    <main id="main" class="main" tabindex="-1">
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
/* first Tab stop: hidden until focused */
.skip {
  position: fixed;
  top: var(--space-2);
  left: var(--space-2);
  z-index: 100;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-s);
  background: var(--accent);
  color: var(--accent-text);
  font-weight: 600;
  transform: translateY(-200%);
}
.skip:focus-visible { transform: none; }
.main:focus { outline: none; }
.main {
  /* the fixed tab bar's offset is the footer's job: it is the last thing above the bar */
  padding: 0 var(--space-4);
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  overflow-x: clip;
}
</style>
