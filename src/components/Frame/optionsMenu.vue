<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import LanguageSelector from './languageSelector.vue';
import ThemeSwitcher from './themeSwitcher.vue';

type InstallPromptEvent = BeforeInstallPromptEvent;

// 1️⃣ Reactive state
const deferredPrompt = ref<InstallPromptEvent | null>(null);

// 2️⃣ Detect “installed” state (Chrome/Edge/Opera + iOS Safari)
const isStandalone = computed(() => {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // iOS Safari exposes a non‑standard flag
    (navigator as any).standalone === true
  );
});

// 3️⃣ Show button only when we have a saved prompt *and* we are not already
//    running as a PWA
const showInstallButton = computed(() => !!deferredPrompt.value && !isStandalone.value);

// 4️⃣ Event listeners -------------------------------------------------
function handleBeforeInstall(e: InstallPromptEvent) {
  e.preventDefault();               // Required – tells the browser we’ll show it later
  deferredPrompt.value = e;         // Save the event for later use
}

function handleAppInstalled() {
  console.log('✅ PWA successfully installed');
  deferredPrompt.value = null;      // Clean up so the button disappears
}

onMounted(() => {
  window.addEventListener('beforeinstallprompt', handleBeforeInstall);
  window.addEventListener('appinstalled', handleAppInstalled);
});

onBeforeUnmount(() => {
  window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  window.removeEventListener('appinstalled', handleAppInstalled);
});

// 5️⃣ Install button click handler ----------------------------------
async function triggerInstall() {
  const promptEvent = deferredPrompt.value;
  if (!promptEvent) return;         // Safety guard

  // Show the native install UI
  promptEvent.prompt();

  // Wait for the user’s decision
  const { outcome } = await promptEvent.userChoice;
  console.log('Install outcome:', outcome);

  // Reset – the prompt can’t be shown again
  deferredPrompt.value = null;
}
</script>

<template>
  <v-menu offset-y>
    <template #activator="{ props }">
      <v-btn 
        v-bind="props" 
        icon 
        variant="tonal"
        aria-label="Menu"
      >
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </template>

    <v-list class="text-center">
      <v-list-item>
        <languageSelector />
      </v-list-item>
      
      <v-list-item>
        <themeSwitcher />
      </v-list-item>
      
      <v-list-item v-if="showInstallButton">
        <v-btn
          variant="plain"
          @click="triggerInstall"
          class="text-none"
          :aria-label="$t('navBar.installApp')"
        >
          {{ $t('navBar.installApp') }}
        </v-btn>
      </v-list-item>
    </v-list>
  </v-menu>
</template>