import { createRouter, createWebHashHistory } from "vue-router";
import HomeVue from "../views/HomeView.vue";
import Auth from "../views/Auth.vue";
import UserPage from "../views/UserPage.vue";
import PollsPage from "../views/PollsPage.vue"; 
import { useAuthStore } from "../stores/auth";

const routes = [
  { path: "/", component: HomeVue },
  { path: "/auth", component: Auth },
  { path: "/user", component: UserPage, meta: { requiresAuth: true } },
  { path: "/polls", component: PollsPage },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

let userFetched = false; // флаг, что пользователь уже загружен

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();

  if (!userFetched) {
    await auth.fetchUser();
    userFetched = true; // больше не нужно запрашивать каждый раз
  }

  const isAuthPage = to.path === "/auth";


  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next("/auth");
  }

  // редирект на главную, если уже авторизован
  if (isAuthPage && auth.isAuthenticated) {
    return next("/");
  }

  next();
});

export default router;
