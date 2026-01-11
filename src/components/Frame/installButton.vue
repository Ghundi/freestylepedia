<script setup lang="ts">

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const props = defineProps<{
  prompt: BeforeInstallPromptEvent | null;
}>();

async function install() {
  const ev = props.prompt;
  if (!ev) return; // safety guard – should never happen if UI is hidden

  try {
    await ev.prompt();                       // show the install dialog
    const { outcome } = await ev.userChoice; // wait for the user decision
    console.log('User response to the install prompt:', outcome);
  } catch (err) {
    console.error('Error while showing PWA install prompt:', err);
  }
}
</script>

<template>
  <v-btn
    variant="plain"
    @click="install"
    class="text-none"
    aria-label="Install this app"
  >
    {{ $t('navBar.installApp') }}
  </v-btn>
</template>