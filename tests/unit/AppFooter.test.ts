import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import { createMemoryHistory, createRouter } from 'vue-router'
import en from '../../src/locales/en.json'
import AppFooter from '../../src/components/layout/AppFooter.vue'

const Page = defineComponent({ render: () => null })

async function mountFooter() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{
      path: '/:lang/',
      children: [
        { path: '', name: 'Home', component: Page },
        { path: 'AboutUs', name: 'AboutUs', component: Page },
        { path: 'Help', name: 'Help', component: Page },
      ],
    }],
  })
  await router.push('/en/')
  const i18n = createI18n({ legacy: false, locale: 'en', messages: { en } })
  return mount(AppFooter, { global: { plugins: [router, i18n, createPinia()] } })
}

describe('AppFooter', () => {
  it('links to About us and Help in the current language', async () => {
    const w = await mountFooter()
    const about = w.findAll('a').find(a => a.text() === en.aboutUs.aboutUs)
    const help = w.findAll('a').find(a => a.text() === en.footer.help)
    expect(about?.attributes('href')).toBe('/en/AboutUs')
    expect(help?.attributes('href')).toBe('/en/Help')
  })
})
