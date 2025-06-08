import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    isAuthenticated: false,
    registration: false,
  }),
  actions: {
    setUser(user) {
      this.user = user;
      this.isAuthenticated = !!user;
    },

    async login(email, password) {
      try {
        const res = await fetch("http://localhost:3000/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (data.success) {
          this.setUser(data.user);
          return true;
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error("Login error:", error.message);
        return false;
      }
    },

    async register(email, login, password) {
      try {
        const res = await fetch("http://localhost:3000/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, login, password }),
        });
        const data = await res.json();
        if (data.success) {
          return true;
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error("Register error:", error.message);
        return false;
      }
    },

    async logout() {
      try {
        await fetch("http://localhost:3000/auth/logout", {
          method: "POST",
          credentials: "include",
        });
        this.setUser(null);
      } catch (error) {
        console.error("Logout error:", error);
      }
    },

    async fetchUser() {
      try {
        const res = await fetch("http://localhost:3000/me", {
          credentials: "include",
        });
        if (!res.ok) {
          this.user = null;
          this.isAuthenticated = false;
          return;
        }
        const data = await res.json();
        if (data.success) {
          this.user = data;
          this.isAuthenticated = true;
        } else {
          this.user = null;
          this.isAuthenticated = false;
        }
      } catch {
        this.user = null;
        this.isAuthenticated = false;
      }
    },
  },
});
