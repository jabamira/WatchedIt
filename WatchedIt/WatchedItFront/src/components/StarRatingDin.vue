<template>
  <div class="flex items-center">
    <template v-for="index in 10" :key="index">
      <svg
        @mouseover="hoverRating = index"
        @mouseleave="hoverRating = 0"
        @click="setRating(index)"
        :class="[
          'w-4 h-4 cursor-pointer ms-1',
          hoverRating >= index || (!hoverRating && rating >= index)
            ? 'text-yellow-300'
            : 'text-gray-300 dark:text-gray-500',
        ]"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.951h4.163c.969 0 1.371 1.24.588 1.81l-3.37 2.448 1.287 3.951c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.951-3.37-2.448c-.783-.57-.38-1.81.588-1.81h4.163l1.286-3.951z"
        />
      </svg>
    </template>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: Number,
});

const emit = defineEmits(["update:modelValue"]);

const rating = ref(props.modelValue || 0);
const hoverRating = ref(0);

function setRating(value) {
  rating.value = value;
  emit("update:modelValue", value);
}

watch(
  () => props.modelValue,
  (val) => {
    rating.value = val;
  }
);
</script>
