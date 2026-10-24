import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import VideoPlayer from '../../src/components/trick/VideoPlayer.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en: { video: { play: 'Play {name}' } } },
})

const mountPlayer = (videoId = 'abc') =>
  mount(VideoPlayer, { props: { videoId, title: 'Hawk Stop' }, global: { plugins: [i18n] } })

describe('VideoPlayer', () => {
  it('shows the poster and no iframe before play', () => {
    const w = mountPlayer()
    expect(w.find('iframe').exists()).toBe(false)
    expect(w.get('img').attributes('src')).toContain('/vi/abc/')
    expect(w.get('button').attributes('aria-label')).toBe('Play Hawk Stop')
  })

  it('loads the nocookie iframe with start=4 and autoplay after click', async () => {
    const w = mountPlayer()
    await w.get('button').trigger('click')
    const iframe = w.get('iframe')
    const src = iframe.attributes('src')!
    expect(src.startsWith('https://www.youtube-nocookie.com/embed/abc?')).toBe(true)
    expect(src).toContain('start=4')
    expect(src).toContain('autoplay=1')
    expect(iframe.attributes('allow')).toBe('autoplay; encrypted-media; picture-in-picture; fullscreen')
    expect(iframe.attributes('title')).toBe('Hawk Stop')
    expect(w.find('img').exists()).toBe(false)
  })

  it('resets to the poster when videoId changes', async () => {
    const w = mountPlayer()
    await w.get('button').trigger('click')
    expect(w.find('iframe').exists()).toBe(true)
    await w.setProps({ videoId: 'def' })
    expect(w.find('iframe').exists()).toBe(false)
    expect(w.get('img').attributes('src')).toContain('/vi/def/')
  })
})
