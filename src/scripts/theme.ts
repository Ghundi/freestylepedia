import { computed, ref, watch } from 'vue'

export type ThemeMode = 'system' | 'dark' | 'light'

const KEY = 'themeMode'
// --bg of each theme in src/styles/tokens.css, for the browser UI colour (theme-color meta)
export const THEME_COLORS = { dark: '#111214', light: '#f6f6f4' } as const
const mode = ref<ThemeMode>('system')
const systemLight = ref(false)
let listening = false
let initialized = false

function readStored(): ThemeMode {
  try {
    const v = localStorage.getItem(KEY)
    if (v === 'dark' || v === 'light' || v === 'system') return v
  } catch {
    /* storage unavailable */
  }
  return 'system'
}

function setup() {
  if (listening) return
  listening = true
  mode.value = readStored()
  if (typeof window.matchMedia === 'function') {
    const light = window.matchMedia('(prefers-color-scheme: light)')
    systemLight.value = light.matches
    light.addEventListener?.('change', (e: MediaQueryListEvent) => {
      systemLight.value = e.matches
    })
  }
}

const resolved = computed<'dark' | 'light'>(() => {
  if (mode.value === 'system') return systemLight.value ? 'light' : 'dark'
  return mode.value
})

function setMode(m: ThemeMode) {
  mode.value = m
  try {
    localStorage.setItem(KEY, m)
  } catch {
    /* storage unavailable */
  }
}

export function useThemeMode() {
  setup()
  return { mode, resolved, setMode }
}

export function initTheme(): void {
  useThemeMode()
  if (initialized) return
  initialized = true
  watch(
    resolved,
    (v) => {
      document.documentElement.dataset.theme = v
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[v])
    },
    { immediate: true, flush: 'sync' },
  )
}

/** Test-only: reset the module singleton. */
export function __resetThemeForTests(): void {
  listening = false
  initialized = false
  mode.value = 'system'
  systemLight.value = false
}
