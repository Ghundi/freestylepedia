<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { mdiPlay } from '@mdi/js'
import AppIcon from '@/components/ui/AppIcon.vue'
import YtThumb from '@/components/ui/YtThumb.vue'
import { embedUrl } from '@/scripts/trickMedia'
import { loadYouTubeApi, type YouTubeApi, type YouTubePlayer } from '@/scripts/youtubeApi'

const props = defineProps<{ videoId: string; title: string }>()

const { t } = useI18n()
const playing = ref(false)
const frame = ref<HTMLIFrameElement>()
let player: YouTubePlayer | undefined

function stopPlayer() {
  player?.destroy()
  player = undefined
}

watch(() => props.videoId, () => {
  stopPlayer()
  playing.value = false
})
onBeforeUnmount(stopPlayer)

// YouTube needs the network: offline, the poster stays and says so instead of opening an empty frame.
const offline = ref(false)
const backOnline = () => { offline.value = false }
window.addEventListener('online', backOnline)
onBeforeUnmount(() => window.removeEventListener('online', backOnline))

// Safari refuses autoplay with sound inside the frame: start muted there instead of waiting for a second tap.
// Without the API (blocked script), the frame keeps YouTube's own play button.
async function attachPlayer(api: Promise<YouTubeApi>, el: HTMLIFrameElement) {
  try {
    const YT = await api
    if (frame.value !== el) return
    player = new YT.Player(el, {
      events: {
        onAutoplayBlocked: ({ target }) => {
          target.mute()
          target.playVideo()
        },
      },
    })
  } catch {
    // the plain frame still plays on a tap
  }
}

// The play button disappears on click: hand focus to the player so keyboard users keep their place.
async function play() {
  if (!navigator.onLine) {
    offline.value = true
    return
  }
  // the API starts loading with the frame, so it is ready when the browser decides on autoplay
  const api = loadYouTubeApi()
  api.catch(() => {})
  playing.value = true
  await nextTick()
  if (!frame.value) return
  frame.value.focus()
  attachPlayer(api, frame.value)
}
</script>

<template>
  <div class="player">
    <iframe
      v-if="playing"
      ref="frame"
      class="media"
      :src="embedUrl(videoId, { api: true })"
      :title="title"
      allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
      allowfullscreen
    />
    <button v-else type="button" class="poster" :aria-label="t('video.play', { name: title })" @click="play">
      <YtThumb class="media" :video-id="videoId" alt="" eager sizes="(min-width: 900px) 960px, 100vw" />
      <span class="disc"><AppIcon :path="mdiPlay" :size="36" /></span>
    </button>
    <p v-if="offline && !playing" class="offline" role="status">{{ t('video.offline') }}</p>
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
/* the poster fills the 16:9 frame instead of YtThumb's own 16:10 box */
.media.yt-thumb { aspect-ratio: auto; border-radius: 0; }
.poster {
  display: block;
  width: 100%;
  height: 100%;
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
}
.poster:focus { outline: none; }
.offline {
  position: absolute;
  inset: auto var(--space-3) var(--space-3);
  z-index: 2;
  margin: 0;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-s);
  background: rgb(0 0 0 / 0.75);
  color: #fff;
  font-size: var(--t-sm);
  text-align: center;
}
/* dark theme only: dims the poster a little so a white title card does not glare in the dark page */
:root[data-theme='dark'] .poster::after { content: ''; position: absolute; inset: 0; background: rgb(0 0 0 / 0.2); }
.disc {
  position: absolute;
  top: 50%;
  left: 50%;
  display: grid;
  place-items: center;
  width: 64px;
  height: 64px;
  margin: -32px 0 0 -32px;
  border-radius: 50%;
  background: var(--text);
  color: var(--bg);
  z-index: 1;
}
/* the triangle's visual centre sits left of its box centre */
.disc :deep(svg) { margin-left: 2px; }
@media (hover: hover) { .poster:hover .disc { filter: brightness(1.08); } }
/* drawn on the video frame in both themes: a black then a white ring reads on any picture */
.poster:focus-visible .disc { box-shadow: 0 0 0 3px #000; outline: 2px solid #fff; outline-offset: 3px; }
</style>
