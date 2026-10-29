<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import YtThumb from '@/components/ui/YtThumb.vue'
import { strToUrl } from '@/scripts/helpers'
import { useCategoryStore } from '@/scripts/store'
import { visibleOnBackground } from '@/scripts/contrast'
import type { Trick } from '@/scripts/trickStore'

// started: the user has mastered tricks already, so a suggestion is no longer a first trick
const props = defineProps<{ trick: Trick | null; fromTodo: boolean; started?: boolean }>()

const { t, locale } = useI18n()
// the dot sits on the card's fixed dark scrim, whatever the theme
const categories = useCategoryStore()
const dotColor = computed(() => props.trick ? visibleOnBackground(categories.getColor(props.trick.category), '#000000', 'dark') : '')

const to = computed(() => props.trick && {
  name: 'Trick',
  params: { lang: locale.value, trickname: strToUrl(props.trick.title[0]) },
})
</script>

<template>
  <router-link v-if="trick && to" :to="to" class="next">
    <!-- the title is the link text; the image adds nothing for screen readers -->
    <YtThumb :video-id="trick.videoID[0]" alt="" eager sizes="(min-width: 900px) 560px, 100vw" />
    <span class="cap">
      <span class="name">{{ trick.title[0] }}</span>
      <span class="meta">
        <span class="dot" :style="{ background: dotColor }" />
        {{ fromTodo ? t('home.nextContext') : started ? t('home.recommendedContext') : t('home.suggestedContext') }} · {{ t('categories.' + trick.category) }} · {{ t('level', { n: trick.difficulty }) }}
      </span>
    </span>
  </router-link>
</template>

<style scoped>
.next {
  position: relative;
  display: block;
  width: 100%;
  border-radius: var(--radius-l);
  overflow: hidden;
  color: #f2f2f0;
  text-decoration: none;
  background: var(--surface-2);
}
.next:focus-visible { outline: 2px solid var(--focus); outline-offset: 3px; }
.next :deep(.yt-thumb) { border-radius: 0; }
/* Text sits on the video frame in both themes, so the scrim and text colours are fixed. */
.cap {
  position: absolute;
  inset: auto 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: var(--space-6) var(--space-4) var(--space-4);
  /* fades in over the top padding only, so the text always sits on ≥ 80% black, even on white title cards */
  background: linear-gradient(to bottom, rgb(0 0 0 / 0), rgb(0 0 0 / 0.8) var(--space-6), rgb(0 0 0 / 0.85));
}
.name {
  font-size: var(--t-lg);
  font-weight: 700;
  line-height: 1.2;
  overflow-wrap: anywhere;
}
.meta {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-1);
  color: #c9ccd2;
  font-size: var(--t-sm);
}
.dot { width: 8px; height: 8px; border-radius: 50%; flex: none; }
@media (min-width: 900px) {
  /* full content width, cinematic crop */
  .next :deep(.yt-thumb) { aspect-ratio: 21 / 9; max-height: 440px; }
  .next :deep(.img) { object-position: 50% 50%; }
  .cap { padding: var(--space-6) var(--space-5) var(--space-5); }
  .name { font-size: var(--t-xl); }
}
</style>
