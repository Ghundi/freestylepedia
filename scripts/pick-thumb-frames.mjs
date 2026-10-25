#!/usr/bin/env node
// Maintainer script: picks the best YouTube auto-thumbnail frame (hq1, hq2 or hq3) for every video
// in src/data/tricks.json and writes src/data/thumbFrames.json.
//
//   npm run thumbs
//
// Blackbird's videos often open on a white title card or a logo frame, which YouTube picks as one of the
// three auto-generated frames. Each frame is downloaded, the 16:9 picture inside the 4:3 letterbox is
// scored, and the frame that looks the least like a title card wins. `card: true` means even the best
// frame is still mostly flat white/grey (the UI then inverts it in the dark theme).
//
// Requires ImageMagick (`magick`) on the PATH; no npm dependency. Network access to i.ytimg.com needed.
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const tricks = JSON.parse(readFileSync(join(root, 'src/data/tricks.json'), 'utf8'))
const ids = [...new Set(tricks.flatMap(t => t.videoID))]
const FRAMES = ['hq1', 'hq2', 'hq3']
// ice rinks and night scenes are flat white or black too (up to ~0.8): only a near-uniform frame is a card
const CARD_THRESHOLD = 0.85
const tmp = mkdtempSync(join(tmpdir(), 'thumbs-'))

/**
 * Looks at the 16:9 picture inside the letterbox. Returns `flat` (fraction of flat white/grey or flat black
 * pixels: title cards, logo frames) and a tiny 6x4 colour signature used to spot branding frames that
 * repeat across videos.
 */
export function analyse(file) {
  // crop the letterbox (4:3 -> 16:9: 12.5 % bands top and bottom), shrink, dump as text pixels
  const out = execFileSync('magick', [file, '-gravity', 'center', '-crop', '100%x75%+0+0', '+repage',
    '-resize', '48x27!', '-depth', '8', 'txt:-'], { encoding: 'utf8', maxBuffer: 1 << 24 })
  let flat = 0
  let n = 0
  for (const m of out.matchAll(/\((\d+),(\d+),(\d+)(?:,\d+)?\)/g)) {
    const [r, g, b] = [m[1], m[2], m[3]].map(Number)
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    n++
    if ((min > 170 && max - min < 28) || max < 40) flat++
  }
  const sig = execFileSync('magick', [file, '-gravity', 'center', '-crop', '100%x75%+0+0', '+repage',
    '-resize', '6x4!', '-depth', '8', 'txt:-'], { encoding: 'utf8' })
  const vec = [...sig.matchAll(/\((\d+),(\d+),(\d+)(?:,\d+)?\)/g)].flatMap(m => [m[1], m[2], m[3]].map(Number))
  return { flat: n ? flat / n : 1, vec }
}

const dist = (a, b) => a.reduce((s, v, i) => s + Math.abs(v - b[i]), 0) / a.length

async function download(id, frame) {
  const res = await fetch(`https://i.ytimg.com/vi/${id}/${frame}.jpg`)
  if (!res.ok) return null
  const buf = Buffer.from(await res.arrayBuffer())
  const file = join(tmp, `${id}-${frame}.jpg`)
  writeFileSync(file, buf)
  return file
}

const frames = []
try {
  for (const id of ids) {
    for (const frame of FRAMES) {
      const file = await download(id, frame).catch(() => null)
      if (file) frames.push({ id, frame, ...analyse(file) })
    }
  }
} finally {
  rmSync(tmp, { recursive: true, force: true })
}

// Branding frames (logo splash, end card) look the same in many videos: a frame that has near-twins in at
// least 3 other videos is a card, whatever its colours.
for (const f of frames) {
  const twins = new Set(frames.filter(o => o.id !== f.id && dist(o.vec, f.vec) < 6).map(o => o.id))
  f.score = twins.size >= 3 ? 1 : f.flat
}

const result = {}
for (const id of ids) {
  const own = frames.filter(f => f.id === id)
  if (!own.length) { console.warn(`${id}: no frame reachable, skipped`); continue }
  // keep hq2 (the historical default) unless another frame is clearly better
  let best = own.find(f => f.frame === 'hq2') ?? own[0]
  for (const f of own) if (f.score < best.score - 0.1) best = f
  result[id] = { frame: best.frame, card: best.score > CARD_THRESHOLD }
  console.log(id, best.frame, best.score.toFixed(2), result[id].card ? 'CARD' : '')
}
writeFileSync(join(root, 'src/data/thumbFrames.json'), JSON.stringify(result, null, 2) + '\n')
console.log(`wrote ${Object.keys(result).length} entries`)
