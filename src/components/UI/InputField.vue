<script setup lang="ts">
interface Props {
  id?: string
  type?: string
  errors?: Array<String>
  label?: string
  required?: boolean
  placeholder?: string
  modelValue: string | number
}

const {
  id = crypto.randomUUID(),
  type = 'text',
  errors = [],
  label = '',
  required = false,
  placeholder = '',
  modelValue,
} = defineProps<Props>()

const emit = defineEmits(['update:modelValue'])

function handleInputChange(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<template>
  <div>
    <label
      v-if="label"
      :for="id"
      :class="[errors.length ? 'text-red-700 dark:text-red-500' : 'text-gray-900 dark:text-white']"
      class="block mb-2 text-sm font-medium"
      >{{ label }}</label
    >
    <input
      :id
      :type
      :value="modelValue"
      @input="handleInputChange"
      class="border text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700"
      :placeholder
      :required
      :class="[
        errors.length > 0
          ? 'bg-red-50 border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500'
          : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
      ]"
    />
    <div v-if="errors.length > 0" class="flex flex-col">
      <p v-for="error in errors" class="mt-2 text-sm text-red-600 dark:text-red-500">{{ error }}</p>
    </div>
  </div>
</template>
