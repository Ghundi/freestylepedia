import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

async function load() {
  const mod = await import('@/scripts/homeView')
  return mod.useHomeView()
}

describe('useHomeView', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.resetModules()
  })

  it('defaults to category', async () => {
    const { view } = await load()
    expect(view.value).toBe('category')
  })

  it('defaults to all on a wide screen', async () => {
    vi.stubGlobal('matchMedia', (q: string) => ({ matches: q === '(min-width: 900px)' }))
    const { view } = await load()
    expect(view.value).toBe('all')
    vi.unstubAllGlobals()
  })

  it('keeps a stored choice on a wide screen', async () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true }))
    localStorage.setItem('homeView', 'category')
    const { view } = await load()
    expect(view.value).toBe('category')
    vi.unstubAllGlobals()
  })

  it('restores all from localStorage', async () => {
    localStorage.setItem('homeView', 'all')
    const { view } = await load()
    expect(view.value).toBe('all')
  })

  it('ignores an unknown stored value', async () => {
    localStorage.setItem('homeView', 'grid')
    const { view } = await load()
    expect(view.value).toBe('category')
  })

  it('persists a change', async () => {
    const { view } = await load()
    view.value = 'all'
    await nextTick()
    expect(localStorage.getItem('homeView')).toBe('all')
  })
})
