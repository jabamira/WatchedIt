import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import axios from "axios";
import { io } from "socket.io-client";

const API_URL = "http://localhost:3000";

export const usePollStore = defineStore("polls", () => {
  const polls = ref([]);
  const pollResults = reactive({});
  const userVotes = reactive({});
  const socket = io(API_URL, { withCredentials: true });

	//  =========================
	//   FETCH
	//  =========================
  async function fetchPolls(authenticated) {
    try {
      const res = await axios.get(`${API_URL}/polls`, { withCredentials: true });

      polls.value = res.data.reverse();

      polls.value.forEach(p => {

        /// результаты голосов
        pollResults[p.id] = {};
        p.options.forEach(o => pollResults[p.id][o.id] = o.votes);

        /// подсветка - ТОЛЬКО если авторизован
        userVotes[p.id] = authenticated ? p.userVotes || [] : [];
      });

    } catch (err) {
      console.error("[FETCH POLLS]", err.response?.data || err.message);
    }
  }

	//  =========================
	//   LOCAL VOTE SAVE + socket sync
	//  =========================
  async function vote(pollId, optionIds) {
    try {
      await axios.post(`${API_URL}/polls/${pollId}/vote`, { optionIds }, { withCredentials: true });

      // сразу подсвечиваем
      userVotes[pollId] = optionIds;

      /// НЕ обновляем pollResults тут!  
      /// Это сделает сокет!!!

    } catch (err) {
      console.error("[VOTE ERROR]", err.response?.data || err.message);
    }
  }

	//  =========================
	//   SOCKET EVENTS
	//  =========================
  socket.on("poll:vote", ({ pollId, results }) => {
    if (!pollResults[pollId]) return;

    results.forEach(r => {
      pollResults[pollId][r.id] = r.votes;
    });
  });

  socket.on("poll:created", poll => {
    polls.value.unshift(poll);

    pollResults[poll.id] = {};
    poll.options.forEach(o => pollResults[poll.id][o.id] = o.votes);
    userVotes[poll.id] = [];
  });

  return { polls, pollResults, userVotes, fetchPolls, vote };
});
