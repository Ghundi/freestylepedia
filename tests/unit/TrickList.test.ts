import { beforeEach, describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import { createMemoryHistory, createRouter } from 'vue-router'
import en from '../../src/locales/en.json'
import TrickList from '../../src/pages/TrickList.vue'
import { useHomeView } from '../../src/scripts/homeView'
import { useSelDifficultyStore } from '../../src/scripts/store'
import { useTrickStore, type Trick } from '../../src/scripts/trickStore'

const make = (trickID: string, title: string, category: string, difficulty: number) =>
  ({ trickID, title: [title], difficulty, category, releaseDate: new Date('2024-01-01'),
    videoID: ['vid' + trickID], requirements: [], connections: [] }) as Trick

// the five starter tricks getRecommendedTricks looks up by title, plus one todo candidate
const tricks = [
  make('0001', 'Triangle', 'footwork', 1),
  make('0002', 'Backwards Donut', 'footwork', 1),
  make('0003', 'Hockey Stop', 'stop', 1),
  make('0004', 'Eagle', 'footwork', 2),
  make('0005', 'Grapevine', 'footwork', 2),
  make('0042', 'Scratch Spin', 'spin', 3),
]

async function mountAt(path: string) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/:lang', name: 'Home', component: TrickList },
      { path: '/:lang/trick/:trickname', name: 'Trick', component: { template: '<div/>' } },
    ],
  })
  router.push(path)
  await router.isReady()
  const i18n = createI18n({ legacy: false, locale: 'en', messages: { en } })
  const w = mount(TrickList, { global: { plugins: [router, i18n] } })
  await flushPromises()
  return Object.assign(w, { router })
}

describe('TrickList (home)', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
    useTrickStore().tricks = tricks.map(t => ({ ...t }))
    useHomeView().view.value = 'category'
  })

  it('shows one rail per non-empty category', async () => {
    const w = await mountAt('/en')
    const titles = w.findAll('.rail h2').map(h => h.text())
    expect(titles).toEqual(['Footwork', 'Spin', 'Stop'])
  })

  it('shows the empty state in all mode when the filters hide every trick', async () => {
    useHomeView().view.value = 'all'
    useSelDifficultyStore().update([5, 5])
    const w = await mountAt('/en')
    expect(w.text()).toContain(en.error.noResults)
    expect(w.findAll('.grid li')).toHaveLength(0)
    await w.get('.empty button').trigger('click')
    expect(w.findAll('.grid li')).toHaveLength(tricks.length)
  })

  it('lists the filtered tricks in all mode', async () => {
    useHomeView().view.value = 'all'
    useSelDifficultyStore().update([2, 5])
    const w = await mountAt('/en')
    expect(w.findAll('.grid li')).toHaveLength(3)
    expect(w.text()).not.toContain(en.error.noResults)
  })

  it('no longer shows the next-trick card, which lives on My Progress', async () => {
    const w = await mountAt('/en')
    expect(w.find('.next').exists()).toBe(false)
  })
})
