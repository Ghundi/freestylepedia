import { describe, it, expect } from 'vitest'
import { readableTextColor } from '@/scripts/contrast'

describe('readableTextColor', () => {
  it('uses light text on dark navy', () => {
    expect(readableTextColor('#10143a', '#111214')).toBe('#f2f2f0')
  })
  it('uses dark text on light yellow', () => {
    expect(readableTextColor('#fff700', '#111214')).toBe('#111214')
  })
  it('composites translucent colours over the page background', () => {
    // same rgba: dark page makes it dark, light page makes it light
    expect(readableTextColor('rgba(23,35,255,0.53)', '#111214')).toBe('#f2f2f0')
    expect(readableTextColor('rgba(252,247,0,0.76)', '#f6f6f4')).toBe('#111214')
  })
})
