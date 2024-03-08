import { createApp } from 'vue'
import App from "@/App.vue";

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader

import {createPinia} from "pinia";

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)

const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'light'
    }
})
app.use(vuetify)

app.mount('#app')
