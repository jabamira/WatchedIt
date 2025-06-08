<template>
  <nav
    class="fixed top-0 bg-white border-gray-200 dark:bg-gray-800 flex flex-row left-0 w-full z-50"
  >
    <!--logo для больших-->
    <a
      @click="nav.NavigateHome()"
      class="items-center cursor-pointer space-x-3 ml-2 rtl:space-x-reverse hidden md:flex"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="210" viewBox="0 0 600 120">
        <path
          fill-rule="evenodd"
          stroke="rgb(28, 47, 46)"
          stroke-width="0px"
          stroke-linecap="butt"
          stroke-linejoin="miter"
          fill="rgb(98, 0, 233)"
          d="M40.197,7.544 L30.638,18.018 L21.447,33.289 L18.383,38.796 L7.149,59.272 L2.043,68.971 L-0.000,79.100 L1.021,92.680 L7.149,102.379 L15.319,109.641 L23.489,109.641 L32.681,106.689 L42.894,100.223 L52.085,94.371 L59.234,88.369 L67.404,79.100 L70.743,76.620 C71.627,76.959 68.000,96.672 88.851,109.641 L94.979,111.000 L108.255,109.641 L115.404,106.689 L124.596,100.223 L132.766,94.371 L144.000,84.058 L152.170,75.437 L161.362,65.738 L170.440,53.883 L178.723,43.107 L184.912,33.289 L188.936,28.019 L190.979,19.398 L192.000,11.854 L190.979,5.388 L184.912,-0.000 L180.766,-0.000 L175.660,1.078 L171.574,2.748 L165.447,8.621 L162.383,14.010 L159.319,19.398 L155.969,25.864 L153.191,33.289 L149.106,42.029 L141.497,52.806 L137.872,59.272 L131.745,65.738 L127.026,70.049 L121.532,74.359 L117.447,77.592 L112.555,79.100 L108.255,77.592 L102.128,75.437 L100.085,65.738 L100.085,60.350 L103.149,51.728 L108.255,46.340 L111.319,42.029 L115.404,36.641 L118.468,31.252 C120.449,31.095 126.882,21.453 125.617,21.553 L125.617,16.165 L124.596,10.777 L120.511,7.544 L116.426,4.311 L112.555,2.748 L109.277,4.311 L107.234,6.466 L104.170,9.699 L101.106,12.932 L96.000,19.398 L90.894,28.019 L85.787,36.641 L82.723,43.107 L76.596,50.650 L70.468,56.039 L66.383,60.350 L59.234,66.816 L52.085,72.204 L45.957,75.437 L40.197,76.515 L35.745,73.282 L33.702,70.049 L33.702,63.830 L36.766,59.272 L40.197,54.961 L43.915,49.573 L47.1000,44.184 L53.106,35.563 L58.213,28.019 L60.255,23.709 C60.255,23.709 59.964,21.261 60.255,20.476 C60.546,19.691 59.234,16.165 59.234,16.165 L58.213,12.932 L56.170,10.777 L54.669,8.621 L50.043,5.388 L46.979,4.311 L43.915,5.388 L41.872,6.466 L40.197,7.544 Z"
        />

        <!-- Текст -->
        <text
          x="220"
          y="80"
          font-family="VAG World"
          font-weight="bold"
          font-size="53"
          class="fill-black dark:fill-white"
        >
          Watched It
        </text>
      </svg>
    </a>
    <!--весь нав бар-->
    <div class="flex flex-wrap items-center justify-between mx-auto p-4 w-full">
      <div class="flex flex-row items-center md:order-2 space-x-5 md:space-x-3">
        <!--разделы сверху-->
        <div
          :class="[
            'flex-row gap-10 hidden justify-end md:flex md:order-3',
            !authStore.isAuthenticated ? 'md:mr-85' : '',
          ]"
        >
          <a @click="nav.NavigateFilms()" class="link text-lg">Films</a>
          <a @click="nav.NavigateSerials()" class="link text-lg">Serials</a>
          <a @click="nav.NavigateAnime()" class="link text-lg">Anime</a>
          <a @click="nav.NavigateCartoons()" class="link text-lg">Сartoons</a>
        </div>
        <!--лого для маленькой-->
        <a
          href="http://localhost:5173/#/"
          class="items-center space-x-3 rtl:space-x-reverse flex md:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="210"
            viewBox="0 0 600 120"
          >
            <path
              fill-rule="evenodd"
              stroke="rgb(28, 47, 46)"
              stroke-width="0px"
              stroke-linecap="butt"
              stroke-linejoin="miter"
              fill="rgb(98, 0, 233)"
              d="M40.197,7.544 L30.638,18.018 L21.447,33.289 L18.383,38.796 L7.149,59.272 L2.043,68.971 L-0.000,79.100 L1.021,92.680 L7.149,102.379 L15.319,109.641 L23.489,109.641 L32.681,106.689 L42.894,100.223 L52.085,94.371 L59.234,88.369 L67.404,79.100 L70.743,76.620 C71.627,76.959 68.000,96.672 88.851,109.641 L94.979,111.000 L108.255,109.641 L115.404,106.689 L124.596,100.223 L132.766,94.371 L144.000,84.058 L152.170,75.437 L161.362,65.738 L170.440,53.883 L178.723,43.107 L184.912,33.289 L188.936,28.019 L190.979,19.398 L192.000,11.854 L190.979,5.388 L184.912,-0.000 L180.766,-0.000 L175.660,1.078 L171.574,2.748 L165.447,8.621 L162.383,14.010 L159.319,19.398 L155.969,25.864 L153.191,33.289 L149.106,42.029 L141.497,52.806 L137.872,59.272 L131.745,65.738 L127.026,70.049 L121.532,74.359 L117.447,77.592 L112.555,79.100 L108.255,77.592 L102.128,75.437 L100.085,65.738 L100.085,60.350 L103.149,51.728 L108.255,46.340 L111.319,42.029 L115.404,36.641 L118.468,31.252 C120.449,31.095 126.882,21.453 125.617,21.553 L125.617,16.165 L124.596,10.777 L120.511,7.544 L116.426,4.311 L112.555,2.748 L109.277,4.311 L107.234,6.466 L104.170,9.699 L101.106,12.932 L96.000,19.398 L90.894,28.019 L85.787,36.641 L82.723,43.107 L76.596,50.650 L70.468,56.039 L66.383,60.350 L59.234,66.816 L52.085,72.204 L45.957,75.437 L40.197,76.515 L35.745,73.282 L33.702,70.049 L33.702,63.830 L36.766,59.272 L40.197,54.961 L43.915,49.573 L47.1000,44.184 L53.106,35.563 L58.213,28.019 L60.255,23.709 C60.255,23.709 59.964,21.261 60.255,20.476 C60.546,19.691 59.234,16.165 59.234,16.165 L58.213,12.932 L56.170,10.777 L54.669,8.621 L50.043,5.388 L46.979,4.311 L43.915,5.388 L41.872,6.466 L40.197,7.544 Z"
            />

            <!-- Текст -->
            <text
              x="220"
              y="80"
              font-family="VAG World"
              font-weight="bold"
              font-size="53"
              class="fill-black dark:fill-white"
            >
              Watched It
            </text>
          </svg>
        </a>
      </div>
      <!--кнопки логина и профиль и кнопкамалеькая-->
      <div class="flex flex-row gap-3 md:order-2">
        <!--кнопки логина-->
        <div
          v-if="!authStore.isAuthenticated && !isAuthRoute"
          class="hidden xs:flex flex-row gap-3 md:order-2"
        >
          <a
            href="http://localhost:5173/#/Auth?mode=login"
            class="btn-indigo-light"
            >Login</a
          >
          <a
            href="http://localhost:5173/#/Auth?mode=signup"
            @click=""
            class="btn-indigo mr-5"
            >Sign up</a
          >
        </div>
        <!--кнопки профиля-->
        <div
          v-if="authStore.isAuthenticated"
          class="flex flex-row gap-3 items-center mr-25 md:order-2"
        >
          <!-- Контейнер: Аватар + Ник -->
          <div
            class="flex items-center gap-2"
            data-dropdown-toggle="userDropdown"
            data-dropdown-placement="bottom-start"
          >
            <img
              id="avatarButton"
              type="button"
              class="w-10 h-10 rounded-full cursor-pointer"
              src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
              alt="User dropdown"
            />
            <div class="flex flex-col text-sm">
              <span class="font-semibold text-gray-900 dark:text-white"
                >Bonnie Green</span
              >
              <span class="text-gray-500 dark:text-gray-400 text-xs"
                >name@flowbite.com</span
              >
            </div>
          </div>

          <!-- Dropdown menu -->
          <div
            id="userDropdown"
            class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-800 dark:divide-gray-600 border border-gray-500"
          >
            <div class="px-4 py-3 text-sm text-gray-900 dark:text-white">
              <div class="">Bonnie Green</div>
              <div class="font-medium truncate">name@flowbite.com</div>
            </div>
            <ul
              class="py-2 text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="avatarButton"
            >
              <li>
                <a
                  href="#"
                  class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >Dashboard</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >Settings</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >Earnings</a
                >
              </li>
            </ul>
            <div class="py-1">
              <a
                @click="logout()"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                >Sign out</a
              >
            </div>
          </div>
        </div>
        <!--маленькая кнопка разворота  dropdown -->
        <button
          data-collapse-toggle="mega-menu"
          type="button"
          class="inline-flex items-center p-2 w-10 h-10 justify-center dark:bg-gray-800 rtl:space-x-reverse bg-gray-500 text-sm rounded-lg md:hidden focus:outline-none focus:ring-2"
          aria-controls="mega-menu"
          aria-expanded="false"
        >
          <span class="sr-only">Open main menu</span>
          <svg
            class="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
      </div>

      <!--Мега меню-->
      <div id="mega-menu" class="hidden w-full md:flex md:w-auto md:order-0">
        <ul class="flex flex-col md:flex-row md:mt-0 md:justify-between w-full">
          <li class="w-full">
            <button
              id="mega-menu-dropdown-button"
              data-dropdown-toggle="mega-menu-dropdown"
              class="cursor-pointer items-center flex w-full py-2 px-3 font-medium border-b border-gray-100 md:w-auto hover:bg-gray-150 md:hover:bg-transparent md:border-0 md:hover:text-indigo-600 text-gray-800 hover:text-indigo-600 md:p-0 dark:text-white"
            >
              HomePage
              <svg
                class="w-2.5 h-2.5 ms-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>
            <div
              id="mega-menu-dropdown"
              class="absolute z-10 hidden grid-cols-1 text-sm dark:bg-gray-800 rounded-lg border border-gray-500 md:w-auto w-[80%] mx-auto"
            >
              <div class="p-4 pb-0">
                <ul
                  class="space-y-4 text-base"
                  aria-labelledby="mega-menu-dropdown-button"
                >
                  <li><a href="#" class="link-gray">About Us</a></li>
                  <li><a href="#" class="link-gray">Library</a></li>
                  <li><a href="#" class="link-gray">Resources</a></li>
                  <li><a href="#" class="link-gray">Pro Version</a></li>
                </ul>
              </div>
              <div class="p-4 pb-0">
                <ul class="space-y-4">
                  <li><a href="#" class="link-gray">Blog</a></li>
                  <li><a href="#" class="link-gray">Newsletter</a></li>
                  <li><a href="#" class="link-gray">Playground</a></li>
                  <li><a href="#" class="link-gray">License</a></li>
                </ul>
              </div>
              <div class="p-4">
                <ul class="space-y-4">
                  <li><a href="#" class="link-gray">Contact Us</a></li>
                  <li><a href="#" class="link-gray">Support Center</a></li>
                  <li><a href="#" class="link-gray">Terms</a></li>
                </ul>
              </div>
            </div>
          </li>
          <li class="flex md:flex-row flex-col space-x-5">
            <a href="#" class="link md:hidden">Films</a>
            <a href="#" class="link md:hidden">Serials</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { computed } from "vue";
import { useNavigation } from "../router/navigation.js";

import { useAuthStore } from "../stores/auth";
const authStore = useAuthStore();
const nav = useNavigation();

const router = useRouter();
const route = useRoute();
const isAuthRoute = computed(() => {
  console.log("Текущий маршрут:", route.path);
  return route.path === "/Auth";
});

async function logout() {
  try {
    await authStore.logout();
    router.push("/Auth");
  } catch (error) {
    console.error(error);
  }
}
</script>

<style scoped></style>
