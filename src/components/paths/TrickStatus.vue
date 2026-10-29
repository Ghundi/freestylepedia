<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { mdiBookmark, mdiCheck } from '@mdi/js'
import AppIcon from '../ui/AppIcon.vue'
import { useMasteredStore, useTodoStore } from '../../scripts/store'
import type { Trick } from '../../scripts/trickStore'

defineProps<{ trick: Trick }>()

const { t } = useI18n()
const mastered = useMasteredStore()
const todo = useTodoStore()
</script>

<template>
  <span v-if="mastered.isMastered(trick)" class="st st--done">
    <AppIcon :path="mdiCheck" :size="16" />
    <span class="sr-only">{{ t('marked.mastered') }}</span>
  </span>
  <span v-else-if="todo.isOnTodo(trick)" class="st st--todo">
    <AppIcon :path="mdiBookmark" :size="14" />
    <span class="sr-only">{{ t('marked.todo') }}</span>
  </span>
  <span v-else class="st" aria-hidden="true"></span>
</template>

<style scoped>
.st { display: grid; place-items: center; width: 24px; height: 24px; border-radius: 50%; flex: none; }
.st--done { background: var(--accent); color: var(--accent-text); }
.st--todo { border: 2px solid var(--accent); color: var(--accent); }
</style>
