<script setup lang="ts">
import { useEventStore } from "../store/event";
const props = defineProps<{
  id: string;
}>();
const eventStore = useEventStore();
const { events, guestsMap } = storeToRefs(eventStore);
if (Object.keys(guestsMap).length === 0) {
  eventStore.fetchGuests();
}
const event = computed(
  () => (events.value || []).filter((e) => e.id === props.id)[0],
);
</script>
<template>
  <p v-if="!event">Loading event ...</p>
  <template v-else>
    {{ event.description }}
    <div class="event-details">
      <el-icon>
        <ElIconCalendar />
      </el-icon>
      <div>{{ event.start }} - {{ event.end }}</div>
    </div>
    <div class="event-details">
      <el-icon>
        <ElIconMapLocation />
      </el-icon>
      <div>{{ event.location }}</div>
    </div>

    <h4 v-if="event.guests.length > 0">Guests</h4>
    <div v-for="guestId in event.guests" :key="guestId" class="event-details">
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
