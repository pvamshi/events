<script setup lang="ts">
import "element-plus/dist/index.css";

import { useEventStore } from "./store/event";
import { useGuestStore } from "./store/guest";

const dialogVisible = ref(false);

export interface FormData {
  start: Date;
  end: Date;
  allDay: boolean;
  title: string;
  description: string;
  guests: string[];
  location: string;
}

// Component data
const formData: FormData = reactive({
  start: new Date(),
  end: new Date(),
  allDay: false,
  title: "",
  description: "",
  guests: [],
  location: "",
});

const modalContent = ref<"Add" | "View" | null>(null);
const selectedEventId = ref<string | null>(null);
const selectedEventTitle = ref<string>("Event details");

// store data
const {
  public: { API_URL },
} = useRuntimeConfig();

const eventStore = useEventStore();
const guestStore = useGuestStore();
const { events } = storeToRefs(eventStore);

// Initatialize store data
if (events.value === null) {
  eventStore.fetchEvents(API_URL);
  guestStore.fetchGuests(API_URL);
}

// component methods
function closeModal() {
  dialogVisible.value = false;
  modalContent.value = null;
  selectedEventId.value = null;
  selectedEventTitle.value = "Event details";
}

function handleCreateEvent(event: FormData) {
  Object.assign(formData, event);
  modalContent.value = "Add";
  dialogVisible.value = true;
}

function handleViewEvent({
  eventId,
  eventTitle,
}: {
  eventId: string;
  eventTitle: string;
}) {
  dialogVisible.value = true;
  modalContent.value = "View";
  selectedEventId.value = eventId;
  selectedEventTitle.value = eventTitle;
}
</script>
<template>
  <div>
    <MainCalendar
      @create-event="handleCreateEvent"
      @view-event="handleViewEvent"
    />
    <el-dialog
      v-model="dialogVisible"
      :title="modalContent === 'Add' ? 'Add Event' : selectedEventTitle"
      width="380px"
    >
      <EventForm
        v-if="modalContent === 'Add'"
        v-model="formData"
        @close="closeModal"
      />
      <ViewEvent v-else-if="selectedEventId !== null" :id="selectedEventId" />
    </el-dialog>
  </div>
</template>
<style>
*:root {
  font-family: "Inter", sans-serif;
}
</style>
