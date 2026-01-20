<script setup>
  import { watch, ref, nextTick } from "vue";
  import { useTrickStore } from "@/scripts/trickStore.js";
  import { useRoute, useRouter } from "vue-router";
  import ShareDial from "@/components/shareDial.vue";
  import { pathToStr } from "@/scripts/helpers.js";
  import OtherTutorials from "@/components/otherTutorials.vue";
  import TrickLinkList from "@/components/trickLinkList.vue";
  import { useMasteredStore, useTodoStore } from "@/scripts/store";

  function getEmbedURL(id) {
    return 'https://www.youtube-nocookie.com/embed/' + id + '?si=9jysKI0zbGHvpMCD&mute=1&start=4'
  }

  const route = useRoute()
  const router = useRouter()
  const trickStore = useTrickStore()
  const trick = ref(null)

  watch(
    () => route.params.trickname,
    async (newName) => {
      if (!newName) return;
      
      const foundTrick = trickStore.getTrickByTitle(pathToStr(newName), trickStore);
      trick.value = foundTrick;
      
      await nextTick();
      
      if (trick.value && trick.value !== -1) {
        document.getElementById('main')?.focus();
        document.title = trick.value.title[0] || "Trick Details";
      }
    },
    { immediate: true }
  );

  const TodoStore = useTodoStore()
  const masteredStore = useMasteredStore()

  const isOnTodo = () => trick.value && trick.value !== -1 && TodoStore.isOnTodo(trick.value)
  function toggleTodo() {
    if (trick.value && trick.value !== -1) 
      TodoStore.toggle(trick.value)
  }
  
  const isMastered = () => trick.value && trick.value !== -1 && masteredStore.isMastered(trick.value)
  function toggleMastered() {
    if (trick.value && trick.value !== -1) masteredStore.toggle(trick.value)
  }

  function goBack() {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.replace({ name: "Home", params: { lang: route.params.lang } });
    }
  }

  // Helper function for navigating to a new trick
  function navigateToTrick(newTrickName) {
    router.push({ 
      name: 'TrickDetails', // Ensure this matches your route name in router/index.js
      params: { trickname: newTrickName.toLowerCase().replace(/\s+/g, '-') } 
    });
  }

</script>

<template>
  <div v-if="trick && trick !== -1">
    <component :is="'script'" type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "name": "{{ trick.title[0] }}",
        "description": "Learn how to do {{ trick.title[0] }}"
      }
    </component>
  </div>

  <div v-if="trick === -1">
    <div class="text-center pa-5 ma-15">
      <v-empty-state
          icon="mdi-alert-circle-outline"
          :text="$t('error.trickNotFoundSuggestion')"
          :title="pathToStr(route.params.trickname) + ' ' + $t('error.trickNotFound')"
      ></v-empty-state>
    </div>
  </div>

  <div
      id="main"
      v-else-if="trick"
      class="text-center mt-2"
      @keyup.esc="goBack()"
      tabindex="0">
    <v-fab
        icon="mdi-close"
        :ripple="true"
        density="comfortable"
        variant="elevated"
        size="x-large"
        @click="goBack()"
        class="Right"></v-fab>
    <v-container>
      <v-row>
        <iframe
            class="responsive-iframe"
            :src="getEmbedURL(trick.id[0])"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
        ></iframe>
      </v-row>
      <v-row >
        <v-col v-for="(title, index) in trickStore.getLocalTrickTitles(trick, $i18n.locale)" :key="index">
          <strong>{{ title }}</strong>
        </v-col>
        
        <v-col>
          <v-btn 
            @click="toggleTodo"
            :append-icon="(isOnTodo()) ? 'mdi-check-bold' : 'mdi-plus'"
          >
          {{ $t("marked.todo") }}
          </v-btn>
        </v-col>
        <v-col>
            <v-btn 
              @click="toggleMastered"
              :append-icon="(isMastered()) ? 'mdi-medal' : 'mdi-medal-outline'"
            >
            {{ $t("marked.mastered") }}
            </v-btn>
        </v-col>
        <v-col>
          <ShareDial/>
        </v-col>
      </v-row>

      <v-row class="d-flex" justify="center">
        <v-col>
          <v-card class="pa-3 mx-auto" elevation="5" max-width="300px">
            <p class="font-weight-bold">{{ $t('difficulty') }}:</p>
             {{ trick.difficulty }}
            <br>
            <p class="font-weight-bold">{{ $t('category') }}:</p>
            {{ $t('categories.' + trick.category) }}
          </v-card>
        </v-col>
        
        <v-col v-if="trick.connections && trick.connections.length > 0">
          <trick-link-list 
            :list="trick.connections" 
            :title="$t('similarTricks')"
            class="mx-auto"
          />
        </v-col>

        <v-col v-if="trick.requirements && trick.requirements.length > 0">
          <trick-link-list 
            :list="trick.requirements" 
            :title="$t('requirements')"
            class="mx-auto"
          />
        </v-col>

        <template v-if="trick.id && trick.id.length > 1">
          <other-tutorials :id="trick.id"/>
        </template>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.responsive-iframe {
  width: 100%;
  aspect-ratio: 16 / 9;
}

.Right{
  position: absolute;
  right: 60px;
  top: 120px;
  z-index: 10;
}
#main {
  outline: none;
}
</style>