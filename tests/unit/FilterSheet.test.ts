import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import en from '../../src/locales/en.json'
import FilterSheet from '../../src/components/home/FilterSheet.vue'
import {
  useCurSearchStore, useMarkedStore, useSelCategoryStore, useSelDifficultyStore, useSelSortingOrderStore,
} from '../../src/scripts/store'

const i18n = createI18n({ legacy: false, locale: 'en', messages: { en } })
// closed: the <dialog> stays in the DOM, so its controls can be driven without showModal (absent in jsdom)
const mountSheet = () => mount(FilterSheet, { props: { open: false }, global: { plugins: [i18n] } })

describe('FilterSheet', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('drives the difficulty store from the level slider', async () => {
    const w = mountSheet()
    const [min, max] = w.findAll('input[type="range"]')
    await min.setValue('2')
    expect(useSelDifficultyStore().val).toEqual([2, 5])
    await max.setValue('4')
    expect(useSelDifficultyStore().val).toEqual([2, 4])
  })

  it('binds category checkboxes to the selected categories', async () => {
    const w = mountSheet()
    await w.get('input[value="spin"]').setValue(true)
    expect(useSelCategoryStore().categories).toEqual(['spin'])
  })

  it('reset clears filters but keeps the sort order', async () => {
    const w = mountSheet()
    useSelCategoryStore().update(['spin'])
    useSelDifficultyStore().update([2, 3])
    useMarkedStore().update(['todo'])
    useCurSearchStore().update('x')
    useSelSortingOrderStore().update('nameUp')
    await w.findAll('button').find(b => b.text() === en.home.reset)!.trigger('click')
    expect(useSelCategoryStore().categories).toEqual([])
    expect(useSelDifficultyStore().val).toEqual([1, 5])
    expect(useMarkedStore().selMarkers).toEqual(['mastered', 'non-mastered'])
    expect(useCurSearchStore().val).toBeNull()
    expect(useSelSortingOrderStore().by).toBe('nameUp')
  })
})
