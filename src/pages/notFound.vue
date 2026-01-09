<script setup>
</script>

<template>
  <div class="text-center pa-5 ma-15">
    <v-empty-state
        icon="mdi-alert-circle-outline"
        :text="$t('error.pageNotFoundSuggestion')"
        :title="$t('error.pageNotFound')"
    ></v-empty-state>
  </div>
</template>

<style scoped>

</style>