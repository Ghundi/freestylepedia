<script setup>
import { useCategoryStore, useMasteredStore } from "@/scripts/store.js";
import { useTrickStore} from "@/scripts/videoStore.js";
import { toPath } from "@/scripts/helpers.js";

const videoStore = useTrickStore();
const categoryStore = useCategoryStore();

const props = defineProps({
  id: Array[String],
  title: Array[String],
  difficulty: Number,
  category: String,
  releaseDate: Date,
  thumbnailUrl: String,
  requirements: Array[String],
  connections: Array[String],
});

  const mastered = useMasteredStore();

</script>

<script>

export default {
  data () {
    return {
      dialog: false,
    }
  },
}

function getLocalDate(date, locale) {
  if(locale === 'en') {
    const dateOptions = {year: 'numeric', month: 'long', day: 'numeric'}
    return date.toLocaleDateString(locale, dateOptions)
  }
  else {
    const dateOptions = {year: 'numeric', month: 'numeric', day: 'numeric'}
    return date.toLocaleDateString(locale, dateOptions)
  }
}

function isMobile() {
  return /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

</script>

<template>
        <v-card
            class="videoCard"
            :width="isMobile() ? '9em' : '14em'"
            :height="isMobile() ? '6em' : '10em'"
            :style="{'box-shadow': `0px 0px 8px 2px ${categoryStore.getColor(category)}`}"
            :to="'/trick/' + toPath(title[0])"
        >
          <v-img
              :src="thumbnailUrl"
              id="thumbnail"
              rel="preload"
              :alt="title[0]"
          >
          </v-img>
          <template v-if="!isMobile()">
            <v-card-subtitle class="smaller-font text-center">
              {{ getLocalDate(releaseDate, $i18n.locale) }}
            </v-card-subtitle>
          </template>
          <template v-if="title[0] === videoStore.newestTrick" class="newTag">
            <v-card-title
                class="newTag"
                :style="{'width': isMobile() ? '50px' : '80px',
                      'font-size': isMobile() ? '0.7em' : '1.2em',
                      'bottom': isMobile() ? '80px' : '140px',
                     'left': isMobile() ? '105px' : '170px'}">
              New!
            </v-card-title>
          </template>
          <template v-if="mastered.isMastered(title[0])">
            <v-icon 
              icon='mdi-medal'
              :style="{'bottom': isMobile() ? '80px' : '8px',
                      'right': isMobile() ? '105px' : '-197px'}"
              />
          </template>
        </v-card>
</template>

<style scoped>
.smaller-font {
  font-size: 0.6em;
  text-transform: none;
}
.videoCard {
  overflow: visible;
  border-radius: 5%;
}
.newTag {
  position: relative;
  rotate: 30deg;
  line-height: 0;
  border-radius: 1em;
  padding: 0.7em;
  background: rgba(255, 0, 0, 50%);
}
</style>