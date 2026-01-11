<script setup>
  import { useI18n } from 'vue-i18n';

  const { locale, availableLocales} = useI18n()
  const items = availableLocales.map(l => ({ title: l }))

  function updateLang(lang) {
    locale.value = lang
  }

</script>

<template>
    <v-btn
        id="menu-activator"
        variant="plain"
    >
      {{ $t("footer.language") }}
      <v-card-subtitle class="smaller-font">
        {{ $t("languages." + locale)  }}
      </v-card-subtitle>
    </v-btn>
    <v-menu activator="#menu-activator">
      <v-list>
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
          :value="item"
          @click="updateLang(item.title)"
          class="text-center"
        >
          {{ $t("languages." + item.title) }}
        </v-list-item>
      </v-list>
    </v-menu>
</template>

<style scoped>

</style>