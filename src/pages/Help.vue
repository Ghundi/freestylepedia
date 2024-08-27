<script setup>
import {useFAQ} from "@/store.js";

const FAQ_store = useFAQ();
</script>

<template>
  <v-card class="ma-10" elevation="3">
    <v-card-title>
      FAQ
    </v-card-title>
    <v-expansion-panels variant="accordion">
      <v-expansion-panel
          v-for="entry in FAQ_store.val"
          :text="$t('faq.' + entry + '_answer')"
          :title="$t('faq.' + entry + '_question')"
      >
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
</template>

<style scoped>

</style>