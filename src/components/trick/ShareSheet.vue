<script setup lang="ts">
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { mdiCheck, mdiContentCopy, mdiFacebook, mdiShareVariant, mdiWhatsapp } from '@mdi/js'
import AppDialog from '@/components/ui/AppDialog.vue'
import AppButton from '@/components/ui/AppButton.vue'
import { useCopy } from '@/scripts/useCopy'

// X's logo (Simple Icons, CC0): @mdi/js only has the old Twitter bird.
const X_LOGO = 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z'

const props = defineProps<{ open: boolean; url: string; name: string }>()
const emit = defineEmits<{ 'update:open': [value: boolean] }>()

const { t } = useI18n()
const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function'
const { copied, failed, copy, reset } = useCopy(() => props.url)

watch(() => props.open, reset)

const links = computed(() => [
  { label: 'WhatsApp', icon: mdiWhatsapp, href: `https://wa.me/?text=${encodeURIComponent(props.name + ' ' + props.url)}` },
  { label: 'Facebook', icon: mdiFacebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(props.url)}` },
  { label: 'X', icon: X_LOGO, href: `https://x.com/intent/post?url=${encodeURIComponent(props.url)}` },
])

async function shareNative() {
  try {
    await navigator.share({ title: props.name, url: props.url })
    emit('update:open', false)
  } catch {
    // dismissed by the user, or refused by the browser: the sheet stays open with the other options
  }
}
</script>

<template>
  <AppDialog :open="open" :title="t('share.title')" @update:open="emit('update:open', $event)">
    <ul class="list">
      <li v-if="canShare">
        <AppButton class="row" variant="primary" :icon="mdiShareVariant" @click="shareNative">{{ t('share.native') }}</AppButton>
      </li>
      <li>
        <AppButton class="row" :icon="copied ? mdiCheck : mdiContentCopy" @click="copy">
          <span aria-live="polite">{{ copied ? t('share.copied') : t('share.copy') }}</span>
        </AppButton>
        <p v-if="failed" class="fail" role="status">{{ t('share.copyFailed') }}</p>
      </li>
      <li v-for="l in links" :key="l.label">
        <AppButton class="row" :icon="l.icon" :href="l.href" target="_blank" rel="noopener">{{ l.label }}</AppButton>
      </li>
    </ul>
  </AppDialog>
</template>

<style scoped>
.list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}
.fail { margin: var(--space-2) 0 0; color: var(--text-muted); font-size: var(--t-sm); }
.list .row { width: 100%; min-height: 48px; justify-content: flex-start; }
</style>
