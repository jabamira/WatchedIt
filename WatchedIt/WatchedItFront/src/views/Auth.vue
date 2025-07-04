<template>
  <div class="flex h-screen flex-col pt-18 justify-center px-6 py-12 lg:px-8">
    <div
      class="sm:mx-auto sm:w-full sm:max-w-sm flex flex-row items-baseline justify-center space-x-2 whitespace-nowrap"
    >
      <h1 class="text-4xl font-medium text-gray-900 dark:text-white">
        Sign in
      </h1>
      <h2 class="text-3xl font-bold text-indigo-500">to your account</h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form ref="formRef" @submit.prevent="clickAuth">
        <div>
          <div class="flex justify-start">
            <label
              for="email"
              class="block text-sm/6 font-medium text-gray-900 dark:text-white"
            >
              <span v-if="registration">Email address or login</span>
              <span v-else>Email address</span>
            </label>
          </div>
          <div class="mt-2">
            <input
              v-model="email"
              type="email"
              name="email"
              id="email"
              autocomplete="email"
              required
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
          </div>
        </div>

        <transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 max-h-0"
          enter-to-class="opacity-100 max-h-40"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 max-h-40"
          leave-to-class="opacity-0 max-h-0"
        >
          <div v-if="registration" class="overflow-hidden mt-1">
            <div>
              <div class="flex justify-start">
                <label
                  for="login"
                  class="block text-sm/6 font-medium text-gray-950 dark:text-white"
                  >Login</label
                >
              </div>
              <div class="mt-2">
                <input
                  v-model="login"
                  type="text"
                  autocomplete="login"
                  required
                  class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-2 -outline-offset-4 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
          </div>
        </transition>

        <div>
          <div class="flex items-center justify-between mt-1">
            <label
              for="password"
              class="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >Password</label
            >
            <div class="text-sm">
              <a
                href="#"
                class="font-semibold text-indigo-600 hover:text-indigo-500"
                >Forgot password?</a
              >
            </div>
          </div>
          <div class="mt-2">
            <input
              v-model="password"
              type="password"
              name="password"
              id="password"
              autocomplete="current-password"
              required
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
          </div>

          <transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 max-h-0"
            enter-to-class="opacity-100 max-h-40"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 max-h-40"
            leave-to-class="opacity-0 max-h-0"
          >
            <div v-if="registration" class="overflow-hidden">
              <div class="flex justify-start mt-2 text-sm">
                <label
                  for="passwordConfirm"
                  class="block text-sm/6 font-medium text-gray-900 dark:text-white"
                >
                  Confirm password
                </label>
              </div>
              <div class="mt-2">
                <input
                  v-model="passwordConfirm"
                  type="password"
                  name="passwordConfirm"
                  id="passwordConfirm"
                  autocomplete="current-password"
                  required
                  @input="validatePasswordConfirm"
                  class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
          </transition>

          <div class="flex justify-end space-x-4 mt-4 text-sm">
            <a
              @click.prevent="SwapAuthRegistr"
              class="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              <span class="cursor-pointer" v-if="!registration"
                >Not registered yet?</span
              >
              <span v-else>Go to login</span>
            </a>
          </div>
        </div>

        <div class="mt-6 flex justify-end">
          <button
            type="submit"
            class="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            <span v-if="!registration">Sign in</span>
            <span v-else>Sign up</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useNavigation } from "../router/navigation.js";
const nav = useNavigation();

const router = useRouter();
const formRef = ref(null);

const email = ref("");
const login = ref("");
const password = ref("");
const passwordConfirm = ref("");
const registration = ref(false);

onMounted(() => {
  const hash = window.location.hash;
  const queryString = hash.split("?")[1];
  const params = new URLSearchParams(queryString);
  const mode = params.get("mode");
  registration.value = mode === "signup";
});

function validatePasswordConfirm(event) {
  const input = event.target;
  if (password.value !== passwordConfirm.value) {
    input.setCustomValidity("Пароли не совпадают");
  } else {
    input.setCustomValidity("");
  }
}

async function handleLogin() {
  try {
    const response = await axios.post(
      "http://localhost:3000/auth/login",
      {
        email: email.value,
        password: password.value,
      },
      { withCredentials: true }
    );

    if (response.data.success) {
      const res = await fetch("http://localhost:3000/me", {
        credentials: "include",
      });
      if (res.ok) {
        nav.NavigateFilms();
      } else {
        console.error("Token невалиден после входа");
      }
    } else {
      alert(response.data.message || "Неверный email или пароль");
    }
  } catch (error) {
    alert(
      "Ошибка входа: " +
        (error.response?.data?.message || "Неверный email или пароль")
    );
  }
}

async function handleRegister() {
  try {
    const response = await axios.post("http://localhost:3000/auth/register", {
      email: email.value,
      login: login.value,
      password: password.value,
    });

    if (response.data.success) {
      alert("Регистрация прошла успешно!");
      router.push("/");
    } else {
      alert(response.data.message || "Ошибка регистрации");
    }
  } catch (error) {
    alert(error.response?.data?.message || "Ошибка регистрации");
  }
}

async function clickAuth() {
  if (!formRef.value.checkValidity()) {
    formRef.value.reportValidity();
    return;
  }
  if (registration.value) await handleRegister();
  else await handleLogin();
}

function SwapAuthRegistr() {
  registration.value = !registration.value;
}
</script>
