<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import InstallButton from './installButton.vue';
import LanguageSelector from './languageSelector.vue';
import ThemeSwitcher from './themeSwitcher.vue';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null);
function handleBeforeInstall(e: Event) {
  e.preventDefault(); 
  deferredPrompt.value = e as BeforeInstallPromptEvent;
}
function handleAppInstalled() {
  console.log('PWA was installed');
  deferredPrompt.value = null;
}

onMounted(() => {
  window.addEventListener('beforeinstallprompt', handleBeforeInstall);
  window.addEventListener('appinstalled', handleAppInstalled);
});

onBeforeUnmount(() => {
  window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  window.removeEventListener('appinstalled', handleAppInstalled);
});

const isStandalone = computed(() => {
  // Chrome / Edge / Opera
  const display = window.matchMedia('(display-mode: standalone)').matches;
  // iOS Safari (non‑standard)
  const ios = (navigator as any).standalone === true;
  return display || ios;
});
const showInstall = computed(() => !!deferredPrompt.value && !isStandalone.value);
</script>

<template>
  <v-menu offset-y>
    <template #activator="{ props }">
      <v-btn v-bind="props" icon variant="tonal" aria-label="Menu">
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </template>

    <v-list class="text-center">
      <v-list-item>
        <language-selector />
      </v-list-item>

      <v-list-item>
        <theme-switcher />
      </v-list-item>

      <v-list-item v-if="showInstall">
        <install-button :prompt="deferredPrompt" />
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<style scoped>
</style>