import { describe, it, expect } from 'vitest'
import thumbFrames from '../../src/data/thumbFrames.json'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import localThumbs from '../../src/data/localThumbs.json'
import tricks from '../../src/data/tricks.json'
import { thumbFrameInfo, frameThumbnailUrl, fallbackThumbnailUrl, embedUrl, hasLocalThumb } from '../../src/scripts/trickMedia'

describe('trickMedia', () => {
  it('builds the frame thumbnail url', () => {
    expect(frameThumbnailUrl('abc')).toBe('https://i.ytimg.com/vi/abc/hq2.jpg')
  })
  it('uses the picked frame when the video is known', () => {
    const [id, info] = Object.entries(thumbFrames as Record<string, { frame: string }>).find(([, v]) => v.frame !== 'hq2')!
    expect(frameThumbnailUrl(id)).toBe(`https://i.ytimg.com/vi/${id}/${info.frame}.jpg`)
  })
  it('defaults to hq2 and no card for an unknown video', () => {
    expect(thumbFrameInfo('unknown-id')).toEqual({ frame: 'hq2', card: false })
  })
  it('lists only videos whose extracted frames exist in public/thumbs', () => {
    for (const id of localThumbs) {
      expect(hasLocalThumb(id)).toBe(true)
      for (const w of [480, 960]) expect(existsSync(resolve(__dirname, `../../public/thumbs/${id}-${w}.webp`))).toBe(true)
    }
    expect(hasLocalThumb('abc')).toBe(false)
  })
  it('covers every released trick video', () => {
    const ids = (tricks as { videoID: string[] }[]).flatMap(t => t.videoID).filter(id => id !== 'TMP')
    expect(ids.filter(id => !hasLocalThumb(id))).toEqual([])
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
