<script setup>
  import { computed } from 'vue'
  import { useCategoryStore, useMasteredStore } from '@/scripts/store.js'
  import { useTrickStore } from '@/scripts/videoStore.js'
  import { toPath } from '@/scripts/helpers.js'
  import difficultyImg from '../assets/Silouette_Schlittschuh.png'

  const videoStore = useTrickStore()
  const categoryStore = useCategoryStore()
  const mastered = useMasteredStore()

  const props = defineProps({
    id: Array[String],
    title: Array[String],
    difficulty: Number,
    category: String,
    releaseDate: Date,
    requirements: Array[String],
    connections: Array[String],
  })

  function getLocalDate(date, locale) {
    const opts = locale === 'en'
      ? { year: 'numeric', month: 'long', day: 'numeric' }
      : { year: 'numeric', month: 'numeric', day: 'numeric' }
    return date.toLocaleDateString(locale, opts)
  }
  function isMobile() {
    return /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }

  const cardStyle = computed(() => ({
    boxShadow: `0px 0px 8px 2px ${categoryStore.getColor(props.category)}`,
    overflow: 'visible',
    borderRadius: '5%',
    position: 'relative',
  }))

  const badgeStyle = computed(() => ({
    width: isMobile() ? '50px' : '80px',
    fontSize: isMobile() ? '0.8em' : '1.2em',
    top: isMobile() ? '-1cqw' : '-0.3cqw',
    right: isMobile() ? '-4cqw' : '-1.1cqw',
    transform: 'rotate(30deg)',
    lineHeight: '0',
    borderRadius: '1em',
    padding: '0.7em',
    background: 'rgba(255,0,0,0.5)',
    position: 'absolute',
  }))

  const medalStyle = computed(() => ({
    bottom: isMobile() ? '0cqw' : '0.5cqw',
    right: isMobile() ? '-33cqw' : '-197px',
  }))
  
  const getTitleFontSize = (title) => {
    const len = title.length;
    if (isMobile()) {
      const size = Math.min(15, Math.max(6, 20 - len * 0.8));
      return `${size}cqw`;
    } else {
      const size = Math.min(12, Math.max(6, 15 - len * 0.4));
      return `${size}cqw`;
    }
  }
</script>

<template>
  <v-card
    :width="isMobile() ? '40cqw' : '14em'"
    :height="isMobile() ? '25cqw' : '9em'"
    :style="cardStyle"
    :to="'/trick/' + toPath(title[0])"
  >
    <div class="title-wrapper" ref="containerRef">
      <v-card-title 
        :style="{fontSize: getTitleFontSize(title[0])}"
        class="title-text">
        {{ title[0] }}
      </v-card-title>
    </div>

    <v-container class="justify-center pt-1 m-5">
      <v-row dense no-gutters class="justify-center">
        <template v-for="_ in difficulty">
          <v-col :style="{margin: '0 1px'}">
            <v-img :src="difficultyImg" :width="isMobile() ? '4.4cqw' : '1.8cqw'" />
          </v-col>
        </template>
        <template v-for="_ in (5 - difficulty)">
          <v-col :style="{margin: '0 1px'}">
            <v-img :src="difficultyImg" :width="isMobile() ? '4.4cqw' : '1.8cqw'" class="opacity-50" />
          </v-col>
        </template>
      </v-row>
    </v-container>

    <template v-if="!isMobile()">
      <v-card-subtitle :style="{fontSize: '0.6em', textTransform: 'none'}" class="text-center">
        {{ getLocalDate(releaseDate, $i18n.locale) }}
      </v-card-subtitle>
    </template>

    <template v-if="title[0] === videoStore.newestTrick">
      <v-card-title :style="badgeStyle">New!</v-card-title>
    </template>

    <template v-if="mastered.isMastered(title[0])">
      <v-icon icon="mdi-medal" :style="medalStyle" />
    </template>
  </v-card>
</template>

<style scoped>
  .title-wrapper {
    height: 40%;
    width: 90%;
    margin: 0 auto;
    justify-content: center;
    align-items: center;
    container-type: inline-size;
  }
  .title-text {
    padding-top: 8cqw;
    font-family: serif;
    font-weight: bold;
    text-align: center;
    white-space: nowrap;
  }
</style>