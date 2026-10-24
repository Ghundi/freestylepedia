// Pick a readable label colour for a (possibly translucent) background colour.
const DARK_TEXT = '#111214'
const LIGHT_TEXT = '#f2f2f0'

type RGB = [number, number, number]

function parse(css: string): { rgb: RGB; a: number } {
  const c = css.trim()
  if (c.startsWith('#')) {
    const h = c.length === 4 ? c.slice(1).split('').map(x => x + x).join('') : c.slice(1, 7)
    return { rgb: [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)) as RGB, a: 1 }
  }
  const m = c.match(/rgba?\(([^)]+)\)/)
  if (!m) return { rgb: [0, 0, 0], a: 1 }
  const p = m[1].split(',').map(s => parseFloat(s))
  return { rgb: [p[0], p[1], p[2]], a: p[3] ?? 1 }
}

function luminance([r, g, b]: RGB): number {
  const f = (v: number) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}

function ratio(l1: number, l2: number): number {
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1]
  return (hi + 0.05) / (lo + 0.05)
}

/** Text colour with the higher contrast on `color` composited over `pageBg`. */
export function readableTextColor(color: string, pageBg: string): string {
  const fg = parse(color)
  const bg = parse(pageBg).rgb
  const mixed = fg.rgb.map((v, i) => v * fg.a + bg[i] * (1 - fg.a)) as RGB
  const l = luminance(mixed)
  return ratio(l, luminance(parse(DARK_TEXT).rgb)) >= ratio(l, luminance(parse(LIGHT_TEXT).rgb))
    ? DARK_TEXT
    : LIGHT_TEXT
}
