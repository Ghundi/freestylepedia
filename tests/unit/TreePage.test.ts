import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { createMemoryHistory, createRouter } from 'vue-router'
import en from '../../src/locales/en.json'
import TreePage from '../../src/components/paths/TreePage.vue'

async function mountTree(active: 'TrickTree' | 'CategoryTree') {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/:lang/TrickTree', name: 'TrickTree', component: { template: '<div/>' } },
      { path: '/:lang/CategoryTree', name: 'CategoryTree', component: { template: '<div/>' } },
    ],
  })
  router.push(`/en/${active}`)
  await router.isReady()
  const i18n = createI18n({ legacy: false, locale: 'en', messages: { en } })
  return mount(TreePage, {
    props: { active, edges: [], description: en.trickTree.description },
    global: { plugins: [router, i18n] },
  })
}

describe('TreePage', () => {
  it.each(['TrickTree', 'CategoryTree'] as const)('gives the %s page one h1 naming the Paths tab', async (active) => {
    const w = await mountTree(active)
    const h1 = w.findAll('h1')
    expect(h1).toHaveLength(1)
    expect(h1[0].text()).toBe(en.tabs.paths)
  })
  it('offers zoom in, zoom out and fit controls with accessible names', async () => {
    const w = await mountTree('TrickTree')
    const labels = w.findAll('.controls button').map(b => b.attributes('aria-label'))
    expect(labels).toEqual([en.paths.zoomIn, en.paths.zoomOut, en.paths.fit])
  })
})
