import { createApp } from 'vue'
import App from "@/App.vue";
import config from "@/data/config.json";

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

import { checkIfInstallable } from '@/scripts/pwaInstall.ts'

// design foundations
import '@fontsource-variable/onest'
import '@/styles/tokens.css'
import '@/styles/base.css'
import { initTheme } from '@/scripts/theme.ts'


function getLang() {
    if (navigator.languages !== undefined)
        return navigator.languages[0].slice(0, 2);
    return navigator.language;
}

const pinia = createPinia()

const availableLocales = config.locales.availableLocales;
const fallbackLocale = config.locales.fallbackLocale;

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
            return { name: 'Home', params: { lang: locale } };
        }
    },
    {
        path: '/CategoryTree',
        redirect: () => {
            const locale = availableLocales.includes(getLang()) ? getLang() : fallbackLocale;
            return { name: 'CategoryTree', params: { lang: locale } };
        }
    },
    {
        path: '/TrickTree',
        redirect: () => {
            const locale = availableLocales.includes(getLang()) ? getLang() : fallbackLocale;
            return { name: 'TrickTree', params: { lang: locale } };
        }
    },
    {
        path: '/MyProgress',
        redirect: () => {
            const locale = availableLocales.includes(getLang()) ? getLang() : fallbackLocale;
            return { name: 'MyProgress', params: { lang: locale } };
        }
    },
    {
        path: '/Settings',
        redirect: () => {
            const locale = availableLocales.includes(getLang()) ? getLang() : fallbackLocale;
            return { name: 'Settings', params: { lang: locale } };
        }
    },
    {
        path: '/AboutUs',
        redirect: () => {
            const locale = availableLocales.includes(getLang()) ? getLang() : fallbackLocale;
            return { name: 'AboutUs', params: { lang: locale } };
        }
    },
    {
        path: '/Help',
        redirect: () => {
            const locale = availableLocales.includes(getLang()) ? getLang() : fallbackLocale;
            return { name: 'Help', params: { lang: locale } };
        }
    },
    {
        path: '/trick/:trickname',
        redirect: (to) => {
            const locale = availableLocales.includes(getLang()) ? getLang() : fallbackLocale;
            return { path: `/${locale}/trick/${to.params.trickname}` };
        }
    },
    {
        path: '/:lang',
        component: () => import('./components/localeLayout.vue'),
        children: [
            { path: '',                 name: 'Home',         component: () => import('./pages/TrickList.vue') },
            { path: 'CategoryTree',     name: 'CategoryTree', component: () => import('./pages/CategoryTree.vue') },
            { path: 'TrickTree',        name: 'TrickTree',    component: () => import('./pages/TrickTree.vue') },
            { path: 'MyProgress',       name: 'MyProgress',   component: () => import('./pages/MyProgress.vue') },
            { path: 'Settings',         name: 'Settings',     component: () => import('./pages/Settings.vue') },
            { path: 'AboutUs',          name: 'AboutUs',      component: () => import('./pages/AboutUs.vue') },
            { path: 'Help',             name: 'Help',         component: () => import('./pages/Help.vue') },
            { path: 'trick/:trickname', name: 'Trick',        component: () => import('./pages/Trick.vue'), meta: { ownHeader: true } },
            { path: ':pathMatch(.*)*',  name: 'NotFound',     component: () => import('./pages/notFound.vue') },
        ]
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    const { lang } = to.params;

    if (!lang) return next();                     // '/' redirect handles this

    if (!availableLocales.includes(lang)) {
        // First segment isn't a valid locale → send to 404
        return next({
            name: 'NotFound',
            params: {
                lang: fallbackLocale,
                pathMatch: to.path.split('/').filter(Boolean).join('/')
            }
        });
    }

    i18n.global.locale.value = lang;
    // screen readers pick their voice from <html lang>; Japanese is "ja" in BCP 47, "jp" in our URLs
    document.documentElement.lang = lang === 'jp' ? 'ja' : lang;
    next();
});

initTheme()

createApp(App)
    .use(pinia) // Use Pinia plugin
    .use(i18n)
    .use(router)
    .mount('#app');

checkIfInstallable()