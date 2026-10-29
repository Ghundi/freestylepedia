<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  mdiArrowDown, mdiBookmark, mdiBookmarkOutline, mdiCheckCircle, mdiCheckCircleOutline, mdiChevronRight,
} from '@mdi/js'
import AppDialog from '../ui/AppDialog.vue'
import AppButton from '../ui/AppButton.vue'
import AppIcon from '../ui/AppIcon.vue'
import YtThumb from '../ui/YtThumb.vue'
import TrickStatus from './TrickStatus.vue'
import { trickPath } from '../../scripts/paths'
import { strToUrl } from '../../scripts/helpers'
import { useTrickStore, type Trick } from '../../scripts/trickStore'
import { useCategoryStore, useMasteredStore, useTodoStore } from '../../scripts/store'

const props = defineProps<{ trick: Trick | null }>()
const emit = defineEmits<{ 'update:trick': [trick: Trick | null] }>()

const { t, locale } = useI18n()
const trickStore = useTrickStore()
const categoryStore = useCategoryStore()
const masteredStore = useMasteredStore()
const todoStore = useTodoStore()

const path = computed(() => props.trick ? trickPath(trickStore.tricks, props.trick) : { before: [], after: [] })
const name = (trick: Trick) => trickStore.getLocalTrickTitles(trick, locale.value)[0] ?? trick.title[0]

// Switching to another trick scrolls the dialog back to the top and moves focus to the trick card,
// since the tapped row is gone. The first open is left to AppDialog.
const content = ref<HTMLElement>()
const card = ref<HTMLElement>()
watch(() => props.trick, async (now, before) => {
  if (!now || !before) return
  await nextTick()
  const dlg = content.value?.closest('dialog')
  if (dlg) dlg.scrollTop = 0
  card.value?.focus({ preventScroll: true })
})
</script>

<template>
  <AppDialog :open="trick !== null" :title="t('paths.sheetTitle')" placement="bottom" @update:open="v => { if (!v) emit('update:trick', null) }">
    <div v-if="trick" ref="content" class="sheet">
      <p class="lab">{{ t('paths.before') }}</p>
      <ul class="minis before">
        <li v-for="x in path.before" :key="x.trickID">
          <button type="button" class="mini" @click="emit('update:trick', x)">
            <span class="tx">
              <span class="nm">{{ name(x) }}</span>
              <span class="mt">{{ t('level', { n: x.difficulty }) }}</span>
            </span>
            <TrickStatus :trick="x" />
            <AppIcon :path="mdiChevronRight" :size="20" class="chev" />
          </button>
        </li>
        <li v-if="!path.before.length" class="none">{{ t('paths.noneBefore') }}</li>
      </ul>

      <AppIcon :path="mdiArrowDown" :size="24" class="arrow" />

      <div ref="card" class="focus" tabindex="-1">
        <YtThumb :video-id="trick.videoID[0]" :alt="''" class="th" sizes="96px" />
        <div class="tx">
          <span class="nm nm--l">{{ name(trick) }}</span>
          <span class="mt">
            <span class="dot" :style="{ background: categoryStore.getDotColor(trick.category) }" aria-hidden="true"></span>
            {{ t('categories.' + trick.category) }} · {{ t('level', { n: trick.difficulty }) }}
          </span>
        </div>
      </div>

      <div class="marks">
        <AppButton
          class="mark"
          :pressed="todoStore.isOnTodo(trick)"
          :icon="todoStore.isOnTodo(trick) ? mdiBookmark : mdiBookmarkOutline"
          @click="todoStore.toggle(trick)"
        >{{ t('trick.todo') }}</AppButton>
        <AppButton
          class="mark"
          :pressed="masteredStore.isMastered(trick)"
          :icon="masteredStore.isMastered(trick) ? mdiCheckCircle : mdiCheckCircleOutline"
          @click="masteredStore.toggle(trick)"
        >{{ t('trick.mastered') }}</AppButton>
      </div>

      <AppIcon :path="mdiArrowDown" :size="24" class="arrow" />

      <p class="lab">{{ t('paths.after') }}</p>
      <ul class="minis after">
        <li v-for="x in path.after" :key="x.trickID">
          <button type="button" class="mini" @click="emit('update:trick', x)">
            <span class="tx">
              <span class="nm">{{ name(x) }}</span>
              <span class="mt">{{ t('level', { n: x.difficulty }) }}</span>
            </span>
            <TrickStatus :trick="x" />
            <AppIcon :path="mdiChevronRight" :size="20" class="chev" />
          </button>
        </li>
        <li v-if="!path.after.length" class="none">{{ t('paths.noneAfter') }}</li>
      </ul>

      <AppButton
        class="open"
        variant="primary"
        :to="{ name: 'Trick', params: { lang: locale, trickname: strToUrl(trick.title[0]) } }"
      >{{ t('paths.openTrick') }}</AppButton>
    </div>
  </AppDialog>
</template>

<style scoped>
.lab { margin: var(--space-3) 0 var(--space-1); color: var(--text-muted); font-size: var(--t-sm); font-weight: 600; }
.minis { list-style: none; margin: 0; padding: 0; }
.minis li { margin-bottom: 6px; }
.mini {
  display: flex; align-items: center; gap: 10px; width: 100%; min-height: 48px; padding: 0 12px;
  border: 1px solid var(--line); border-radius: var(--radius-m); background: none; color: var(--text);
  font: inherit; text-align: left; cursor: pointer;
}
.mini:focus-visible { outline: 2px solid var(--focus); outline-offset: 2px; }
.none { color: var(--text-muted); font-size: var(--t-sm); padding: var(--space-2) 0; }
.tx { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
.nm { font-weight: 600; }
.nm--l { font-size: var(--t-lg); font-weight: 700; }
.mt { display: flex; align-items: center; gap: 6px; color: var(--text-muted); font-size: var(--t-sm); }
.dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; flex: none; }
.chev { color: var(--text-muted); flex: none; }
.arrow { display: block; margin: var(--space-1) auto; color: var(--text-muted); }
.focus { display: flex; align-items: center; gap: 12px; padding: 12px; border: 2px solid var(--accent); border-radius: var(--radius-m); }
.focus:focus { outline: none; }
.focus:focus-visible { outline: 2px solid var(--focus); outline-offset: 2px; }
.th { width: 96px; height: 60px; border-radius: var(--radius-s); overflow: hidden; background: var(--surface-2); flex: none; }
.marks { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); margin-top: var(--space-3); }
.mark { min-height: 48px; padding-inline: var(--space-3); white-space: nowrap; }
.open { display: flex; width: 100%; min-height: 48px; margin-top: var(--space-3); }
</style>
