<script setup lang="ts">
import { useEventStore } from "../store/event";
import type { FormData } from "../app.vue";
const props = defineProps<{
  modelValue: FormData;
}>();
const emit = defineEmits<{
  close: [];
}>();

const eventStore = useEventStore();
const { addEventInProgress } = storeToRefs(eventStore);
const form = reactive<FormData>({
  title: "",
  start: props.modelValue?.start ?? new Date(),
  end: props.modelValue?.end ?? new Date(),
  allDay: props.modelValue?.allDay ?? false,
  description: "",
  guests: [],
  location: "",
});

watch(props.modelValue, () => {
  form.start = props.modelValue.start;
  form.end = props.modelValue.end;
  form.allDay = props.modelValue.allDay;
});
function onSubmit() {
  eventStore.addEvent({ ...form, createdAt: new Date() }).then(() => {
    ElMessage({
      message: "All invitations have been sent!",
      type: "success",
    });
    emit("close");
  });
}
</script>
<template>
  <el-form :model="form" label-width="120px" :disabled="addEventInProgress">
    <el-form-item label="Title">
      <el-input v-model="form.title" />
    </el-form-item>
    <el-form-item label="Start time">
      <el-col :span="11">
        <el-date-picker
          v-model="form.start"
          type="datetime"
          placeholder="Pick a Date"
          format="YYYY-MM-DD HH:mm:ss"
          date-format="MMM DD, YYYY"
          time-format="HH:mm"
        />
      </el-col>
    </el-form-item>
    <el-form-item label="End time">
      <el-col :span="11">
        <el-date-picker
          v-model="form.end"
          type="datetime"
          placeholder="Pick a Date"
          format="YYYY-MM-DD HH:mm:ss"
          date-format="MMM DD, YYYY"
          time-format="HH:mm"
        />
      </el-col>
    </el-form-item>
    <el-form-item label="All Day">
      <el-switch v-model="form.allDay" />
    </el-form-item>

    <el-form-item label="Location">
      <el-input v-model="form.location" />
    </el-form-item>
    <el-form-item label="Guests">
      <GuestsForm v-model="form.guests" />
    </el-form-item>
    <el-form-item label="Description">
      <el-input v-model="form.description" type="textarea" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">{{
        addEventInProgress ? "Adding Event... " : "Add Event"
      }}</el-button>
      <el-button @click="emit('close')">Cancel</el-button>
    </el-form-item>
  </el-form>
</template>
