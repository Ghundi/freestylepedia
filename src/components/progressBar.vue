<script setup>

    import { useMasteredStore } from '@/scripts/store'
    import { useTrickStore } from '@/scripts/trickStore';

    const mastered = useMasteredStore()
    const trickStore = useTrickStore()

</script>

<template>
    <v-progress-linear
    color="green-lighten-1"
    :model-value="(mastered.calcShareMastered(trickStore.tricks) / trickStore.tricks.length) * 100"
    :height="20"
    rounded
    >
        <strong>{{ Math.ceil((mastered.calcShareMastered(trickStore.tricks) / trickStore.tricks.length) * 100) }}% ( {{ mastered.calcShareMastered(trickStore.tricks) }} / {{ trickStore.tricks.length }})</strong>
    </v-progress-linear>
</template>

<style scoped>

</style>