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
    // block the event
    event.preventDefault()

    // and store the caught event
    pwaInstallPromptEvent.value = event as BeforeInstallPromptEvent
  })
}

export { checkIfInstallable, pwaInstallPromptEvent }