<script setup lang="ts">
import { initPopovers } from 'flowbite'
import { onMounted } from 'vue'

const id = crypto.randomUUID()

onMounted(() => {
  initPopovers()
})
</script>

<template>
  <template class="flex justify-center">
    <span :data-popover-target="id" data-popover-trigger="hover">
      <slot name="object"></slot>
    </span>
    <div
      data-popover
      :id
      role="tooltip"
      class="absolute z-10 invisible inline-block w-48 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-xs opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800"
    >
      <div
        class="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700"
      >
        <h3 class="font-semibold text-gray-900 dark:text-white"><slot name="title"></slot></h3>
      </div>
      <div class="px-3 py-2">
        <p><slot name="body"></slot></p>
      </div>
      <div data-popper-arrow></div>
    </div>
  </template>
</template>
