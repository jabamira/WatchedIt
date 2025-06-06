<template>
  <div
    class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8"
  >
    <div
      class="sm:mx-auto sm:w-full sm:max-w-sm flex flex-row items-end space-x-2 text-nowrap"
    >
      <h1 class="text-1xl font-medium text-gray-900 dark:text-white">
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
              <span v-if="!registration">Email addres or login</span>
              <span v-else>Email addres</span></label
            >
          </div>

          <div class="mt-2">
            <input
              v-model="email"
              type="email"
              name="email"
              id="email"
              autocomplete="email"
              required=""
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
                  type="login"
                  autocomplete="login"
                  required=""
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
              required=""
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
              <span v-if="!registration">Not registered yet?</span>
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

<script>
import axios from "axios";
import { ref } from "vue";
export default {
  data() {
    return {
      email: "",
      login: "",
      password: "",
      registration: false,
      passwordConfirm: "",
    };
  },
  mounted() {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get("mode");

    if (mode === "signup") {
      this.registration = true;
    }
  },
  methods: {
    async handleLogin() {
      try {
        const response = await axios.post(
          "http://localhost:3000/auth",
          {
            email: this.email,
            password: this.password,
          },
          {
            withCredentials: true,
          }
        );

        console.log(response.data);

        if (response.data.success) {
          const res = await fetch("http://localhost:3000/me", {
            credentials: "include",
          });

          if (res.ok) {
            this.$router.push("/InfoPage");
          } else {
            console.error("Token невалиден после входа");
          }
        } else {
          alert(response.data.message || "Неверный email или пароль");
        }
      } catch (error) {
        console.error("Ошибка входа:", error.response?.data || error.message);
        alert(
          "Ошибка входа: " +
            (error.response?.data?.message || "Неверный email или пароль")
        );
      }
    },
    async handleRegister() {
      try {
        const response = await axios.post("http://localhost:3000/register", {
          email: this.email,
          login: this.login,
          password: this.password,
        });

        if (response.data.success) {
          alert("Регистрация прошла успешно!");
          this.perehodHome();
        } else {
          alert(response.data.message || "Ошибка регистрации");
        }
      } catch (error) {
        alert(error.response?.data?.message || "Ошибка регистрации");
      }
    },
    SwapAuthRegistr() {
      this.registration = !this.registration;
    },
    async clickAuth() {
      const form = this.$refs.formRef;
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      if (this.registration) {
        await this.handleRegister();
      } else {
        await this.handleLogin();
      }
    },
    validatePasswordConfirm(event) {
      const input = event.target;
      if (this.password !== this.passwordConfirm) {
        input.setCustomValidity("Пароли не совпадают");
      } else {
        input.setCustomValidity("");
      }
    },
  },
};
</script>
<style scoped>
.h1 {
  font-family: Arial, Helvetica, sans-serif;
  color: red;
}
</style>
