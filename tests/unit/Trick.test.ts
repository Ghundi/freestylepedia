import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import { createMemoryHistory, createRouter } from 'vue-router'
import en from '../../src/locales/en.json'
import Trick from '../../src/pages/Trick.vue'
import VideoPlayer from '../../src/components/trick/VideoPlayer.vue'
import { useTrickStore, type Trick as TrickT } from '../../src/scripts/trickStore'

const make = (trickID: string, title: string | string[], videoID: string[], requirements: string[] = [], connections: string[] = []) =>
  ({ trickID, title: Array.isArray(title) ? title : [title], difficulty: 2, category: 'stop', releaseDate: new Date('2024-01-01'),
    videoID, requirements, connections }) as TrickT

const tricks = [
  make('0001', 'Hockey Stop', ['aaa']),
  make('0002', ['Hawk Stop', 'de{Falken Bremse}'], ['bbb', 'ccc', 'ddd'], ['0001', '9999'], ['0001', '0003']),
  make('0003', 'T-Stop', ['eee']),
]

async function mountAt(path: string) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/:lang', name: 'Home', component: { template: '<div/>' } },
      { path: '/:lang/trick/:trickname', name: 'Trick', component: Trick },
    ],
  })
  router.push(path)
  await router.isReady()
  const i18n = createI18n({ legacy: false, locale: 'en', messages: { en } })
  const w = mount(Trick, { global: { plugins: [router, i18n] } })
  await flushPromises()
  return Object.assign(w, { router })
}

describe('Trick page', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
    useTrickStore().tricks = tricks.map(t => ({ ...t }))
    window.scrollTo = vi.fn() as unknown as typeof window.scrollTo
  })

  it('shows a not-found heading and a home link, and no player, for an unknown trick', async () => {
    const w = await mountAt('/en/trick/Moon+Walk')
    expect(w.get('h1').text()).toBe('Moon Walk ' + en.error.trickNotFound)
    const home = w.get('.missing a')
    expect(home.text()).toBe(en.error.toHome)
    expect(home.attributes('href')).toBe('/en')
    expect(w.findComponent(VideoPlayer).exists()).toBe(false)
    expect(w.find('.others').exists()).toBe(false)
  })

  it('has no "other videos" block for a trick with a single video', async () => {
    const w = await mountAt('/en/trick/Hockey+Stop')
    expect(w.get('h1').text()).toBe('Hockey Stop')
    expect(w.findComponent(VideoPlayer).exists()).toBe(true)
    expect(w.find('.others').exists()).toBe(false)
    expect(w.text()).not.toContain(en.video.others)
  })

  it('lists every video in the "other videos" block for a trick with several', async () => {
    const w = await mountAt('/en/trick/Hawk+Stop')
    const others = w.get('.others')
    expect(others.get('h2').text()).toBe(en.video.others)
    expect(others.findAll('button.alt')).toHaveLength(3)
  })

  it('drops requirement ids that match no trick from the "learn first" rail', async () => {
    const w = await mountAt('/en/trick/Hawk+Stop')
    const rail = w.findAll('.rail').find(r => r.text().includes(en.trick.before))!
    expect(rail.findAll('li')).toHaveLength(1)
    expect(rail.text()).toContain('Hockey Stop')
  })

  it('sends an alias or a different case to the trick\'s own URL', async () => {
    expect((await mountAt('/en/trick/hawk+stop')).router.currentRoute.value.path).toBe('/en/trick/Hawk+Stop')
    expect((await mountAt('/de/trick/Falken+Bremse')).router.currentRoute.value.path).toBe('/de/trick/Hawk+Stop')
  })

  it('does not repeat a "learn first" trick under related tricks', async () => {
    const w = await mountAt('/en/trick/Hawk+Stop')
    const related = w.findAll('.rail').find(r => r.text().includes(en.trick.related))!
    expect(related.text()).toContain('T-Stop')
    expect(related.text()).not.toContain('Hockey Stop')
  })
})
