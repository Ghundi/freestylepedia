<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import QRCode from 'qrcode'
import blackbirdLogo from "@/assets/blackbirdIcon.png"

const props = defineProps({
    text: { type: String, required: true },
    size: { type: Number, default: 200 },
    margin: { type: Number, default: 2 },
    color: { type: Object, default: () => ({ dark: '#000000', light: '#ffffff' }) },
    logoSize: { type: Number, default: 40 },
    logoBackground: { type: Boolean, default: true },
    errorCorrectionLevel: { type: String, default: 'H' }, 
})

const dataUrl = ref('')

async function generate() {
    dataUrl.value = await QRCode.toDataURL(props.text, {
        width: props.size,
        margin: props.margin,
        color: props.color,
        errorCorrectionLevel: props.errorCorrectionLevel,
    })
}

onMounted(generate)
watch(
    () => [props.text, props.size, props.color.dark, props.color.light, props.errorCorrectionLevel],
    generate
)

const logoStyle = computed(() => ({
    width: `${props.logoSize}px`,
    height: `${props.logoSize}px`,
}))
</script>

<template>
    <div class="qr-wrapper" :style="{ width: `${size}px`, height: `${size}px` }">
        <img v-if="dataUrl" :src="dataUrl" :width="size" :height="size" alt="QR code" />
        <div class="qr-logo" :class="{ padded: logoBackground }">
            <img :src="blackbirdLogo" :style="logoStyle" alt="Logo" />
        </div>
    </div>
</template>

<style scoped>
.qr-wrapper {
    position: relative;
    display: inline-block;
}
.qr-logo {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 15px;
}
.qr-logo.padded {
    background: black;
    padding: 6px;
    box-shadow: 0 0 0 2px #ffffff;
}
.qr-logo img {
    display: block;
    object-fit: contain;
    border-radius: 5px;
    background-color: black;
}
</style>