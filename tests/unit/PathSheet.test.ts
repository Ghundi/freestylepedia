import { beforeEach, describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import { createMemoryHistory, createRouter } from 'vue-router'
import en from '../../src/locales/en.json'
import PathSheet from '../../src/components/paths/PathSheet.vue'
import AppDialog from '../../src/components/ui/AppDialog.vue'
import { trickPath } from '../../src/scripts/paths'
import { useTrickStore, type Trick } from '../../src/scripts/trickStore'
import { useMasteredStore } from '../../src/scripts/store'

async function mountSheet(trick: Trick | null, attach = false) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/:lang/trick/:trickname', name: 'Trick', component: { template: '<div/>' } }],
  })
  router.push('/en/trick/x')
  await router.isReady()
  const i18n = createI18n({ legacy: false, locale: 'en', messages: { en } })
  return mount(PathSheet, { props: { trick }, global: { plugins: [router, i18n] }, attachTo: attach ? document.body : undefined })
}

const names = (w: ReturnType<typeof mount>, sel: string) => w.findAll(`${sel} .nm`).map(n => n.text())

// jsdom has no showModal/close on <dialog>
HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', '') }
HTMLDialogElement.prototype.close = function () { this.removeAttribute('open') }

beforeEach(() => {
  localStorage.clear()
  setActivePinia(createPinia())
  useTrickStore().loadTricks()
})

describe('PathSheet', () => {
  it('stays closed without a trick', async () => {
    const w = await mountSheet(null)
    expect((w.get('dialog').element as HTMLDialogElement).open).toBe(false)
  })

  it('lists what comes before and after, as trickPath does', async () => {
    const store = useTrickStore()
    const trick = store.getTrickByTitle('Eagle Stop')!
    const { before, after } = trickPath(store.tricks, trick)
    expect(before.length).toBeGreaterThan(0)
    expect(after.length).toBeGreaterThan(0)
    const w = await mountSheet(trick)
    await flushPromises()
    expect((w.get('dialog').element as HTMLDialogElement).open).toBe(true)
    const title = (t: Trick) => store.getLocalTrickTitles(t, 'en')[0] ?? t.title[0]
    expect(names(w, '.before')).toEqual(before.map(title))
    expect(names(w, '.after')).toEqual(after.map(title))
  })

  it('emits the tapped earlier trick', async () => {
    const store = useTrickStore()
    const trick = store.getTrickByTitle('Eagle Stop')!
    const { before } = trickPath(store.tricks, trick)
    const w = await mountSheet(trick)
    await w.get('.before button').trigger('click')
    expect(w.emitted('update:trick')![0]).toEqual([before[0]])
  })

  it('says so when a trick has no prerequisite', async () => {
    const store = useTrickStore()
    const trick = store.tricks.find(t => trickPath(store.tricks, t).before.length === 0)!
    const w = await mountSheet(trick)
    expect(w.get('.before').text()).toContain(en.paths.noneBefore)
  })

  it('marks the trick as mastered from the sheet', async () => {
    const trick = useTrickStore().getTrickByTitle('Eagle Stop')!
    const w = await mountSheet(trick)
    const btn = w.findAll('button').find(b => b.text() === en.trick.mastered)!
    await btn.trigger('click')
    expect(useMasteredStore().list).toContain(trick.trickID)
    expect(btn.attributes('aria-pressed')).toBe('true')
  })

  it('links to the trick page', async () => {
    const trick = useTrickStore().getTrickByTitle('Eagle Stop')!
    const w = await mountSheet(trick)
    const a = w.findAll('a').find(l => l.text() === en.paths.openTrick)!
    expect(a.attributes('href')).toBe('/en/trick/Eagle+Stop')
  })
})

describe('PathSheet switching tricks', () => {
  it('scrolls back to the top and focuses the trick card', async () => {
    const store = useTrickStore()
    const trick = store.getTrickByTitle('Eagle Stop')!
    const { before } = trickPath(store.tricks, trick)
    const w = await mountSheet(trick, true)
    await flushPromises()
    const dlg = w.get('dialog').element as HTMLDialogElement
    dlg.scrollTop = 120
    expect(dlg.scrollTop).toBe(120)
    await w.get('.before button').trigger('click')
    await w.setProps({ trick: w.emitted('update:trick')![0][0] as Trick })
    await flushPromises()
    expect(dlg.scrollTop).toBe(0)
    expect(document.activeElement).toBe(w.get('.focus').element)
    expect(w.get('.focus .nm').text()).toBe(store.getLocalTrickTitles(before[0], 'en')[0] ?? before[0].title[0])
    w.unmount()
  })
})

describe('AppDialog placement', () => {
  it('is centred by default and bottom only on request', () => {
    const i18n = createI18n({ legacy: false, locale: 'en', messages: { en } })
    const mk = (props: object) => mount(AppDialog, { props: { open: false, title: 'x', ...props }, global: { plugins: [i18n] } })
    expect(mk({}).get('dialog').classes()).toEqual(['dlg'])
    expect(mk({ placement: 'bottom' }).get('dialog').classes()).toContain('dlg--bottom')
  })
})

describe('AppDialog bottom sheet drag', () => {
  const ev = (type: string, clientY: number) => {
    const e = new Event(type, { bubbles: true }) as PointerEvent
    Object.defineProperty(e, 'clientY', { value: clientY })
    return e
  }
  it('closes when the title bar is dragged down far enough, not on a short drag', async () => {
    const i18n = createI18n({ legacy: false, locale: 'en', messages: { en } })
    const w = mount(AppDialog, { props: { open: true, title: 'T', placement: 'bottom' }, global: { plugins: [i18n] }, attachTo: document.body })
    const bar = w.get('header.bar').element
    bar.dispatchEvent(ev('pointerdown', 100)); window.dispatchEvent(ev('pointermove', 140)); window.dispatchEvent(ev('pointerup', 140))
    expect(w.emitted('update:open')).toBeUndefined()
    bar.dispatchEvent(ev('pointerdown', 100)); window.dispatchEvent(ev('pointermove', 220)); window.dispatchEvent(ev('pointerup', 220))
    expect(w.emitted('update:open')?.[0]).toEqual([false])
    w.unmount()
  })
})
