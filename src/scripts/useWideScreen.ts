import { onScopeDispose, readonly, ref, type Ref } from 'vue'

const QUERY = '(min-width: 900px)'

// True while the viewport is at least 900px wide; false where matchMedia is missing.
export function useWideScreen(): Readonly<Ref<boolean>> {
  const wide = ref(false)
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return readonly(wide)
  const mq = window.matchMedia(QUERY)
  wide.value = mq.matches
  const onChange = (e: { matches: boolean }) => { wide.value = e.matches }
  mq.addEventListener('change', onChange)
  onScopeDispose(() => mq.removeEventListener('change', onChange))
  return readonly(wide)
}
