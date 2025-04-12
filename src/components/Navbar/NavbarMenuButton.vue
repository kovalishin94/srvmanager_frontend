<script setup lang="ts">
defineProps({
  name: {
    type: String,
    default: 'MenuButton',
  },
})
</script>

<template>
  <button
    class="flex items-center p-2 text-gray-900 rounded-lg cursor-pointer dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group w-full text-left"
  >
    <slot></slot>
    <span class="flex-1 ms-3 whitespace-nowrap">{{name}}</span>
  </button>
</template>