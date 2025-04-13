<script setup lang="ts">
import DownArrowIcon from '@/components/UI/Icons/DownArrowIcon.vue'
import type { DropDownItem } from '@/types/dropdownitem.ts'

defineProps({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  items: {
    type: Array<DropDownItem>,
    required: true,
  },
})

const emit = defineEmits(['proxy'])
</script>

<template>
  <button
    :id="`${id}Button`"
    :data-dropdown-toggle="id"
    class="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
    type="button"
  >
    <span class="sr-only">Dropdown button</span>
    {{ name }}
    <DownArrowIcon class="ms-2.5" />
  </button>
  <!-- Dropdown menu -->
  <div
    :id
    class="z-10 hidden bg-white rounded-lg shadow-sm w-44 dark:bg-gray-700 dark:divide-gray-600"
  >
    <ul class="py-1 text-sm text-gray-700 dark:text-gray-200" :aria-labelledby="`${id}Button`">
      <li v-for="item in items">
        <button
          @click="emit('proxy', item.action)"
          class="cursor-pointer text-left block w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
        >
          {{ item.name }}
        </button>
      </li>
    </ul>
  </div>
</template>
