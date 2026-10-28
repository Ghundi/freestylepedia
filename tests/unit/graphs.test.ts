import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useTrickStore } from '../../src/scripts/trickStore'

describe.each(['Portrait', 'Landscape'])('graphs in %s', (orientation) => {
  beforeEach(() => {
    setActivePinia(createPinia())
    useTrickStore().loadTricks()
  })

  it('draws every trick of the Trick Tree once, with one heading per level', () => {
    const [nodes] = useTrickStore().getTrickTreeGraph(orientation)
    const ids = nodes.map(n => n.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids.filter(id => id.startsWith('Difficulty '))).toHaveLength(5)
  })

  it('draws every node of the Category Tree once', () => {
    const [nodes] = useTrickStore().getConnectionsGraph(orientation)
    const ids = nodes.map(n => n.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
