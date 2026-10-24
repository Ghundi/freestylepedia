<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import config from '@/data/config.json'
import AppButton from '@/components/ui/AppButton.vue'
import AppDialog from '@/components/ui/AppDialog.vue'
import SegmentedControl from '@/components/ui/SegmentedControl.vue'
import { pwaInstallPromptEvent } from '@/scripts/pwaInstall'
import { useThemeMode, type ThemeMode } from '@/scripts/theme'

const { t, locale } = useI18n()
const router = useRouter()
const route = useRoute()
const { mode, setMode } = useThemeMode()

const names: Record<string, string> = {
  de: 'Deutsch', en: 'English', fr: 'Français', jp: '日本語', pl: 'Polski',
}
const languages = config.locales.availableLocales.map(code => ({ code, name: names[code] ?? code }))

function updateLang(code: string) {
  if (locale.value === code) return
  locale.value = code
  router.replace({ name: route.name as string, params: { ...route.params, lang: code } })
}

const themeOptions = computed(() => [
  { value: 'system', label: t('settings.themeSystem') },
  { value: 'dark', label: t('settings.themeDark') },
  { value: 'light', label: t('settings.themeLight') },
])

const isIOS = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase())
const standalone = 'standalone' in window.navigator && !!(window.navigator as { standalone?: boolean }).standalone
const iosHint = ref(false)
</script>

<template>
  <div class="settings">
    <h1>{{ t('settings.title') }}</h1>

    <section>
      <h2>{{ t('settings.language') }}</h2>
      <ul class="langs">
        <li v-for="l in languages" :key="l.code">
          <button
            type="button"
            class="lang"
            :aria-current="l.code === locale ? 'true' : undefined"
            @click="updateLang(l.code)"
          >{{ l.name }}</button>
        </li>
      </ul>
    </section>

    <section>
      <h2>{{ t('settings.theme') }}</h2>
      <SegmentedControl
        :model-value="mode"
        :options="themeOptions"
        :label="t('settings.theme')"
        @update:model-value="setMode($event as ThemeMode)"
      />
    </section>

    <section v-if="pwaInstallPromptEvent || (isIOS && !standalone)">
      <AppButton v-if="pwaInstallPromptEvent" @click="pwaInstallPromptEvent.prompt()">
        {{ t('navBar.installApp') }}
      </AppButton>
      <AppButton v-else @click="iosHint = true">{{ t('navBar.installApp') }}</AppButton>
    </section>

    <section class="links">
      <AppButton variant="ghost" :to="{ name: 'AboutUs', params: { lang: locale } }">{{ t('aboutUs.aboutUs') }}</AppButton>
      <AppButton variant="ghost" :to="{ name: 'Help', params: { lang: locale } }">{{ t('footer.help') }}</AppButton>
    </section>

    <AppDialog v-model:open="iosHint" :title="t('navBar.installApp')">
      <p>{{ t('navBar.installAppHintIOS') }}</p>
    </AppDialog>
  </div>
</template>

<style scoped>
.settings { max-width: 40rem; margin: 0 auto; padding-top: var(--space-5); }
h1 { margin: 0 0 var(--space-5); font-size: var(--t-xl); }
h2 { margin: 0 0 var(--space-3); font-size: var(--t-md); color: var(--text-muted); font-weight: 600; }
section { margin-bottom: var(--space-6); }
.langs { display: flex; flex-direction: column; gap: var(--space-1); margin: 0; padding: 0; list-style: none; }
.lang {
  width: 100%; min-height: 44px; padding: 0 var(--space-4); text-align: left;
  border: 1px solid var(--line); border-radius: var(--radius-m);
  background: var(--surface); color: var(--text); font: inherit; cursor: pointer;
}
.lang[aria-current='true'] { border-color: var(--accent); color: var(--accent); font-weight: 600; }
.links { display: flex; flex-wrap: wrap; gap: var(--space-2); }
</style>
