<script setup lang="ts">
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
    <p v-if="pending">Loading...</p>
    <ul>
      <li v-for="event in (data || []).slice(0, 10)" :key="event.id">
        {{ event.title }}
      </li>
    </ul>
  </div>
</template>
