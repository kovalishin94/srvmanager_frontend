<script setup lang="ts">
defineProps({
  id: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'text',
  },
  errors: {
    type: Array<String>,
    default: [],
  },
  label: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  modelValue: {
    type: String,
    required: true,
  },
})

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
      :class="[
        errors.length
        ? 'text-red-700 dark:text-red-500'
        : 'text-gray-900 dark:text-white'
        ]"
      class="block mb-2 text-sm font-medium"
      >{{ label }}</label
    >
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      @input="handleInputChange"
      class="border text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700"
      :placeholder="placeholder"
      :class="[
        errors.length > 0
          ? 'bg-red-50 border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500'
          : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
      ]"
    />
    <div v-if="errors.length > 0" class="flex flex-col">
      <p v-for="error in errors" class="mt-2 text-sm text-red-600 dark:text-red-500">{{error}}</p>
    </div>
  </div>
</template>
