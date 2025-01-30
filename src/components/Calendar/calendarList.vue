<script setup>
import CalendarListItem from "@/components/Calendar/calendarListItem.vue";
import {useEventsStore} from "@/scripts/store.js";
import {getLocalDate} from "@/scripts/helpers.js";

const eventsStore = useEventsStore();

function getEventDate(event, locale) {
  if (event.dateStart === event.dateEnd)
    return getLocalDate(event.dateStart, locale);
  else
    return getLocalDate(event.dateStart, locale) + " - " + getLocalDate(event.dateEnd, locale);
}
</script>

<template>
  <v-card>
    <v-card-title>
      {{ $t('calendar.eventList') }}
    </v-card-title>
    <v-list lines="two">
      <v-list-item>
        <calendar-list-item
            v-for="event in eventsStore.events"
            :title="event.title"
            :more-info="event.moreInfo"
            :location="event.location"
            :logo="event.logo"
            :date="getEventDate(event, $i18n.locale)"
            :description="event.description"
            :color="event.color"
        />
      </v-list-item>
    </v-list>
  </v-card>
</template>

<style scoped>

</style>