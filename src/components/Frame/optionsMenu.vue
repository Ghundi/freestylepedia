<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import InstallButton from './installButton.vue'
import LanguageSelector from './languageSelector.vue'
import ThemeSwitcher from './themeSwitcher.vue'

const deferredPrompt = ref<Event | null>(null)


onMounted(() => {
  const beforeHandler = (e: Event) => {
    e.preventDefault()
    deferredPrompt.value = e  
  }
  const installedHandler = () => {
    console.log('PWA was installed')
    // Optionally clear the stored prompt
    deferredPrompt.value = null
  }

  window.addEventListener('beforeinstallprompt', beforeHandler)
  window.addEventListener('appinstalled', installedHandler)

  onBeforeUnmount(() => {
    window.removeEventListener('beforeinstallprompt', beforeHandler)
    window.removeEventListener('appinstalled', installedHandler)
  })
})
</script>

<template>
  <v-menu offset-y>
    <template #activator="{ props }">
      <v-btn v-bind="props" icon variant="tonal">
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

      <v-list-item v-if="deferredPrompt">
        <install-button :prompt="deferredPrompt" />
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<style scoped>
/* No extra CSS needed – Vuetify takes care of the layout */
</style>