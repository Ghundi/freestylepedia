import { onBeforeUnmount, ref } from 'vue'

/**
 * Copy text to the clipboard and report how it went: `copied` is true for a moment after success,
 * `failed` stays true after a refusal (insecure context, denied permission) until the next attempt or `reset`.
 */
export function useCopy(getText: () => string, resetAfterMs = 2500) {
  const copied = ref(false)
  const failed = ref(false)
  let timer: ReturnType<typeof setTimeout> | undefined
  onBeforeUnmount(() => clearTimeout(timer))

  function reset() {
    clearTimeout(timer)
    copied.value = false
    failed.value = false
  }

  async function copy() {
    clearTimeout(timer)
    try {
      await navigator.clipboard.writeText(getText())
    } catch {
      copied.value = false
      failed.value = true
      return
    }
    failed.value = false
    copied.value = true
    timer = setTimeout(() => { copied.value = false }, resetAfterMs)
  }

  return { copied, failed, copy, reset }
}
