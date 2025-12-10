<template>
    <HeaderComponent />
  <div class="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
    <h1 class="text-8xl font-extrabold text-red-600 text-center">
      Не Успел Доделать
    </h1>
  </div>
</template>

<script setup>
import HeaderComponent from '../components/HeaderComponent.vue';

//  я 8:18 
</script>

<style scoped>
h1 {
  animation: blink 1.2s infinite;
}

@keyframes blink {
  0%, 50%, 100% { opacity: 1; }
  25%, 75% { opacity: 0.5; }
}
</style>

