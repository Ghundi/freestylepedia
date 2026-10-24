import { beforeEach, describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import { createMemoryHistory, createRouter } from 'vue-router'
import en from '../../src/locales/en.json'
import TrickList from '../../src/pages/TrickList.vue'
import { useHomeView } from '../../src/scripts/homeView'
import { useMasteredStore, useSelDifficultyStore } from '../../src/scripts/store'
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

  it('loads a transfer link: the todo trick is next, mastered tricks are marked', async () => {
    const w = await mountAt('/en?mastered=0001,0003&todo=0042')
    const card = w.get('.next')
    expect(card.text()).toContain('Scratch Spin')
    expect(card.text()).toContain(en.home.next)
    const mastered = useMasteredStore()
    expect(tricks.filter(t => mastered.isMastered(t)).map(t => t.trickID)).toEqual(['0001', '0003'])
  })

  it('drops the transfer query once loaded, so going back does not apply it again', async () => {
    const w = await mountAt('/en?mastered=0001&todo=0042')
    expect(w.router.currentRoute.value.query).toEqual({})
    expect(w.router.currentRoute.value.fullPath).toBe('/en')
    expect(useMasteredStore().list).toEqual(['0001'])
  })

  it('shows a todo trick saved with a legacy "trick" id as next', async () => {
    localStorage.setItem('todo', JSON.stringify(['trick0042']))
    const w = await mountAt('/en')
    const card = w.get('.next')
    expect(card.text()).toContain('Scratch Spin')
    expect(card.text()).toContain(en.home.next)
  })

  it('suggests a starter trick when nothing is on the todo list', async () => {
    const w = await mountAt('/en')
    expect(w.get('.next').text()).toContain(en.home.suggested)
  })
})
