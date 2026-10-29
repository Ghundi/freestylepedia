import type { Trick } from './trickStore'

export function groupByCategory(tricks: Trick[], categories: string[]): { category: string, tricks: Trick[] }[] {
  return categories
    .map(category => ({
      category,
      tricks: tricks
        .filter(t => t.category === category)
        .sort((a, b) => a.difficulty - b.difficulty || a.title[0].localeCompare(b.title[0])),
    }))
    .filter(row => row.tricks.length > 0)
}

export function getNextTrick(
  tricks: Trick[],
  todoIds: string[],
  recommended: Trick[],
  isMastered: (t: Trick) => boolean,
): Trick | null {
  for (const id of todoIds) {
    const trick = tricks.find(t => t.trickID === id)
    if (trick && !isMastered(trick)) return trick
  }
  return recommended[0] ?? null
}

export function categoryProgress(
  tricks: Trick[],
  categories: string[],
  isMastered: (t: Trick) => boolean,
): { category: string, mastered: number, total: number }[] {
  return categories.map(category => {
    const inCategory = tricks.filter(t => t.category === category)
    return { category, mastered: inCategory.filter(isMastered).length, total: inCategory.length }
  })
}
