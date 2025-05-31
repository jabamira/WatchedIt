import { createRouter, createWebHashHistory } from "vue-router";
import HomeVue from "../views/HomeView.vue";
import Auth from "../views/Auth.vue";
import InfoPage from "../views/InfoPage.vue";

const routes = [
  { path: "/", component: HomeVue },
  { path: "/Auth", component: Auth },
  {
    path: "/InfoPage",
    component: InfoPage,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const isAuthPage = to.path === "/Auth";

  try {
    const res = await fetch("https://turbo-space-funicular-pxwpjgwp6jrh6wwp-30002.app.github.dev/me", {
      credentials: "include",
    });

    const isAuthenticated = res.ok;

    if (to.meta.requiresAuth && !isAuthenticated) {
      return next("/Auth");
    }

    if (isAuthPage && isAuthenticated) {
      return next("/InfoPage");
    }

    return next();
  } catch (err) {
    console.error("Ошибка при проверке авторизации:", err);

    if (to.meta.requiresAuth) {
      return next("/Auth");
    }

    return next();
  }
});

export default router;
