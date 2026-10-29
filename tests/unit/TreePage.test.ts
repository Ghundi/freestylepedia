import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import { createMemoryHistory, createRouter } from 'vue-router'
import en from '../../src/locales/en.json'
import TreePage from '../../src/components/paths/TreePage.vue'
import { useTrickStore } from '../../src/scripts/trickStore'
import PathList from '../../src/components/paths/PathList.vue'
import PathSheet from '../../src/components/paths/PathSheet.vue'

const originalMatchMedia = window.matchMedia
let listener: (e: { matches: boolean }) => void = () => {}
// stubs matchMedia: no stub is the phone case, matches=true the wide case
function stubWide(matches: boolean) {
  window.matchMedia = vi.fn(() => ({
    matches,
    addEventListener: (_: string, l: typeof listener) => { listener = l },
    removeEventListener: () => {},
  })) as never
}

async function mountTree(active: 'TrickTree' | 'CategoryTree') {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/:lang/TrickTree', name: 'TrickTree', component: { template: '<div/>' } },
      { path: '/:lang/CategoryTree', name: 'CategoryTree', component: { template: '<div/>' } },
      { path: '/:lang/trick/:trickname', name: 'Trick', component: { template: '<div/>' } },
    ],
  })
  router.push(`/en/${active}`)
  await router.isReady()
  const pinia = createPinia()
  setActivePinia(pinia)
  useTrickStore().loadTricks()
  const i18n = createI18n({ legacy: false, locale: 'en', messages: { en } })
  return mount(TreePage, {
    props: { active, edges: [], description: en.trickTree.description },
    global: { plugins: [router, i18n, pinia] },
  })
}

describe('TreePage', () => {
  HTMLDialogElement.prototype.showModal = vi.fn()
  HTMLDialogElement.prototype.close = vi.fn()
  afterEach(() => { window.matchMedia = originalMatchMedia })

  it.each(['TrickTree', 'CategoryTree'] as const)('gives the %s page one h1 naming the Paths tab', async (active) => {
    stubWide(true)
    const w = await mountTree(active)
    const h1 = w.findAll('h1')
    expect(h1).toHaveLength(1)
    expect(h1[0].text()).toBe(en.tabs.paths)
  })
  it('offers zoom in, zoom out and fit controls with accessible names', async () => {
    stubWide(true)
    const w = await mountTree('TrickTree')
    const labels = w.findAll('.controls button').map(b => b.attributes('aria-label'))
    expect(labels).toEqual([en.paths.zoomIn, en.paths.zoomOut, en.paths.fit])
  })
  it('orders the switch by category, then by level', async () => {
    stubWide(true)
    const w = await mountTree('TrickTree')
    const labels = w.findAll('[role="radio"], [role="tab"], button').filter(b => [en.paths.byCategory, en.paths.byLevel].includes(b.text())).map(b => b.text())
    expect(labels).toEqual([en.paths.byCategory, en.paths.byLevel])
  })
  it.each([['CategoryTree', 'category'], ['TrickTree', 'level']] as const)('shows the %s list on a phone', async (active, mode) => {
    const w = await mountTree(active)
    expect(w.find('.controls').exists()).toBe(false)
    expect(w.findComponent(PathList).props('mode')).toBe(mode)
    expect(w.text()).toContain(en.paths.hint)
  })
  it('closes the sheet when the screen becomes wide', async () => {
    stubWide(false)
    const w = await mountTree('CategoryTree')
    const trick = useTrickStore().tricks[0]
    w.findComponent(PathList).vm.$emit('open', trick)
    await w.vm.$nextTick()
    expect(w.findComponent(PathSheet).props('trick')).toEqual(trick)
    listener({ matches: true })
    await w.vm.$nextTick()
    expect(w.findComponent(PathSheet).exists() ? w.findComponent(PathSheet).props('trick') : null).toBeNull()
  })
})
