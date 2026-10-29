<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { mdiClose, mdiMagnify } from '@mdi/js'
import AppIcon from '@/components/ui/AppIcon.vue'
import TrickThumb from '@/components/ui/TrickThumb.vue'
import { trickMatchesSearch } from '@/scripts/helpers'
import { useTrickStore } from '@/scripts/trickStore'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ 'update:open': [value: boolean] }>()

const { t } = useI18n()
const route = useRoute()
const trickStore = useTrickStore()

const dialog = ref<HTMLDialogElement>()
const input = ref<HTMLInputElement>()
const query = ref('')
let trigger: HTMLElement | null = null
let openedAt = ''

const results = computed(() => {
  const q = query.value.trim()
  if (!q) return []
  const lower = q.toLowerCase()
  // names that start with the query first, then alphabetical
  return trickStore.tricks
    .filter(trick => trickMatchesSearch(trick, q))
    .sort((a, b) =>
      Number(!a.title[0].toLowerCase().startsWith(lower)) - Number(!b.title[0].toLowerCase().startsWith(lower))
      || a.title[0].localeCompare(b.title[0]))
})

function lockScroll(lock: boolean) {
  document.documentElement.style.overflow = lock ? 'hidden' : ''
}

watch(() => props.open, async (open) => {
  await nextTick()
  const el = dialog.value
  if (!el) return
  if (open && !el.open) {
    trigger = document.activeElement instanceof HTMLElement && document.activeElement !== document.body
      ? document.activeElement
      : document.querySelector<HTMLElement>('[data-search-trigger]')
    openedAt = route.fullPath
    el.showModal()
    lockScroll(true)
    input.value?.focus()
    input.value?.select()
  } else if (!open && el.open) {
    el.close()
  }
}, { immediate: true, flush: 'post' })

// A result is a link: once the route changes the overlay has done its job.
watch(() => route.fullPath, () => { if (props.open) emit('update:open', false) })

// Fires for Escape, the close button and navigation alike.
function onClose() {
  lockScroll(false)
  emit('update:open', false)
  if (route.fullPath === openedAt) trigger?.focus()
  else {
    // a result was picked: the browser has put focus back on the search button, move it to the new page
    nextTick(() => {
      const heading = document.querySelector<HTMLElement>('main h1')
      if (heading && !heading.hasAttribute('tabindex')) heading.tabIndex = -1
      ;(heading ?? document.getElementById('main'))?.focus()
    })
  }
  trigger = null
}

onBeforeUnmount(() => lockScroll(false))
</script>

<template>
  <dialog ref="dialog" class="search" :aria-label="t('search.open')" @close="onClose">
    <div class="bar">
      <div class="inner">
        <label class="field">
          <AppIcon :path="mdiMagnify" class="lead" />
          <span class="sr-only">{{ t('search.placeholder') }}</span>
          <input
            ref="input"
            v-model="query"
            type="search"
            autocomplete="off"
            spellcheck="false"
            enterkeyhint="search"
            :placeholder="t('search.placeholder')"
          >
        </label>
        <button type="button" class="close" :aria-label="t('close')" @click="emit('update:open', false)">
          <AppIcon :path="mdiClose" />
        </button>
      </div>
    </div>
    <div class="body">
      <p v-if="query.trim()" class="count" aria-live="polite">
        {{ results.length ? t('home.count', { n: results.length }, results.length) : t('error.noResults') }}
      </p>
      <ul v-if="results.length" class="grid">
        <li v-for="trick in results" :key="trick.trickID"><TrickThumb :trick="trick" /></li>
      </ul>
    </div>
  </dialog>
</template>

<style scoped>
.search {
  width: 100%;
  max-width: none;
  height: 100%;
  max-height: none;
  margin: 0;
  padding: 0;
  border: 0;
  background: var(--bg);
  color: var(--text);
  overflow-y: auto;
  overscroll-behavior: contain;
}
.bar {
  position: sticky;
  top: 0;
  z-index: 1;
  background: var(--bg);
  border-bottom: 1px solid var(--line);
  padding-top: env(safe-area-inset-top);
}
.inner, .body {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-4);
}
.inner {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  height: 56px;
}
.field {
  flex: 1;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-width: 0;
  height: 44px;
  padding: 0 var(--space-3);
  border: 1px solid var(--line);
  border-radius: var(--radius-m);
  background: var(--surface);
  color: var(--text-muted);
}
.field:focus-within { border-color: var(--focus); outline: 2px solid var(--focus); outline-offset: -1px; }
.lead { flex: none; }
input {
  flex: 1;
  min-width: 0;
  height: 100%;
  border: 0;
  background: transparent;
  color: var(--text);
  font: inherit;
  font-size: var(--t-md);
}
input:focus { outline: none; }
input::placeholder { color: var(--text-muted); }
.close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  flex: none;
  padding: 0;
  border: 0;
  border-radius: var(--radius-m);
  background: transparent;
  color: var(--text);
  cursor: pointer;
}
@media (hover: hover) { .close:hover { background: var(--surface-2); } }
.close:focus-visible { outline: 2px solid var(--focus); outline-offset: 2px; }
.body { padding-top: var(--space-4); padding-bottom: calc(var(--space-6) + env(safe-area-inset-bottom)); }
.count { margin: 0 0 var(--space-4); color: var(--text-muted); font-size: var(--t-sm); }
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: var(--space-5) var(--space-3);
  margin: 0;
  padding: 0;
  list-style: none;
}
/* Safari draws its own clear button next to ours */
input::-webkit-search-cancel-button { display: none; }
</style>
