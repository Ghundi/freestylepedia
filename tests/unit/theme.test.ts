import { beforeEach, describe, expect, it, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

function mockMatchMedia(matches: { dark?: boolean; light?: boolean }) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches:
      (query.includes('dark') && !!matches.dark) ||
      (query.includes('light') && !!matches.light),
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia
}

async function load() {
  const mod = await import('@/scripts/theme')
  mod.__resetThemeForTests()
  return mod
}

describe('theme', () => {
  beforeEach(() => {
    localStorage.clear()
    delete document.documentElement.dataset.theme
    vi.resetModules()
  })

  it('resolves to dark when the system declares nothing', async () => {
    mockMatchMedia({})
    const { useThemeMode } = await load()
    const t = useThemeMode()
    expect(t.mode.value).toBe('system')
    expect(t.resolved.value).toBe('dark')
  })

  it('follows a light system preference', async () => {
    mockMatchMedia({ light: true })
    const { useThemeMode } = await load()
    expect(useThemeMode().resolved.value).toBe('light')
  })

  it('manual mode wins and is persisted', async () => {
    mockMatchMedia({ dark: true })
    const { useThemeMode } = await load()
    const t = useThemeMode()
    t.setMode('light')
    expect(localStorage.getItem('themeMode')).toBe('light')
    expect(t.resolved.value).toBe('light')
  })

  it('initTheme writes data-theme', async () => {
    mockMatchMedia({})
    const { initTheme } = await load()
    initTheme()
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('initTheme keeps the theme-color meta on the resolved theme background', async () => {
    mockMatchMedia({})
    document.head.innerHTML = '<meta name="theme-color" content="#000000">'
    const meta = document.querySelector('meta[name="theme-color"]')!
    const { initTheme, useThemeMode } = await load()
    initTheme()
    expect(meta.getAttribute('content')).toBe('#111214')
    useThemeMode().setMode('light')
    expect(meta.getAttribute('content')).toBe('#f6f6f4')
  })

  it('theme-color values match the --bg tokens', async () => {
    const css = readFileSync(resolve(__dirname, '../../src/styles/tokens.css'), 'utf8')
    const bg = (theme: string) =>
      css.match(new RegExp(`data-theme='${theme}'\\]\\s*\\{[^}]*--bg:\\s*([^;]+);`))?.[1]
    const { THEME_COLORS } = await load()
    expect(THEME_COLORS).toEqual({ dark: bg('dark'), light: bg('light') })
  })
})
