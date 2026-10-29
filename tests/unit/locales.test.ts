import { describe, expect, it } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { pluralPl } from '../../src/scripts/pluralRules'

const dir = join(__dirname, '../../src/locales')
const load = (file: string) => JSON.parse(readFileSync(join(dir, file), 'utf8'))

function flat(obj: Record<string, unknown>, prefix = '', out: Record<string, string> = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k
    if (v && typeof v === 'object') flat(v as Record<string, unknown>, key, out)
    else out[key] = String(v)
  }
  return out
}
const placeholders = (s: string) => [...new Set([...s.matchAll(/\{(\w+)\}/g)].map(m => m[1]))].sort()

const en = flat(load('en.json'))
const files = readdirSync(dir).filter(f => f.endsWith('.json') && f !== 'en.json')

describe('locale files', () => {
  it.each(files)('%s has exactly the keys of en.json', (file) => {
    const keys = Object.keys(flat(load(file)))
    expect(keys.filter(k => !(k in en))).toEqual([])
    expect(Object.keys(en).filter(k => !keys.includes(k))).toEqual([])
  })

  it.each(files)('%s keeps the placeholders of en.json', (file) => {
    const tr = flat(load(file))
    for (const [k, v] of Object.entries(tr)) {
      if (k in en) expect(placeholders(v), `${file}: ${k}`).toEqual(placeholders(en[k]))
    }
  })
})

describe('Polish plural rule', () => {
  it('picks one / few / many', () => {
    const pick = (n: number) => pluralPl(n, 3)
    expect([0, 1, 2, 4, 5, 12, 14, 21, 22, 25, 112, 122].map(pick)).toEqual([2, 0, 1, 1, 2, 2, 2, 2, 1, 2, 2, 1])
  })
  it('falls back to the default rule with two choices', () => {
    expect([0, 1, 2].map(n => pluralPl(n, 2))).toEqual([1, 0, 1])
  })
})
