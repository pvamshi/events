<script setup lang="ts">
import { useEventStore } from "../store/event";
import { useGuestStore } from "../store/guest";
const props = defineProps<{
  id: string;
}>();
const eventStore = useEventStore();
const guestStore = useGuestStore();
const { events } = storeToRefs(eventStore);
const { guestsMap } = storeToRefs(guestStore);
const event = computed(
  () => (events.value || []).filter((e) => e.id === props.id)[0],
);

function editEvent() {
  // TODO: implement edit event
}

function deleteEvent() {
  // TODO: implement delete event
}

const TIME_IN_DAY = 24 * 60 * 60 * 1000;
function formatDate(date1: Date, date2: Date, allDay: boolean) {
  const secondDate = new Date(date2.getTime() - TIME_IN_DAY); // exclude the last date as calendar stores 1 day extra
  if (allDay) {
    if (+secondDate - +date1 === 0) {
      // same day
      return date1.toDateString();
    }
    return date1.toDateString() + " - " + secondDate.toDateString();
  }
  return (
    date1.toDateString() +
    ", " +
    date1.toLocaleTimeString() +
    " - " +
    secondDate.toLocaleTimeString()
  );
}
</script>
<template>
  <p v-if="!event">Loading event ...</p>
  <template v-else>
    {{ event.description }}
    <div class="event-details">
      <el-icon>
        <ElIconCalendar />
      </el-icon>
      {{ formatDate(event.start, event.end, event.allDay) }}
    </div>
    <div v-if="event.location" class="event-details">
      <el-icon>
        <ElIconMapLocation />
      </el-icon>
      <div>{{ event.location }}</div>
    </div>

    <h4 v-if="Object.keys(event.guests).length > 0">Guests</h4>
    <div
      v-for="guestId in Object.keys(event.guests)"
      :key="guestId"
      class="event-details"
    >
      <el-icon>
        <ElIconUser />
      </el-icon>
      <div>
        {{ guestsMap[guestId].name }}
      </div>
    </div>
    <div class="action-buttons">
      <el-button type="primary" @click="editEvent">Edit</el-button>
      <el-button type="danger" @click="deleteEvent">Delete</el-button>
    </div>
  </template>
</template>
<style>
.event-details {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.el-dialog__body {
  margin-top: 0;
}

.action-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
