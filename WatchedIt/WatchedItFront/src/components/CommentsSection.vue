<template>
  <section class="mt-8 max-w-6xl mx-auto px-4">
    <form @submit.prevent="postComment">
      <div
        class="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
      >
        <div class="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
          <label for="comment" class="sr-only">Your comment</label>
          <textarea
            id="comment"
            v-model="newComment"
            rows="4"
            class="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
            placeholder="Write a comment..."
            required
          ></textarea>
        </div>
        <div
          class="flex items-center justify-between px-3 py-2 border-t dark:border-gray-600 border-gray-200"
        >
          <button
            type="submit"
            class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
          >
            Post comment
          </button>
        </div>
      </div>

      <div class="space-y-4 max-h-[400px] overflow-auto">
        <div
          v-for="(comment, index) in allComments"
          :key="index"
          :class="[
            'p-3 rounded shadow max-w-[70%]',
            comment.isMine
              ? 'bg-blue-600 text-white ml-auto text-right'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white mr-auto text-left',
          ]"
        >
          <p>{{ comment.text }}</p>
          <small class="opacity-70">
            — {{ comment.isMine ? "Ты" : comment.author }}
          </small>
        </div>

        <div
          v-if="allComments.length === 0"
          class="text-gray-500 dark:text-gray-400 text-center"
        >
          Пока нет комментариев.
        </div>
      </div>
    </form>
  </section>
</template>

<script setup>
import { ref, computed } from "vue";

const newComment = ref("");

const userComments = ref([
  { text: "Отличный фильм, рекомендую!", author: "Иван", isMine: false },
  {
    text: "Сюжет немного затянут, но игра актеров супер.",
    author: "Мария",
    isMine: false,
  },
]);

const myComments = ref([
  { text: "Очень понравилась музыка в фильме.", isMine: true },
]);

const allComments = computed(() => [
  ...userComments.value,
  ...myComments.value,
]);

function postComment() {
  if (newComment.value.trim() === "") return;
  myComments.value.push({ text: newComment.value.trim(), isMine: true });
  newComment.value = "";
}
</script>
