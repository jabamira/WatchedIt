import { createRouter, createWebHashHistory } from "vue-router";
import HomeVue from "../views/HomeView.vue";
import Auth from "../views/Auth.vue";
import LibraryLayout from "../views/LibraryLayout.vue";
import InfoPage from "../views/InfoPage.vue";
import FilmsPage from "../views/FilmsPage.vue";
import SerialsPage from "../views/SerialsPage.vue";
import AnimePage from "../views/AnimePage.vue";
import CartoonsPage from "../views/CartoonsPage.vue";
import { useAuthStore } from "../stores/auth"; // путь к твоему store

const routes = [
  { path: "/", component: HomeVue },
  { path: "/Auth", component: Auth },
  {
    path: "/InfoPage",
    component: InfoPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/library",
    component: LibraryLayout,
    children: [
      { path: "films", component: FilmsPage },
      { path: "serials", component: SerialsPage },
      { path: "anime", component: AnimePage },
      { path: "cartoons", component: CartoonsPage },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();

  if (!auth.isAuthenticated) {
    await auth.fetchUser();
  }

  const isAuthPage = to.path === "/Auth";

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next("/Auth");
  }

  if (isAuthPage && auth.isAuthenticated) {
    return next("/InfoPage");
  }

  return next();
});

export default router;
