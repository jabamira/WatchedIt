<template>
  <section class="py-8 md:py-16 mt-16 antialiased">
    <div v-if="isLoading" class="text-center text-gray-600 dark:text-gray-300">
      Загрузка...
    </div>

    <div v-else-if="movie" class="max-w-screen-xl px-4 mx-auto 2xl:px-0">
      <div class="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
        <div class="shrink-0 max-w-md lg:max-w-lg mx-auto">
          <img
            :src="movie.posterUrl"
            :alt="movie.title"
            class="w-full rounded-lg shadow"
          />
        </div>

        <div class="mt-6 sm:mt-8 lg:mt-0">
          <h1
            class="text-xl font-semibold text-gray-900 sm:text-3xl dark:text-white"
          >
            {{ movie.title }} ({{ movie.year }})
          </h1>

          <div class="mt-4 sm:items-center sm:gap-4 sm:flex">
            <p class="text-lg font-bold text-gray-900 dark:text-white">
              IMDB: {{ movie.imdbRating }}
            </p>
          </div>

          <div class="flex flex-row">
            <!-- Кнопка "Add to Favorite" -->
            <div class="relative">
              <button
                @click="toggleFavorite"
                class="flex items-center justify-center py-2.5 px-5 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-indigo-800"
              >
                {{ isFavorite ? "Remove from Favorite" : "Add to Favorite" }}
              </button>

              <div
                v-if="showFavoriteTooltip"
                class="absolute top-full left-0 mt-2 px-3 py-1 text-sm text-indigo-800 bg-indigo-100 border border-indigo-300 rounded shadow transform transition-all duration-300 ease-out opacity-100 scale-100"
              >
                Please login or register first
              </div>
            </div>

            <!-- Рейтинг -->
            <div class="relative ms-4 my-auto">
              <div>
                <StarRating
                  v-model="userRating"
                  @update:modelValue="handleRatingClick"
                  @hover="handleHover"
                  @mouseleave="handleHoverLeave"
                />
              </div>
              <div
                class="text-yellow-400 text-sm mt-1 font-semibold select-none"
              >
                {{ (hoverRating || userRating).toFixed(1) }}
              </div>

              <div
                v-if="showRatingTooltip"
                class="absolute top-full left-0 mt-2 px-3 py-1 text-sm text-indigo-800 bg-indigo-100 border border-indigo-300 rounded shadow transform transition-all duration-300 ease-out opacity-100 scale-100"
              >
                Please login or register first
              </div>
            </div>
          </div>

          <hr class="my-6 md:my-8 border-gray-200 dark:border-gray-800" />

          <p class="mb-2 text-gray-500 dark:text-gray-400">
            <strong>Жанр:</strong> {{ movie.genre }}
          </p>
          <p class="mb-2 text-gray-500 dark:text-gray-400">
            <strong>Страна:</strong> {{ movie.country }}
          </p>
          <p class="text-gray-500 dark:text-gray-400">
            <strong>Описание:</strong> {{ movie.plot }}
          </p>
        </div>
      </div>
    </div>
    <div v-if="movie">
      <CommentsSection :movieId="movie.id" />
    </div>
    <div v-else class="text-center text-gray-500 dark:text-gray-400">
      Фильм не найден.
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import CommentsSection from "../components/CommentsSection.vue";
import StarRating from "../components/StarRatingDin.vue";
const route = useRoute();
const movie = ref(null);
const isLoading = ref(true);
const isFavorite = ref(false);
import { useAuthStore } from "../stores/auth";
const auth = useAuthStore();
const userRating = ref(0);

const showRatingTooltip = ref(false);
const showFavoriteTooltip = ref(false);
const hoverRating = ref(0);

function handleHover(rating) {
  hoverRating.value = rating;
}

function handleHoverLeave() {
  hoverRating.value = 0;
}

function showTooltip(refToShow, ...otherRefs) {
  otherRefs.forEach((ref) => (ref.value = false));

  refToShow.value = true;

  setTimeout(() => {
    refToShow.value = false;
  }, 2000);
}
async function toggleFavorite() {
  if (!auth.isAuthenticated) {
    showTooltip(showFavoriteTooltip, showRatingTooltip);
    return;
  }

  try {
    if (isFavorite.value) {
      await axios.delete("http://localhost:3000/user/removeFavorite", {
        data: { movieId: movie.value.id },
        withCredentials: true,
      });
      isFavorite.value = false;
    } else {
      await axios.post(
        "http://localhost:3000/user/addFavorite",
        { movieId: movie.value.id },
        { withCredentials: true }
      );
      isFavorite.value = true;
    }
  } catch (err) {
    console.error(
      "Ошибка при переключении избранного:",
      err.response?.data || err.message
    );
  }
}

async function fetchUserRating() {
  if (!auth.isAuthenticated) return;

  try {
    const res = await axios.get(
      `http://localhost:3000/user/rating/${movie.value.id}`,
      { withCredentials: true }
    );
    userRating.value = res.data.value || 0;
  } catch (err) {
    console.error(
      "Ошибка загрузки рейтинга:",
      err.response?.data || err.message
    );
  }
}

async function handleRatingClick(newRating) {
  newRating = Number(newRating);
  if (!auth.isAuthenticated) {
    showTooltip(showRatingTooltip, showFavoriteTooltip);
    return;
  }

  try {
    await axios.post(
      "http://localhost:3000/user/rate",
      { movieId: movie.value.id, value: newRating },
      { withCredentials: true }
    );
    userRating.value = newRating;
    console.log("Рейтинг сохранён:", newRating);
  } catch (err) {
    console.error(
      "Ошибка сохранения рейтинга:",
      err.response?.data || err.message
    );
  }
}
async function checkFavoriteStatus() {
  if (!auth.isAuthenticated) return;

  try {
    const res = await axios.get("http://localhost:3000/user/favorites", {
      withCredentials: true,
    });

    isFavorite.value = res.data.some((fav) => fav.id === movie.value.id);
  } catch (err) {
    console.error(
      "Ошибка проверки избранного:",
      err.response?.data || err.message
    );
  }
}

onMounted(async () => {
  try {
    const response = await axios.get(
      `http://localhost:3000/services/movie/${route.params.id}`
    );
    movie.value = response.data;
    console.log("Фильм получен:", movie.value);

    await checkFavoriteStatus();
    await fetchUserRating();
  } catch (err) {
    console.error("Ошибка загрузки фильма:", err);
  } finally {
    isLoading.value = false;
  }
});
</script>
