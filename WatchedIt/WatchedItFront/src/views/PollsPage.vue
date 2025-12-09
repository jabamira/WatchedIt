<template>
  <div class="p-4">
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

const authStore = useAuthStore();
const pollStore = usePollStore();

async function fetchPolls() {
  await pollStore.fetchPolls(authStore.isAuthenticated);
}

function handleVote({ pollId, results, votedOptions }) {
  console.log("Vote recorded for poll", pollId, results, votedOptions);
  pollStore.userVotes[pollId] = votedOptions;
  results.forEach(r => pollStore.pollResults[pollId][r.id] = r.votes);
}

onMounted(fetchPolls);
</script>
