import type { Pinia } from 'pinia'
import type { LocationQuery } from 'vue-router'
import tricksJSON from '@/data/tricks.json'
import { useMasteredStore, useTodoStore } from '@/scripts/store'

const knownIds = new Set(tricksJSON.map(trick => trick.trickID.replace('trick', '')))
export const isKnownTrickId = (id: string): boolean => knownIds.has(id)

const KEYS = ['mastered', 'todo'] as const

// Applies a transfer link (?mastered=0001,0002&todo=0042) on any page, then returns the query
// without those keys so the caller can drop them from the URL; returns null when there is none.
export function applyTransferQuery(query: LocationQuery, pinia?: Pinia): LocationQuery | null {
    const found = Object.keys(query).filter(key => (KEYS as readonly string[]).includes(key.toLowerCase()))
    if (!found.length) return null
    const rest: LocationQuery = { ...query }
    for (const key of found) {
        const value = query[key]
        const hash = (Array.isArray(value) ? value.join(',') : value) ?? ''
        const store = key.toLowerCase() === 'mastered' ? useMasteredStore(pinia) : useTodoStore(pinia)
        store.loadHash(hash, isKnownTrickId)
        delete rest[key]
    }
    // a trick mastered on either device is not left on the todo list
    const mastered = useMasteredStore(pinia).list
    const todo = useTodoStore(pinia)
    todo.list = todo.list.filter(id => !mastered.includes(id))
    return rest
}
