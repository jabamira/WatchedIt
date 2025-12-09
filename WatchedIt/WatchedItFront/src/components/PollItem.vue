<template>
  <div class="border rounded p-4 mb-4 bg-white dark:bg-gray-800 shadow-sm">
    <div class="flex justify-between items-center mb-2">
      <h3 class="font-bold text-gray-900 dark:text-white">{{ poll.question }}</h3>
      <div class="text-sm text-gray-500 dark:text-gray-300 space-x-2">
        <span v-if="poll.isAnonymous">Анонимно</span>
        <span v-if="poll.multipleChoice">Несколько вариантов</span>
      </div>
    </div>

    <div class="space-y-2">
      <div
        v-for="option in poll.options"
        :key="option.id"
        class="flex justify-between items-center p-2 border rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
        :class="{'opacity-60': poll.userVotes.includes(option.id)}"
        @click="handleVote(option.id)"
      >
        <span>{{ option.text }}</span>
        <span class="text-gray-600 dark:text-gray-300">{{ option.votes }} голосов</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "../stores/auth";
import { inject } from "vue";
import axios from "axios";

const props = defineProps({
  poll: Object,
});

const emit = defineEmits(["voted"]);

const API_URL = "http://localhost:3000";
const authStore = useAuthStore();
const socket = inject("socket"); // сокет передаётся из PollsPage

function handleVote(optionId) {
  if (!authStore.isAuthenticated) return;

  // не даём голосовать повторно за тот же вариант
  if (props.poll.userVotes.includes(optionId)) return;

  axios
    .post(`${API_URL}/polls/${props.poll.id}/vote`, { optionIds: optionId }, { withCredentials: true })
    .then(res => {
      const { results, userVotes } = res.data;
      // обновляем локально
      props.poll.options.forEach(opt => {
        const r = results.find(r => r.id === opt.id);
        if (r) opt.votes = r.votes;
      });
      props.poll.userVotes = userVotes;

      emit("voted", props.poll.id); // можно использовать для родителя
    })
    .catch(err => console.error(err));
}
</script>

<style scoped>
.opacity-60 {
  opacity: 0.6;
}
</style>
