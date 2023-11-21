<script setup lang="ts">
const user = ref("vamshi");
</script>
<template>
  <div :data="user">
    <p>{{ user }}</p>
  </div>
</template>
