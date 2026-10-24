<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { frameThumbnailUrl, fallbackThumbnailUrl } from '../../scripts/trickMedia'

const props = withDefaults(defineProps<{ videoId: string; alt: string; eager?: boolean }>(), { eager: false })

// YouTube answers a grey 120px-wide placeholder when hq2.jpg does not exist.
const PLACEHOLDER_MAX_WIDTH = 120
const useFallback = ref(false)
watch(() => props.videoId, () => { useFallback.value = false })

const src = computed(() =>
  useFallback.value ? fallbackThumbnailUrl(props.videoId) : frameThumbnailUrl(props.videoId))

function onError() { useFallback.value = true }
function onLoad(e: Event) {
  if ((e.target as HTMLImageElement).naturalWidth <= PLACEHOLDER_MAX_WIDTH) useFallback.value = true
}
</script>

<template>
  <span class="yt-thumb">
    <img class="img" :src="src" :alt="alt" :loading="eager ? 'eager' : 'lazy'" decoding="async" @error="onError" @load="onLoad">
  </span>
</template>

<style scoped>
.yt-thumb {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: var(--surface-2);
  border-radius: var(--radius-m);
}
/* hq2/hqdefault are 4:3 frames with a 16:9 picture letterboxed in black; cropped to 16:10 a band
   stays at top and bottom. Zooming by (10/16) / (9/16) = 1.112 crops into the picture itself. */
.img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.112);
}
</style>
