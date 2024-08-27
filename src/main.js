import { createApp } from 'vue'
import App from "@/App.vue";

// vuetify styling
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader

// multi language
import { createI18n } from "vue-i18n";
import messages from "@intlify/unplugin-vue-i18n/messages";

// global store
import {createPinia} from "pinia";

// routing
import {createMemoryHistory, createRouter, createWebHistory} from 'vue-router'
import VideoList from './pages/VideoList.vue'
import CategoryTree from './pages/CategoryTree.vue'
import TrickTree from './pages/TrickTree.vue'
import AboutUs from './pages/AboutUs.vue'
import Help from './pages/Help.vue'

const routes = [
    { path: '/', component: VideoList },
    { path: '/CategoryTree', component: CategoryTree },
    { path: '/TrickTree', component: TrickTree },
    { path: '/AboutUs', component: AboutUs },
    { path: '/Help', component: Help },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

function getLang() {
    if (navigator.languages !== undefined)
        return navigator.languages[0].slice(0, 2);
    return navigator.language;
}

const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: getLang(),
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
    .use(router)
    .mount('#app');

