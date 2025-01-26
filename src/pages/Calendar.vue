<script setup>
import { ScheduleXCalendar } from '@schedule-x/vue'
import {
  createCalendar,
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar'
import '@schedule-x/theme-default/dist/index.css'
import CalendarListItem from "@/components/calendarListItem.vue";

// Do not use a ref here, as the calendar instance is not reactive, and doing so might cause issues
// For updating events, use the events service plugin
const calendarApp = createCalendar({
  selectedDate: new Date().toISOString().split('T')[0],
  views: [
    createViewMonthGrid(),
  ],
  events: [
    {
      id: 1,
      title: 'IFP Freestyle Gala',
      start: '2025-12-01',
      end: '2025-12-03',
      calendarId: 'IFP'
    },
    {
      id: 2,
      title: 'IFP Contest',
      start: '2025-11-20 12:00',
      end: '2025-11-22 13:00',
      calendarId: 'IFP'
    },
    {
      id: 3,
      title: 'Budapest Meetup',
      start: '2025-01-31 16:00',
      end: '2025-02-02 14:00',
      calendarId: 'NK'
    },
  ],
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
      colorName: 'NK',
      lightColors: {
        main: '#ffff00',
        container: '#50c0f0',
        onContainer: '#ffffff',
      },
      darkColors: {
        main: '#c0dfff',
        onContainer: '#dee6ff',
        container: '#426aa2',
      },
    },
  }
})
</script>

<template>
  <v-container>
    <v-row class="d-flex justify-center align-center">
      <v-col cols="9">
        {{ $t('calendar.description') }}
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <ScheduleXCalendar :calendar-app="calendarApp">
          <template #timeGridEvent="{ calendarEvent }">
            <div class="event">
              {{ calendarEvent.title }}
            </div>
          </template>
        </ScheduleXCalendar>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>
            {{ $t('calendar.eventList') }}
          </v-card-title>
          <v-list lines="two">
            <v-list-item>
              <calendar-list-item
                title="Budapest Meetup"
                logo="NK"
                date="01.02.2025"
                description="Ice Freestyle Meetup in Budapest by a river."
                color="yellow"
              />
            </v-list-item>
          </v-list>
        </v-card>
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