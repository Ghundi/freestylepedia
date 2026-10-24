import { describe, it, expect } from 'vitest'
import { frameThumbnailUrl, fallbackThumbnailUrl, embedUrl } from '../../src/scripts/trickMedia'

describe('trickMedia', () => {
  it('builds the frame thumbnail url', () => {
    expect(frameThumbnailUrl('abc')).toBe('https://i.ytimg.com/vi/abc/hq2.jpg')
  })
  it('builds the fallback thumbnail url', () => {
    expect(fallbackThumbnailUrl('abc')).toBe('https://i.ytimg.com/vi/abc/hqdefault.jpg')
  })
  it('builds the embed url with defaults', () => {
    expect(embedUrl('abc')).toBe('https://www.youtube-nocookie.com/embed/abc?start=4&autoplay=1&playsinline=1&rel=0')
  })
  it('omits autoplay when disabled and honours start', () => {
    expect(embedUrl('abc', { autoplay: false })).toBe('https://www.youtube-nocookie.com/embed/abc?start=4&playsinline=1&rel=0')
    expect(embedUrl('abc', { start: 10 })).toContain('start=10')
  })
})
