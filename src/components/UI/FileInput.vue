<script setup lang="ts">
import { computed } from 'vue'

const id = String(crypto.randomUUID())

const {
  modelValue = null,
  formats,
  label,
} = defineProps<{
  modelValue?: File | null
  formats?: string
  label?: string
}>()

const fileName = computed(() => (modelValue ? modelValue.name : 'Файл не выбран'))

const emit = defineEmits<{
  'update:modelValue': [value: File | null]
}>()

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    emit('update:modelValue', target.files[0])
  }
}

const handleDrop = (event: DragEvent) => {
  if (event.dataTransfer && event.dataTransfer.files.length > 0) {
    emit('update:modelValue', event.dataTransfer.files[0])
  }
}
</script>
<template>
  <div class="flex items-center justify-center w-full">
    <label
      @dragover.prevent
      @drop.prevent="handleDrop"
      :for="id"
      class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
    >
      <svg
        class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 16"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
        />
      </svg>
      <p class="mb-2 text-lg text-gray-500 dark:text-gray-400" v-if="label">
        {{ label }}
      </p>
      <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
        <span class="font-semibold">Кликните для загрузки</span> или перетащите файл
      </p>
      <p class="text-xs text-gray-500 dark:text-gray-400" v-if="formats">{{ formats }}</p>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
        {{ fileName }}
      </p>
      <input :id="id" type="file" class="hidden" @change="handleFileChange" />
    </label>
  </div>
</template>
