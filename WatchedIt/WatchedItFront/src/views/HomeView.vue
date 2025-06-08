<template></template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

onMounted(() => {
  import("flowbite").then(({ initFlowbite }) => {
    a;
    initFlowbite();
  });
});

const perehodClicker = () => {
  router.push("/Auth");
};
</script>

<style scoped></style>
