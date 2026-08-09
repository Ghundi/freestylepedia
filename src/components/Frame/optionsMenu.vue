<script setup lang="ts">
import LanguageSelector from './languageSelector.vue';
import ThemeSwitcher from './themeSwitcher.vue';
import { pwaInstallPromptEvent } from '@/scripts/pwaInstall'

function isIOS() {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test( userAgent );
}

function isInStandalone() {
  return ('standalone' in window.navigator) && (window.navigator.standalone);
}

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
      <!-- android install button -->
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
      <!-- IOS install button (only hint possible at the moment) -->
      <v-list-item v-if="isIOS() && !isInStandalone()">
        <v-dialog max-width="500">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn
              variant="plain"
              v-bind="activatorProps"
              class="text-none"
              :aria-label="$t('navBar.installApp')"
            >
              {{ $t('navBar.installApp') }}
            </v-btn>
        </template>

        <template v-slot:default="{ isActive }">
            <v-card>
                <v-card-text>
                    {{ $t('navBar.installAppHintIOS') }}
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                        <v-btn
                            text="Close"
                            @click="isActive.value = false"
                        ></v-btn>
                </v-card-actions>
            </v-card>
        </template>
        </v-dialog>
      </v-list-item>
    </v-list>
  </v-menu>
</template>