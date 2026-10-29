import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import RangeSlider from '../../src/components/ui/RangeSlider.vue'

const mountSlider = (modelValue: [number, number]) =>
  mount(RangeSlider, { props: { modelValue, min: 1, max: 5, minLabel: 'Minimum', maxLabel: 'Maximum' } })
const inputs = (w: ReturnType<typeof mountSlider>) => {
  const [lo, hi] = w.findAll('input[type="range"]')
  return { lo, hi }
}
const lastEmit = (w: ReturnType<typeof mountSlider>) => w.emitted('update:modelValue')!.at(-1)

describe('RangeSlider', () => {
  it('renders two labelled range inputs bound to the value', () => {
    const { lo, hi } = inputs(mountSlider([2, 4]))
    expect((lo.element as HTMLInputElement).value).toBe('2')
    expect((hi.element as HTMLInputElement).value).toBe('4')
    expect(lo.attributes('aria-label')).toBe('Minimum')
    expect(hi.attributes('aria-label')).toBe('Maximum')
    expect(lo.attributes('min')).toBe('1')
    expect(hi.attributes('max')).toBe('5')
  })

  it('emits the new pair when a thumb moves', async () => {
    const w = mountSlider([2, 4])
    await inputs(w).lo.setValue('3')
    expect(lastEmit(w)).toEqual([[3, 4]])
  })

  it('clamps the min thumb at the max thumb', async () => {
    const w = mountSlider([2, 3])
    const { lo } = inputs(w)
    await lo.setValue('5')
    expect(lastEmit(w)).toEqual([[3, 3]])
    expect((lo.element as HTMLInputElement).value).toBe('3')
  })

  it('clamps the max thumb at the min thumb', async () => {
    const w = mountSlider([3, 4])
    const { hi } = inputs(w)
    await hi.setValue('1')
    expect(lastEmit(w)).toEqual([[3, 3]])
    expect((hi.element as HTMLInputElement).value).toBe('3')
  })

  it('lifts the thumb that can still move when both sit at an end', () => {
    let { lo, hi } = inputs(mountSlider([5, 5]))
    expect(lo.classes()).toContain('on-top')
    expect(hi.classes()).not.toContain('on-top')
    ;({ lo, hi } = inputs(mountSlider([1, 1])))
    expect(hi.classes()).toContain('on-top')
    expect(lo.classes()).not.toContain('on-top')
  })

  it('shows a numbered tick for every step', () => {
    const ticks = mountSlider([1, 5]).findAll('.tick')
    expect(ticks.map(t => t.text())).toEqual(['1', '2', '3', '4', '5'])
  })

  it('moves the nearest thumb to a tapped tick', async () => {
    const w = mountSlider([2, 4])
    const ticks = w.findAll('.tick')
    await ticks[4].trigger('click')
    expect(lastEmit(w)).toEqual([[2, 5]])
    await ticks[0].trigger('click')
    expect(lastEmit(w)).toEqual([[1, 4]])
    await ticks[2].trigger('click')
    expect(lastEmit(w)).toEqual([[3, 4]])
  })

  it('marks the ticks inside the chosen range', () => {
    const ticks = mountSlider([2, 4]).findAll('.tick')
    expect(ticks.map(t => t.classes().includes('tick--in'))).toEqual([false, true, true, true, false])
  })

  it('does not repeat the values above the thumbs', () => {
    expect(mountSlider([2, 4]).find('.bubble').exists()).toBe(false)
  })
})
