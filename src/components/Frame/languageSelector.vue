<script setup lang="ts">
  import { useI18n } from 'vue-i18n';
  import { useRoute, useRouter } from "vue-router";

  const { locale, availableLocales } = useI18n()
  const langs = ["Deutsch", "English", "Français", "日本語", "Polski"];
  const languages = Object.fromEntries(langs.map( (lang, i) => ( [availableLocales[i], lang] )))


  const router= useRouter()
  const route = useRoute()

  function updateLang(newLang: string) {
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
        {{ languages[locale] }}
      </v-card-subtitle>
    </v-btn>
    <v-menu activator="#menu-activator">
      <v-list>
        <v-list-item
          v-for="(item, index) in availableLocales"
          :key="index"
          :value="item"
          @click="updateLang(item)"
          class="text-center"
        >
          {{ languages[item] }}
        </v-list-item>
      </v-list>
    </v-menu>
</template>

<style scoped>

</style>