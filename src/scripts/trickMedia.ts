import thumbFrames from '../data/thumbFrames.json'
import localThumbs from '../data/localThumbs.json'

type FrameInfo = { frame: 'hq1' | 'hq2' | 'hq3'; card: boolean }
const frames = thumbFrames as Record<string, FrameInfo>

// Videos with a frame extracted from the video itself, served from public/thumbs/<id>-<width>.webp (16:9).
const local = new Set<string>(localThumbs)
export const LOCAL_THUMB_WIDTHS = [480, 960] as const

export function hasLocalThumb(videoId: string): boolean {
  return local.has(videoId)
}

export function localThumbUrl(videoId: string, width: number = LOCAL_THUMB_WIDTHS[0]): string {
  return `${import.meta.env.BASE_URL}thumbs/${videoId}-${width}.webp`
}

export function localThumbSrcset(videoId: string): string {
  return LOCAL_THUMB_WIDTHS.map(w => `${localThumbUrl(videoId, w)} ${w}w`).join(', ')
}

/** Picked frame for a video (see scripts/pick-thumb-frames.mjs); hq2 and not a card when unknown. */
export function thumbFrameInfo(videoId: string): FrameInfo {
  return frames[videoId] ?? { frame: 'hq2', card: false }
}

export function frameThumbnailUrl(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/${thumbFrameInfo(videoId).frame}.jpg`
}

export function fallbackThumbnailUrl(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
}

export function embedUrl(videoId: string, opts: { autoplay?: boolean, start?: number } = {}): string {
  const { autoplay = true, start = 4 } = opts
  const autoplayParam = autoplay ? '&autoplay=1' : ''
  return `https://www.youtube-nocookie.com/embed/${videoId}?start=${start}${autoplayParam}&playsinline=1&rel=0`
}
