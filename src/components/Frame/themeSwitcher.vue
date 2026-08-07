<script setup lang="ts">
import { useTheme } from 'vuetify'

const theme = useTheme()

function toggleTheme(): void {
  theme.change( theme.global.current.value.dark ? 'light' : 'dark' )
}
function isDarkTheme(): Boolean {
  return theme.global.name.value  == 'dark'
} 

</script>

<template>
  <v-btn 
  @click="toggleTheme" 
  variant="plain" 
  class="text-none">
      {{ (isDarkTheme()) ? $t('navBar.switchToLightMode') : $t('navBar.switchToDarkMode')}}
  </v-btn>
</template>

<style scoped>

</style>