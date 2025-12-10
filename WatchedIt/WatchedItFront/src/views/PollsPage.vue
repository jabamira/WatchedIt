<template>
  <HeaderComponent></HeaderComponent>
  <div class="pt-24 p-4">
    <PollCreate v-if="authStore.isAuthenticated" @created="fetchPolls" />

    <div class="mt-6 space-y-4">
      <PollItem
        v-for="poll in pollStore.polls"
        :key="poll.id"
        :poll="poll"
        :isAuthenticated="authStore.isAuthenticated"
        @voted="handleVote"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useAuthStore } from "../stores/auth";
import { usePollStore } from "../stores/polls";
import PollItem from "../components/PollItem.vue";
import PollCreate from "../components/PollCreate.vue";
import HeaderComponent from "../components/HeaderComponent.vue";

const authStore = useAuthStore();
const pollStore = usePollStore();

async function fetchPolls() {
  const authenticated = authStore.isAuthenticated;
  await pollStore.fetchPolls(authenticated);

  // Сортировка на фронте на всякий случай: новые сверху
  pollStore.polls.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Если авторизован, получаем отдельно все голоса пользователя для подсветки
  if (authenticated) {
    await pollStore.fetchUserVotes();
  }
}

function handleVote({ pollId, results, votedOptions }) {
  pollStore.userVotes[pollId] = votedOptions;
  results.forEach(r => (pollStore.pollResults[pollId][r.id] = r.votes));
}

onMounted(fetchPolls);
</script>
