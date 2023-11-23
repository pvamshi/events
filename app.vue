<script setup lang="ts">
import type {
  CalendarOptions,
  EventApi,
  DateSelectArg,
  EventClickArg,
} from "@fullcalendar/core";

import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

// let currentEvents = [] as EventApi[];

const calendarOptions = {
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
  initialEvents: [], // alternatively, use the `events` setting to fetch from a feed
  editable: true,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  weekends: true,
  select: handleDateSelect,
  eventClick: handleEventClick,
  eventsSet: handleEvents,
  /* you can update a remote database when these fire:
  eventAdd:
  eventChange:
  eventRemove:
  */
} as CalendarOptions;

function handleDateSelect(selectInfo: DateSelectArg) {
  const title = prompt("Please enter a new title for your event");
  const calendarApi = selectInfo.view.calendar;

  calendarApi.unselect(); // clear date selection

  if (title) {
    calendarApi.addEvent({
      id: new Date().getTime().toString(),
      title,
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      allDay: selectInfo.allDay,
    });
  }
}
function handleEventClick(clickInfo: EventClickArg) {
  if (
    confirm(
      `Are you sure you want to delete the event '${clickInfo.event.title}'`,
    )
  ) {
    clickInfo.event.remove();
  }
}
function handleEvents(events: EventApi[]) {
  // currentEvents = events;
  console.log("handle events", events);
}

// const user = ref("vamshi");
const {
  public: { API_URL },
} = useRuntimeConfig();
const { data, pending } = await useFetch<{ id: string; title: string }[]>(
  `${API_URL}/events`,
);
</script>
<template>
  <div>
    <el-button type="primary">Primary</el-button>
    <p v-if="pending">Loading...</p>

    <ul>
      <li v-for="event in (data || []).slice(0, 10)" :key="event.id">
        {{ event.title }}
      </li>
    </ul>
    <FullCalendar class="demo-app-calendar" :options="calendarOptions">
      <template #eventContent="arg">
        <b>{{ arg.timeText }}</b>
        <i>{{ arg.event.title }}</i>
      </template>
    </FullCalendar>
  </div>
</template>
