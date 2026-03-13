<script setup>
</script>

<template>
    <v-dialog max-width="500">
    <template v-slot:activator="{ props: activatorProps }">
        <v-btn
        v-bind="activatorProps"
        variant="elevated"
        >
        {{ $t('myProgress.transferProgress') }}
    </v-btn>
    </template>

    <template v-slot:default="{ isActive }">
        <v-card>
            <v-card-text>
                {{ $t('myProgress.transferInfo') }}
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                    <v-btn
                        text="Close"
                        @click="isActive.value = false"
                    ></v-btn>
            </v-card-actions>
        </v-card>
    </template>
    </v-dialog>
</template>