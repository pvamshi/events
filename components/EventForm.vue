<script setup lang="ts">
import type { FormData } from "./FullCalendar.vue";
const isFormPending = ref(false);
const props = defineProps<{
  modelValue: FormData;
}>();
const emit = defineEmits<{
  close: [];
}>();
const {
  public: { API_URL },
} = useRuntimeConfig();
const form = reactive<FormData>({
  title: "",
  start: props.modelValue?.start ?? new Date(),
  end: props.modelValue?.end ?? new Date(),
  allDay: props.modelValue?.allDay ?? false,
  description: "",
});

watch(props.modelValue, () => {
  form.start = props.modelValue.start;
  form.end = props.modelValue.end;
  form.allDay = props.modelValue.allDay;
});
function onSubmit() {
  isFormPending.value = true;
  fetch(`${API_URL}/events`, {
    method: "POST",
    body: JSON.stringify(form),
  })
    .then((res) => res.json())
    .then(() => {
      isFormPending.value = false;
      emit("close");
    });
}
</script>
<template>
  <el-form :model="form" label-width="120px">
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
    <el-form-item label="Description">
      <el-input v-model="form.description" type="textarea" />
    </el-form-item>
    <p v-if="isFormPending">In progress</p>
    <el-form-item v-else>
      <el-button type="primary" @click="onSubmit">Create</el-button>
      <el-button @click="emit('close')">Cancel</el-button>
    </el-form-item>
  </el-form>

  <!-- <template #footer> -->
  <!--   <span class="dialog-footer"> -->
  <!--     <el-button @click="dialogVisible = false">Cancel</el-button> -->
  <!--     <el-button type="primary" @click="dialogVisible = false"> -->
  <!--       Confirm -->
  <!--     </el-button> -->
  <!--   </span> -->
  <!-- </template> -->
</template>
