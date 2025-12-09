<template>
  <div class="p-4 bg-[#1f2937] rounded-xl shadow border border-gray-600">

    <div class="font-semibold text-lg text-white mb-3">
      {{ poll.question }}
    </div>

    <div
      v-for="option in poll.options"
      :key="option.id"
      @click="select(option.id)"
      :class="[
        'flex justify-between px-4 py-2 rounded-lg mb-2',
        'transition select-none border border-gray-700 text-gray-200',
        props.isAuthenticated ? 'cursor-pointer hover:bg-gray-700' : 'cursor-default opacity-70',
        store.userVotes[poll.id]?.includes(option.id)
          ? 'bg-blue-600 border-blue-400 text-white'
          : ''
      ]"
    >
      <span class="font-medium">{{ option.text }}</span>
      <span class="text-sm opacity-80">{{ store.pollResults[poll.id][option.id] ?? 0 }}</span>
    </div>

  </div>
</template>




<script setup>
import { usePollStore } from "../stores/polls";

const props = defineProps({
  poll: Object,
  isAuthenticated: Boolean
});

const store = usePollStore();

function select(optionId) {
  if (!props.isAuthenticated) return;

  const current = store.userVotes[props.poll.id] || [];

  let newSelection = props.poll.multipleChoice
    ? (current.includes(optionId)
      ? current.filter(id => id !== optionId)
      : [...current, optionId])
    : [optionId];

  store.vote(props.poll.id, newSelection);
}
</script>
<style scoped>
.poll-item {
  padding: 10px;
  border-bottom: 1px solid #333;
}

.option {
  display: flex;
  justify-content: space-between;
  padding: 6px;
  cursor: pointer;
}

.option.selected {
  background: rgba(0, 150, 255, 0.25);
  border-radius: 4px;
}
</style>
