<script setup>
import { useTheme } from 'vuetify'

const theme = useTheme()

function toggleTheme () {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}
</script>

<template>
  <v-btn @click="toggleTheme">
    <v-icon icon="mdi-circle-half-full"></v-icon>
  </v-btn>
</template>

<style scoped>

</style>