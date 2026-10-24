export function frameThumbnailUrl(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hq2.jpg`
}

export function fallbackThumbnailUrl(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
}

export function embedUrl(videoId: string, opts: { autoplay?: boolean, start?: number } = {}): string {
  const { autoplay = true, start = 4 } = opts
  const autoplayParam = autoplay ? '&autoplay=1' : ''
  return `https://www.youtube-nocookie.com/embed/${videoId}?start=${start}${autoplayParam}&playsinline=1&rel=0`
}
