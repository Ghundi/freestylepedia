<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import LanguageSelector from './languageSelector.vue'
import ThemeSwitcher from './themeSwitcher.vue'

/* ===== 1. TYPE SAFETY (CRITICAL FOR PWAs) ===== */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

/* ===== 2. REACTIVE STATE ===== */
const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null)

// Detect if already installed (works on Chrome, Edge, Opera, iOS)
const isStandalone = computed(() => 
  window.matchMedia('(display-mode: standalone)').matches || 
  !!(navigator as any).standalone
)

// Only show button when installable AND not already installed
const showInstallButton = computed(() => 
  !!deferredPrompt.value && !isStandalone.value
)

/* ===== 3. PWA EVENT HANDLING (ALL IN ONE PLACE) ===== */
const handleBeforeInstall = (e: Event) => {
  e.preventDefault() // REQUIRED to defer the prompt
  deferredPrompt.value = e as BeforeInstallPromptEvent
}

const handleAppInstalled = () => {
  console.log('PWA successfully installed')
  deferredPrompt.value = null // Clear after install
}

onMounted(() => {
  window.addEventListener('beforeinstallprompt', handleBeforeInstall)
  window.addEventListener('appinstalled', handleAppInstalled)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
  window.removeEventListener('appinstalled', handleAppInstalled)
})

/* ===== 4. INSTALL HANDLER (NO CHILD COMPONENT NEEDED) ===== */
async function triggerInstall() {
  if (!deferredPrompt.value) return

  try {
    // Show native install prompt
    await deferredPrompt.value.prompt()
    
    // Wait for user decision
    const { outcome } = await deferredPrompt.value.userChoice
    console.log('Install outcome:', outcome)
    
    // Cleanup (prompt can only be used once)
    deferredPrompt.value = null
  } catch (err) {
    console.error('Install failed:', err)
  }
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
        <language-selector />
      </v-list-item>
      
      <v-list-item>
        <theme-switcher />
      </v-list-item>
      
      <v-list-item v-if="showInstallButton">
        <v-btn
          variant="plain"
          @click="triggerInstall"
          class="text-none"
          aria-label="Install this app"
        >
          {{ $t('navBar.installApp') }}
        </v-btn>
      </v-list-item>
    </v-list>
  </v-menu>
</template>