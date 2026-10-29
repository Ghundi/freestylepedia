import type { Trick } from './trickStore'

export interface PathRow { trick: Trick; depth: number }

const MAX_DEPTH = 3

const byLevelThenName = (a: Trick, b: Trick) =>
  a.difficulty - b.difficulty || a.title[0].localeCompare(b.title[0])

// Tricks of one category in tree order: each trick sits right under the first
// of its requirements found in the same category, depth-first from the roots.
export function categoryRows(tricks: Trick[], category: string): PathRow[] {
  const list = tricks.filter(t => t.category === category)
  const ids = new Set(list.map(t => t.trickID))
  const children = new Map<string | null, Trick[]>()
  for (const t of [...list].sort(byLevelThenName)) {
    const parent = t.requirements.find(r => ids.has(r)) ?? null
    const siblings = children.get(parent)
    if (siblings) siblings.push(t)
    else children.set(parent, [t])
  }

  const rows: PathRow[] = []
  const visited = new Set<string>()
  const walk = (parent: string | null, depth: number) => {
    for (const t of children.get(parent) ?? []) {
      if (visited.has(t.trickID)) continue
      visited.add(t.trickID)
      rows.push({ trick: t, depth: Math.min(depth, MAX_DEPTH) })
      walk(t.trickID, depth + 1)
    }
  }
  walk(null, 0)

  // Tricks caught in a requirement loop are never reached from a root.
  for (const t of [...list].sort(byLevelThenName)) {
    if (!visited.has(t.trickID)) {
      visited.add(t.trickID)
      rows.push({ trick: t, depth: 0 })
    }
  }
  return rows
}

// Tricks of one level, grouped by category order, then by name.
export function levelRows(tricks: Trick[], level: number, categories: string[]): Trick[] {
  return tricks
    .filter(t => t.difficulty === level)
    .sort((a, b) =>
      categories.indexOf(a.category) - categories.indexOf(b.category) ||
      a.title[0].localeCompare(b.title[0]))
}

// What to know first (requirements) and what it leads to (tricks requiring it).
export function trickPath(tricks: Trick[], trick: Trick): { before: Trick[]; after: Trick[] } {
  const before = tricks.filter(t => t.trickID !== trick.trickID && trick.requirements.includes(t.trickID))
  const after = tricks
    .filter(t => t.trickID !== trick.trickID && t.requirements.includes(trick.trickID))
    .sort(byLevelThenName)
  return { before, after }
}
