<script setup lang="ts">
import { computed } from 'vue'
import { mdiInstagram, mdiYoutube } from '@mdi/js'
import { useI18n } from 'vue-i18n'
import AppIcon from '@/components/ui/AppIcon.vue'
import { useThemeMode } from '@/scripts/theme'
import blackbirdLight from '@/assets/blackbirdIcon.png'
import blackbirdDark from '@/assets/blackbirdIconInverted.png'
import misgLight from '@/assets/MISG-white-Icon.png'
import misgDark from '@/assets/MISG-Icon.png'

const { t } = useI18n()
const { resolved } = useThemeMode()
const dark = computed(() => resolved.value === 'dark')

const groups = computed(() => [
  {
    name: 'MISG',
    logo: dark.value ? misgLight : misgDark,
    alt: 'MISG Logo',
    description: t('aboutUs.MisgDescription'),
    links: [{ href: 'https://www.instagram.com/mainziceskategroup/', icon: mdiInstagram, label: 'Instagram' }],
  },
  {
    name: 'Blackbird Ice Freestyle',
    logo: dark.value ? blackbirdLight : blackbirdDark,
    alt: 'Blackbird Logo',
    description: t('aboutUs.BlackbirdDescription'),
    links: [
      { href: 'https://www.instagram.com/blackbird_ice_freestyle', icon: mdiInstagram, label: 'Instagram' },
      { href: 'https://www.youtube.com/@BlackbirdIceFreestyle', icon: mdiYoutube, label: 'YouTube' },
    ],
  },
])
</script>

<template>
  <div class="about">
    <h1>{{ t('aboutUs.aboutUs') }}</h1>

    <section>
      <h2>{{ t('aboutUs.story_title') }}</h2>
      <p class="story">{{ t('aboutUs.story') }}</p>
    </section>

    <div class="groups">
      <section v-for="g in groups" :key="g.name" class="group">
        <div class="head">
          <img :src="g.logo" :alt="g.alt" width="72" height="72">
          <h2>{{ g.name }}</h2>
        </div>
        <p>{{ g.description }}</p>
        <div class="find">
          <span>{{ t('aboutUs.findUs') }}</span>
          <a
            v-for="l in g.links"
            :key="l.label"
            class="icon-link"
            :href="l.href"
            target="_blank"
            rel="noopener"
            :aria-label="`${g.name} – ${l.label}`"
          >
            <AppIcon :path="l.icon" />
          </a>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.about { max-width: 48rem; margin: 0 auto; padding-top: var(--space-5); }
h1 { margin: 0 0 var(--space-5); font-size: var(--t-xl); }
h2 { margin: 0; font-size: var(--t-lg); font-weight: 600; }
.story { margin: var(--space-3) 0 0; max-width: 62ch; line-height: 1.6; }
.groups { display: grid; gap: var(--space-4); margin-top: var(--space-6); }
@media (min-width: 720px) { .groups { grid-template-columns: 1fr 1fr; } }
.group { padding: var(--space-4); border: 1px solid var(--line); border-radius: var(--radius-l); background: var(--surface); }
.head { display: flex; align-items: center; gap: var(--space-4); }
.head img { flex: none; width: 72px; height: 72px; object-fit: contain; }
.group p { margin: var(--space-3) 0 0; line-height: 1.5; }
.find { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-2); margin-top: var(--space-4); color: var(--text-muted); }
.icon-link {
  display: inline-flex; align-items: center; justify-content: center;
  width: 44px; height: 44px; border-radius: var(--radius-m); color: var(--text);
}
@media (hover: hover) { .icon-link:hover { background: var(--surface-2); } }
.icon-link:focus-visible { outline: 2px solid var(--focus); outline-offset: 2px; }
</style>
