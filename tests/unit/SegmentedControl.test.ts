import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SegmentedControl from '../../src/components/ui/SegmentedControl.vue'

const options = [
  { value: 'category', label: 'By category' },
  { value: 'all', label: 'All' },
]

describe('SegmentedControl', () => {
  it('emits the next value on ArrowRight', async () => {
    const w = mount(SegmentedControl, { props: { modelValue: 'category', options, label: 'View' } })
    await w.get('[aria-checked="true"]').trigger('keydown', { key: 'ArrowRight' })
    expect(w.emitted('update:modelValue')![0]).toEqual(['all'])
  })

  it('wraps to the last value on ArrowLeft from the first', async () => {
    const w = mount(SegmentedControl, { props: { modelValue: 'category', options, label: 'View' } })
    await w.get('[aria-checked="true"]').trigger('keydown', { key: 'ArrowLeft' })
    expect(w.emitted('update:modelValue')![0]).toEqual(['all'])
  })

  it('exposes a labelled radiogroup with one tab stop', () => {
    const w = mount(SegmentedControl, { props: { modelValue: 'all', options, label: 'View' } })
    expect(w.get('[role="radiogroup"]').attributes('aria-label')).toBe('View')
    expect(w.findAll('[tabindex="0"]')).toHaveLength(1)
  })
})
