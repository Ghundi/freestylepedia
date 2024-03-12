<script setup>
import {useFAQ} from "@/store.js";

const FAQ = useFAQ().val
</script>

<template>
  <v-card class="ma-10" elevation="3">
    <v-card-title>
      FAQ
    </v-card-title>
    <v-expansion-panels variant="accordion">
      <v-expansion-panel
          v-for="question in FAQ"
          :text="question.text"
          :title="question.title"
      >
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
</template>

<style scoped>

</style>