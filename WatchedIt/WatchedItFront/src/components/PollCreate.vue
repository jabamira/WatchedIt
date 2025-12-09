<template>
  <form v-if="isAuth" @submit.prevent="createPoll" class="space-y-4 border-b pb-4 mb-6 p-4 rounded shadow-sm bg-white dark:bg-gray-800">
    <h2 class="text-xl font-bold mb-2 text-gray-900 dark:text-white">Создать опрос</h2>

    <div>
      <label class="block mb-1 font-medium text-gray-900 dark:text-white">Вопрос</label>
      <input v-model="question" type="text" class="w-full border rounded px-2 py-1 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700" required />
    </div>

    <div>
      <label class="block mb-1 font-medium text-gray-900 dark:text-white">Варианты</label>
      <div v-for="(option, idx) in options" :key="idx" class="flex gap-2 mb-2">
        <input v-model="options[idx]" type="text" class="flex-1 border rounded px-2 py-1 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700" required />
        <button type="button" @click="removeOption(idx)" class="text-red-500 font-bold">×</button>
      </div>
      <button type="button" @click="addOption" class="text-indigo-600 hover:underline">Добавить вариант</button>
    </div>

    <div class="flex gap-4 items-center">
      <label class="flex items-center gap-2 text-gray-900 dark:text-white">
        <input type="checkbox" v-model="isAnonymous" /> Анонимное голосование
      </label>
      <label class="flex items-center gap-2 text-gray-900 dark:text-white">
        <input type="checkbox" v-model="multipleChoice" /> Несколько вариантов
      </label>
    </div>

    <button type="submit" class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500">
      Создать
    </button>
  </form>
</template>

<script setup>
import { ref, computed } from "vue";
import axios from "axios";
import { useAuthStore } from "../stores/auth";

const API_URL = "http://localhost:3000";

const authStore = useAuthStore();
const isAuth = computed(() => authStore.isAuthenticated);

const question = ref("");
const options = ref(["", ""]);
const isAnonymous = ref(false);
const multipleChoice = ref(false);

function addOption() {
  options.value.push("");
}
function removeOption(idx) {
  if (options.value.length > 1) options.value.splice(idx, 1);
}

async function createPoll() {
  if (!question.value.trim() || options.value.some(o => !o.trim())) return;
  try {
    await axios.post(
      `${API_URL}/polls`,
      {
        question: question.value,
        options: options.value,
        isAnonymous: isAnonymous.value,
        multipleChoice: multipleChoice.value
      },
      { withCredentials: true }
    );
    question.value = "";
    options.value = ["", ""]; 
    isAnonymous.value = false;
    multipleChoice.value = false;
  } catch (err) {
    console.error("[PollCreate] createPoll error:", err.response?.data || err.message);
  }
}
</script>
