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
import { useEventStore } from "../store/event";

const dialogVisible = ref(false);
export interface FormData {
  start: Date;
  end: Date;
  allDay: boolean;
  title: string;
  description: string;
}
const formData: FormData = reactive({
  start: new Date(),
  end: new Date(),
  allDay: false,
  title: "",
  description: "",
});
const {
  public: { API_URL },
} = useRuntimeConfig();

const eventStore = useEventStore();
const { events } = storeToRefs(eventStore);
if (events.value === null) {
  eventStore.fetchEvents(API_URL);
}
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
  events: [], // alternatively, use the `events` setting to fetch from a feed
  editable: true,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  weekends: true,
  select: handleDateSelect,
  eventClick: handleEventClick,
  eventsSet: handleEvents,
  // eventAdd: handleEventAdd,
  /* you can update a remote database when these fire:
  eventAdd:
  eventChange:
  eventRemove:
  */
} as CalendarOptions;

// function handleEventAdd({ event }: EventAddArg): void {
//   console.log(JSON.stringify(event));
//   if (event.start !== null && event.end !== null) {
//     eventStore.addEvent({
//       id: event.id,
//       start: event.start,
//       end: event.end,
//       allDay: event.allDay,
//       title: event.title,
//       description: "",
//     });
//   }
// }
function handleDateSelect(selectInfo: DateSelectArg) {
  // const title = prompt("Please enter a new title for your event");
  const calendarApi = selectInfo.view.calendar;

  calendarApi.unselect(); // clear date selection

  // if (title) {
  //   calendarApi.addEvent({
  //     id: new Date().getTime().toString(),
  //     title,
  //     start: selectInfo.startStr,
  //     end: selectInfo.endStr,
  //     allDay: selectInfo.allDay,
  //   });
  // }
  // const event = selectInfo;

  formData.start = selectInfo.start;
  formData.end = selectInfo.end;
  formData.allDay = selectInfo.allDay;
  dialogVisible.value = true;

  // if (event.start !== null && event.end !== null) {
  //   eventStore.addEvent({
  //     id: new Date().getTime().toString(),
  //     start: event.start,
  //     end: event.end,
  //     allDay: event.allDay,
  //     title: "demo",
  //     description: "",
  //   });
  // }
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
</script>
<template>
  <div>
    <p v-for="event in events" :key="event.id">{{ event.title }}</p>
    <FullCalendar class="demo-app-calendar" :options="calendarOptions">
      <template #eventContent="arg">
        <b>{{ arg.timeText }}</b>
        <i>{{ arg.event.title }}</i>
      </template>
    </FullCalendar>
    <el-dialog v-model="dialogVisible" title="Add Event" width="50%">
      <EventForm v-model="formData" @close="dialogVisible = false" />
    </el-dialog>
  </div>
</template>
