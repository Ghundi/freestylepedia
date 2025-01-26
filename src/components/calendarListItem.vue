<script setup>
const props = defineProps({
  title: String,
  logo: String,
  date: String,
  description: String,
  color: String,
});
</script>

<script>
import NK from "../assets/supporters/nagyerdei korisok.webp"

export default {
  data: () => ({
    dialog: false,
    files: [
      {
        color: 'blue',
        icon: 'mdi-clipboard-text',
        subtitle: 'Jan 20, 2014',
        title: 'Vacation itinerary',
      },
      {
        color: 'amber',
        icon: 'mdi-gesture-tap-button',
        subtitle: 'Jan 10, 2014',
        title: 'Kitchen remodel',
      },
    ],
    folders: [
      {
        subtitle: 'Jan 9, 2014',
        title: 'Photos',
      },
      {
        subtitle: 'Jan 17, 2014',
        title: 'Recipes',
      },
      {
        subtitle: 'Jan 28, 2014',
        title: 'Work',
      },
    ],
  }),
}
</script>

<template>
  <v-container>
    <v-row>
        <v-col>
          <v-list-item
              :key="title"
              :subtitle="date"
              :title="title"
          >
            <template v-slot:prepend>
              <v-avatar :color="color">
                <v-img
                    contain
                    :src="NK"
                    aspect-ratio="1"
                    alt="Supporter Logo"
                ></v-img>
              </v-avatar>
            </template>

            <template v-slot:append>
              <v-btn
                  @click="dialog = true"
                  color="grey-lighten-1"
                  icon="mdi-information"
                  variant="text"
              ></v-btn>
            </template>
          </v-list-item>
        </v-col>

      <v-dialog
          v-model="dialog"
          width="auto"
      >
        <v-card
            prepend-icon="mdi-information"
            class="pa-5"
        >
          <v-card-title>
            {{ title }}
          </v-card-title>
          {{ description }}
          <template v-slot:actions>
            <v-btn
                class="ms-auto"
                @click="dialog = false"
            >
              {{ $t('close') }}
            </v-btn>
          </template>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<style scoped>

</style>