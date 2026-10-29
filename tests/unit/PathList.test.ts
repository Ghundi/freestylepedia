import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import { effectScope } from 'vue'
import en from '../../src/locales/en.json'
import config from '../../src/data/config.json'
import PathList, { resetOpenGroups } from '../../src/components/paths/PathList.vue'
import { useWideScreen } from '../../src/scripts/useWideScreen'
import { categoryRows, levelRows } from '../../src/scripts/paths'
import { useTrickStore } from '../../src/scripts/trickStore'
import { useMasteredStore } from '../../src/scripts/store'

const i18n = createI18n({ legacy: false, locale: 'en', messages: { en } })
const cats = config.initialValues.categoryStore.categories

function make(mode: 'category' | 'level') {
  return mount(PathList, { props: { mode }, global: { plugins: [i18n] } })
}

beforeEach(() => {
  localStorage.clear()
  resetOpenGroups()
  setActivePinia(createPinia())
  useTrickStore().loadTricks()
})

describe('PathList', () => {
  it('lists the categories collapsed, in config order', () => {
    const w = make('category')
    const heads = w.findAll('button[aria-expanded]')
    expect(heads).toHaveLength(7)
    expect(heads.every(h => h.attributes('aria-expanded') === 'false')).toBe(true)
    expect(heads.map(h => h.text().toLowerCase())).toEqual(
      cats.map((c: string) => expect.stringContaining(en.categories[c as keyof typeof en.categories].toLowerCase())))
    expect(w.findAll('.row')).toHaveLength(0)
  })

  it('opens a category on click', async () => {
    const w = make('category')
    const head = w.findAll('button[aria-expanded]').find(h => h.text().includes('Stop'))!
    await head.trigger('click')
    expect(head.attributes('aria-expanded')).toBe('true')
    expect(w.findAll('.row')).toHaveLength(categoryRows(useTrickStore().tricks, 'stop').length)
  })

  it('shows five levels and opens one', async () => {
    const w = make('level')
    expect(w.findAll('button[aria-expanded]')).toHaveLength(5)
    await w.findAll('button[aria-expanded]').find(h => h.text().includes('Level 2'))!.trigger('click')
    expect(w.findAll('.row')).toHaveLength(levelRows(useTrickStore().tricks, 2, cats).length)
  })

  it('counts and flags mastered tricks', async () => {
    const trick = useTrickStore().tricks.find(t => t.category === 'stop')!
    useMasteredStore().toggle(trick)
    const w = make('category')
    const head = w.findAll('button[aria-expanded]').find(h => h.text().includes('Stop'))!
    const total = categoryRows(useTrickStore().tricks, 'stop').length
    expect(head.text()).toContain(`1/${total}`)
    await head.trigger('click')
    const row = w.findAll('.row').find(r => r.text().includes(trick.title[0]))!
    expect(row.text()).toContain(en.marked.mastered)
  })

  it('emits open with the trick of the clicked row', async () => {
    const w = make('category')
    await w.findAll('button[aria-expanded]').find(h => h.text().includes('Stop'))!.trigger('click')
    const first = categoryRows(useTrickStore().tricks, 'stop')[0].trick
    await w.findAll('.row')[0].trigger('click')
    expect(w.emitted('open')![0]).toEqual([first])
  })
})

describe('useWideScreen', () => {
  const original = window.matchMedia
  afterEach(() => { window.matchMedia = original })

  it('is false without matchMedia', () => {
    window.matchMedia = undefined as never
    const scope = effectScope()
    expect(scope.run(() => useWideScreen())!.value).toBe(false)
    scope.stop()
  })

  it('follows the media query', () => {
    let listener: (e: { matches: boolean }) => void = () => {}
    const remove = vi.fn()
    window.matchMedia = vi.fn(() => ({
      matches: true,
      addEventListener: (_: string, l: typeof listener) => { listener = l },
      removeEventListener: remove,
    })) as never
    const scope = effectScope()
    const wide = scope.run(() => useWideScreen())!
    expect(wide.value).toBe(true)
    listener({ matches: false })
    expect(wide.value).toBe(false)
    scope.stop()
    expect(remove).toHaveBeenCalled()
  })
})
