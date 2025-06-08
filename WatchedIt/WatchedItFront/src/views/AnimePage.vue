<template></template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

onMounted(() => {
  import("flowbite").then(({ initFlowbite }) => {
    initFlowbite();
  });
});
</script>

<style scoped></style>
