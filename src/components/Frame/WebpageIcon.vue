<script setup lang="ts">
  const props = defineProps({
    page: String,
    icon: String,
  });

  function openWebpage() {
    window.open(props.page, '_blank')
  }
</script>

<template>
  <v-btn
      :icon=icon
      class="mx-4"
      size="medium"
      variant="plain"
      @click="openWebpage()"
  ></v-btn>
</template>

<style scoped>

</style>