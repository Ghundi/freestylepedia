import { describe, it, expect } from 'vitest'
import { groupByCategory, getNextTrick, categoryProgress } from '../../src/scripts/collections'
import type { Trick } from '../../src/scripts/trickStore'

const mk = (id: string, title: string, difficulty: number, category: string): Trick =>
  ({ trickID: id, title: [title], difficulty, category, releaseDate: new Date('2024-01-01'),
     videoID: ['v' + id], requirements: [], connections: [] }) as unknown as Trick

const tricks = [
  mk('0001', 'Spin', 2, 'spins'),
  mk('0002', 'Brush', 1, 'steps'),
  mk('0003', 'Axel', 2, 'spins'),
  mk('0004', 'Bunny', 1, 'spins'),
  mk('0005', 'Jump', 3, 'jumps'),
]

describe('groupByCategory', () => {
  it('groups in config order and drops empty categories', () => {
    const rows = groupByCategory(tricks, ['steps', 'empty', 'spins'])
    expect(rows.map(r => r.category)).toEqual(['steps', 'spins'])
  })
  it('sorts each row by difficulty then name', () => {
    const rows = groupByCategory(tricks, ['spins'])
    expect(rows[0].tricks.map(t => t.trickID)).toEqual(['0004', '0003', '0001'])
  })
})

describe('getNextTrick', () => {
  const rec = [tricks[1], tricks[4]]
  it('next trick is the first unmastered todo entry', () => {
    const next = getNextTrick(tricks, ['0003', '0001'], rec, t => t.trickID === '0003')
    expect(next?.trickID).toBe('0001')
  })
  it('next trick ignores todo ids that no longer exist', () => {
    expect(getNextTrick(tricks, ['9999'], rec, () => false)).toBe(rec[0])
  })
  it('next trick skips the todo list when every entry is mastered', () => {
    expect(getNextTrick(tricks, ['0003', '0001'], rec, () => true)).toBe(rec[0])
  })
  it('next trick falls back to the first recommendation, then null', () => {
    expect(getNextTrick(tricks, [], rec, () => false)).toBe(rec[0])
    expect(getNextTrick(tricks, [], [], () => false)).toBeNull()
  })
})

describe('categoryProgress', () => {
  it('category progress counts mastered and total per category', () => {
    const res = categoryProgress(tricks, ['spins', 'steps'], t => ['0001', '0002'].includes(t.trickID))
    expect(res).toEqual([
      { category: 'spins', mastered: 1, total: 3 },
      { category: 'steps', mastered: 1, total: 1 },
    ])
  })
})
