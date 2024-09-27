import { createApp } from 'vue'
import App from "@/App.vue";

// vuetify styling
import { createVuetify } from 'vuetify'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader

// VueFlow
/* import the necessary styles for Vue Flow to work */
import '@vue-flow/core/dist/style.css';
/* import the default theme, this is optional but generally recommended */
import '@vue-flow/core/dist/theme-default.css';

// multi language
import { createI18n } from "vue-i18n";
import messages from "@intlify/unplugin-vue-i18n/messages";

// global store
import {createPinia} from "pinia";

// routing
import {createRouter, createWebHistory} from 'vue-router';

const routes = [
    { path: '/', component: () => import('./pages/VideoList.vue') },
    { path: '/CategoryTree', component: () => import('./pages/CategoryTree.vue') },
    { path: '/TrickTree', component: () => import('./pages/TrickTree.vue') },
    { path: '/AboutUs', component: () => import('./pages/AboutUs.vue') },
    { path: '/Help', component: () => import('./pages/Help.vue') },
    { path: '/:trickname', component: () => import('./pages/VideoPlayer.vue') },
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

