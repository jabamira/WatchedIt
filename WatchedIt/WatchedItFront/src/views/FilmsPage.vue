<template>
  <div class="flex flex-row">
    <!-- Search -->
    <form
      class="w-full justify-center items-center flex md:flex-row flex-col gap-2 pt-30 px-5 md:px-0"
      @submit="handleSearch"
    >
      <div class="flex flex-row md:w-102 w-100">
        <div class="relative w-full">
          <input
            type="search"
            v-model="searchQuery"
            class="w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            placeholder="Search films..."
            required
          />
          <button
            type="submit"
            class="absolute top-0 end-0 p-2.5 text-sm font-medium text-white bg-indigo-700 rounded-e-lg border border-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
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
          </button>
        </div>
      </div>
      <!--Loading-->
      <div class="flex items-center justify-center" v-if="isLoading">
        <div role="status">
          <svg
            aria-hidden="true"
            class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-indigo-600"
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
        </div>
      </div>
      <!--All movies-->
      <div class="flex flex-col w-100 md:w-43">
        <button
          id="dropdownDelayButton"
          data-dropdown-toggle="dropdownDelay"
          data-dropdown-delay="500"
          data-dropdown-trigger="hover"
          data-dropdown-placement="bottom-start"
          class="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
          type="button"
        >
          {{ selectedCategory }}
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
          id="dropdownDelay"
          class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700"
        >
          <ul
            class="py-2 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownDelayButton"
          >
            <li v-for="category in categories" :key="category">
              <a
                @click.prevent="selectCategory(category)"
                class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                {{ category }}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <!--Countryes-->
      <div class="w-100 md:w-103">
        <div class="flex flex-row">
          <input
            v-model="search"
            type="text"
            placeholder="Поиск страны..."
            class="w-90 md:w-70 bg-gray-700 text-white placeholder-indigo-200 border border-gray-500 rounded-lg focus:ring-1 focus:ring-indigo-400 focus:outline-none"
          />
          <div class="flex items-center mx-auto">
            <input
              id="default-checkbox"
              type="checkbox"
              v-model="useApi"
              class="text-indigo-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              for="default-checkbox"
              class="ms-2 text-sm text-center align-text-bottom font-medium text-gray-900 dark:text-gray-300"
            >
              Use API
            </label>
          </div>
        </div>

        <!-- Список подсказок -->
        <ul
          v-if="filteredCountries.length"
          class="mt-1 absolute bg-indigo-600 z-100 text-white rounded-lg shadow divide-y divide-indigo-500"
        >
          <li
            v-for="country in filteredCountries"
            :key="country"
            @click="addCountry(country)"
            class="px-4 py-2 hover:bg-indigo-500 cursor-pointer"
          >
            {{ country }}
          </li>
        </ul>
        <!-- Выбранные страны -->
        <div class="flex flex-wrap gap-2">
          <span
            v-for="country in selectedCountries"
            :key="country"
            class="bg-indigo-600 py-2 text-white px-2 mt-2 rounded-full flex items-center text-sm"
          >
            {{ country }}
            <button
              @click="removeCountry(country)"
              class="ml-1 text-white font-bold"
            ></button>
          </span>
        </div>
      </div>
    </form>
  </div>

  <!-- GRid -->
  <div
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 3xl:grid-cols-5 gap-6 mt-8 max-w-6xl mx-auto"
  >
    <router-link
      v-for="movie in movies"
      :key="movie.id"
      :to="`/library/films/${movie.id}`"
      class="bg-white border border-gray-400 rounded-lg hover:scale-95 color-transition cursor-pointer transition-transform duration-300 shadow-sm hover:dark:bg-gray-700 dark:bg-gray-800 dark:border-gray-700 flex flex-col h-full no-underline"
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
    </router-link>
  </div>

  <!--NoFilms-->
  <div
    v-if="!isLoading && movies.length === 0"
    class="text-center mt-8 text-gray-500 dark:text-gray-400"
  >
    No movies found. Try adjusting filters or search query.
  </div>
  <!--Paginatioin-->
  <div
    v-if="movies.length > 0"
    class="flex flex-col justify-center items-center my-5"
  >
    <nav aria-label="Page navigation example ">
      <ul class="inline-flex -space-x-px text-base h-10">
        <li>
          <a
            href="#"
            @click.prevent="goToPage(currentPage - 1)"
            class="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >Previous</a
          >
        </li>
        <li v-for="page in visiblePages" :key="page">
          <a
            href="#"
            @click.prevent="goToPage(page)"
            :class="[
              'flex items-center justify-center px-3 h-8 leading-tight border border-gray-300 hover:bg-indigo-800 hover:text-gray-700 dark:border-gray-700 dark:hover:bg-indigo-800 dark:hover:text-white',
              page === currentPage
                ? 'bg-indigo-700 text-white dark:bg-indigo-700'
                : 'bg-white text-gray-500 dark:bg-gray-800 dark:text-gray-400',
            ]"
          >
            {{ page }}
          </a>
        </li>
        <li>
          <a
            href="#"
            @click.prevent="goToPage(currentPage + 1)"
            class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >Next</a
          >
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useNavigation } from "../router/navigation.js";
const nav = useNavigation();

import StarRating from "../components/StarRating.vue"; // добавь путь
const router = useRouter();
const searchQuery = ref("");
const SearchOne = ref(false);
const movie = ref(false);
const isLoading = ref(false);
const currentPage = ref(1);
const limit = 20;
const totalPages = ref(1);
const movies = ref([]);

const selectedCategory = ref("All movies");
const categories = [
  "All movies",
  "Action",
  "Adventure",
  "Animation",
  "Biography",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Fantasy",
  "Horror",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Short",
  "Thriller",
];

const allCountries = [
  "Australia",
  "Bahamas",
  "Belgium",
  "Cambodia",
  "Canada",
  "China",
  "Czech Republic",
  "Denmark",
  "Dominican Republic",
  "Finland",
  "France",
  "Germany",
  "Hong Kong",
  "Hungary",
  "Iceland",
  "India",
  "Ireland",
  "Italy",
  "Japan",
  "Luxembourg",
  "Mexico",
  "Netherlands",
  "New Zealand",
  "Norway",
  "Philippines",
  "Poland",
  "Puerto Rico",
  "Romania",
  "Russia",
  "Slovenia",
  "South Korea",
  "Soviet Union",
  "Spain",
  "Sweden",
  "Taiwan",
  "Thailand",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
];

const selectedCountries = ref([]);

const filteredCountries = computed(() => {
  if (!search.value) return [];
  return allCountries.filter(
    (c) =>
      c.toLowerCase().includes(search.value.toLowerCase()) &&
      !selectedCountries.value.includes(c)
  );
});

const search = ref("");
const useApi = ref(false);
const handleSearch = async (event) => {
  event.preventDefault();

  if (useApi.value) {
    await handleSearchApi();
  } else {
    await handleSearchDefault();
  }
};
const handleSearchApi = async (e) => {
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
const handleSearchDefault = async (e) => {
  if (!searchQuery.value) return;

  currentPage.value = 1;
  await fetchMovies();
};

const fetchMovies = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(
      "http://localhost:3000/services/movies-page-mydb",
      {
        params: {
          page: currentPage.value,
          limit,
          title: searchQuery.value || undefined,
          category:
            selectedCategory.value !== "All movies"
              ? selectedCategory.value
              : undefined,
          countries:
            selectedCountries.value.length > 0
              ? selectedCountries.value.join(",")
              : undefined,
        },
      }
    );

    movies.value = response.data.data;
    totalPages.value = response.data.totalPages;
    currentPage.value = response.data.currentPage;
  } catch (err) {
    console.error("Ошибка загрузки фильмов из БД:", err);
  } finally {
    isLoading.value = false;
  }
};
function selectCategory(category) {
  selectedCategory.value = category;
  currentPage.value = 1;
  fetchMovies();
}

function addCountry(country) {
  selectedCountries.value.push(country);
  search.value = "";
  currentPage.value = 1;
  fetchMovies();
}

function removeCountry(country) {
  selectedCountries.value = selectedCountries.value.filter(
    (c) => c !== country
  );
  currentPage.value = 1;
  fetchMovies();
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchMovies();
    window.scrollTo(0, 0); // прокрутка вверх
  }
};

onMounted(async () => {
  await fetchMovies();

  const Dropdown = (await import("flowbite")).Dropdown;
  const triggerEl = document.getElementById("dropdownDelayButton");
  const dropdownEl = document.getElementById("dropdownDelay");

  if (triggerEl && dropdownEl) {
    new Dropdown(dropdownEl, triggerEl);
  }
});
const visiblePages = computed(() => {
  const maxVisible = 10;
  let start = 1;
  let end = totalPages.value;

  if (totalPages.value > maxVisible) {
    const half = Math.floor(maxVisible / 2);
    if (currentPage.value <= half) {
      start = 1;
      end = maxVisible;
    } else if (currentPage.value + half >= totalPages.value) {
      start = totalPages.value - maxVisible + 1;
      end = totalPages.value;
    } else {
      start = currentPage.value - half;
      end = currentPage.value + half;
    }
  }

  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});
</script>

<style scoped></style>
