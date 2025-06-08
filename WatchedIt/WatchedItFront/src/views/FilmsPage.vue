<template>
  <form class="max-w-lg mx-auto pt-30" @submit="handleSearch">
    <div>
      <div class="flex flex-col">
        <div class="flex">
          <label
            for="search-dropdown"
            class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
            >Your Email</label
          >
          <button
            id="dropdown-button"
            data-dropdown-toggle="dropdown"
            class="shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
            type="button"
          >
            All categories
            <svg
              class="w-2.5 h-2.5 ms-2.5"
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
            id="dropdown"
            class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700"
          >
            <ul
              class="py-2 text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="dropdown-button"
            >
              <li>
                <button
                  type="button"
                  class="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Mockups
                </button>
              </li>
              <li>
                <button
                  type="button"
                  class="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Templates
                </button>
              </li>
              <li>
                <button
                  type="button"
                  class="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Design
                </button>
              </li>
              <li>
                <button
                  type="button"
                  class="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Logos
                </button>
              </li>
            </ul>
          </div>
          <div class="relative w-full">
            <input
              type="search"
              id="search-dropdown"
              v-model="searchQuery"
              class="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
              placeholder="Search Mockups, Logos, Design Templates..."
              required
            />
            <button
              type="submit"
              class="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <svg
                class="w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
              <span class="sr-only">Search</span>
            </button>
          </div>

          <div class="flex items-center justify-center ml-3" v-if="isLoading">
            <div role="status">
              <svg
                aria-hidden="true"
                class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span class="sr-only">Loading...</span>
            </div>
          </div>
        </div>
        <div>
          <div class="flex items-center justify-end mt-3">
            <input
              checked
              id="checked-checkbox"
              type="checkbox"
              v-model="SearchOne"
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              for="checked-checkbox"
              class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >Only one film</label
            >
          </div>
        </div>
      </div>
    </div>
  </form>

  <div
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8 max-w-6xl mx-auto"
  >
    <div
      v-for="movie in movies"
      :key="movie.id"
      class="bg-white border border-gray-400 rounded-lg hover:scale-95 color-transition cursor-pointer transition-transform duration-300 shadow-sm hover:dark:bg-gray-700 dark:bg-gray-800 dark:border-gray-700 flex flex-col h-full"
    >
      <img
        class="rounded-t-lg w-full h-64 object-cover"
        :src="movie.posterUrl"
        :alt="movie.title"
      />
      <div class="p-5 flex flex-col h-full">
        <h5 class="mb-2 text-xl font-bold text-gray-900 dark:text-white">
          {{ movie.title }} ({{ movie.year }})
        </h5>

        <p class="mb-2 text-sm text-gray-700 dark:text-gray-400">
          {{ movie.plot }}
        </p>

        <div class="mt-auto text-sm text-gray-500 dark:text-gray-400">
          IMDB рейтинг: {{ movie.imdbRating }}
          <StarRating :rating="movie.imdbRating" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import StarRating from "../components/StarRating.vue"; // добавь путь
const router = useRouter();
const searchQuery = ref("");
const SearchOne = ref(false);
const movie = ref(false);
const isLoading = ref(false);

const movies = ref([]);
const handleSearch = async (e) => {
  e.preventDefault();

  if (!searchQuery.value) return;

  isLoading.value = true;
  try {
    let response;
    if (SearchOne.value) {
      response = await axios.post(
        "http://localhost:3000/services/cache-movie",
        {
          title: searchQuery.value,
        }
      );
      // При поиске одного фильма положим результат в массив для отображения
      movies.value = response.data.data ? [response.data.data] : [];
    } else {
      response = await axios.post(
        "http://localhost:3000/services/cache-movies",
        {
          title: searchQuery.value,
        }
      );
      movies.value = response.data.data || [];
    }

    console.log("Результат поиска:", movies.value);
  } catch (error) {
    console.error(
      "Ошибка при поиске:",
      error.response?.data?.message || error.message
    );
    movies.value = [];
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  try {
    const res = await axios.get("http://localhost:3000/services/all-movies");
    movies.value = res.data.data; // массив фильмов
  } catch (err) {
    console.error("Ошибка загрузки фильмов:", err);
  }
});
</script>

<style scoped></style>
