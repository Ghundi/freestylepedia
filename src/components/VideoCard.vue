<template>
  <v-card outlined elevation="5" width="15em"  align="center" class="border">
    <v-img
        :src="thumbnailUrl"
        id="thumbnail">
    </v-img>
    <v-card-subtitle class="smaller-font">
      {{releaseDate.toLocaleDateString("de-DE")}}
      {{ releaseDate.getYear() }}
    </v-card-subtitle>
      <v-divider></v-divider>
    <v-card-actions>
      <v-dialog fullscreen>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" text="Open" width="100%">

          </v-btn>
        </template>

        <template v-slot:default="{ isActive }">
          <v-card>
            <iframe width="100%" height="90%" :src="getEmbedURL(id)" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

            <v-card-actions>
              <v-btn
                  width="100%"
                  text="Close Dialog"
                  @click="isActive.value = false"
              ></v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
    </v-card-actions>
  </v-card>
</template>

<script setup>
const props = defineProps({
  id: String,
  title: String,
  difficulty: String,
  category: String,
  releaseDate: Date,
  thumbnailUrl: String,
});

function getEmbedURL(id) {
  return 'https://www.youtube.com/embed/' + id + '?si=9jysKI0zbGHvpMCD'
}
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
