<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { embedUrl } from '@/scripts/trickMedia'

defineProps<{ videoId: string; title: string }>()

const { t } = useI18n()

// Offline (a page opened from the installed app's cache), the frame would show the browser's error page:
// a short notice stands in for it until the connection is back.
const online = ref(navigator.onLine)
const update = () => { online.value = navigator.onLine }
window.addEventListener('online', update)
window.addEventListener('offline', update)
onBeforeUnmount(() => {
  window.removeEventListener('online', update)
  window.removeEventListener('offline', update)
})
</script>

<!-- Plain YouTube embed: YouTube's own poster and play button.
     The key replaces the frame on a video change: a new src on the same frame would add a history entry. -->
<template>
  <div class="player">
    <iframe
      v-if="online"
      :key="videoId"
      class="media"
      :src="embedUrl(videoId, { autoplay: false })"
      :title="title"
      allow="encrypted-media; picture-in-picture; fullscreen"
      allowfullscreen
    />
    <p v-else class="offline" role="status">{{ t('video.offline') }}</p>
  </div>
</template>

<style scoped>
.player {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: #000;
}
.media {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}
.offline {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  margin: 0;
  padding: var(--space-4);
  color: #fff;
  font-size: var(--t-sm);
  text-align: center;
}
</style>
