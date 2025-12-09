<template>
  <div class="p-4">
    <!-- Форма создания опроса видна только авторизованным -->
    <PollCreate v-if="authStore.isAuthenticated" @created="fetchPolls" />

    <div class="mt-6">
      <PollItem
        v-for="poll in polls"
        :key="poll.id"
        :poll="poll"
        @voted="() => {}"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, provide } from "vue";
import { useAuthStore } from "../stores/auth";
import axios from "axios";
import { io } from "socket.io-client";
import PollItem from "../components/PollItem.vue";
import PollCreate from "../components/PollCreate.vue";

const API_URL = "http://localhost:3000";
const authStore = useAuthStore();

const polls = ref([]);
let socket;

function processPollData(data) {
  // преобразуем для фронта: options и userVotes
  return data.map(p => ({
    id: p.id,
    question: p.question,
    isAnonymous: p.isAnonymous,
    multipleChoice: p.multipleChoice,
    options: p.options.map(o => ({
      id: o.id,
      text: o.text,
      votes: o.votes,
    })),
    userVotes: p.userVotes || [], // варианты, за которые пользователь голосовал
  }));
}

async function fetchPolls() {
  try {
    const res = await axios.get(`${API_URL}/polls`);
    polls.value = processPollData(res.data);
  } catch (err) {
    console.error("Ошибка загрузки опросов:", err);
  }
}

onMounted(async () => {
  await fetchPolls();

  socket = io(API_URL, { withCredentials: true });
  provide("socket", socket);

  socket.on("poll:created", poll => {
    polls.value.unshift({
      ...poll,
      options: poll.options.map(o => ({ ...o })),
      userVotes: [],
    });
  });

  socket.on("poll:vote", ({ pollId, results, userVotes }) => {
    const poll = polls.value.find(p => p.id === pollId);
    if (!poll) return;
    poll.options.forEach(opt => {
      const r = results.find(r => r.id === opt.id);
      if (r) opt.votes = r.votes;
    });
    poll.userVotes = userVotes;
  });
});
</script>
