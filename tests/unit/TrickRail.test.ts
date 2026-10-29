import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import { createMemoryHistory, createRouter } from 'vue-router'
import en from '../../src/locales/en.json'
import TrickRail from '../../src/components/ui/TrickRail.vue'

async function mountRail() {
  const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/', component: { template: '<div/>' } }] })
  router.push('/'); await router.isReady()
  const i18n = createI18n({ legacy: false, locale: 'en', messages: { en } })
  return mount(TrickRail, {
    props: { title: 'Rail', count: 0, tricks: [] },
    global: { plugins: [router, i18n, createPinia()] },
  })
}
function size(el: HTMLElement, scrollWidth: number, clientWidth: number, scrollLeft: number) {
  Object.defineProperty(el, 'scrollWidth', { configurable: true, value: scrollWidth })
  Object.defineProperty(el, 'clientWidth', { configurable: true, value: clientWidth })
  el.scrollLeft = scrollLeft
}

describe('TrickRail arrows', () => {
  it('has no arrows when everything fits', async () => {
    const w = await mountRail()
    expect(w.find('.arrows').exists()).toBe(false)
  })
  it('greys out each arrow at its end and pages by most of the visible width', async () => {
    const w = await mountRail()
    const list = w.get('ul').element as HTMLElement
    const calls: number[] = []
    list.scrollBy = ((o: ScrollToOptions) => { calls.push(o.left ?? 0) }) as typeof list.scrollBy
    size(list, 2000, 1000, 0)
    await w.get('ul').trigger('scroll')
    const [prev, next] = w.findAll('.arrows button')
    expect(prev.attributes('aria-label')).toBe(en.home.scrollPrev)
    expect(prev.attributes('disabled')).toBeDefined()
    expect(next.attributes('disabled')).toBeUndefined()
    await next.trigger('click')
    expect(calls).toEqual([900])
    size(list, 2000, 1000, 1000)
    await w.get('ul').trigger('scroll')
    expect(w.findAll('.arrows button')[1].attributes('disabled')).toBeDefined()
  })
})
