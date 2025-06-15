<template>
  <section class="bg-white py-8 antialiased dark:bg-transparent md:py-8">
    <div class="mx-auto max-w-screen-lg px-4 2xl:px-0">
      <div class="py-4 md:py-8 mt-16">
        <div class="mb-4 grid gap-4 sm:grid-cols-2 sm:gap-8 lg:gap-16">
          <div class="space-y-4">
            <div class="flex space-x-4">
              <label for="avatar-upload" class="cursor-pointer">
                <img
                  :src="avatarSrc"
                  alt="User avatar"
                  class="h-60 rounded-lg"
                />
                <input
                  id="avatar-upload"
                  type="file"
                  class="hidden"
                  @change="uploadAvatar"
                  accept="image/*"
                />
              </label>
              <div class="my-auto mx-auto">
                <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
                  {{ auth.user?.user?.login || "Гость" }}
                </h2>
              </div>
            </div>

            <dl>
              <dt class="font-semibold text-gray-900 dark:text-white">Email</dt>
              <dd
                class="flex items-center gap-1 text-gray-500 dark:text-gray-400"
              >
                <svg
                  class="w-6 h-6 text-gray-800 dark:text-gray-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 16v-5.5A3.5 3.5 0 0 0 7.5 7m3.5 9H4v-5.5A3.5 3.5 0 0 1 7.5 7m3.5 9v4M7.5 7H14m0 0V4h2.5M14 7v3m-3.5 6H20v-6a3 3 0 0 0-3-3m-2 9v4m-8-6.5h1"
                  />
                </svg>

                {{ auth.user?.user?.email || "Нет email" }}
              </dd>
            </dl>
          </div>
          <div class="space-y-4">
            <!---->
            <dl>
              <div class="flex flex-row items-start">
                <dt class="font-semibold text-gray-900 dark:text-white">
                  Birth Date
                </dt>
                <div class="pt-1 ml-5 flex items-center gap-2">
                  <svg
                    @click="showDateInput = !showDateInput"
                    class="w-6 h-6 text-gray-800 dark:text-gray-500 cursor-pointer hover:text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M10.779 17.779 4.36 19.918 6.5 13.5m4.279 4.279 8.364-8.643a3.027 3.027 0 0 0-2.14-5.165 3.03 3.03 0 0 0-2.14.886L6.5 13.5m4.279 4.279L6.499 13.5m2.14 2.14 6.213-6.504M12.75 7.04 17 11.28"
                    />
                  </svg>
                </div>
              </div>

              <dd class="text-gray-500 dark:text-gray-400 mt-2">
                <div v-if="showDateInput" class="relative max-w-sm">
                  <div
                    class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none"
                  >
                    <svg
                      class="w-4 h-4 text-gray-500 dark:text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="..." />
                    </svg>
                  </div>
                  <input
                    type="date"
                    v-model="birthDate"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <div class="flex gap-2 justify-end mt-2">
                    <button
                      @click="saveBirthDate"
                      class="px-3 py-1 bg-indigo-700 hover:bg-indigo-800 text-white rounded"
                    >
                      Save
                    </button>
                    <button
                      @click="showDateInput = !showDateInput"
                      class="px-3 py-1 bg-indigo-300 hover:bg-indigo-400 text-indigo-900 font-semibold transition rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
                <span v-else>{{
                  auth.user?.user?.birthDate || "Не указана"
                }}</span>
              </dd>
            </dl>
            <!---->
            <dl>
              <div class="flex flex-row items-start">
                <dt class="font-semibold text-gray-900 dark:text-white">
                  Gender
                </dt>
                <div class="pt-1 ml-5 flex items-center gap-2">
                  <svg
                    @click="showGenderInput = !showGenderInput"
                    class="w-6 h-6 text-gray-800 dark:text-gray-500 cursor-pointer hover:text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M10.779 17.779 4.36 19.918 6.5 13.5m4.279 4.279 8.364-8.643a3.027 3.027 0 0 0-2.14-5.165 3.03 3.03 0 0 0-2.14.886L6.5 13.5m4.279 4.279L6.499 13.5m2.14 2.14 6.213-6.504M12.75 7.04 17 11.28"
                    />
                  </svg>
                </div>
              </div>

              <dd class="text-gray-500 dark:text-gray-400 mt-2">
                <div v-if="showGenderInput">
                  <select
                    v-model="gender"
                    class="p-2 border rounded w-full dark:bg-gray-700 dark:text-white"
                  >
                    <option disabled value="">Choice</option>

                    <option>Male</option>
                    <option>Female</option>
                    <option>Helicopter</option>
                    <option>Other</option>
                    <option>vkishnik</option>
                  </select>
                  <div class="flex gap-2 justify-end mt-2">
                    <button
                      @click="saveGender"
                      class="px-3 py-1 bg-indigo-700 hover:bg-indigo-800 text-white rounded"
                    >
                      Save
                    </button>
                    <button
                      @click="showGenderInput = !showGenderInput"
                      class="px-3 py-1 bg-indigo-300 hover:bg-indigo-400 text-indigo-900 font-semibold transition rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
                <span v-else>{{ auth.user.user.gender || "Не указан" }}</span>
              </dd>
            </dl>

            <dl>
              <dt class="font-semibold text-gray-900 dark:text-white">Role</dt>
              <dd class="text-gray-500 dark:text-gray-400">
                {{ auth.user?.user?.role || "user" }}
              </dd>
            </dl>

            <dl>
              <dt class="font-semibold text-gray-900 dark:text-white">
                Activity
              </dt>
              <dd class="text-gray-500 dark:text-gray-400">
                {{ auth.user?.user?.isActive ? "Да" : "Нет" }}
              </dd>
            </dl>

            <dl>
              <dt class="font-semibold text-gray-900 dark:text-white">
                Last Online
              </dt>
              <dd class="text-gray-500 dark:text-gray-400">
                {{ auth.user?.user?.lastOnlineAt || "Неизвестно" }}
              </dd>
            </dl>
          </div>
        </div>
      </div>

      <div
        class="grid grid-cols-2 gap-6 border-b border-t border-gray-200 py-4 dark:border-gray-700 md:py-8 lg:grid-cols-4 xl:gap-16"
      >
        <div class="pl-10">
          <svg
            class="h-10 text-gray-800 dark:text-gray-500"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-width="2"
              d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>

          <h3 class="mb-2 text-gray-500 dark:text-gray-400">Friends</h3>
          <span
            class="flex items-center text-2xl font-bold text-gray-900 dark:text-white"
            >{{ friendCount }}
          </span>
        </div>

        <div class="pl-10">
          <svg
            class="h-10 text-gray-800 dark:text-gray-500"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z"
            />
          </svg>

          <h3 class="mb-2 text-gray-500 dark:text-gray-400">Favorites</h3>
          <span
            class="flex items-center text-2xl font-bold text-gray-900 dark:text-white"
            >{{ favoriteCount }}
          </span>
        </div>
        <div class="pl-10">
          <svg
            class="h-9 text-gray-800 dark:text-gray-500"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 9h5m3 0h2M7 12h2m3 0h5M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-6.616a1 1 0 0 0-.67.257l-2.88 2.592A.5.5 0 0 1 8 18.477V17a1 1 0 0 0-1-1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
            />
          </svg>

          <h3 class="mb-2 text-gray-500 dark:text-gray-400">Comments</h3>
          <span
            class="flex items-center text-2xl font-bold text-gray-900 dark:text-white"
            >{{ comentCount }}
          </span>
        </div>
        <div class="pl-10">
          <svg
            class="mb-2 h-8 w-8 text-gray-400 dark:text-gray-500"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-width="2"
              d="M11.083 5.104c.35-.8 1.485-.8 1.834 0l1.752 4.022a1 1 0 0 0 .84.597l4.463.342c.9.069 1.255 1.2.556 1.771l-3.33 2.723a1 1 0 0 0-.337 1.016l1.03 4.119c.214.858-.71 1.552-1.474 1.106l-3.913-2.281a1 1 0 0 0-1.008 0L7.583 20.8c-.764.446-1.688-.248-1.474-1.106l1.03-4.119A1 1 0 0 0 6.8 14.56l-3.33-2.723c-.698-.571-.342-1.702.557-1.771l4.462-.342a1 1 0 0 0 .84-.597l1.753-4.022Z"
            />
          </svg>

          <h3 class="mb-2 text-gray-500 dark:text-gray-400">Ratings</h3>
          <span
            class="flex items-center text-2xl font-bold text-gray-900 dark:text-white"
            >{{ ratingsCount }}
          </span>
        </div>
        <div></div>
      </div>
    </div>
  </section>
  <!-- Выводим список избранных фильмов -->
  <section class="bg-white dark:bg-transparent py-8">
    <div class="relative overflow-hidden shadow-md rounded-lg sm:rounded-lg">
      <table
        class="mx-auto w-fit text-sm text-left rtl:text-right text-gray-500 rounded-lg dark:text-gray-400"
      >
        <thead
          class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 rounded-lg dark:text-gray-400"
        >
          <tr>
            <th scope="col" class="px-6 py-3 rounded-tl-lg">Название</th>
            <th scope="col" class="px-6 py-3">Год</th>
            <th scope="col" class="px-6 py-3">Страна</th>
            <th scope="col" class="px-6 py-3">Жанр</th>
            <th scope="col" class="px-6 py-3">Рейтинг IMDb</th>
            <th scope="col" class="px-6 py-3">Ваша оценка</th>
            <th scope="col" class="px-6 py-3 rounded-tr-lg">
              <span class="sr-only">Удалить</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(movie, index) in favorites"
            :key="movie.id"
            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 rounded-lg border-gray-200"
          >
            <th
              scope="row"
              class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              :class="index === favorites.length - 1 ? 'rounded-bl-lg' : ''"
            >
              <router-link
                :to="`/library/films/${movie.id}`"
                class="text-indigo-600 hover:underline dark:text-white"
              >
                {{ movie.title }}
              </router-link>
            </th>
            <td class="px-6 py-4">{{ movie.year }}</td>
            <td class="px-6 py-4">{{ movie.country }}</td>
            <td class="px-6 py-4">{{ movie.genre }}</td>
            <td class="px-6 py-4">{{ movie.imdbRating || "N/A" }}</td>

            <!-- Новый столбик -->
            <td class="px-6 py-4">
              <div
                class="flex items-center"
                @mouseleave="hoverRatingMap[movie.id] = 0"
              >
                <StarRating
                  :modelValue="movie.userRating"
                  @update:modelValue="(val) => updateRating(movie.id, val)"
                  @hover="(val) => (hoverRatingMap[movie.id] = val)"
                />
                <div
                  class="text-yellow-400 text-sm mt-1 font-semibold select-none ms-2"
                >
                  {{
                    (hoverRatingMap[movie.id] || movie.userRating).toFixed(1)
                  }}
                </div>
              </div>
            </td>

            <td
              class="px-6 py-4 text-right"
              :class="index === favorites.length - 1 ? 'rounded-br-lg' : ''"
            >
              <button
                @click="removeFavorite(movie.id)"
                class="font-medium text-red-600 dark:text-red-500 hover:underline"
              >
                Remove from favorite
              </button>
            </td>
          </tr>

          <tr v-if="favorites.length === 0">
            <td
              colspan="7"
              class="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
            >
              Избранных фильмов нет.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
<script setup>
import { ref, computed, onMounted, watch } from "vue";
import axios from "axios";
import { useAuthStore } from "../stores/auth";
import { useNavigation } from "../router/navigation.js";
import StarRating from "../components/StarRatingDin.vue";
const nav = useNavigation();

const auth = useAuthStore();
const favorites = ref([]);
const comentCount = ref(0);
const ratingsCount = ref(0);
const friendCount = ref(0);
const showDatePicker = ref(false);
const selectedDate = ref("");
const dateNote = ref("");
const favoriteCount = computed(() => favorites.value?.length || 0);
const showDateInput = ref(false);
const showGenderInput = ref(false);
const birthDate = ref("");
const gender = ref("");
async function removeFavorite(movieId) {
  if (!auth.isAuthenticated) {
    showTooltip(showFavoriteTooltip, showRatingTooltip);
    return;
  }

  try {
    await axios.delete("http://localhost:3000/user/removeFavorite", {
      data: { movieId },
      withCredentials: true,
    });
    // После успешного удаления обнови список:
    favorites.value = favorites.value.filter((movie) => movie.id !== movieId);
  } catch (err) {
    console.error(
      "Ошибка при переключении избранного:",
      err.response?.data || err.message
    );
  }
}
const avatarSrc = ref(
  auth.user?.user?.avatarUrl
    ? `http://localhost:3000${auth.user.user.avatarUrl}`
    : "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/helene-engels.png"
);
const hoverRatingMap = ref({});

function handleHover(rating) {
  hoverRating.value = rating;
}

function handleHoverLeave() {
  hoverRating.value = 0;
}
const saveBirthDate = async () => {
  try {
    await axios.put(
      "http://localhost:3000/user/profile",
      { birthDate: birthDate.value },
      { withCredentials: true }
    );
    auth.fetchUser();
    showDateInput.value = false;
  } catch (err) {
    console.error(
      "Ошибка при сохранении даты рождения:",
      err.response?.data || err.message
    );
  }
};
async function updateRating(movieId, newRating) {
  newRating = Number(newRating);
  if (!auth.isAuthenticated) {
    showTooltip(showRatingTooltip, showFavoriteTooltip); // если нужна подсказка
    return;
  }

  try {
    await axios.post(
      "http://localhost:3000/user/rate",
      { movieId, value: newRating },
      { withCredentials: true }
    );

    const movie = favorites.value.find((m) => m.id === movieId);
    if (movie) movie.userRating = newRating;

    console.log("Рейтинг сохранён:", newRating);
  } catch (err) {
    console.error(
      "Ошибка сохранения рейтинга:",
      err.response?.data || err.message
    );
  }
}

const saveGender = async () => {
  try {
    await axios.put(
      "http://localhost:3000/user/profile",
      { gender: gender.value },
      { withCredentials: true }
    );
    showGenderInput.value = false;
    auth.fetchUser();
  } catch (err) {
    console.error(
      "Ошибка при сохранении гендера:",
      err.response?.data || err.message
    );
  }
};

const uploadAvatar = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("avatar", file);

  try {
    const userId = auth.user.user.id;
    const res = await axios.post(
      `http://localhost:3000/user/upload-avatar/${userId}`,
      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    auth.user.user.avatarUrl = res.data.avatarUrl;

    avatarSrc.value = `http://localhost:3000${res.data.avatarUrl}`;
  } catch (err) {
    console.error("Ошибка загрузки аватара:", err);
  }
};

onMounted(async () => {
  auth.fetchUser();

  try {
    const resFavorites = await axios.get(
      "http://localhost:3000/user/favorites",
      {
        withCredentials: true,
      }
    );
    favorites.value = resFavorites.data.sort(
      (a, b) => b.userRating - a.userRating
    );

    if (auth.user?.user?.id) {
      const resCommentsCount = await axios.get(
        `http://localhost:3000/user/comments/count/${auth.user.user.id}`,
        { withCredentials: true }
      );
      comentCount.value = resCommentsCount.data.commentCount;

      const resRatingsCount = await axios.get(
        `http://localhost:3000/user/ratings/count/${auth.user.user.id}`,
        { withCredentials: true }
      );
      ratingsCount.value = resRatingsCount.data.ratingCount;
    }
  } catch (err) {
    console.error(
      "Ошибка при загрузке данных:",
      err.response?.data || err.message
    );
  }
});
</script>
