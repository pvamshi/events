<script setup lang="ts">
import { useGuestStore } from "../store/guest";

const showGuestForm = ref(false);
const guestStore = useGuestStore();
const { guests, addGuestInProgress } = storeToRefs(guestStore);
const props = defineProps<{
  modelValue: string[];
}>();
const emit = defineEmits(["update:modelValue"]);

const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

if (guests.value === null) {
  guestStore.fetchGuests();
}
const form = reactive({
  name: "",
  email: "",
});

function addGuest() {
  guestStore.addGuest(form).then(() => {
    form.name = "";
    form.email = "";
    showGuestForm.value = false;
  });
}
</script>
<template>
  <div class="guest-form-container">
    <el-select
      v-model="value"
      multiple
      filterable
      remote
      reserve-keyword
      placeholder="Please enter a keyword"
    >
      <el-option
        v-for="item in guests"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      />
    </el-select>
    <el-button
      v-if="!showGuestForm"
      class="add-guest-btn"
      @click="showGuestForm = true"
      >Add Guest</el-button
    >
    <el-form
      v-else
      :model="form"
      label-width="60px"
      class="guest-form"
      :disabled="addGuestInProgress"
    >
      <el-form-item label="Name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="Email">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item class="guest-form-buttons">
        <el-button type="primary" @click="addGuest">{{
          addGuestInProgress ? "Creating guest .." : "Create"
        }}</el-button>
        <el-button @click="showGuestForm = false">Cancel</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<style scoped>
.guest-form-container {
  display: flex;
  flex-direction: column;
}

.add-guest-btn {
  margin-top: 20px;
}

.guest-form {
  margin-top: 20px;
  width: 280px;
  margin-left: -60px;
}

.guest-form .el-input {
  margin-top: 10px;
}

.guest-form-buttons {
  margin-top: 10px;
  margin-left: 60px;
}
</style>
