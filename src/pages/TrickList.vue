<script setup>
  import TrickCard from '../components/TrickCard.vue';
  import Toolbar from "@/components/Toolbar/Toolbar.vue";
  import { useMasteredStore, useTodoStore } from '@/scripts/store';
  import { useTrickStore } from "@/scripts/trickStore.js";
  import { useRoute } from 'vue-router';

  const trickStore = useTrickStore();

  console.log(useTodoStore().list)

  const route = useRoute()
  if(route.query.todo) {
    console.log(route.query.todo)
    useTodoStore().loadHash(route.query.todo);
    useMasteredStore().loadHash(route.query.mastered);
  }

</script>

<script>
  function isMobile() {
    return /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

</script>

<template>
  <v-container>
    <v-row class="mt-3" justify="center">
      <Toolbar/>
    </v-row>
    <v-row :justify="isMobile() ? 'center' : 'start'" align-content="center">
      <template
          v-for="trick in trickStore.shownTricks"
          :key="trick.title[0]">
        <v-col cols="auto">
            <TrickCard
                :trick="trick"
            />
        </v-col>
      </template>
      <template v-if="trickStore.tricks.length === 0">
        <v-col>
          <v-empty-state
              icon="mdi-magnify"
              :text="$t('error.noResultsSuggestions')"
              :title="$t('error.noResults')"
          ></v-empty-state>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<style scoped>
</style>