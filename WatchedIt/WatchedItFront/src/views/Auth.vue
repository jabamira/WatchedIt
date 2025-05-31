<template>
  <!--
    This example requires updating your template:

    ```
    <html class="h-full bg-white">
    <body class="h-full">
    ```
  -->
  <div
    class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <h2
        class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900"
      >
        Sign in to your account
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form ref="formRef" @submit.prevent="clickAuth">
        <div>
          <label for="email" class="block text-sm/6 font-medium text-gray-900">
            <span v-if="!registration">Email addres or login</span>
            <span v-else>Email addres</span></label
          >
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
                  class="block text-sm/6 font-medium text-gray-900"
                  >Login</label
                >
              </div>

              <div class="mt-2">
                <input
                  v-model="login"
                  type="login"
                  autocomplete="login"
                  required=""
                  class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
          </div>
        </transition>
        <div>
          <div class="flex items-center justify-between mt-1">
            <label
              for="password"
              class="block text-sm/6 font-medium text-gray-900"
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
                  class="block text-sm/6 font-medium text-gray-900"
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

        <div class="mt-6">
          <button
            type="submit"
            class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <span v-if="!registration">Sign in</span>
            <span v-else>Sign up</span>
          </button>
        </div>
      </form>

      <p class="mt-10 text-center text-sm/6 text-gray-500">
        Not a member?
        {{ " " }}
        <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500"
          >Start a 14 day free trial</a
        >
      </p>
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
  methods: {
    async handleLogin() {
      try {
        const response = await axios.post(
          "https://turbo-space-funicular-pxwpjgwp6jrh6wwp-3000.app.github.dev/auth",
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
          const res = await fetch("https://turbo-space-funicular-pxwpjgwp6jrh6wwp-3000.app.github.dev/me", {
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
        const response = await axios.post("https://turbo-space-funicular-pxwpjgwp6jrh6wwp-3000.app.github.dev/register", {
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
