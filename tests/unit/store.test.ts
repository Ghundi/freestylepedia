import { beforeEach, describe, expect, it, vi } from 'vitest'
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

describe.each(stores)('%s store: transfer links, other tabs, blocked storage', (key, useStore) => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('loadHash adds to the existing list and drops empty or unknown ids', () => {
    localStorage.setItem(key, JSON.stringify(['0010']))
    const store = useStore()
    store.loadHash('0001, ,abc,,trick0002', id => ['0001', '0002', '0010'].includes(id))
    expect(store.list).toEqual(['0010', '0001', '0002'])
  })

  it('an empty or junk link leaves the list as it was', () => {
    localStorage.setItem(key, JSON.stringify(['0010']))
    const store = useStore()
    store.loadHash('', () => true)
    store.loadHash('abc,9999', () => false)
    expect(store.list).toEqual(['0010'])
  })

  it('reloads the list when another tab changes it, so a later toggle keeps both marks', async () => {
    const store = useStore()
    localStorage.setItem(key, JSON.stringify(['0006']))
    window.dispatchEvent(new StorageEvent('storage', { key }))
    expect(store.list).toEqual(['0006'])
    store.toggle(trick('0001'))
    await nextTick()
    expect(JSON.parse(localStorage.getItem(key)!)).toEqual(['0006', '0001'])
  })

  it('keeps working in memory when localStorage throws', async () => {
    const get = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new DOMException('denied', 'SecurityError') })
    const set = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new DOMException('full', 'QuotaExceededError') })
    try {
      const store = useStore()
      expect(store.list).toEqual([])
      store.toggle(trick('0001'))
      await nextTick()
      expect(store.list).toEqual(['0001'])
    } finally {
      get.mockRestore()
      set.mockRestore()
    }
  })
})

describe('mastering a trick', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('takes it off the todo list; unmarking it does not put it back', () => {
    const todo = useTodoStore()
    const mastered = useMasteredStore()
    todo.toggle(trick('0001'))
    todo.toggle(trick('0002'))
    mastered.toggle(trick('0001'))
    expect(todo.list).toEqual(['0002'])
    mastered.toggle(trick('0001'))
    expect(mastered.list).toEqual([])
    expect(todo.list).toEqual(['0002'])
  })
})
