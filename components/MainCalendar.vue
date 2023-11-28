<script setup lang="ts">
import type {
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
} from "@fullcalendar/core";

import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEventStore } from "../store/event";

const eventStore = useEventStore();
const { events } = storeToRefs(eventStore);

// emits
const emit = defineEmits<{
  createEvent: [event: { start: Date; end: Date; allDay: boolean }];
  viewEvent: [viewData: { eventId: string; eventTitle: string }];
}>();
const calendarOptions = computed(
  () =>
    ({
      plugins: [
        dayGridPlugin,
        timeGridPlugin,
        interactionPlugin, // needed for dateClick
      ],
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      },
      initialView: "dayGridMonth",
      events: events.value,
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      weekends: true,
      select: handleDateSelect,
      eventClick: handleEventClick,
    }) as CalendarOptions,
);

function handleDateSelect(selectInfo: DateSelectArg) {
  // const title = prompt("Please enter a new title for your event");
  const calendarApi = selectInfo.view.calendar;

  calendarApi.unselect(); // clear date selection

  emit("createEvent", {
    start: selectInfo.start,
    end: selectInfo.end,
    allDay: selectInfo.allDay,
  });
}
function handleEventClick(clickInfo: EventClickArg) {
  emit("viewEvent", {
    eventId: clickInfo.event.id.toString(),
    eventTitle: clickInfo.event.title,
  });
}
</script>
<template>
  <FullCalendar class="full-calendar" :options="calendarOptions">
    <template #eventContent="arg">
      <b>{{ arg.timeText }}</b>
      <i>{{ arg.event.title }}</i>
    </template>
  </FullCalendar>
</template>
<style>
.full-calendar {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
