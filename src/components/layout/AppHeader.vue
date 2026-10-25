<script setup lang="ts">
import { mdiArrowLeft, mdiCogOutline, mdiMagnify } from '@mdi/js'
import { useI18n } from 'vue-i18n'
import AppIcon from '@/components/ui/AppIcon.vue'
import IconButton from '@/components/ui/IconButton.vue'
import { useSearchOpen } from '@/scripts/ui'

defineProps<{ title?: string; back?: boolean }>()
const emit = defineEmits<{ back: [] }>()

const { t, locale } = useI18n()
const searchOpen = useSearchOpen()
</script>

<template>
  <header class="header">
    <div class="inner">
      <template v-if="back">
        <IconButton :label="t('back')" @click="emit('back')">
          <AppIcon :path="mdiArrowLeft" />
        </IconButton>
        <h1 v-if="title" class="title">{{ title }}</h1>
        <div class="actions"><slot name="actions" /></div>
      </template>
      <template v-else>
        <router-link class="brand" :to="{ name: 'Home', params: { lang: locale } }">Freestylepedia</router-link>
        <div class="actions">
          <slot name="actions" />
          <IconButton :label="t('search.open')" data-search-trigger @click="searchOpen = true">
            <AppIcon :path="mdiMagnify" />
          </IconButton>
          <IconButton :label="t('settings.title')" :to="{ name: 'Settings', params: { lang: locale } }">
            <AppIcon :path="mdiCogOutline" />
          </IconButton>
        </div>
      </template>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 10;
  height: var(--header-h);
  background: var(--bg);
  border-bottom: 1px solid var(--line);
}
.inner {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-4);
}
.brand, .title {
  flex: 1;
  min-width: 0;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--text);
  font-size: var(--t-lg);
  font-weight: 700;
  text-decoration: none;
}
.actions { display: flex; align-items: center; gap: var(--space-1); margin-left: auto; }
@media (min-width: 900px) {
  .brand { flex: 0 0 auto; margin-right: auto; }
}
</style>
