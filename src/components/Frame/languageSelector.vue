<script setup>
  import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from "vue-router";

  const { locale, availableLocales } = useI18n()
  const items = availableLocales.map(l => ({ title: l }))

  const router = useRouter()
  const route = useRoute()

  function updateLang(newLang) {
    if(!availableLocales.includes(newLang) || locale.value === newLang) return

    locale.value = newLang
    router.replace({
      name: route.name,
      params: { ...route.params, lang: newLang }
    })
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