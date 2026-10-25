import { ref } from 'vue'

// Shared across components: the header opens the search, the home page shows it.
const searchOpen = ref(false)

export function useSearchOpen() {
  return searchOpen
}

// Switching language or tree view remounts the page: the caller asks, the new page's h1 takes focus
// (once), so keyboard and screen-reader users land at the top of what they just chose.
let headingFocusPending = false

export function requestHeadingFocus() {
  headingFocusPending = true
}

export function focusHeadingIfRequested(heading: HTMLElement | null | undefined) {
  if (!headingFocusPending) return
  headingFocusPending = false
  heading?.focus({ preventScroll: true })
}
