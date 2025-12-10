<template>
  <nav class="fixed top-0 bg-white border-gray-200 dark:border-slate-700 dark:bg-gray-800 flex flex-row left-0 w-full z-50 p-2">
    <!-- Логотип -->
    <a @click="nav.NavigateHome()" class="items-center h-15 cursor-pointer flex ml-2">
      <svg xmlns="http://www.w3.org/2000/svg" width="230" viewBox="0 0 700 120">
        <text x="220" y="90" font-family="VAG World" font-weight="bold" font-size="93" class="fill-black dark:fill-white">
          Fast Quiz
        </text>
      </svg>
    </a>

    <div class="flex flex-row gap-3 ml-auto items-center">
      <!-- Кнопки логина/регистрации -->
      <div v-if="!authStore.isAuthenticated && route.path !== '/auth'" class="flex gap-3">
  <a href="#/auth?mode=login" class="btn-indigo-light">Login</a>
  <a href="#/auth?mode=signup" class="btn-indigo">Sign up</a>
</div>

      <!-- Профиль пользователя -->
<!-- Профиль пользователя -->
<div v-if="authStore.isAuthenticated" class="relative">
  <button
    @click="toggleDropdown"
    ref="avatarButton"
    class="flex items-center justify-center h-16 w-16 rounded-full overflow-hidden"
  >
    <img
      :src="avatarSrc"
      alt="User"
      class="h-16 w-16 object-cover object-center rounded-full"
    />
  </button>

  <!-- Dropdown -->
  <div
    v-show="dropdownOpen"
    class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg z-50"
  >
    <div class="px-4 py-2 text-sm text-gray-900 dark:text-white">
      <div class="font-medium">{{ authStore.user?.login }}</div>
      <div class="text-xs text-gray-500 dark:text-gray-400">{{ authStore.user?.email }}</div>
    </div>
    <ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
      <li>
        <a @click="nav.NavigateUser" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">Profile</a>
      </li>
      <li>
        <a @click="logout" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">Sign out</a>
      </li>
    </ul>
  </div>
</div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useNavigation } from "../router/navigation.js";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const route = useRoute();
const nav = useNavigation();
const authStore = useAuthStore();

// Dropdown
const dropdownOpen = ref(false);
const avatarButton = ref(null);

// Аватар
const avatarSrc = ref(
  authStore.user?.avatarUrl
    ? `http://localhost:3000${authStore.user.avatarUrl}`
    : "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/helene-engels.png"
);

// Кнопки авторизации — computed с проверкой пути
const showAuthButtons = computed(() => !authStore.isAuthenticated && route.path !== "/auth");

// Слежение за изменением пользователя и аватара
watch(
  () => authStore.user,
  (newUser) => {
    avatarSrc.value = newUser?.avatarUrl
      ? `http://localhost:3000${newUser.avatarUrl}`
      : "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/helene-engels.png";
  },
  { immediate: true }
);

// Переключение dropdown
function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value;
}

// Выход
async function logout() {
  await authStore.logout();
  dropdownOpen.value = false;
  avatarSrc.value = "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/helene-engels.png";
  router.push("/auth");
}

// Закрытие dropdown при клике вне
function handleClickOutside(event) {
  if (avatarButton.value && !avatarButton.value.contains(event.target)) {
    dropdownOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});
</script>

<style scoped>
button img {
  display: block;
}
</style>
