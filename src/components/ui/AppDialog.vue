<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{ open: boolean; title: string }>()
const emit = defineEmits<{ 'update:open': [value: boolean] }>()

const { t } = useI18n()
const dialog = ref<HTMLDialogElement>()
let trigger: HTMLElement | null = null

watch(() => props.open, async (open) => {
  await nextTick()
  const el = dialog.value
  if (!el) return
  if (open && !el.open) {
    trigger = document.activeElement as HTMLElement | null
    el.showModal()
  } else if (!open && el.open) {
    el.close()
  }
}, { immediate: true, flush: 'post' })

// Fires for Escape, the close button and programmatic close alike.
function onClose() {
  emit('update:open', false)
  trigger?.focus()
  trigger = null
}
// The dialog box itself is only the click target outside its inner panel (the backdrop).
function onClick(e: MouseEvent) {
  if (e.target === dialog.value) emit('update:open', false)
}
</script>

<template>
  <dialog ref="dialog" class="dlg" :aria-label="title" @close="onClose" @click="onClick">
    <div class="panel">
      <header class="bar">
        <h2>{{ title }}</h2>
        <button type="button" class="close" @click="emit('update:open', false)">{{ t('close') }}</button>
      </header>
      <slot />
    </div>
  </dialog>
</template>

<style scoped>
.dlg {
  /* centred explicitly: a global reset (Vuetify's, until Task 10) zeroes the UA margin: auto */
  margin: auto;
  width: calc(100% - 2 * var(--space-4));
  max-width: 32rem;
  padding: 0;
  border: 1px solid var(--line);
  border-radius: var(--radius-l);
  background: var(--surface);
  color: var(--text);
}
.dlg::backdrop { background: rgb(0 0 0 / 0.6); }
.panel { padding: var(--space-5); }
.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
}
h2 { margin: 0; font-size: var(--t-lg); font-weight: 600; }
.close {
  min-height: 44px;
  padding: 0 var(--space-4);
  border: 1px solid var(--line);
  border-radius: var(--radius-s);
  background: transparent;
  color: var(--text);
  font: inherit;
  font-size: var(--t-sm);
  cursor: pointer;
}
.close:focus-visible { outline: 2px solid var(--focus); outline-offset: 2px; }
</style>
