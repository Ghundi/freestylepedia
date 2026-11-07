import { afterEach, describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import VideoPlayer from '../../src/components/trick/VideoPlayer.vue'

const i18n = createI18n({ legacy: false, locale: 'en', messages: { en: { video: { offline: 'You are offline' } } } })
const mountPlayer = (videoId = 'abc') =>
  mount(VideoPlayer, { props: { videoId, title: 'Hawk Stop' }, global: { plugins: [i18n] } })

describe('VideoPlayer', () => {
  afterEach(() => { vi.restoreAllMocks() })

  it('offline, says so instead of loading a frame that would show the browser error page', () => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false)
    const w = mountPlayer()
    expect(w.find('iframe').exists()).toBe(false)
    expect(w.get('[role="status"]').text()).toBe('You are offline')
  })

  it('shows the frame once the connection is back', async () => {
    const online = vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false)
    const w = mountPlayer()
    online.mockReturnValue(true)
    window.dispatchEvent(new Event('online'))
    await w.vm.$nextTick()
    expect(w.find('iframe').exists()).toBe(true)
    expect(w.find('[role="status"]').exists()).toBe(false)
  })

  it('shows the YouTube frame right away, with no poster or play button of its own', () => {
    const w = mountPlayer()
    expect(w.find('button').exists()).toBe(false)
    expect(w.find('img').exists()).toBe(false)
    const src = w.get('iframe').attributes('src')!
    expect(src.startsWith('https://www.youtube-nocookie.com/embed/abc?')).toBe(true)
    expect(src).toContain('start=4')
    expect(w.get('iframe').attributes('title')).toBe('Hawk Stop')
  })

  it('leaves playback to YouTube: no autoplay and no player API', () => {
    const w = mountPlayer()
    const src = w.get('iframe').attributes('src')!
    expect(src).not.toContain('autoplay')
    expect(src).not.toContain('enablejsapi')
    expect(document.querySelector('script[src*="iframe_api"]')).toBeNull()
  })

  it('replaces the frame instead of changing its src when the video changes', async () => {
    const w = mountPlayer()
    const first = w.get('iframe').element
    await w.setProps({ videoId: 'def' })
    expect(w.get('iframe').element).not.toBe(first)
    expect(w.get('iframe').attributes('src')).toContain('/embed/def?')
  })
})
