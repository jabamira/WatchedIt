<template>Films</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

onMounted(() => {
  import("flowbite").then(({ initFlowbite }) => {
    initFlowbite();
  });
});
</script>

<style scoped></style>
