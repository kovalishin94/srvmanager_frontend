<script setup lang="ts">
type Tab = {
  label: string
  value: string
}

const { tabs = [], modelValue } = defineProps<{
  tabs: Tab[]
  modelValue: string
}>()
</script>

<template>
  <div
    class="text-lg font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700"
  >
    <ul class="flex flex-wrap -mb-px">
      <li class="me-2" v-for="tab in tabs">
        <button
          @click="$emit('update:modelValue', tab.value)"
          :class="[
            modelValue === tab.value
              ? 'active text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500'
              : 'hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 border-transparent',
          ]"
          class="cursor-pointer inline-block p-4 border-b-2 rounded-t-lg"
        >
          {{ tab.label }}
        </button>
      </li>
    </ul>
  </div>
</template>
