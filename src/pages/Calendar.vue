<script setup>
import {useEventsStore} from "@/scripts/store.js";
import { getOrientation } from "@/scripts/helpers.js";

const eventsStore = useEventsStore();


import { ScheduleXCalendar } from '@schedule-x/vue'
import {
  createCalendar,
  createViewMonthGrid,
} from '@schedule-x/calendar'
import '@schedule-x/theme-default/dist/index.css'
import CalendarList from "@/components/Calendar/calendarList.vue";
import Selector from "@/components/Selector.vue";

// Do not use a ref here, as the calendar instance is not reactive, and doing so might cause issues
// For updating events, use the events service plugin
const calendarApp = createCalendar({
  selectedDate: new Date().toISOString().split('T')[0],
  views: [
    createViewMonthGrid(),
  ],
  events: eventsStore.getCalendarEvents(eventsStore.events),
  calendars: {
    IFP: {
      colorName: 'IFP',
      lightColors: {
        main: '#ffff00',
        container: '#0030a0',
        onContainer: '#ffffff',
      },
      darkColors: {
        main: '#c0dfff',
        onContainer: '#dee6ff',
        container: '#426aa2',
      },
    },
    NK: {
      colorName: "NK",
      lightColors: {
        main: '#ffff00',
        container: '#ffff00',
        onContainer: '#ffff00',
      },
      darkColors: {
        main: '#ffff00',
        onContainer: '#ffff00',
        container: '#ffff00',
      },
    },
  }
})
</script>

<template>
  <v-container>
    <v-row class="d-flex justify-center align-center">
      <v-col>
        <Selector/>
      </v-col>
      <v-col>
        <b>
          {{ $t('calendar.disclaimer') }}
        </b>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <ScheduleXCalendar :calendar-app="calendarApp">
          <template #timeGridEvent="{ calendarEvent }">
            <div class="event">
              {{ calendarEvent.title }}
            </div>
          </template>
        </ScheduleXCalendar>
      </v-col>
      <v-col v-if="getOrientation() === 'Landscape'">
        <CalendarList/>
      </v-col>
    </v-row>
    <v-row v-if="getOrientation() === 'Portrait'">
      <v-col>
        <Calendar-list/>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
/* Hide scrollbar for all elements */
::-webkit-scrollbar {
  display: none;
}

/* Optional: Disable scrollbar arrows */
::-webkit-scrollbar-button {
  display: none;
}
</style>