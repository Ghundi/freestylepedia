<script setup>
import LanguageSelector from './languageSelector.vue';
import ThemeSwitcher from './themeSwitcher.vue';
import { pwaInstallPromptEvent } from '@/scripts/pwaInstall.ts'
</script>

<template>
  <v-menu offset-y>
    <template #activator="{ props }">
      <v-btn 
        v-bind="props" 
        icon 
        variant="tonal"
        aria-label="Menu"
      >
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </template>

    <v-list class="text-center">
      <v-list-item>
        <languageSelector />
      </v-list-item>
      
      <v-list-item>
        <themeSwitcher />
      </v-list-item>
      
      <v-list-item v-if="pwaInstallPromptEvent">
        <v-btn
          variant="plain"
          @click="pwaInstallPromptEvent.prompt()"
          class="text-none"
          :aria-label="$t('navBar.installApp')"
        >
          {{ $t('navBar.installApp') }}
        </v-btn>
      </v-list-item>
    </v-list>
  </v-menu>
</template>