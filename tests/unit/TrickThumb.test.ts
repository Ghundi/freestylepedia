import { describe, it, expect, beforeEach } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createI18n } from 'vue-i18n'
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

  it('shows level and links to the trick page', () => {
    const w = mountThumb()
    expect(w.text()).toContain('Level 2')
    expect(w.findComponent(RouterLinkStub).props('to')).toMatchObject({
      name: 'Trick', params: { trickname: 'Spin' },
    })
  })
})
