<script setup>
</script>

<template>
  <div class="text-center pa-5 ma-15">
    <v-empty-state
        icon="mdi-alert-circle-outline"
        :text="$t('pageNotFoundSuggestion')"
        :title="$t('pageNotFound')"
    ></v-empty-state>
  </div>
</template>

<style scoped>

</style>