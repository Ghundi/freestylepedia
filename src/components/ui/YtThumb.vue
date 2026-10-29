<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { frameThumbnailUrl, fallbackThumbnailUrl, hasLocalThumb, localThumbSrcset, localThumbUrl, thumbFrameInfo } from '../../scripts/trickMedia'

const props = withDefaults(defineProps<{ videoId: string; alt: string; eager?: boolean; sizes?: string }>(), {
  eager: false,
  // grid and rail cards; wide images (next-trick card, player poster) pass their own
  sizes: '(min-width: 900px) 260px, 45vw',
})

// YouTube answers a grey 120px-wide placeholder when hq2.jpg does not exist.
const PLACEHOLDER_MAX_WIDTH = 120
const useFallback = ref(false)
// Both images failed (deleted or private video): the img goes, the empty box stays.
const failed = ref(false)
function reset() { useFallback.value = false; failed.value = false }
watch(() => props.videoId, reset)
// a picture that failed while offline gets another try once the connection is back
function onOnline() { if (useFallback.value || failed.value) reset() }
onMounted(() => window.addEventListener('online', onOnline))
onBeforeUnmount(() => window.removeEventListener('online', onOnline))

// A frame extracted from the video when there is one; otherwise YouTube's picked frame, then its default.
const local = computed(() => hasLocalThumb(props.videoId) && !useFallback.value)
const src = computed(() =>
  local.value ? localThumbUrl(props.videoId)
    : useFallback.value ? fallbackThumbnailUrl(props.videoId) : frameThumbnailUrl(props.videoId))
const srcset = computed(() => local.value ? localThumbSrcset(props.videoId) : undefined)

const isCard = computed(() => !local.value && thumbFrameInfo(props.videoId).card)

function onError() {
  if (useFallback.value) failed.value = true
  else useFallback.value = true
}
function onLoad(e: Event) {
  if (!local.value && (e.target as HTMLImageElement).naturalWidth <= PLACEHOLDER_MAX_WIDTH) useFallback.value = true
}
</script>

<template>
  <span class="yt-thumb" :class="{ card: isCard, local }">
    <img v-if="!failed" class="img" :src="src" :srcset="srcset" :sizes="srcset ? sizes : undefined" :alt="alt" :loading="eager ? 'eager' : 'lazy'" decoding="async" @error="onError" @load="onLoad">
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
/* extracted frames are plain 16:9, no letterbox to crop */
.local .img { transform: none; }
/* A white title card glares in the dark UI: invert it to light-on-dark. */
:root[data-theme='dark'] .card .img {
  filter: invert(1) grayscale(1) contrast(0.9);
}
</style>
