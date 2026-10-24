<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import YtThumb from '@/components/ui/YtThumb.vue'
import { strToUrl } from '@/scripts/helpers'
import { useCategoryStore } from '@/scripts/store'
import type { Trick } from '@/scripts/trickStore'

const props = defineProps<{ trick: Trick | null; fromTodo: boolean }>()

const { t, locale } = useI18n()
const categories = useCategoryStore()

const to = computed(() => props.trick && {
  name: 'Trick',
  params: { lang: locale.value, trickname: strToUrl(props.trick.title[0]) },
})
</script>

<template>
  <router-link v-if="trick && to" :to="to" class="next">
    <!-- the title is the link text; the image adds nothing for screen readers -->
    <YtThumb :video-id="trick.videoID[0]" alt="" eager />
    <span class="cap">
      <span class="over">{{ fromTodo ? t('home.next') : t('home.suggested') }}</span>
      <span class="name">{{ trick.title[0] }}</span>
      <span class="meta">
        <span class="dot" :style="{ background: categories.getColor(trick.category) }" />
        {{ t('categories.' + trick.category) }} · {{ t('level', { n: trick.difficulty }) }}
      </span>
    </span>
  </router-link>
</template>

<style scoped>
.next {
  position: relative;
  display: block;
  width: 100%;
  max-width: 720px;
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
.over { color: #c9ccd2; font-size: var(--t-sm); font-weight: 500; }
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
  .cap { padding: var(--space-6) var(--space-5) var(--space-5); }
  .name { font-size: var(--t-xl); }
}
</style>
