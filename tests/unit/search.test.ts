import { describe, expect, it } from 'vitest'
import { trickMatchesSearch } from '../../src/scripts/helpers'
import type { Trick } from '../../src/scripts/trickStore'

const trick = (...title: string[]) => ({ title }) as unknown as Trick

describe('trick search', () => {
  it('ignores accents, case, hyphens and extra spaces', () => {
    expect(trickMatchesSearch(trick('Forward Brush', 'de{Vorwärts Brush}'), 'vorwarts')).toBe(true)
    expect(trickMatchesSearch(trick('X-Stop'), 'x stop')).toBe(true)
    expect(trickMatchesSearch(trick('X-Stop'), 'X-STOP')).toBe(true)
    expect(trickMatchesSearch(trick('Forward Donut'), '  forward   donut ')).toBe(true)
  })

  it('does not match the locale tag of an alias', () => {
    expect(trickMatchesSearch(trick('Forward Brush', 'de{Vorwärts Brush}'), 'de{')).toBe(false)
  })

  it('matches everything for an empty or blank query', () => {
    expect(trickMatchesSearch(trick('Spin'), '')).toBe(true)
    expect(trickMatchesSearch(trick('Spin'), '   ')).toBe(true)
    expect(trickMatchesSearch(trick('Spin'), null)).toBe(true)
  })
})
