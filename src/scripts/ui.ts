import { ref } from 'vue'

// Shared across components: the header opens the search, the home page shows it.
const searchOpen = ref(false)

export function useSearchOpen() {
  return searchOpen
}
