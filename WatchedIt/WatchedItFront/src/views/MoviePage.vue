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
                @click="handleAddToFavorite"
                class="flex items-center justify-center py-2.5 px-5 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-indigo-800"
              >
                Add to Favorite
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
              <div @click="handleRatingClick">
                <StarRating :rating="userRating" />
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

    <div v-else class="text-center text-gray-500 dark:text-gray-400">
      Фильм не найден.
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import StarRating from "../components/StarRatingDin.vue";
const route = useRoute();
const movie = ref(null);
const isLoading = ref(true);

import { useAuthStore } from "../stores/auth";
const auth = useAuthStore();
const userRating = ref(0);

const showRatingTooltip = ref(false);
const showFavoriteTooltip = ref(false);

function showTooltip(refToShow, ...otherRefs) {
  otherRefs.forEach((ref) => (ref.value = false));

  refToShow.value = true;

  setTimeout(() => {
    refToShow.value = false;
  }, 2000);
}

function handleRatingClick() {
  if (!auth.isAuthenticated) {
    showTooltip(showRatingTooltip, showFavoriteTooltip);
    return;
  }
  // логика оценки
}

function handleAddToFavorite() {
  if (!auth.isAuthenticated) {
    showTooltip(showFavoriteTooltip, showRatingTooltip);
    return;
  }
  // логика добавления в избранное
}

onMounted(async () => {
  try {
    const response = await axios.get(
      `http://localhost:3000/services/movie/${route.params.id}`
    );
    movie.value = response.data;
    console.log("Фильм получен:", movie.value);
  } catch (err) {
    console.error("Ошибка загрузки фильма:", err);
  } finally {
    isLoading.value = false;
  }
});
</script>
