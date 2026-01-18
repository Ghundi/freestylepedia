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
import {createRouter, createWebHistory} from 'vue-router'

// PWA
import './registerServiceWorker'


function getLang() {
    if (navigator.languages !== undefined)
        return navigator.languages[0].slice(0, 2);
    return navigator.language;
}

const pinia = createPinia()

const vuetify = createVuetify({
    theme: {
        defaultTheme: 'light'
    }
})

const availableLocales = ["en", "de", "fr", "pl"];
const fallbackLocale = 'en';

const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: getLang(),
    fallbackLocale: fallbackLocale,
    availableLocales: availableLocales,
    messages: messages,
});

const routes = [
    { 
        path: '/', 
        redirect: () => {
            const locale = availableLocales.includes(getLang()) ? getLang() : fallbackLocale;
            return { name: 'Home', params: { lang: locale} };
        }
    },
    { 
        path: '/:lang',
        component: () => import('./components/localeLayout.vue'),
        beforeEnter: (to, from, next) => {
            const { lang } = to.params;
            if(!availableLocales.includes(lang)) {
                return next({name: 'Home', params: { lang: fallbackLocale} });
            }

            i18n.global.locale.value = lang;
            next();
        },
        children: [
            { path: '',                 name: 'Home', component: () => import('./pages/VideoList.vue')},
            { path: 'CategoryTree',     name: 'CategoryTree', component: () => import('./pages/CategoryTree.vue') },
            { path: 'TrickTree',        name: 'TrickTree', component: () => import('./pages/TrickTree.vue') },
            { path: 'MyProgress',       name: 'MyProgress', component: () => import('./pages/MyProgress.vue') },
            { path: 'AboutUs',          name: 'AboutUs', component: () => import('./pages/AboutUs.vue') },
            { path: 'Help',             name: 'Help', component: () => import('./pages/Help.vue') },
            { path: 'trick/:trickname', name: 'Trick', component: () => import('./pages/Trick.vue') },
            { path: ':pathMatch(.*)*', component: () => import('./pages/notFound.vue') },
        ]
    },
    { 
        path: '/:pathMatch(.*)*', 
        redirect: (to) => ({
            name: 'Home',
            params: {lang: fallbackLocale, pathMatch: to.params.pathMatch }
        })    
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})


router.beforeEach((to, from, next) => {
  if(!to.params.lang) return next();

  const lang = to.params.lang;
  if(!availableLocales.includes(lang)) {
    return next({name: 'home', params: { lang: fallbackLocale }});
  }
  i18n.global.locale.value = lang;
  next();
});

createApp(App)
    .use(pinia) // Use Pinia plugin
    .use(vuetify)
    .use(i18n)
    .use(router)
    .mount('#app');

