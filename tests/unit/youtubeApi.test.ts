import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

type Win = Window & { YT?: unknown, onYouTubeIframeAPIReady?: () => void }
const win = window as Win
const apiScripts = () => document.querySelectorAll('script[src="https://www.youtube.com/iframe_api"]')

// the module caches its promise: load a fresh copy for every test
const load = async () => (await import('../../src/scripts/youtubeApi')).loadYouTubeApi

describe('loadYouTubeApi', () => {
  beforeEach(() => { vi.resetModules() })
  afterEach(() => {
    vi.useRealTimers()
    apiScripts().forEach(s => s.remove())
    delete win.YT
    delete win.onYouTubeIframeAPIReady
  })

  it('resolves at once when the API is already on the page', async () => {
    const YT = { Player: class {} }
    win.YT = YT
    await expect((await load())()).resolves.toBe(YT)
    expect(apiScripts()).toHaveLength(0)
  })

  it('injects the script once and resolves when YouTube calls back', async () => {
    const loadYouTubeApi = await load()
    const first = loadYouTubeApi()
    const second = loadYouTubeApi()
    expect(second).toBe(first)
    expect(apiScripts()).toHaveLength(1)
    const YT = { Player: class {} }
    win.YT = YT
    win.onYouTubeIframeAPIReady!()
    await expect(first).resolves.toBe(YT)
  })

  it('keeps a ready callback set by someone else', async () => {
    const other = vi.fn()
    win.onYouTubeIframeAPIReady = other
    const pending = (await load())()
    win.YT = { Player: class {} }
    win.onYouTubeIframeAPIReady!()
    await pending
    expect(other).toHaveBeenCalledTimes(1)
  })

  it('rejects when the script fails, and tries again on the next call', async () => {
    const loadYouTubeApi = await load()
    const failed = loadYouTubeApi()
    apiScripts()[0].dispatchEvent(new Event('error'))
    await expect(failed).rejects.toThrow()
    expect(apiScripts()).toHaveLength(0)
    loadYouTubeApi()
    expect(apiScripts()).toHaveLength(1)
  })

  it('rejects when YouTube never answers', async () => {
    vi.useFakeTimers()
    const pending = (await load())()
    vi.advanceTimersByTime(10_000)
    await expect(pending).rejects.toThrow()
  })
})
