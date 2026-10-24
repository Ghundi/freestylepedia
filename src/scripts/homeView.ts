import { ref, watch, type Ref } from 'vue'

export type HomeView = 'category' | 'all'

const KEY = 'homeView'
const VIEWS: HomeView[] = ['category', 'all']

function read(): HomeView {
  try {
    const stored = localStorage.getItem(KEY)
    return VIEWS.includes(stored as HomeView) ? stored as HomeView : 'category'
  } catch {
    return 'category'
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
