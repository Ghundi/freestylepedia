import { ref } from "vue";

// define type for event
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

// create ref to hold the event
const pwaInstallPromptEvent = ref<BeforeInstallPromptEvent>()

function checkIfInstallable() {
  window.addEventListener('beforeinstallprompt', (event) => {
    // The browser keeps its own install banner; the event is stored for the Settings button.
    pwaInstallPromptEvent.value = event as BeforeInstallPromptEvent
  })
  // installed from the browser menu or from our button: nothing left to offer
  window.addEventListener('appinstalled', () => { pwaInstallPromptEvent.value = undefined })
}

// The browser's install prompt can be shown once per event: drop it after use.
async function promptInstall() {
  const event = pwaInstallPromptEvent.value
  if (!event) return
  pwaInstallPromptEvent.value = undefined
  try {
    await event.prompt()
    await event.userChoice
  } catch { /* prompt refused by the browser */ }
}

export { checkIfInstallable, promptInstall, pwaInstallPromptEvent }