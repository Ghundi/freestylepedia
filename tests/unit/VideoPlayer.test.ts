import { beforeEach, describe, it, expect, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import VideoPlayer from '../../src/components/trick/VideoPlayer.vue'
import { loadYouTubeApi } from '../../src/scripts/youtubeApi'

vi.mock('../../src/scripts/youtubeApi', () => ({ loadYouTubeApi: vi.fn() }))

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en: { video: { play: 'Play {name}' } } },
})

const mountPlayer = (videoId = 'abc') =>
  mount(VideoPlayer, { props: { videoId, title: 'Hawk Stop' }, global: { plugins: [i18n] } })

// Stand-in for YT.Player: records the element and events it was given.
function fakeApi() {
  const calls: string[] = []
  const player = {
    mute: vi.fn(() => { calls.push('mute') }),
    playVideo: vi.fn(() => { calls.push('playVideo') }),
    destroy: vi.fn(),
  }
  const created: { el: HTMLIFrameElement, events: Record<string, (e: { target: typeof player }) => void> }[] = []
  class Player {
    constructor(el: HTMLIFrameElement, opts: { events: Record<string, (e: { target: typeof player }) => void> }) {
      created.push({ el, events: opts.events })
      return player
    }
  }
  vi.mocked(loadYouTubeApi).mockResolvedValue({ Player } as never)
  return { player, created, calls }
}

describe('VideoPlayer', () => {
  beforeEach(() => { vi.mocked(loadYouTubeApi).mockReset() })

  it('shows the poster and no iframe before play', () => {
    fakeApi()
    const w = mountPlayer()
    expect(w.find('iframe').exists()).toBe(false)
    expect(w.get('img').attributes('src')).toContain('/vi/abc/')
    expect(w.get('button').attributes('aria-label')).toBe('Play Hawk Stop')
    expect(loadYouTubeApi).not.toHaveBeenCalled()
  })

  it('loads the nocookie iframe with start=4, autoplay and the player API after click', async () => {
    fakeApi()
    const w = mountPlayer()
    await w.get('button').trigger('click')
    const iframe = w.get('iframe')
    const src = iframe.attributes('src')!
    expect(src.startsWith('https://www.youtube-nocookie.com/embed/abc?')).toBe(true)
    expect(src).toContain('start=4')
    expect(src).toContain('autoplay=1')
    expect(src).toContain('enablejsapi=1')
    expect(iframe.attributes('allow')).toBe('autoplay; encrypted-media; picture-in-picture; fullscreen')
    expect(iframe.attributes('title')).toBe('Hawk Stop')
    expect(w.find('img').exists()).toBe(false)
  })

  it('starts loading the YouTube API on the click itself, before the frame renders', () => {
    fakeApi()
    const w = mountPlayer()
    w.get('button').trigger('click')
    expect(loadYouTubeApi).toHaveBeenCalledTimes(1)
  })

  it('attaches the player to the iframe it rendered', async () => {
    const { created } = fakeApi()
    const w = mountPlayer()
    await w.get('button').trigger('click')
    await flushPromises()
    expect(created).toHaveLength(1)
    expect(created[0].el).toBe(w.get('iframe').element)
  })

  it('mutes and retries when the browser blocks autoplay with sound', async () => {
    const { player, created, calls } = fakeApi()
    const w = mountPlayer()
    await w.get('button').trigger('click')
    await flushPromises()
    created[0].events.onAutoplayBlocked({ target: player })
    expect(calls).toEqual(['mute', 'playVideo'])
  })

  it('keeps the plain iframe when the YouTube API cannot load', async () => {
    vi.mocked(loadYouTubeApi).mockRejectedValue(new Error('blocked'))
    const w = mountPlayer()
    await w.get('button').trigger('click')
    await flushPromises()
    expect(w.find('iframe').exists()).toBe(true)
  })

  it('destroys the player and resets to the poster when the trick changes', async () => {
    const { player } = fakeApi()
    const w = mountPlayer()
    await w.get('button').trigger('click')
    await flushPromises()
    await w.setProps({ videoId: 'def' })
    expect(player.destroy).toHaveBeenCalledTimes(1)
    expect(w.find('iframe').exists()).toBe(false)
    expect(w.get('img').attributes('src')).toContain('/vi/def/')
  })

  it('destroys the player on unmount', async () => {
    const { player } = fakeApi()
    const w = mountPlayer()
    await w.get('button').trigger('click')
    await flushPromises()
    w.unmount()
    expect(player.destroy).toHaveBeenCalledTimes(1)
  })
})
