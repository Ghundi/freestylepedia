<script setup>
  import { computed } from 'vue'
  import { useCategoryStore, useMasteredStore } from '@/scripts/store.js'
  import { useTrickStore } from '@/scripts/videoStore.js'
  import { toPath } from '@/scripts/helpers.js'
  import difficultyImg from '../assets/Silouette_Schlittschuh.png'
import ScalingText from './scalingText.vue'

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

  const newBadgeStyle = computed(() => ({
    width: isMobile() ? '50px' : '80px',
    fontSize: isMobile() ? '0.8em' : '1.2em',
    top: isMobile() ? '-1cqw' : '-0.3vw',
    right: isMobile() ? '-4cqw' : '-1.1vw',
    transform: 'rotate(30deg)',
    lineHeight: '0',
    borderRadius: '1em',
    padding: '0.7em',
    background: 'rgba(255,0,0,0.5)',
    position: 'absolute',
  }))

  const medalStyle = computed(() => ({
    position: 'absolute',
    bottom: '4%',
    right: '0%',
    fontSize: isMobile() ? '100%' : '150%',
  }))
</script>

<template>
  <v-card
    :width="isMobile() ? '35vw' : '15vw'"
    :height="isMobile() ? '20vw' : '9vw'"
    :style="cardStyle"
    :to="'/trick/' + toPath(title[0])"
  >
    <div class="title-wrapper">
      <scaling-text class="pa-2" :title="title[0]"/>
    </div>

    <div class="text-center pb-2" :style="{ color: 'black', fontSize: isMobile() ? '8px' : '12px' }">
        ({{ $t('categories.' + category) }})
    </div>

    <v-container class="justify-center pt-1 m-5">
      <v-row dense no-gutters class="justify-center">
        <template v-for="_ in difficulty">
          <v-col :style="{margin: '0 1px'}">
            <v-img :src="difficultyImg" :width="isMobile() ? '80%' : '65%'" />
          </v-col>
        </template>
        <template v-for="_ in (5 - difficulty)">
          <v-col :style="{margin: '0 1px'}">
            <v-img :src="difficultyImg" :width="isMobile() ? '80%' : '65%'" class="opacity-20" />
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
      <v-card-title :style="newBadgeStyle">New!</v-card-title>
    </template>

    <template v-if="mastered.isMastered(title[0])">
      <v-icon icon="mdi-medal" :style="medalStyle" />
    </template>
  </v-card>
</template>

<style scoped>
  .title-wrapper {
    padding-top: 3%;
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