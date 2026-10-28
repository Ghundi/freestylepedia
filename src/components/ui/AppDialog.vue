<script setup lang="ts">
import { nextTick, ref, useId, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{ open: boolean; title: string }>()
const emit = defineEmits<{ 'update:open': [value: boolean] }>()

const { t } = useI18n()
const titleId = useId()
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
// A press that starts inside (a drag, a text selection) and ends outside does not close it.
let pressedOutside = false
function onPointerDown(e: PointerEvent) {
  pressedOutside = e.target === dialog.value
}
function onClick(e: MouseEvent) {
  if (e.target === dialog.value && pressedOutside) emit('update:open', false)
  pressedOutside = false
}
</script>

<template>
  <dialog ref="dialog" class="dlg" :aria-labelledby="titleId" @close="onClose" @pointerdown="onPointerDown" @click="onClick">
    <div class="panel">
      <header class="bar">
        <h2 :id="titleId">{{ title }}</h2>
        <button type="button" class="close" @click="emit('update:open', false)">{{ t('close') }}</button>
      </header>
      <slot />
    </div>
  </dialog>
</template>

<style scoped>
.dlg {
  /* centred explicitly: keeps the dialog centred whatever a global reset does to the UA margin: auto */
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
/* the page behind an open dialog stays put */
:global(html:has(dialog[open])) { overflow: hidden; }
.dlg { overscroll-behavior: contain; }
.panel { padding: 0 var(--space-5) var(--space-5); }
/* the title and Close stay in view while a long dialog scrolls */
.bar {
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-5) 0 var(--space-3);
  margin-bottom: var(--space-1);
  background: var(--surface);
}
h2 { margin: 0; font-size: var(--t-lg); font-weight: 600; }
.close {
  min-height: 44px;
  min-width: 44px;
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
