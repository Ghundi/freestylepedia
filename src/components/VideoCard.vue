<script>


export default {
  data () {
    return {
      dialog: false,
    }
  },
}
</script>

<template>
  <div class="text-center pa-4">
      <v-card
          width="14em"
          height="10em"
          class="videoCard"
          :style =  "{'box-shadow': `0px 0px 8px 2px ${categoryStore.getColor(category)}`}"
          :to="'/' + title[0].replaceAll(' ', '-')"
      >
        <v-img
            :src="thumbnailUrl"
            id="thumbnail">
        </v-img>
        <v-card-subtitle class="smaller-font">
          {{ releaseDate.toLocaleDateString($i18n.locale) }}
        </v-card-subtitle>
      </v-card>
    <template v-if="title[0] === videoStore.newestTrick" class="newTag">
      <v-card-title class="newTag">New!</v-card-title>
    </template>
  </div>
</template>

<script setup>
import { useVideoStore, useCategoryStore } from "@/store.js";

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
  border-radius: 5%;
}
.newTag {
  position: relative;
  bottom: 8em;
  left: 8.4em;
  rotate: 30deg;
  line-height: 0;
  width: 4em;
  border-radius: 1em;
  padding: 0.7em;
  background: rgba(255, 0, 0, 50%);
}
</style>