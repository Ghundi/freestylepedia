import { beforeEach, describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import { createMemoryHistory, createRouter } from 'vue-router'
import en from '../../src/locales/en.json'
import MyProgress from '../../src/pages/MyProgress.vue'
import { useCategoryStore } from '../../src/scripts/store'
import { useTrickStore, type Trick } from '../../src/scripts/trickStore'

const make = (trickID: string, title: string, category: string, difficulty: number) =>
  ({ trickID, title: [title], difficulty, category, releaseDate: new Date('2024-01-01'),
    videoID: ['vid' + trickID], requirements: [], connections: [] }) as Trick

// the five starter tricks getRecommendedTricks looks up by title; only two of the configured
// categories have tricks, so every other one has a total of 0
const tricks = [
  make('0001', 'Triangle', 'footwork', 1),
  make('0002', 'Backwards Donut', 'footwork', 1),
  make('0003', 'Hockey Stop', 'stop', 1),
  make('0004', 'Eagle', 'footwork', 2),
  make('0005', 'Grapevine', 'footwork', 2),
  make('0006', 'Hawk Stop', 'stop', 3),
]

async function mountPage() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/:lang', name: 'Home', component: { template: '<div/>' } },
      { path: '/:lang/MyProgress', name: 'MyProgress', component: MyProgress },
      { path: '/:lang/trick/:trickname', name: 'Trick', component: { template: '<div/>' } },
    ],
  })
  router.push('/en/MyProgress')
  await router.isReady()
  const i18n = createI18n({ legacy: false, locale: 'en', messages: { en } })
  const w = mount(MyProgress, { global: { plugins: [router, i18n] } })
  await flushPromises()
  return w
}

describe('MyProgress page', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
    useTrickStore().tricks = tricks.map(t => ({ ...t }))
  })

  it('shows the empty state and a home button when nothing is mastered', async () => {
    const w = await mountPage()
    expect(w.get('h1').text()).toBe(en.myProgress.myProgress)
    expect(w.get('.line').text()).toBe('0 of 6 tricks mastered')
    expect(w.get('.empty').text()).toContain(en.myProgress.empty)
    const browse = w.get('.empty a')
    expect(browse.text()).toBe(en.myProgress.browse)
    expect(browse.attributes('href')).toBe('/en')
    expect(w.find('[role="progressbar"]').exists()).toBe(false)
  })

  it('hides categories without tricks and never shows NaN', async () => {
    expect(useCategoryStore().categories.length).toBeGreaterThan(2)
    localStorage.setItem('mastered', JSON.stringify(['0001']))
    const w = await mountPage()
    const bars = w.findAll('.block [role="progressbar"]')
    expect(bars.map(b => b.attributes('aria-label'))).toEqual([en.categories.footwork, en.categories.stop])
    const overall = w.get('.overall')
    expect(overall.attributes('aria-valuenow')).toBe('1')
    expect(overall.attributes('aria-valuemax')).toBe('6')
    expect(overall.get('.fill').attributes('style')).toContain('width: 17%')
    expect(w.get('.line').text()).toBe('1 of 6 tricks mastered')
    expect(w.find('.percent').exists()).toBe(false)
    expect(w.text()).not.toContain('NaN')
    expect(w.find('.empty').exists()).toBe(false)
  })

  it('shows the next todo trick, also with a legacy "trick" id', async () => {
    localStorage.setItem('todo', JSON.stringify(['trick0006']))
    const w = await mountPage()
    expect(w.get('.up-next h2').text()).toBe(en.myProgress.nextTrick)
    const card = w.get('.up-next .next')
    expect(card.text()).toContain('Hawk Stop')
    expect(card.text()).toContain(en.home.nextContext)
  })

  it('suggests a starter trick when nothing is on the todo list, even with nothing mastered', async () => {
    const w = await mountPage()
    const card = w.get('.up-next .next')
    // the context is one line under the name, not an eyebrow above it
    expect(card.get('.name').element.nextElementSibling?.textContent).toContain(en.home.suggestedContext)
    // the suggested trick is not repeated in the recommended rail
    const name = card.get('.name').text()
    expect(w.findAll('.rail li').map(li => li.text()).some(text => text.includes(name))).toBe(false)
  })
})
