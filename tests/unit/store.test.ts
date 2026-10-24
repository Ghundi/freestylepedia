import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import { useMasteredStore, useTodoStore } from '../../src/scripts/store'
import type { Trick } from '../../src/scripts/trickStore'

// Ids saved before 2026-08-22 (commit 8e29521) carry the old "trick" prefix.
const trick = (trickID: string) => ({ trickID, title: ['T' + trickID] }) as unknown as Trick

const stores = [
  ['todo', useTodoStore],
  ['mastered', useMasteredStore],
] as const

describe.each(stores)('%s store with legacy ids', (key, useStore) => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('normalizes the stored list on load and writes it back', () => {
    localStorage.setItem(key, JSON.stringify(['trick0042', '0001', '0042']))
    expect(useStore().list).toEqual(['0042', '0001'])
    expect(JSON.parse(localStorage.getItem(key)!)).toEqual(['0042', '0001'])
  })

  it('toggle removes an entry that was stored with the legacy prefix', async () => {
    localStorage.setItem(key, JSON.stringify(['trick0042', '0001']))
    const store = useStore()
    store.toggle(trick('0042'))
    expect(store.list).toEqual(['0001'])
    await nextTick()
    expect(JSON.parse(localStorage.getItem(key)!)).toEqual(['0001'])
  })

  it('loadHash normalizes legacy ids from an old transfer link', () => {
    const store = useStore()
    store.loadHash('trick0042,0003,0042')
    expect(store.list).toEqual(['0042', '0003'])
  })

  it('leaves a list of current ids as it is', () => {
    localStorage.setItem(key, JSON.stringify(['0003', '0001']))
    expect(useStore().list).toEqual(['0003', '0001'])
  })
})
