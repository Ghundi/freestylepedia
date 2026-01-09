<script setup>
import { useTheme } from 'vuetify'

const theme = useTheme()

function toggleTheme () {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}
function isDarkTheme() {
  return theme.global.current.value.dark == 'dark'
}
</script>

<template>
  <v-btn 
  @click="toggleTheme" 
  variant="plain" 
  class="text-none">
    <template v-if="isDarkTheme">
      {{ $t('navBar.switchToDarkMode') }}
    </template>
      <template v-else>
      {{ $t('navBar.switchToLightMode') }}
    </template>
  </v-btn>
</template>

<style scoped>

</style>