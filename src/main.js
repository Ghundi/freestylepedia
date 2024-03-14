import { createApp } from 'vue'
import App from "@/App.vue";

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader

import {createPinia} from "pinia";


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
    .mount('#app');

