import { createApp } from 'vue'
import App from "@/App.vue";

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
import { createI18n } from "vue-i18n";
import messages from "@intlify/unplugin-vue-i18n/messages";

import {createPinia} from "pinia";

const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: "de",
    fallbackLocale: "en",
    availableLocales: ["en", "de"],
    messages: messages,
});
const pinia = createPinia()
const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'light'
    }
})

createApp(App)
    .use(pinia) // Use Pinia plugin
    .use(vuetify)
    .use(i18n)
    .mount('#app');

