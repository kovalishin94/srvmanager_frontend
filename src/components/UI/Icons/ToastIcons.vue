<script setup lang="ts">
defineProps<{
  type: 'success' | 'warning' | 'danger'
}>()
</script>

<template>
  <div
    class="inline-flex items-center justify-center shrink-0 w-8 h-8 rounded-lg"
    :class="{
    'text-green-500 bg-green-100  dark:bg-green-800 dark:text-green-200': type === 'success',
    'text-red-500 bg-red-100 dark:bg-red-800 dark:text-red-200': type === 'danger',
    'text-orange-500 bg-orange-100 dark:bg-orange-700 dark:text-orange-200': type === 'warning',
    }"
  >
    <svg
      class="w-5 h-5"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path v-if="type === 'success'"
        d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"
      />
      <path v-if="type === 'danger'"
        d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"
      />
      <path v-if="type === 'warning'"
        d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z"
      />
    </svg>
  </div>
</template>
