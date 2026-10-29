import { describe, it, expect, beforeEach } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import thumbFrames from '../../src/data/thumbFrames.json'
import localThumbs from '../../src/data/localThumbs.json'
import YtThumb from '../../src/components/ui/YtThumb.vue'
import TrickThumb from '../../src/components/ui/TrickThumb.vue'
import { useMasteredStore } from '../../src/scripts/store'
import type { Trick } from '../../src/scripts/trickStore'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en: { level: 'Level {n}', new: 'New', marked: { mastered: 'Mastered', todo: 'Todo' } } },
})

const trick = { trickID: '0001', title: ['Spin'], difficulty: 2, category: 'spin',
  releaseDate: new Date('2024-01-01'), videoID: ['abc'], requirements: [], connections: [] } as unknown as Trick

describe('YtThumb', () => {
  it('serves the extracted frame with a srcset when there is one, and falls back to YouTube if it fails', async () => {
    const id = localThumbs[0]
    const w = mount(YtThumb, { props: { videoId: id, alt: 'x' } })
    const img = w.get('img')
    expect(img.attributes('src')).toBe(`/thumbs/${id}-480.webp`)
    expect(img.attributes('srcset')).toBe(`/thumbs/${id}-480.webp 480w, /thumbs/${id}-960.webp 960w`)
    expect(img.attributes('sizes')).toBeTruthy()
    expect(w.classes()).toContain('local')
    expect(w.classes()).not.toContain('card')
    await img.trigger('error')
    expect(w.get('img').attributes('src')).toContain('i.ytimg.com')
    expect(w.get('img').attributes('srcset')).toBeUndefined()
  })

  it('flags a title-card frame with the card class', () => {
    const cardId = 'card-test-id'
    ;(thumbFrames as Record<string, unknown>)[cardId] = { frame: 'hq1', card: true }
    const w = mount(YtThumb, { props: { videoId: cardId, alt: 'x' } })
    expect(w.classes()).toContain('card')
    expect(w.get('img').attributes('src')).toContain('hq1.jpg')
    expect(mount(YtThumb, { props: { videoId: 'abc', alt: 'x' } }).classes()).not.toContain('card')
    delete (thumbFrames as Record<string, unknown>)[cardId]
  })

  it('falls back to hqdefault when hq2 fails', async () => {
    const w = mount(YtThumb, { props: { videoId: 'abc', alt: 'x' } })
    expect(w.get('img').attributes('src')).toContain('hq2.jpg')
    await w.get('img').trigger('error')
    expect(w.get('img').attributes('src')).toContain('hqdefault.jpg')
  })

  it('falls back when YouTube returns the 120px placeholder', async () => {
    const w = mount(YtThumb, { props: { videoId: 'abc', alt: 'x' } })
    const img = w.get('img')
    Object.defineProperty(img.element, 'naturalWidth', { value: 120 })
    await img.trigger('load')
    expect(img.attributes('src')).toContain('hqdefault.jpg')
    await img.trigger('error')
    expect(img.attributes('src')).toContain('hqdefault.jpg')
  })

  it('hides the image, leaving the empty box, when the fallback fails too', async () => {
    const w = mount(YtThumb, { props: { videoId: 'abc', alt: 'x' } })
    await w.get('img').trigger('error')
    expect(w.get('img').attributes('src')).toContain('hqdefault.jpg')
    await w.get('img').trigger('error')
    expect(w.find('img').exists()).toBe(false)
    expect(w.find('.yt-thumb').exists()).toBe(true)
  })

  it('shows the image again for a new video after a double failure', async () => {
    const w = mount(YtThumb, { props: { videoId: 'abc', alt: 'x' } })
    await w.get('img').trigger('error')
    await w.get('img').trigger('error')
    await w.setProps({ videoId: 'def' })
    expect(w.get('img').attributes('src')).toContain('/vi/def/hq2.jpg')
  })

  it('keeps hq2 when the image is large enough', async () => {
    const w = mount(YtThumb, { props: { videoId: 'abc', alt: 'x' } })
    Object.defineProperty(w.get('img').element, 'naturalWidth', { value: 480 })
    await w.get('img').trigger('load')
    expect(w.get('img').attributes('src')).toContain('hq2.jpg')
  })
})

describe('TrickThumb', () => {
  beforeEach(() => setActivePinia(createPinia()))

  const mountThumb = (pinia = createPinia()) =>
    mount(TrickThumb, {
      props: { trick },
      global: { plugins: [pinia, i18n], stubs: { 'router-link': RouterLinkStub } },
    })

  it('shows the mastered mark only for mastered tricks', () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    expect(mountThumb(pinia).text()).not.toContain('Mastered')
    useMasteredStore().list.push('0001')
    expect(mountThumb(pinia).text()).toContain('Mastered')
  })

  it('gives the image an empty alt: the link already names the trick', () => {
    expect(mountThumb().get('img').attributes('alt')).toBe('')
  })

  it('shows level and links to the trick page', () => {
    const w = mountThumb()
    expect(w.text()).toContain('Level 2')
    expect(w.findComponent(RouterLinkStub).props('to')).toMatchObject({
      name: 'Trick', params: { trickname: 'Spin' },
    })
  })
})
