<script setup>

  import { useMasteredStore } from '@/scripts/store'

  const props = defineProps({
    title: String,
  });

  const mastered = useMasteredStore()

  const isMastered = () => mastered.isMastered(props.title)
  function toggleMastered() { mastered.toggle(props.title) }
  
</script>

<template>
  <v-btn 
    @click="toggleMastered"
    :icon="(isMastered()) ? 'mdi-medal' : 'mdi-medal-outline'"
  >
  </v-btn>
</template>

<style scoped>

</style>