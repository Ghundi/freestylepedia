<script setup lang="ts">
  import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
  import { useI18n } from "vue-i18n";
  import { useRoute, useRouter } from "vue-router";
  import { mdiBookmark, mdiBookmarkOutline, mdiCheckCircle, mdiCheckCircleOutline, mdiShareVariant, mdiArrowLeft } from "@mdi/js";
  import AppHeader from "@/components/layout/AppHeader.vue";
  import AppButton from "@/components/ui/AppButton.vue";
  import AppIcon from "@/components/ui/AppIcon.vue";
  import IconButton from "@/components/ui/IconButton.vue";
  import TrickRail from "@/components/ui/TrickRail.vue";
  import YtThumb from "@/components/ui/YtThumb.vue";
  import VideoPlayer from "@/components/trick/VideoPlayer.vue";
  import ShareSheet from "@/components/trick/ShareSheet.vue";
  import { strToUrl, UrlToStr } from "@/scripts/helpers";
  import { embedUrl, fallbackThumbnailUrl } from "@/scripts/trickMedia";
  import { useCategoryStore, useMasteredStore, useTodoStore } from "@/scripts/store";
  import { useTrickStore, type Trick } from "@/scripts/trickStore";

  const route = useRoute()
  const router = useRouter()
  const { t, locale } = useI18n()
  const trickStore = useTrickStore()
  const todoStore = useTodoStore()
  const masteredStore = useMasteredStore()
  const categories = useCategoryStore()

  // The router-view is keyed by fullPath, so each trick gets its own instance of this page.
  const requestedName = UrlToStr(String(route.params.trickname ?? ''))
  const trick = trickStore.getTrickByTitle(requestedName)
  // An alias or a different case ("forward donut", "Vorwärts Kreisel") leads to the trick's own URL.
  const match = trick ? null : trickStore.findTrickByAnyTitle(requestedName)
  if (match) {
    router.replace({ name: 'Trick', params: { lang: route.params.lang, trickname: strToUrl(match.title[0]) }, hash: route.hash })
  }
  const selected = ref(trick?.videoID[0] ?? '')

  const localTitles = computed(() => trick ? trickStore.getLocalTrickTitles(trick, locale.value) : [])
  const aliases = computed(() => localTitles.value.slice(1))
  const isOnTodo = computed(() => !!trick && todoStore.isOnTodo(trick))
  const isMastered = computed(() => !!trick && masteredStore.isMastered(trick))

  const byIds = (ids: string[]) => ids.map(id => trickStore.getTrickByID(id)).filter((x): x is Trick => !!x)
  const before = computed(() => trick ? byIds(trick.requirements) : [])
  // a trick already under "learn first" is not repeated under related tricks
  const related = computed(() => trick ? byIds(trick.connections.filter(id => !trick.requirements.includes(id))) : [])

  const shareOpen = ref(false)
  // href carries the folder the site is served from, if any
  const shareUrl = computed(() => window.location.origin + router.resolve(route.path).href)

  const jsonLd = computed(() => trick && JSON.stringify({
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": trick.title[0],
    "description": "Learn how to do " + trick.title[0],
    "thumbnailUrl": fallbackThumbnailUrl(trick.videoID[0]),
    "embedUrl": embedUrl(trick.videoID[0], { autoplay: false }),
    "uploadDate": trick.releaseDate.toISOString().slice(0, 10),
  }))

  let leaving = false
  function goBack() {
    // a second tap while the first is still navigating would go back twice
    if (leaving) return
    leaving = true
    // vue-router records the previous in-app entry; without one, back would leave the site
    if (window.history.state?.back) {
      router.back();
    } else {
      router.replace({ name: "Home", params: { lang: route.params.lang } });
    }
  }

  // Escape goes back, unless it is closing a dialog (the share sheet) first.
  function onKeydown(e: KeyboardEvent) {
    // a held key repeats: going back once is enough
    if (e.key !== 'Escape' || e.repeat || e.defaultPrevented || document.querySelector('dialog[open]')) return
    goBack()
  }

  const heading = ref<HTMLElement>()
  onMounted(async () => {
    window.addEventListener('keydown', onKeydown)
    // arriving from a rail lower on the previous trick's page must not land mid-page
    window.scrollTo(0, 0)
    document.title = (trick ? trick.title[0] : requestedName + ' ' + t('error.trickNotFound')) + ' · Freestylepedia'
    await nextTick()
    heading.value?.focus({ preventScroll: true })
  })
  onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div class="trick">
    <!-- below 900px: own header (the tab bar is hidden); from 900px: the global header and tab row, and this toolbar -->
    <AppHeader class="head" back @back="goBack">
      <template v-if="trick" #actions>
        <IconButton :label="t('share.title')" @click="shareOpen = true">
          <AppIcon :path="mdiShareVariant" />
        </IconButton>
      </template>
    </AppHeader>
    <div class="toolbar">
      <IconButton :label="t('back')" @click="goBack"><AppIcon :path="mdiArrowLeft" /></IconButton>
      <IconButton v-if="trick" :label="t('share.title')" @click="shareOpen = true">
        <AppIcon :path="mdiShareVariant" />
      </IconButton>
    </div>

    <template v-if="trick">
      <component :is="'script'" type="application/ld+json" v-text="jsonLd" />

      <VideoPlayer class="video" :video-id="selected" :title="trick.title[0]" />

      <div class="col">
        <section class="info">
          <h1 ref="heading" class="name" tabindex="-1">{{ trick.title[0] }}</h1>
          <p v-if="aliases.length" class="aliases">{{ aliases.join(' · ') }}</p>
          <p class="meta">
            <span class="pill">
              <span class="dot" :style="{ background: categories.getDotColor(trick.category) }" />
              {{ t('categories.' + trick.category) }}
            </span>
            <span>{{ t('level', { n: trick.difficulty }) }}</span>
          </p>
        </section>

        <div class="marks">
          <AppButton
            class="mark"
            :pressed="isOnTodo"
            :icon="isOnTodo ? mdiBookmark : mdiBookmarkOutline"
            @click="todoStore.toggle(trick)"
          >{{ t('trick.todo') }}</AppButton>
          <AppButton
            class="mark"
            :pressed="isMastered"
            :icon="isMastered ? mdiCheckCircle : mdiCheckCircleOutline"
            @click="masteredStore.toggle(trick)"
          >{{ t('trick.mastered') }}</AppButton>
        </div>

        <section v-if="trick.videoID.length > 1" class="others">
          <h2>{{ t('video.others') }}</h2>
          <ul class="alts">
            <li v-for="(id, i) in trick.videoID" :key="id">
              <button
                type="button"
                class="alt"
                :aria-current="id === selected ? 'true' : undefined"
                @click="selected = id"
              >
                <YtThumb :video-id="id" :alt="`${trick.title[0]} ${i + 1}/${trick.videoID.length}`" />
              </button>
            </li>
          </ul>
        </section>

        <TrickRail v-if="before.length" :title="t('trick.before')" :count="before.length" :tricks="before" />
        <TrickRail v-if="related.length" :title="t('trick.related')" :count="related.length" :tricks="related" />
      </div>

      <ShareSheet v-model:open="shareOpen" :url="shareUrl" :name="trick.title[0]" />
    </template>

    <section v-else class="col missing">
      <h1 ref="heading" class="name" tabindex="-1">{{ requestedName + ' ' + t('error.trickNotFound') }}</h1>
      <p>{{ t('error.trickNotFoundSuggestion') }}</p>
      <AppButton variant="primary" :to="{ name: 'Home', params: { lang: locale } }">{{ t('error.toHome') }}</AppButton>
    </section>
  </div>
</template>

<style scoped>
/* The header spans the window, past the page gutter, like the global one. App.vue zeroes --header-h
   on own-header routes (no global header there), so this one sets its own height. */
.trick .head { height: 56px; margin-inline: calc(50% - 50vw); }
.toolbar { display: none; }

/* mobile: edge to edge, straight under the header */
.trick .video { width: auto; margin-inline: calc(-1 * var(--space-4)); }
/* phone in landscape: the video fits the height left under the header, centred */
@media (max-width: 899.98px) and (max-height: 560px) {
  .trick .video { width: calc((100dvh - 56px) * 16 / 9); max-width: 100%; margin-inline: auto; }
}

.col {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  max-width: 960px;
  margin: 0 auto;
  padding-top: var(--space-4);
}
.info { display: flex; flex-direction: column; gap: var(--space-2); }
.name {
  margin: 0;
  font-size: var(--t-xl);
  font-weight: 700;
  line-height: 1.15;
  overflow-wrap: anywhere;
}
.name:focus { outline: none; }
.aliases { margin: 0; color: var(--text-muted); }
.meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2) var(--space-3);
  margin: 0;
  color: var(--text-muted);
  font-size: var(--t-sm);
}
.pill {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-1) var(--space-3);
  border-radius: 999px;
  background: var(--surface-2);
  color: var(--text);
  font-weight: 500;
}
.dot { width: 8px; height: 8px; border-radius: 50%; flex: none; }

.marks { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); }
.marks .mark { min-height: 48px; padding-inline: var(--space-3); white-space: nowrap; }
.marks .mark[aria-pressed='true'] {
  background: var(--accent);
  border-color: var(--accent);
  color: var(--accent-text);
}

.others h2 { margin: 0 0 var(--space-3); font-size: var(--t-lg); font-weight: 600; }
.alts {
  display: flex;
  gap: var(--space-3);
  /* room for the selection and focus rings, which overflow-x would clip */
  margin: calc(-1 * var(--space-2));
  padding: var(--space-2);
  list-style: none;
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--line) transparent;
}
.alts li { flex: 0 0 128px; }
.alt {
  display: block;
  width: 100%;
  padding: 0;
  border: 0;
  border-radius: var(--radius-m);
  background: none;
  cursor: pointer;
}
.alt[aria-current='true'] { outline: 2px solid var(--accent); outline-offset: 2px; }
.alt:focus-visible { outline: 2px solid var(--text); outline-offset: 2px; }

.missing { align-items: flex-start; padding-block: var(--space-6); }
.missing p { margin: 0; max-width: 36rem; color: var(--text-muted); }

@media (min-width: 900px) {
  .trick .head { display: none; }
  /* back and share sit on one row directly above the video, aligned with its edges */
  .toolbar {
    display: flex;
    justify-content: space-between;
    max-width: 960px;
    margin: var(--space-3) auto 0;
  }
  /* the 44px hit areas overhang so the icons line up with the video's edges */
  .toolbar > :first-child { margin-left: calc(-1 * var(--space-2)); }
  .toolbar > :last-child { margin-right: calc(-1 * var(--space-2)); }
  .trick .video {
    max-width: 960px;
    margin: var(--space-2) auto 0;
    border-radius: var(--radius-l);
    /* keeps the frame's edge when a white title card sits on the light page */
    outline: 1px solid var(--line);
    outline-offset: -1px;
  }
  .col { gap: var(--space-6); padding-top: var(--space-5); }
  .marks { max-width: 480px; }
  .alts li { flex-basis: 176px; }
}
</style>
