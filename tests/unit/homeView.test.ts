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
