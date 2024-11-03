<script setup>
const props = defineProps({
  page: String,
  icon: String,
});
</script>

<script>
  export default {
    methods: {
      openWebpage() {
          window.open(this.page);
      }
    }
  }
</script>

<template>
  <v-btn
      :icon=icon
      class="mx-4"
      size="medium"
      variant="plain"
      @click="openWebpage(0)"
  ></v-btn>
</template>

<style scoped>

</style>