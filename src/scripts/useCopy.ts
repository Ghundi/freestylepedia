import { onBeforeUnmount, ref } from 'vue'

/**
 * Copy text through a hidden selection. Works where the Clipboard API is missing,
 * such as a page served over plain http on the local network.
 * The field goes inside the open dialog, if any: a modal dialog makes the rest of the page inert,
 * and a selection there copies nothing.
 */
function copyWithSelection(text: string): boolean {
  const previousFocus = document.activeElement as HTMLElement | null
  const host = previousFocus?.closest('dialog[open]') ?? document.body
  const area = document.createElement('textarea')
  area.value = text
  area.readOnly = true
  // 12pt keeps iOS from zooming the page when the field takes focus
  area.style.fontSize = '12pt'
  area.style.position = 'fixed'
  area.style.top = '0'
  area.style.left = '-9999px'
  host.append(area)
  area.select()
  // iOS leaves a readonly field's selection empty without an explicit range
  area.setSelectionRange(0, text.length)
  let ok = false
  try {
    ok = document.execCommand('copy')
  } catch {
    ok = false
  }
  area.remove()
  previousFocus?.focus?.()
  return ok
}

async function writeToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // refused (insecure context, denied permission): try the selection copy below
  }
  return copyWithSelection(text)
}

/**
 * Copy text to the clipboard and report how it went: `copied` is true for a moment after success,
 * `failed` stays true after a refusal until the next attempt or `reset`.
 * Falls back to a selection copy where the Clipboard API is missing or refused.
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
    if (!(await writeToClipboard(getText()))) {
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
