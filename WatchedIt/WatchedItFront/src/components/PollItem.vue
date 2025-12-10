<template>
  <div class="p-4 bg-[#1f2937] rounded-xl shadow border border-gray-600">
    <div class="font-semibold text-lg text-white mb-3">
  {{ poll.question }}
  <span v-if="poll.multipleChoice" class="ml-2 text-sm text-gray-400 italic">
    (Выберите несколько вариантов)
  </span>
</div>

    <div
      v-for="option in poll.options"
      :key="option.id"
      @click="select(option.id)"
      :class="[optionClass(option.id)]"
    >
      <span class="font-medium">{{ option.text }}</span>
      <span class="text-sm opacity-80">{{ store.pollResults[poll.id][option.id] ?? 0 }}</span>
    </div>

    <!-- Кнопка просмотра голосов только для неанонимных опросов -->
   <button
  v-if="!poll.isAnonymous"
  @click="toggleVotes"
  class="mt-2 px-3 py-1 text-sm bg-gray-700 rounded text-white hover:bg-gray-600"
>
  {{ showVotes ? "Скрыть голоса" : "Посмотреть голоса" }}
</button>

    <!-- Список проголосовавших -->
    <div v-if="showVotes" class="mt-2 text-sm text-gray-200">
      <div v-for="option in poll.options" :key="option.id" class="mb-1">
        <div class="font-medium">{{ option.text }}:</div>
        <div v-if="votesList[option.id] && votesList[option.id].length">
          <span v-for="login in votesList[option.id]" :key="login" class="mr-2">{{ login }}</span>
        </div>
        <div v-else class="opacity-70">Нет голосов</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { usePollStore } from "../stores/polls";
import axios from "axios";

const props = defineProps({
  poll: Object,
  isAuthenticated: Boolean
});

const store = usePollStore();
const showVotes = ref(false);
const votesList = ref({});

function optionClass(optionId) {
  return [
    "flex justify-between px-4 py-2 rounded-lg mb-2 transition select-none border border-gray-700 text-gray-200",
    props.isAuthenticated ? "cursor-pointer hover:bg-gray-700" : "cursor-default opacity-70",
    store.userVotes[props.poll.id]?.includes(optionId) ? "bg-blue-600 border-blue-400 text-white" : ""
  ];
}

async function select(optionId) {
  if (!props.isAuthenticated) return;

  const current = store.userVotes[props.poll.id] || [];
  let newSelection;

  if (props.poll.multipleChoice) {
    newSelection = current.includes(optionId) ? current.filter(id => id !== optionId) : [...current, optionId];
  } else {
    newSelection = current.includes(optionId) ? [] : [optionId];
  }

  store.userVotes[props.poll.id] = [...newSelection];
  await store.vote(props.poll.id, newSelection);
}

async function toggleVotes() {
  showVotes.value = !showVotes.value;

  if (showVotes.value && Object.keys(votesList.value).length === 0) {
  
    const res = await axios.get(`http://localhost:3000/polls/${props.poll.id}/votes`, { withCredentials: true });
    votesList.value = res.data;
  }
}
</script>
