<script setup lang="ts">
import { computed } from 'vue'
import { mdiGithub, mdiInstagram, mdiYoutube } from '@mdi/js'
import { useI18n } from 'vue-i18n'
import AppIcon from '@/components/ui/AppIcon.vue'
import { useSupporters } from '@/scripts/store'
import { useThemeMode } from '@/scripts/theme'
import blackbirdLight from '@/assets/blackbirdIcon.png'
import blackbirdDark from '@/assets/blackbirdIconInverted.png'
import misgLight from '@/assets/MISG-white-Icon.png'
import misgDark from '@/assets/MISG-Icon.png'

const { t } = useI18n()
const supporters = useSupporters().images
const { resolved } = useThemeMode()
const dark = computed(() => resolved.value === 'dark')

const social = [
  { href: 'https://www.youtube.com/@BlackbirdIceFreestyle', icon: mdiYoutube, label: 'YouTube' },
  { href: 'https://www.instagram.com/blackbird_ice_freestyle', icon: mdiInstagram, label: 'Instagram' },
  { href: 'https://github.com/Ghundi/freestylepedia', icon: mdiGithub, label: 'GitHub' },
]
</script>

<template>
  <footer class="footer">
    <div class="inner">
      <ul class="row">
        <li v-for="s in social" :key="s.label">
          <a class="social" :href="s.href" target="_blank" rel="noopener" :aria-label="s.label">
            <AppIcon :path="s.icon" />
          </a>
        </li>
      </ul>
      <p class="muted">{{ t('footer.byBlackbirdAndMISG') }}</p>
      <ul class="row">
        <li>
          <a href="https://www.youtube.com/@BlackbirdIceFreestyle" target="_blank" rel="noopener">
            <img class="logo" :src="dark ? blackbirdLight : blackbirdDark" alt="Blackbird Logo" width="44" height="44">
          </a>
        </li>
        <li>
          <a href="https://www.instagram.com/mainziceskategroup/" target="_blank" rel="noopener">
            <img class="logo" :src="dark ? misgLight : misgDark" alt="MISG Logo" width="44" height="44">
          </a>
        </li>
      </ul>
      <p class="muted">{{ t('footer.supportedBy') }}</p>
      <ul class="row">
        <li v-for="(team, i) in supporters" :key="i">
          <a :href="team.link" target="_blank" rel="noopener">
            <img class="logo logo--supporter" :src="team.imgSrc" :alt="team.name" width="44" height="44">
          </a>
        </li>
      </ul>
      <p class="muted">{{ new Date().getFullYear() }} — Freestylepedia</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  margin-top: var(--space-6);
  border-top: 1px solid var(--line);
  /* keep the footer clear of the fixed tab bar on mobile */
  padding: var(--space-6) var(--space-4) calc(var(--space-6) + var(--tabbar-h) + env(safe-area-inset-bottom));
}
.inner { display: flex; flex-direction: column; align-items: center; gap: var(--space-3); max-width: 1200px; margin: 0 auto; }
.row { display: flex; flex-wrap: wrap; justify-content: center; gap: var(--space-2); margin: 0; padding: 0; list-style: none; }
.social {
  display: inline-flex; align-items: center; justify-content: center;
  width: 44px; height: 44px; border-radius: var(--radius-m); color: var(--text);
}
@media (hover: hover) { .social:hover { background: var(--surface-2); } }
.row a { display: inline-flex; }
.logo { display: block; width: 44px; height: 44px; object-fit: contain; }
/* the ring keeps black logos apart from the dark page */
.logo--supporter { border-radius: 50%; background: #000; box-shadow: 0 0 0 1px var(--line); }
.muted { margin: 0; color: var(--text-muted); font-size: var(--t-sm); text-align: center; }
@media (min-width: 900px) {
  .footer { padding-bottom: var(--space-6); }
}
</style>
