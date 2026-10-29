/** The part of the YouTube IFrame Player API the trick page uses. */
export interface YouTubePlayer {
  mute(): void
  playVideo(): void
  destroy(): void
}

export interface YouTubePlayerEvent {
  target: YouTubePlayer
}

export interface YouTubeApi {
  Player: new (
    el: HTMLIFrameElement,
    opts: { events: { onAutoplayBlocked?: (e: YouTubePlayerEvent) => void } },
  ) => YouTubePlayer
}

type ApiWindow = Window & { YT?: YouTubeApi, onYouTubeIframeAPIReady?: () => void }

const SCRIPT_URL = 'https://www.youtube.com/iframe_api'
const TIMEOUT_MS = 10_000

let pending: Promise<YouTubeApi> | undefined

/**
 * Load the YouTube IFrame Player API once and resolve with `window.YT`.
 * Rejects when the script is blocked or never answers; the next call tries again.
 */
export function loadYouTubeApi(): Promise<YouTubeApi> {
  const win = window as ApiWindow
  if (win.YT?.Player) return Promise.resolve(win.YT)
  if (pending) return pending

  pending = new Promise<YouTubeApi>((resolve, reject) => {
    const script = document.createElement('script')
    const fail = (reason: string) => {
      clearTimeout(timer)
      script.remove()
      pending = undefined
      reject(new Error(reason))
    }
    const timer = setTimeout(() => fail('YouTube API timed out'), TIMEOUT_MS)

    const previousReady = win.onYouTubeIframeAPIReady
    win.onYouTubeIframeAPIReady = () => {
      previousReady?.()
      clearTimeout(timer)
      if (win.YT?.Player) resolve(win.YT)
      else fail('YouTube API loaded without a player')
    }

    script.src = SCRIPT_URL
    script.async = true
    script.addEventListener('error', () => fail('YouTube API blocked'))
    document.head.append(script)
  })
  return pending
}
