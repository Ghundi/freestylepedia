<script setup lang="ts">
import { mdiChevronDown } from '@mdi/js'
import { useI18n } from 'vue-i18n'
import AppIcon from '@/components/ui/AppIcon.vue'
import { useFAQ } from '@/scripts/store'

const { t } = useI18n()
const faq = useFAQ()
</script>

<template>
  <div class="faq">
    <h1>FAQ</h1>
    <details v-for="entry in faq.val" :key="entry">
      <summary>
        <span>{{ t('faq.' + entry + '_question') }}</span>
        <AppIcon class="chev" :path="mdiChevronDown" />
      </summary>
      <p>{{ t('faq.' + entry + '_answer') }}</p>
    </details>
  </div>
</template>

<style scoped>
.faq { max-width: 44rem; margin: 0 auto; padding-top: var(--space-5); }
h1 { margin: 0 0 var(--space-5); font-size: var(--t-xl); }
details { border-bottom: 1px solid var(--line); }
summary {
  display: flex; align-items: center; justify-content: space-between; gap: var(--space-3);
  min-height: 56px; padding: var(--space-3) 0; font-weight: 600; cursor: pointer; list-style: none;
}
summary::-webkit-details-marker { display: none; }
summary:focus-visible { outline: 2px solid var(--focus); outline-offset: 2px; border-radius: var(--radius-s); }
.chev { flex: none; color: var(--text-muted); transition: transform var(--dur); }
details[open] .chev { transform: rotate(180deg); }
details p { margin: 0 0 var(--space-4); max-width: 62ch; line-height: 1.6; color: var(--text-muted); }
@media (prefers-reduced-motion: reduce) { .chev { transition: none; } }
</style>
