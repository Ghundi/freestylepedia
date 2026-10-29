import { ref, watch, type Ref } from 'vue'

export type HomeView = 'category' | 'all'

const KEY = 'homeView'
const VIEWS: HomeView[] = ['category', 'all']

// Category rails scroll sideways, which suits touch screens; wide screens start on the grid.
function defaultView(): HomeView {
  return typeof window.matchMedia === 'function' && window.matchMedia('(min-width: 900px)').matches
    ? 'all' : 'category'
}

function read(): HomeView {
  try {
    const stored = localStorage.getItem(KEY)
    return VIEWS.includes(stored as HomeView) ? stored as HomeView : defaultView()
  } catch {
    return defaultView()
  }
}

let view: Ref<HomeView> | null = null

// One shared, persisted value: the home page remembers the last view chosen.
export function useHomeView(): { view: Ref<HomeView> } {
  if (!view) {
    view = ref(read())
    watch(view, v => {
      try { localStorage.setItem(KEY, v) } catch { /* storage unavailable: keep in memory */ }
    })
  }
  return { view }
}
