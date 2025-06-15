<template>
  <section class="py-24 relative">
    <div class="max-w-7xl mx-auto px-5">
      <div class="flex flex-col gap-7">
        <h2 class="text-white text-4xl font-bold font-manrope leading-normal">
          Comments
        </h2>

        <div class="flex flex-col gap-8">
          <div
            v-for="comment in comments"
            :key="comment.id"
            :class="[
              'w-full rounded-3xl border p-8 flex flex-col gap-4',
              comment.userId === currentUserId
                ? 'bg-gray-900 text-gray-600 items-end'
                : 'bg-gray-800 border-indigo-200 text-white items-start',
            ]"
          >
            <div class="flex justify-between w-full items-center">
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-full bg-indigo-300 overflow-hidden"
                >
                  <img
                    :src="
                      comment.User?.avatar ||
                      'https://via.placeholder.com/40?text=U'
                    "
                    alt="User avatar"
                    class="object-cover w-full h-full"
                  />
                </div>
                <div class="flex flex-col leading-tight">
                  <h5 class="font-semibold text-base md:text-lg">
                    {{ comment.User?.login || "Неизвестный" }}
                  </h5>
                  <time class="text-indigo-500 text-xs">{{
                    formatDate(comment.createdAt)
                  }}</time>
                </div>
              </div>
              <div
                class="flex items-center gap-2 text-indigo-400 cursor-pointer select-none"
              >
                <div
                  @click="reactToComment(comment.id, 'like')"
                  class="flex flex-row hover:text-indigo-700 gap-2 cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-5 h-5 fill-current"
                    viewBox="0 0 20 20"
                    stroke="currentColor"
                  >
                    <path
                      d="M2.626 3.433c2.014-1.984 5.194-2.122 7.37-.413 2.176-1.709 5.363-1.572 7.376.412 2.168 2.143 2.168 5.61 0 7.753L10.46 17.976a.75.75 0 01-1.23 0L2.626 11.182c-2.169-2.137-2.169-5.613 0-7.75z"
                      stroke="currentColor"
                    />
                  </svg>
                  <span>{{ comment.likes || 0 }}</span>
                </div>
                <div
                  @click="reactToComment(comment.id, 'dislike')"
                  class="flex flex-row ml-5 hover:text-indigo-700 gap-2 cursor-pointer"
                >
                  <svg
                    class="w-6 h-6 text-indigo-400 fill-indigo-400 hover:fill-indigo-800"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M8.97 14.316H5.004c-.322 0-.64-.08-.925-.232a2.022 2.022 0 0 1-.717-.645 2.108 2.108 0 0 1-.242-1.883l2.36-7.201C5.769 3.54 5.96 3 7.365 3c2.072 0 4.276.678 6.156 1.256.473.145.925.284 1.35.404h.114v9.862a25.485 25.485 0 0 0-4.238 5.514c-.197.376-.516.67-.901.83a1.74 1.74 0 0 1-1.21.048 1.79 1.79 0 0 1-.96-.757 1.867 1.867 0 0 1-.269-1.211l1.562-4.63ZM19.822 14H17V6a2 2 0 1 1 4 0v6.823c0 .65-.527 1.177-1.177 1.177Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span class="hover:text-indigo-800">{{
                    comment.dislikes || 0
                  }}</span>
                </div>
              </div>
            </div>
            <div
              v-if="editingCommentId === comment.id"
              class="w-full flex flex-col gap-2"
            >
              <textarea
                v-model="editedText"
                class="w-full bg-gray-800 rounded-lg p-2 text-white"
                rows="3"
              ></textarea>
              <div class="flex gap-2 justify-end">
                <button
                  @click="saveEditedComment(comment)"
                  class="px-3 py-1 bg-indigo-700 hover:bg-indigo-800 text-white rounded"
                >
                  Save
                </button>
                <button
                  @click="editingCommentId = null"
                  class="px-3 py-1 bg-indigo-300 hover:bg-indigo-400 text-indigo-900 font-semibold transition rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
            <p v-else class="text-base md:text-2xl xs:text-lg leading-relaxed">
              {{ comment.text }}
            </p>

            <div
              v-if="comment.userId === currentUserId"
              class="flex gap-4 justify-end"
            >
              <button
                @click="startEditing(comment)"
                class="px-4 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-semibold transition"
              >
                Edit
              </button>
              <button
                @click="deleteComment(comment.id)"
                class="px-4 py-2 rounded-xl bg-indigo-300 hover:bg-indigo-400 text-indigo-900 font-semibold transition"
              >
                Delete
              </button>
            </div>
          </div>

          <!-- Новый комментарий -->
          <form @submit.prevent="postComment" class="flex gap-4 items-center">
            <input
              v-model="newComment"
              type="text"
              placeholder="Leave a constructive comment..."
              required
              class="flex-grow py-3 px-5 rounded-lg border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-indigo-900 placeholder-indigo-400"
            />
            <button
              type="submit"
              class="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "../stores/auth";

const props = defineProps({
  movieId: String,
});

const authStore = useAuthStore();
const currentUserId = computed(() => authStore.user.user?.id || null);

const newComment = ref("");
const comments = ref([]);

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString() + " " + d.toLocaleTimeString();
}

async function fetchComments() {
  try {
    const res = await axios.get(
      `http://localhost:3000/user/comments/${props.movieId}`
    );
    comments.value = res.data;
  } catch (e) {
    console.error("Ошибка загрузки комментариев", e);
  }
}

async function postComment() {
  if (!newComment.value.trim()) return;
  try {
    const res = await axios.post(
      "http://localhost:3000/user/comments",
      { contentItemId: props.movieId, text: newComment.value.trim() },
      { withCredentials: true }
    );
    comments.value.push(res.data);
    newComment.value = "";
  } catch (e) {
    console.error("Ошибка отправки комментария", e);
  }
}

const editingCommentId = ref(null);
const editedText = ref("");

function startEditing(comment) {
  editingCommentId.value = comment.id;
  editedText.value = comment.text;
}

async function saveEditedComment(comment) {
  if (!editedText.value.trim() || editedText.value === comment.text) return;

  try {
    const response = await axios.put(
      `http://localhost:3000/user/comments/${comment.id}`,
      { text: editedText.value },
      { withCredentials: true }
    );
    const index = comments.value.findIndex((c) => c.id === comment.id);
    if (index !== -1) {
      comments.value[index].text = response.data.text;
    }
    editingCommentId.value = null;
    editedText.value = "";
  } catch (e) {
    console.error("Ошибка при сохранении комментария", e);
  }
}
async function deleteComment(commentId) {
  try {
    await axios.delete(`http://localhost:3000/user/comments/${commentId}`, {
      withCredentials: true,
    });
    comments.value = comments.value.filter((c) => c.id !== commentId);
  } catch (e) {
    console.error("Ошибка удаления комментария", e);
  }
}
async function reactToComment(commentId, reactionType) {
  try {
    const response = await axios.post(
      `http://localhost:3000/user/comments/${commentId}/react`,
      { reactionType },
      { withCredentials: true }
    );

    console.log(response.data.message);
    fetchComments();
  } catch (e) {
    console.error(
      "Ошибка при реакции на комментарий:",
      e.response?.data || e.message
    );
  }
}

onMounted(fetchComments);
</script>
