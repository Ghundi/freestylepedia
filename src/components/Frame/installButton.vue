<template>
    <v-btn variant="outlined">Install as App</v-btn>
  <button v-if="deferredPrompt" @click="install">Install as App</button>
</template>

<script>
export default {
  data() {
    return { deferredPrompt: null };
  },
  created() {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome from showing its own mini-infobar
      e.preventDefault();
      this.deferredPrompt = e;   // stash the event
    });

    // Optional: Detect when the app is installed
    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed');
    });
  },
  methods: {
    async install() {
      if (!this.deferredPrompt) return;
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      console.log('User response to the install prompt:', outcome);
      this.deferredPrompt = null;
    }
  }
};
</script>