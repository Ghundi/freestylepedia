<script>
function createLangObj() {
  const dict = {};
  const locales = ['de', 'en'];
  for (let x = 0; x < locales.length; x++) {
    dict[x] = {
      title: locales[x]
    };
  }
  return dict
}

export default {
  data: () => ({
    valid: true,
    items: createLangObj(),
  }),
  methods: {
    updateLang(lang) {
      this.$i18n.locale = lang;
    },
    getOrientation(){
      return window.innerWidth > window.innerHeight ? "Landscape" : "Portrait";
    }
  }
}
</script>

<template>
  <template v-if="getOrientation() === 'Landscape'">
    <v-btn
        id="menu-activator"
        variant="plain"
    >
      {{ $t("footer.language") }}
      <v-card-subtitle class="smaller-font">
        {{ $t("languages." + this.$i18n.locale)  }}
      </v-card-subtitle>
    </v-btn>
  </template>
  <template v-else>
    <v-btn
        id="menu-activator"
        variant="plain"
    >
      <v-icon icon="mdi-translate"></v-icon>
    </v-btn>
  </template>
  <v-form v-model="valid">
    <v-menu activator="#menu-activator">
      <v-list>
        <v-list-item
            v-for="(item, index) in items"
            :key="index"
            :value="item"
        >
          <v-btn block @click="updateLang(item.title)" class="smaller-font">
            {{ $t("languages." + item.title) }}
          </v-btn>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-form>
</template>

<style scoped>

</style>