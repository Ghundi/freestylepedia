<template>
  <v-btn 
  v-if="deferredPrompt" 
  variant="plain" 
  @click="install" 
  class="text-none">
    {{ $t('navBar.installApp') }}
  </v-btn>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const deferredPrompt = ref<Event | null>(null)

onMounted(() => {
  const before = (e: Event) => {
    e.preventDefault()
    deferredPrompt.value = e
  }
  const installed = () => console.log('PWA was installed')

  window.addEventListener('beforeinstallprompt', before)
  window.addEventListener('appinstalled', installed)

  onBeforeUnmount(() => {
    window.removeEventListener('beforeinstallprompt', before)
    window.removeEventListener('appinstalled', installed)
  })
})

async function install() {
  if (!deferredPrompt.value) return
  const ev: any = deferredPrompt.value
  ev.prompt()
  const { outcome } = await ev.userChoice
  console.log('User response to the install prompt:', outcome)
  deferredPrompt.value = null
}
</script>