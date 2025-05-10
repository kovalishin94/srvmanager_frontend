<script setup lang="ts">
interface Props {
  errors?: Array<String>
  label?: string
  placeholder?: string
  modelValue: string | undefined
  required?: boolean
  rows?: number
}

const id = crypto.randomUUID()

const {
  errors = [],
  label = '',
  placeholder = '',
  modelValue,
  required = false,
  rows = 2,
} = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function handleTextareaChange(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<template>
  <label
    v-if="label"
    :for="id"
    :class="[errors.length ? 'text-red-700 dark:text-red-500' : 'text-gray-900 dark:text-white']"
    class="block mb-1 text-sm font-medium"
    >{{ label }}</label
  >
  <textarea
    :id
    :rows
    :value="modelValue"
    :required
    @input="handleTextareaChange"
    class="block p-2.5 w-full text-sm rounded-lg border dark:bg-gray-700"
    :class="[
      errors.length > 0
        ? 'text-red-900 bg-red-50 border-red-500 focus:ring-red-500 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500 dark:focus:ring-red-500 dark:focus:border-red-500'
        : 'text-gray-900 bg-gray-50  border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:text-white dark:placeholder-gray-400 dark:border-gray-600   dark:focus:ring-blue-500 dark:focus:border-blue-500',
    ]"
    :placeholder
  ></textarea>
  <div v-if="errors.length > 0" class="flex flex-col">
    <p v-for="error in errors" class="mt-2 text-sm text-red-600 dark:text-red-500">{{ error }}</p>
  </div>
</template>
