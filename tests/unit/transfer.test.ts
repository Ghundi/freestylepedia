import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useMasteredStore, useTodoStore } from '../../src/scripts/store'
import { applyTransferQuery, isKnownTrickId } from '../../src/scripts/transfer'

describe('transfer link', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('returns null when the query carries no progress', () => {
    expect(applyTransferQuery({ q: 'x' })).toBeNull()
  })

  it('adds known ids to both lists and returns the query without them', () => {
    localStorage.setItem('mastered', JSON.stringify(['0010']))
    const rest = applyTransferQuery({ mastered: '0001,trick0003,9999,', todo: '0042', tab: 'a' })
    expect(rest).toEqual({ tab: 'a' })
    expect(useMasteredStore().list).toEqual(['0010', '0001', '0003'])
    expect(useTodoStore().list).toEqual(['0042'])
  })

  it('accepts the keys in any case', () => {
    expect(applyTransferQuery({ MASTERED: '0001' })).toEqual({})
    expect(useMasteredStore().list).toEqual(['0001'])
  })

  it('knows the ids of the data file, unreleased tricks included', () => {
    expect(isKnownTrickId('0001')).toBe(true)
    expect(isKnownTrickId('9999')).toBe(false)
    expect(isKnownTrickId('')).toBe(false)
  })
})
