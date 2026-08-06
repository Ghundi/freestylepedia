<script setup>
    import { useMasteredStore, useTodoStore } from '@/scripts/store';

  async function getExportUrl()  {
    try {
      const exportUrl = 'https://freestylepedia.org/en?todo=' + useTodoStore().getHash() + "&mastered=" + useMasteredStore().getHash();
      await navigator.clipboard.writeText(exportUrl);
    } catch($e) {
      console.log('failed copying to clipboard. Make sure you have a secure connection');
    }
  }
</script>

<template>
    <v-dialog max-width="500">
    <template v-slot:activator="{ props: activatorProps }">
        <v-btn
        v-bind="activatorProps"
        variant="elevated"
        @click.stop="getExportUrl()"
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