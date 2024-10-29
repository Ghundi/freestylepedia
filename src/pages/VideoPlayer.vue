<script setup>
import {useVideoStore} from "@/scripts/videoStore.js";
import { useRoute } from "vue-router";
import ShareDial from "@/components/shareDial.vue";
import { pathToStr } from "@/scripts/helpers.js";

const videoStore = useVideoStore()

function getEmbedURL(id) {
  return 'https://www.youtube.com/embed/' + id + '?si=9jysKI0zbGHvpMCD&mute=1'
}

function getThumbnailUrl(videoId) {
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
}

function openVideo(id) {
  window.open("https://www.youtube.com/watch?v=" + id + "?mute=1");
}

function getTrickNames(id_list) {
  let res = [videoStore.getTrickByID(id_list[0], videoStore).title[0]];
  for (let i = 1; i < id_list.length; i++) {
    res.push(videoStore.getTrickByID(id_list[i], videoStore).title[0]);
  }
  return res;
}

const trick = videoStore.getTrickByTitle(pathToStr(useRoute().params.trickname), videoStore);
</script>

<script>
export default {
  mounted() {
    // Ensure the div is focusable to capture key events
    this.$el.focus();
  }
};
function hasHistory () {
  return window.history.length > 2
}
</script>

<template>
  <div
      v-if="trick === -1"
      v-once>
    <div class="text-center pa-5 ma-15">
      <v-empty-state
          icon="mdi-alert-circle-outline"
          :text="$t('trickNotFoundSuggestion')"
          :title="$t('trickNotFound')"
      ></v-empty-state>
    </div>
  </div>
  <div
      v-else
      v-once
      class="text-center mt-2"
      @keyup.esc="hasHistory()
            ? $router.back()
            : $router.push('/')" tabindex="0">
    <v-btn
        size="x-large"
        density="compact"
        :ripple="true"
        class="Right"
        icon="mdi-close"
        variant="elevated"
        @click="hasHistory()
            ? $router.back()
            : $router.push('/')">
    </v-btn>
    <v-container>
      <v-row>
        <iframe
            class="responsive-iframe"
            :src="getEmbedURL(trick.id[0])"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
            name="Freestylepedia Video"
        ></iframe>

        <noframes>
          Here should be the Freestylepedia Video for {{ trick.title[0] }}
        </noframes>
      </v-row>
      <v-row >
        <v-col v-for="title in trick.title">
          <strong>
            {{title}}
          </strong>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card class="pa-3 ma-auto" elevation="5" max-width="300px" justify-center align-center>
            <p class="font-weight-bold">{{ $t('difficulty') }}:</p>
             {{ trick.difficulty }}
            <br>
            <p class="font-weight-bold">{{ $t('category') }}:</p>
            {{ $t('categories.' + trick.category) }}
          </v-card>
        </v-col>
        <v-col v-if="trick.connections.length > 0">
          <v-card class="pa-3" elevation="5" max-width="300px" justify-center align-center>
            <p class="font-weight-bold">{{ $t('similarTricks') }}:</p>
            <template v-for="name in getTrickNames(trick.connections, videoStore)">
              <v-btn :to="'/trick/' + name" variant="flat" class="ma-2">
                {{ name }}
              </v-btn>
            </template>
          </v-card>
        </v-col>
        <v-col v-if="trick.requirements.length > 0">
          <v-card class="pa-3" elevation="5" max-width="300px" justify-center align-center>
            <p class="font-weight-bold">{{ $t('requirements') }}:</p>
            <template v-for="r_name in getTrickNames(trick.requirements, videoStore)">
              <v-btn
                @click="$router.push('/trick/' + r_name)" variant="flat" class="ma-2">
                {{ r_name }}
              </v-btn>
            </template>
          </v-card>
        </v-col>
        <template v-if="trick.id.length > 1">
          <v-container>
            <v-row>
              <v-col>
                <p class="font-weight-bold">{{ $t('otherTutorials') }}:</p>
              </v-col>
            </v-row>
            <v-row justify="center" align="center">
              <v-col
                  v-for="video in trick.id.slice(1)"
                  :key="video"
                  cols="auto"
              >
              <v-card elevation="3" width="150px">
                <v-img
                    :src="getThumbnailUrl(video)"
                    v-on:click="openVideo(video)"
                />
              </v-card>
              </v-col>
            </v-row>
          </v-container>
        </template>
      </v-row>
      <v-row>
        <v-col>
          <ShareDial/>
        </v-col>
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
  float: right;
  right: 10px;
}
div {
  outline: none;
}
</style>