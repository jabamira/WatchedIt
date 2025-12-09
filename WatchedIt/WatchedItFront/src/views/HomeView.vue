<template>
  <HeaderComponent />

  <div class="flex flex-col items-center justify-center h-screen w-screen text-center px-4">
    <h1 class="text-4xl font-bold mb-4">Fast Quiz</h1>

    <p class="text-lg text-gray-700 max-w-xl">
      Создавайте опросы за секунды и получайте результаты в реальном времени.
      Удобно для друзей, команд и любых быстрых решений.
    </p>

    <button
      @click="NavigatePolls"
      class="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
    >
      Перейти к опросам
    </button>
  </div>
</template>

<script>
import HeaderComponent from "../components/HeaderComponent.vue";
import { useNavigation } from "../router/navigation";

export default {
  components: { HeaderComponent },

  setup() {
    const { NavigatePolls } = useNavigation();

    return { NavigatePolls };
  },
};
</script>

<style scoped>
body {
  margin: 0;
  font-family: Arial, sans-serif;
}
</style>
