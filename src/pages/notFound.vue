<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import AppButton from '@/components/ui/AppButton.vue'

const { t } = useI18n()
const route = useRoute()
</script>

<template>
  <div class="not-found">
    <p class="code" aria-hidden="true">404</p>
    <h1>{{ t('error.pageNotFound') }}</h1>
    <p class="hint">{{ t('error.pageNotFoundSuggestion') }}</p>
    <AppButton variant="primary" :to="{ name: 'Home', params: { lang: route.params.lang } }">{{ t('error.toHome') }}</AppButton>
  </div>
</template>

<style scoped>
.not-found { display: flex; flex-direction: column; align-items: flex-start; gap: var(--space-3); max-width: 40rem; margin: 0 auto; padding-top: var(--space-6); }
.code { margin: 0; font-size: 3.5rem; font-weight: 700; line-height: 1; color: var(--text-muted); }
h1 { margin: 0; font-size: var(--t-xl); }
.hint { margin: 0 0 var(--space-3); color: var(--text-muted); }
</style>
