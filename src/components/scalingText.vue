<template>
  <v-card-title
    ref="titleEl"
    :style="{ fontSize: `${computedFontSize}px` }"
    class="title-text"
  >
    {{ title }}
  </v-card-title>
</template>

<script setup>
    import { ref, onMounted, nextTick} from 'vue'

  const props = defineProps({
    title: String,
  })

    const BASE_FONT_SIZE = 50

    const titleEl = ref(null)       
    const computedFontSize = ref(BASE_FONT_SIZE)

    let debounceTimer = null
    const handleResize = () => {
    clearTimeout(debounceTimer)
        debounceTimer = setTimeout(adjustFontSize, 80)
    }

    async function adjustFontSize() {
    computedFontSize.value = BASE_FONT_SIZE
    await nextTick()

    const el = titleEl.value?.$el ?? titleEl.value
    if (!el) return

    const parent = el.parentElement
    if (!parent) return

    const maxWidth  = parent.clientWidth  * 0.8
    const maxHeight = parent.clientHeight * 0.8

    const textWidth  = el.scrollWidth   // width of the title
    const textHeight = el.scrollHeight

    // Guard against hidden elements
    if (maxWidth === 0 || maxHeight === 0) return

    const widthScale  = maxWidth  / textWidth
    const heightScale = maxHeight / textHeight

    const scale = Math.min(1, widthScale, heightScale)

    computedFontSize.value = Math.floor(BASE_FONT_SIZE * scale)
    }

    onMounted(() => {
        adjustFontSize()
        window.addEventListener('resize', handleResize);
    })
</script>

<style scoped>
.title-text {
  white-space: nowrap;
  overflow: hidden;
}
</style>