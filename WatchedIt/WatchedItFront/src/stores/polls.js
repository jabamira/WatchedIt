import { defineStore } from "pinia";
import { ref, reactive } from "vue";
import axios from "axios";
import { io } from "socket.io-client";

const API_URL = "http://localhost:3000";

export const usePollStore = defineStore("polls", () => {
  const polls = ref([]);
  const pollResults = reactive({});
  const userVotes = reactive({});
  const socket = io(API_URL, { withCredentials: true });

  // -------------------------
  // FETCH POLLS
  // -------------------------
  async function fetchPolls(authenticated) {
    try {
      const res = await axios.get(`${API_URL}/polls`, { withCredentials: true });

      polls.value = res.data;

      polls.value.forEach(p => {
        // Результаты голосов
        pollResults[p.id] = {};
        p.options.forEach(o => (pollResults[p.id][o.id] = o.votes));

        // Подсветка — id опций, за которые проголосовал текущий пользователь
        userVotes[p.id] = authenticated ? [...(p.userVotes || [])] : [];
      });

      // Сортировка: новые опросы сверху
      polls.value.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    } catch (err) {
      console.error("[FETCH POLLS]", err.response?.data || err.message);
    }
  }
async function fetchUserVotes() {
  try {
    const res = await axios.get(`${API_URL}/routes/user-votes`, { withCredentials: true });
    const votesData = res.data; // { [pollId]: [optionId, ...] }

    // Кладем в реактивный объект
    Object.keys(votesData).forEach(pollId => {
      userVotes[pollId] = votesData[pollId];
    });
  } catch (err) {
    console.error("[FETCH USER VOTES]", err.response?.data || err.message);
  }
}

  // -------------------------
  // VOTE
  // -------------------------
  async function vote(pollId, optionIds) {
    try {
      await axios.post(`${API_URL}/polls/${pollId}/vote`, { optionIds }, { withCredentials: true });

      // сразу подсвечиваем
      userVotes[pollId] = [...optionIds];
      // pollResults обновится через сокет
    } catch (err) {
      console.error("[VOTE ERROR]", err.response?.data || err.message);
    }
  }

  // -------------------------
  // SOCKET EVENTS
  // -------------------------
  socket.on("poll:vote", ({ pollId, results }) => {
    if (!pollResults[pollId]) return;
    results.forEach(r => pollResults[pollId][r.id] = r.votes);
  });

  socket.on("poll:created", poll => {
    polls.value.unshift(poll);
    pollResults[poll.id] = {};
    poll.options.forEach(o => (pollResults[poll.id][o.id] = o.votes));
    userVotes[poll.id] = [];
  });

 return { polls, pollResults, userVotes, fetchPolls, vote, fetchUserVotes };
});