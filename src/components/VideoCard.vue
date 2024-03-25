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
    <v-dialog
        v-model="dialog"
        transition="dialog-bottom-transition"
        fullscreen
    >
      <template v-slot:activator="{ props: activatorProps }">
          <v-card width="15em" height="12em"  class="border" v-bind="activatorProps">
            <v-img
                :src="thumbnailUrl"
                id="thumbnail">
            </v-img>
            <v-spacer></v-spacer>
            <v-card-subtitle class="smaller-font">
              {{releaseDate.toLocaleDateString(getLang())}}
            </v-card-subtitle>
          </v-card>
      </template>
      <v-card align="center">
        <VideoPlayer
            :id="id"
            :title="title"
            :difficulty="difficulty"
            :category="category"
            :releaseDate="releaseDate"
            :connections="connections"
            :requirements="requirements"
            :thumbnail-url="thumbnailUrl"
        />
        <v-card-actions>
        <v-btn
            @click="dialog = false"
            block
        >
          {{ $t("close") }}
        </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import VideoPlayer from "@/components/VideoPlayer.vue";

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

function getLang() {
  if (navigator.languages !== undefined)
    return navigator.languages[0];
  return navigator.language;
}

</script>

<style scoped>
.smaller-font {
  font-size: 0.6em;
  text-transform: none;
}
</style>