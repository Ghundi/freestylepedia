<script>
export default {
  data: () => ({
    valid: true,
    items: [],
  }),
  methods: {
    createLangObj(i18) {
      const items = {};
      const locales = this.$i18n.availableLocales;
      for (let x = 0; x < locales.length; x++) {
        items[x] = {
          title: locales[x]
        };
      }
      this.items = items;
    },
    updateLang(lang) {
      console.log('lang')
      this.$i18n.locale = lang;
    }
  }
}
</script>

<template>
  {{ this.createLangObj($i18n) }}
  <v-btn
      id="menu-activator"
      variant="plain"
  >
    {{ $t("footer.language") }}
    <v-card-subtitle class="smaller-font">
      {{ $t("languages." + this.$i18n.locale)  }}
    </v-card-subtitle>
  </v-btn>
  <v-card-subtitle class="smaller-font">

  </v-card-subtitle>
  <v-form v-model="valid">
    <v-menu activator="#menu-activator">
      <v-list>
        <v-list-item
            v-for="(item, index) in this.items"
            :key="index"
            :value="index"
        >
          <v-btn block @click="this.updateLang('de')" class="smaller-font">
            {{ $t("languages." + item) }}
          </v-btn>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-form>
</template>

<style scoped>

</style>