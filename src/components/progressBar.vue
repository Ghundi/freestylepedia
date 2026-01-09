<script setup>

    import { useMasteredStore } from '@/scripts/store'
    import { useTrickStore } from '@/scripts/videoStore';

    const mastered = useMasteredStore()
    const videoStore = useTrickStore()

</script>

<template>
    <v-progress-linear
    color="green-lighten-1"
    :model-value="(mastered.calcShareMastered(videoStore.tricks) / videoStore.tricks.length) * 100"
    :height="20"
    rounded
    >
        <strong>{{ Math.ceil((mastered.calcShareMastered(videoStore.tricks) / videoStore.tricks.length) * 100) }}% ( {{ mastered.calcShareMastered(videoStore.tricks) }} / {{ videoStore.tricks.length }})</strong>
    </v-progress-linear>
</template>

<style scoped>

</style>