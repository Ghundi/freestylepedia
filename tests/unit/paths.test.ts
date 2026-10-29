import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useTrickStore } from '../../src/scripts/trickStore'
import type { Trick } from '../../src/scripts/trickStore'
import { categoryRows, levelRows, trickPath } from '../../src/scripts/paths'
import config from '../../src/data/config.json'

const mk = (id: string, title: string, difficulty: number, category: string, requirements: string[] = []): Trick => ({
  trickID: id, title: [title], difficulty, category, releaseDate: '2020-01-01',
  videoID: [], requirements, connections: [],
} as Trick)

const names = (rows: { trick: Trick }[]) => rows.map(r => r.trick.title[0])

describe('categoryRows', () => {
  it('puts a child right under its parent and sorts siblings by level then name', () => {
    const tricks = [
      mk('1', 'Root', 1, 'footwork'),
      mk('2', 'Zed', 2, 'footwork', ['1']),
      mk('3', 'Alpha', 2, 'footwork', ['1']),
      mk('4', 'Easy', 1, 'footwork', ['1']),
      mk('5', 'Grandchild', 3, 'footwork', ['3']),
    ]
    const rows = categoryRows(tricks, 'footwork')
    expect(names(rows)).toEqual(['Root', 'Easy', 'Alpha', 'Grandchild', 'Zed'])
    expect(rows.map(r => r.depth)).toEqual([0, 1, 1, 2, 1])
  })

  it('keeps a trick whose prerequisite is in another category at depth 0', () => {
    const rows = categoryRows([mk('1', 'A', 1, 'stop'), mk('2', 'B', 2, 'footwork', ['1'])], 'footwork')
    expect(rows).toEqual([{ trick: expect.objectContaining({ trickID: '2' }), depth: 0 }])
  })

  it('ignores a prerequisite missing from the list', () => {
    const rows = categoryRows([mk('2', 'B', 2, 'footwork', ['99'])], 'footwork')
    expect(rows.map(r => r.depth)).toEqual([0])
  })

  it('emits each trick of a requirement loop once and terminates', () => {
    const rows = categoryRows([mk('1', 'A', 1, 'footwork', ['2']), mk('2', 'B', 1, 'footwork', ['1'])], 'footwork')
    expect(names(rows).sort()).toEqual(['A', 'B'])
    expect(rows.every(r => r.depth === 0)).toBe(true)
  })

  it('emits a self-requiring trick once at depth 0', () => {
    const rows = categoryRows([mk('1', 'A', 1, 'footwork', ['1'])], 'footwork')
    expect(rows).toHaveLength(1)
    expect(rows[0].depth).toBe(0)
  })

  it('caps depth at 3 on a 5-level chain', () => {
    const tricks = [1, 2, 3, 4, 5].map(i => mk(String(i), `T${i}`, i, 'footwork', i > 1 ? [String(i - 1)] : []))
    expect(categoryRows(tricks, 'footwork').map(r => r.depth)).toEqual([0, 1, 2, 3, 3])
  })
})

describe('levelRows', () => {
  it('sorts by category order then name', () => {
    const tricks = [
      mk('1', 'B', 2, 'stop'), mk('2', 'C', 2, 'footwork'), mk('3', 'A', 2, 'stop'),
      mk('4', 'Other', 3, 'footwork'),
    ]
    expect(levelRows(tricks, 2, ['footwork', 'stop']).map(t => t.title[0])).toEqual(['C', 'A', 'B'])
  })
})

describe('trickPath', () => {
  it('lists requirements in requirements order, ignoring unknown ids, and sorted followers without self-reference', () => {
    const t = mk('1', 'Me', 2, 'footwork', ['3', '99', '2', '1'])
    const tricks = [
      t, mk('2', 'Two', 1, 'footwork'), mk('3', 'Three', 1, 'footwork'),
      mk('4', 'Zed', 3, 'footwork', ['1']), mk('5', 'Alpha', 3, 'footwork', ['1']), mk('6', 'Low', 2, 'stop', ['1']),
    ]
    const { before, after } = trickPath(tricks, t)
    expect(before.map(x => x.trickID)).toEqual(['3', '2'])
    expect(after.map(x => x.title[0])).toEqual(['Low', 'Alpha', 'Zed'])
  })
})

describe('real data', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    useTrickStore().loadTricks()
  })

  it('lists every trick of each category exactly once', () => {
    const { tricks } = useTrickStore()
    for (const c of config.initialValues.categoryStore.categories) {
      const rows = categoryRows(tricks, c)
      const ids = rows.map(r => r.trick.trickID)
      expect(new Set(ids).size).toBe(ids.length)
      expect(ids).toHaveLength(tricks.filter(t => t.category === c).length)
    }
  })

  it('splits all tricks across levels 1 to 5', () => {
    const { tricks } = useTrickStore()
    const cats = config.initialValues.categoryStore.categories
    const total = [1, 2, 3, 4, 5].reduce((n, l) => n + levelRows(tricks, l, cats).length, 0)
    expect(total).toBe(tricks.length)
  })
})
