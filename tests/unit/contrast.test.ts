import { describe, it, expect } from 'vitest'
import { readableTextColor, visibleOnBackground } from '@/scripts/contrast'

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

describe('visibleOnBackground', () => {
  const contrast = (a: string, b: string) => {
    const lum = (hex: string) => {
      const [r, g, bl] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
        .map(s => (s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4))
      return 0.2126 * r + 0.7152 * g + 0.0722 * bl
    }
    const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x)
    return (hi + 0.05) / (lo + 0.05)
  }
  it('lightens translucent navy on the dark page to at least 3:1', () => {
    const c = visibleOnBackground('rgba(23,35,255,0.53)', '#111214', 'dark')
    expect(contrast(c, '#111214')).toBeGreaterThanOrEqual(3)
  })
  it('darkens a pale yellow on the light page to at least 3:1', () => {
    const c = visibleOnBackground('rgba(252,247,0,0.76)', '#f6f6f4', 'light')
    expect(contrast(c, '#f6f6f4')).toBeGreaterThanOrEqual(3)
  })
  it('keeps the hue of a colour that already passes', () => {
    expect(visibleOnBackground('#fff700', '#111214', 'dark')).toBe('#fff700')
  })
  it('reaches 3:1 for every category colour on both pages', () => {
    for (const c of ['rgba(151,0,197,0.48)', 'rgba(152,221,69,0.75)', 'rgba(255,136,0,0.68)', '#e03030', 'rgba(6,187,211,0.78)']) {
      expect(contrast(visibleOnBackground(c, '#111214', 'dark'), '#111214')).toBeGreaterThanOrEqual(3)
      expect(contrast(visibleOnBackground(c, '#f6f6f4', 'light'), '#f6f6f4')).toBeGreaterThanOrEqual(3)
    }
  })
})
