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
  return window.screen.orientation.type === 'portrait-primary'
}

</script>

<template>
    <div class="text-center">
        <v-card
            :width="isMobile() ? '40vw' : '12vw'"
            :height="isMobile() ? '10vh' :  '16vh'"
            class="videoCard"
            :style="{'box-shadow': `0px 0px 8px 2px ${categoryStore.getColor(category)}`,
                    'margin': isMobile() ? '0px 0px 0px' : '10px'}"
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
            <v-card-subtitle class="smaller-font">
              {{ getLocalDate(releaseDate, $i18n.locale) }}
            </v-card-subtitle>
          </template>
          <template v-if="title[0] === videoStore.newestTrick" class="newTag">
            <v-card-title
                class="newTag"
                :style="{'width': isMobile() ? '50px' : '80px',
                      'font-size': isMobile() ? '0.7em' : '1.2em',
                      'bottom': isMobile() ? '80px' : '160px',
                     'left': isMobile() ? '105px' : '190px'}">
              New!
            </v-card-title>
          </template>
        </v-card>
    </div>
</template>

<script setup>
import { useCategoryStore } from "@/scripts/store.js";
import { useVideoStore} from "@/scripts/videoStore.js";
import {toPath} from "@/scripts/helpers.js";

const videoStore = useVideoStore();
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

</script>

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