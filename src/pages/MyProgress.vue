<script setup>
import ProgressBar from '@/components/progressBar.vue';
import ProgressSpiderChart from '@/components/ProgressSpiderChart.vue';

</script>

<template>
  <v-card class="ma-10 pa-5" elevation="3">
    <v-card-title class="text-center font-weight-bold">
      {{ $t("myProgress.myProgress") }}
    </v-card-title>
    <progress-bar/>
    <div class="ma-5">
        <progress-spider-chart/>
    </div>
  </v-card>

</template>

<style scoped>

</style>