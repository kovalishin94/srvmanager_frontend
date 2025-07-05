<script setup lang="ts">
const { color = 'default' } = defineProps<{
  color?: 'default' | 'dark' | 'red' | 'green' | 'yellow' | 'indigo' | 'purple' | 'pink'
}>()
</script>

<template>
  <span
    class="text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm"
    :class="{
    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300': color === 'default',
    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300': color === 'dark',
    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300': color === 'red',
    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300': color === 'green',
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300': color === 'yellow',
    'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300': color === 'indigo',
    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300': color === 'purple',
    'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300': color === 'pink',
    }"
  >
    <slot>Default</slot>
  </span>
</template>