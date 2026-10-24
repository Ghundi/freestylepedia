<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { frameThumbnailUrl, fallbackThumbnailUrl } from '../../scripts/trickMedia'

const props = defineProps<{ videoId: string; alt: string }>()

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
  <img class="yt-thumb" :src="src" :alt="alt" loading="lazy" decoding="async" @error="onError" @load="onLoad">
</template>

<style scoped>
.yt-thumb {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  background: var(--surface-2);
  border-radius: var(--radius-m);
}
</style>
