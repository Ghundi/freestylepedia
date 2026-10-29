import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import CategoryBars from '../../src/components/progress/CategoryBars.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en: { categories: { spin: 'Spin', jump: 'Jump' } } },
})
const rows = [
  { category: 'spin', mastered: 3, total: 12 },
  { category: 'jump', mastered: 0, total: 4 },
]

describe('CategoryBars', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('renders one progressbar per category with aria values', () => {
    const w = mount(CategoryBars, { props: { rows }, global: { plugins: [i18n] } })
    const bars = w.findAll('[role="progressbar"]')
    expect(bars).toHaveLength(2)
    expect(bars[0].attributes('aria-valuenow')).toBe('3')
    expect(bars[0].attributes('aria-valuemin')).toBe('0')
    expect(bars[0].attributes('aria-valuemax')).toBe('12')
    expect(bars[0].attributes('aria-label')).toBe('Spin')
  })

  it('shows mastered over total', () => {
    const w = mount(CategoryBars, { props: { rows }, global: { plugins: [i18n] } })
    expect(w.text()).toContain('3 / 12')
    expect(w.text()).toContain('0 / 4')
  })
})
