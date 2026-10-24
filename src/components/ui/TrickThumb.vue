<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { mdiBookmark, mdiCheckCircle } from '@mdi/js'
import AppIcon from './AppIcon.vue'
import YtThumb from './YtThumb.vue'
import { strToUrl } from '../../scripts/helpers'
import { useCategoryStore, useMasteredStore, useTodoStore } from '../../scripts/store'
import { useTrickStore } from '../../scripts/trickStore'
import type { Trick } from '../../scripts/trickStore'

const props = withDefaults(defineProps<{ trick: Trick; size?: 'm' | 'l' }>(), { size: 'm' })

const { t, locale } = useI18n()
const mastered = useMasteredStore()
const todo = useTodoStore()
const trickStore = useTrickStore()
const categories = useCategoryStore()

const isMastered = computed(() => mastered.isMastered(props.trick))
const isTodo = computed(() => todo.isOnTodo(props.trick))
const isNew = computed(() => trickStore.newestTrick?.trickID === props.trick.trickID)
const dotColor = computed(() => categories.getColor(props.trick.category))
const to = computed(() => ({
  name: 'Trick',
  params: { lang: locale.value, trickname: strToUrl(props.trick.title[0]) },
}))
</script>

<template>
  <router-link :to="to" class="thumb" :class="`thumb--${size}`">
    <span class="frame">
      <YtThumb :video-id="trick.videoID[0]" alt="" />
      <span v-if="isNew" class="tag">{{ t('new') }}</span>
      <span v-if="isMastered || isTodo" class="mark">
        <AppIcon :path="isMastered ? mdiCheckCircle : mdiBookmark" :size="16" />
        <span class="sr-only">{{ isMastered ? t('marked.mastered') : t('marked.todo') }}</span>
      </span>
    </span>
    <span class="name">{{ trick.title[0] }}</span>
    <span class="meta">
      <span class="dot" :style="{ background: dotColor }" />
      {{ t('level', { n: trick.difficulty }) }}
    </span>
  </router-link>
</template>

<style scoped>
.thumb {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  min-width: 0;
  color: var(--text);
  text-decoration: none;
  border-radius: var(--radius-m);
}
.thumb:focus-visible {
  outline: 2px solid var(--focus);
  outline-offset: 3px;
}
.frame { position: relative; display: block; }
.tag {
  position: absolute;
  top: var(--space-2);
  left: var(--space-2);
  padding: 2px var(--space-2);
  border-radius: var(--radius-s);
  background: var(--accent);
  color: var(--accent-text);
  font-size: var(--t-xs);
  font-weight: 600;
}
.mark {
  position: absolute;
  top: var(--space-2);
  right: var(--space-2);
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: var(--radius-s);
  background: var(--surface);
  color: var(--text);
}
.name {
  font-size: var(--t-md);
  font-weight: 500;
  line-height: 1.3;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow-wrap: normal;
  word-break: normal;
  hyphens: none;
}
.meta {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--text-muted);
  font-size: var(--t-xs);
}
.dot { width: 8px; height: 8px; border-radius: 50%; flex: none; }
.thumb--l .name { font-size: var(--t-lg); }
.thumb--l .meta { font-size: var(--t-sm); }
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
</style>
