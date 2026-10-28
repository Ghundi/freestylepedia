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
import { applyTransferQuery } from '@/scripts/transfer.ts'
import { storedLang } from '@/scripts/lang.ts'


// The language picked in Settings, else the browser's; Japanese is "ja" in browsers and "jp" here.
function getLang() {
    const stored = storedLang()
    if (stored) return stored
    const code = (navigator.languages?.[0] ?? navigator.language ?? '').slice(0, 2).toLowerCase()
    return code === 'ja' ? 'jp' : code
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
            { path: 'CategoryTree',     name: 'CategoryTree', component: () => import('./pages/CategoryTree.vue'), meta: { titleKey: 'tabs.paths' } },
            { path: 'TrickTree',        name: 'TrickTree',    component: () => import('./pages/TrickTree.vue'), meta: { titleKey: 'tabs.paths' } },
            { path: 'MyProgress',       name: 'MyProgress',   component: () => import('./pages/MyProgress.vue'), meta: { titleKey: 'myProgress.myProgress' } },
            { path: 'Settings',         name: 'Settings',     component: () => import('./pages/Settings.vue'), meta: { titleKey: 'settings.title' } },
            { path: 'AboutUs',          name: 'AboutUs',      component: () => import('./pages/AboutUs.vue'), meta: { titleKey: 'aboutUs.aboutUs' } },
            { path: 'Help',             name: 'Help',         component: () => import('./pages/Help.vue'), meta: { title: 'FAQ' } },
            { path: 'trick/:trickname', name: 'Trick',        component: () => import('./pages/Trick.vue'), meta: { ownHeader: true } },
            { path: ':pathMatch(.*)*',  name: 'NotFound',     component: () => import('./pages/notFound.vue'), meta: { titleKey: 'error.pageNotFound' } },
        ]
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    // back/forward restores where the page was (the home rails after a trick); a new page starts at the top
    scrollBehavior(to, from, savedPosition) {
        return savedPosition ?? { top: 0 }
    },
})

router.beforeEach((to, from, next) => {
    // A transfer link works on any page; once applied it leaves the URL, so going back
    // to this history entry does not apply it again over marks made since.
    const rest = applyTransferQuery(to.query, pinia);
    if (rest) return next({ path: to.path, query: rest, hash: to.hash, replace: true });

    const { lang } = to.params;

    if (!lang) return next();                     // '/' redirect handles this

    if (!availableLocales.includes(lang) && availableLocales.includes(lang.toLowerCase())) {
        return next({ path: to.fullPath.replace(`/${lang}`, `/${lang.toLowerCase()}`), replace: true });
    }

    if (!availableLocales.includes(lang)) {
        // First segment isn't a valid locale → send to 404
        return next({
            name: 'NotFound',
            params: {
                lang: fallbackLocale,
                pathMatch: to.path.split('/').filter(Boolean)
            }
        });
    }

    i18n.global.locale.value = lang;
    // screen readers pick their voice from <html lang>; Japanese is "ja" in BCP 47, "jp" in our URLs
    document.documentElement.lang = lang === 'jp' ? 'ja' : lang;
    next();
});

// After a new version is deployed, a tab opened before it can ask for a page file that no longer
// exists. Load that page fresh, once per path, so the tap is not lost.
const CHUNK_ERROR = /dynamically imported module|Importing a module script failed|Failed to fetch/i;
function reloadOnce(path) {
    try {
        if (sessionStorage.getItem('chunkReload') === path) return;
        sessionStorage.setItem('chunkReload', path);
    } catch { /* storage blocked: reload anyway */ }
    window.location.assign(path);
}
router.onError((err, to) => {
    if (!CHUNK_ERROR.test(err?.message ?? '')) return;
    // offline, the page loads once the connection is back
    if (navigator.onLine) reloadOnce(to.fullPath);
    else window.addEventListener('online', () => reloadOnce(to.fullPath), { once: true });
});
window.addEventListener('vite:preloadError', (event) => {
    event.preventDefault();
    reloadOnce(window.location.pathname + window.location.search);
});

// Each page names itself in the tab; a trick page sets its own title once its trick is known.
router.afterEach((to) => {
    try { sessionStorage.removeItem('chunkReload'); } catch { /* storage blocked */ }
    if (to.name === 'Trick') return;
    const { titleKey, title } = to.meta;
    const name = titleKey ? i18n.global.t(titleKey) : title;
    document.title = name ? `${name} · Freestylepedia` : 'Freestylepedia';
});

// an installed app asks to keep its storage, so the browser does not clear the progress to free space
if (window.matchMedia?.('(display-mode: standalone)').matches) navigator.storage?.persist?.().catch(() => {});

initTheme()

createApp(App)
    .use(pinia) // Use Pinia plugin
    .use(i18n)
    .use(router)
    .mount('#app');

checkIfInstallable()