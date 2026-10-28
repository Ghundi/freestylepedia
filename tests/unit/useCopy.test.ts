import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { useCopy } from '../../src/scripts/useCopy'

function setup(text = 'https://x.test/a') {
  let api!: ReturnType<typeof useCopy>
  mount(defineComponent({ setup() { api = useCopy(() => text, 1000); return () => h('div') } }))
  return api
}
function clipboard(impl: () => Promise<void>) {
  const writeText = vi.fn(impl)
  Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
  return writeText
}
function selectionCopy(result: boolean) {
  const execCommand = vi.fn(() => result)
  Object.defineProperty(document, 'execCommand', { value: execCommand, configurable: true })
  return execCommand
}

describe('useCopy', () => {
  afterEach(() => { vi.useRealTimers() })

  it('reports success for a moment, then resets', async () => {
    vi.useFakeTimers()
    const writeText = clipboard(() => Promise.resolve())
    const c = setup()
    await c.copy()
    expect(writeText).toHaveBeenCalledWith('https://x.test/a')
    expect(c.copied.value).toBe(true)
    expect(c.failed.value).toBe(false)
    vi.advanceTimersByTime(1000)
    expect(c.copied.value).toBe(false)
  })

  it('reports a failure instead of staying silent, and clears it on the next success', async () => {
    clipboard(() => Promise.reject(new Error('denied')))
    selectionCopy(false)
    const c = setup()
    await c.copy()
    expect(c.failed.value).toBe(true)
    expect(c.copied.value).toBe(false)
    clipboard(() => Promise.resolve())
    await c.copy()
    expect(c.failed.value).toBe(false)
    expect(c.copied.value).toBe(true)
  })

  it('reset clears both flags', async () => {
    clipboard(() => Promise.reject(new Error('denied')))
    selectionCopy(false)
    const c = setup()
    await c.copy()
    c.reset()
    expect(c.failed.value).toBe(false)
  })

  it('falls back to a selection copy when the Clipboard API is missing', async () => {
    Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true })
    const execCommand = selectionCopy(true)
    const c = setup()
    await c.copy()
    expect(execCommand).toHaveBeenCalledWith('copy')
    expect(c.copied.value).toBe(true)
    expect(c.failed.value).toBe(false)
    expect(document.body.querySelector('textarea')).toBeNull()
  })

  it('falls back when the Clipboard API rejects', async () => {
    clipboard(() => Promise.reject(new Error('insecure')))
    selectionCopy(true)
    const c = setup()
    await c.copy()
    expect(c.copied.value).toBe(true)
  })

  it('fails when both ways fail', async () => {
    clipboard(() => Promise.reject(new Error('denied')))
    selectionCopy(false)
    const c = setup()
    await c.copy()
    expect(c.failed.value).toBe(true)
    expect(c.copied.value).toBe(false)
  })
})
