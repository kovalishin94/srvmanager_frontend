<script setup lang="ts">
interface Option {
  label: string
  value: string | number
}

interface Props {
  options: Option[]
  modelValue: string | number | undefined
  placeholder?: string
}
const id = crypto.randomUUID()
const { options, modelValue, placeholder } = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

function handleSelectChange(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<template>
  <select
    :id
    @input="handleSelectChange"
    :value="modelValue"
    class="text-gray-500 dark:text-gray-400 bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
  >
    <option class="text-gray-400 dark:text-gray-500" v-if="placeholder" value="" selected>{{placeholder}}</option>
    <option v-for="option in options" :key="option.value" :value="option.value">
      {{ option.label }}
    </option>
  </select>
</template>
