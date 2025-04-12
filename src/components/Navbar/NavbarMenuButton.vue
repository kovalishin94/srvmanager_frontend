<script setup lang="ts">
import { ref } from 'vue'
defineProps({
  name: {
    type: String,
    default: 'MenuButton'
  },
  is_link: {
    type: Boolean,
    default: false
  },
  link: {
    type: String,
    default: ''
  }
})

const style = ref('flex items-center p-2 text-gray-900 rounded-lg cursor-pointer dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group w-full text-left')
</script>

<template>
  <li>
    <RouterLink
      :to='{name: link}'
      :class=style
      v-if="is_link"
    >
      <slot></slot>
      <span class="flex-1 ms-3 whitespace-nowrap">{{name}}</span>
    </RouterLink>
    <button
      :class=style
      v-else
    >
      <slot></slot>
      <span class="flex-1 ms-3 whitespace-nowrap">{{name}}</span>
    </button>
  </li>
</template>