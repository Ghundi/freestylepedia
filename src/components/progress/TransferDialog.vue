<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { mdiCheck, mdiContentCopy, mdiSwapHorizontal } from '@mdi/js'
import AppButton from '@/components/ui/AppButton.vue'
import AppDialog from '@/components/ui/AppDialog.vue'
import Qrcode from '@/components/qrcode.vue'
import { useMasteredStore, useTodoStore } from '@/scripts/store'

const { t, locale } = useI18n()
const mastered = useMasteredStore()
const todo = useTodoStore()

const open = ref(false)
const url = ref('')
const copied = ref(false)
let copiedTimer: ReturnType<typeof setTimeout> | undefined
onBeforeUnmount(() => clearTimeout(copiedTimer))

async function copy() {
  try {
    await navigator.clipboard.writeText(url.value)
  } catch {
    return // no clipboard access (insecure context, denied permission): the link stays selectable
  }
  copied.value = true
  clearTimeout(copiedTimer)
  copiedTimer = setTimeout(() => { copied.value = false }, 2500)
}

async function show() {
  // Built on click: the lists change while the page is open.
  url.value = `https://freestylepedia.org/${locale.value}?todo=${todo.getHash()}&mastered=${mastered.getHash()}`
  copied.value = false
  open.value = true
  await copy()
}
</script>

<template>
  <AppButton :icon="mdiSwapHorizontal" @click="show">{{ t('myProgress.transferProgress') }}</AppButton>
  <AppDialog v-model:open="open" :title="t('myProgress.transferProgress')">
    <div class="body">
      <p class="info">{{ t('myProgress.transferInfo') }}</p>
      <div class="qr"><Qrcode v-if="url" :text="url" :size="200" /></div>
      <p class="link">{{ url }}</p>
      <AppButton :icon="copied ? mdiCheck : mdiContentCopy" @click="copy">
        <span aria-live="polite">{{ copied ? t('share.copied') : t('share.copy') }}</span>
      </AppButton>
    </div>
  </AppDialog>
</template>

<style scoped>
.body { display: flex; flex-direction: column; align-items: center; gap: var(--space-4); }
.info { margin: 0; align-self: stretch; color: var(--text-muted); }
/* Black on white stays scannable in the dark theme. */
.qr { padding: var(--space-3); background: #fff; border-radius: var(--radius-m); line-height: 0; }
.link {
  align-self: stretch;
  margin: 0;
  padding: var(--space-3);
  border-radius: var(--radius-s);
  background: var(--surface-2);
  font-size: var(--t-sm);
  overflow-wrap: anywhere;
  user-select: all;
}
</style>
