import { defineStore } from "pinia";
import axios from "axios";

const API_URL = "http://localhost:3000";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    isAuthenticated: false,
  }),

  actions: {
    setUser(user) {
      this.user = user;
      this.isAuthenticated = !!user;
    },

    async login(login, password) {
      try {
        const res = await axios.post(`${API_URL}/auth/login`, { login, password }, { withCredentials: true });
        if (!res.data.success) return false;
        await this.fetchUser();
        return true;
      } catch (err) {
        console.error("[AUTH STORE] Login error:", err.response?.data || err.message);
        return false;
      }
    },

    async register(login, password) {
      try {
        const res = await axios.post(`${API_URL}/auth/register`, { login, password }, { withCredentials: true });
        if (!res.data.success) return false;
        await this.fetchUser();
        return true;
      } catch (err) {
        console.error("[AUTH STORE] Register error:", err.response?.data || err.message);
        return false;
      }
    },

    async logout() {
      try {
        await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
      } catch (err) {
        console.error("[AUTH STORE] Logout error:", err.response?.data || err.message);
      } finally {
        this.setUser(null);
      }
    },

    async fetchUser() {
      try {
        const res = await axios.get(`${API_URL}/me`, { withCredentials: true });
        this.setUser(res.data.user);
      } catch (err) {
        console.error("[AUTH STORE] Fetch user error:", err.response?.data || err.message);
        this.setUser(null);
      }
    },
  },
});
