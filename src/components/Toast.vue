<script setup lang="ts">
import { useToast } from '@/stores/toast.ts'
import ToastIcons from '@/components/UI/Icons/ToastIcons.vue'

const toastStore = useToast()
</script>

<template>
  <div
    v-show="toastStore.toasts.length"
    class="fixed flex flex-col items-center w-full max-w-xs p-4 space-y-4 text-gray-500 bg-white  rounded-lg shadow-sm right-5 bottom-5 dark:text-gray-400 dark:bg-gray-800"
    role="alert"
  >
    <TransitionGroup name="toasts" tag="div">
      <div
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        class="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow-sm dark:text-gray-400 dark:bg-gray-800"
        role="alert"
      >
        <ToastIcons :type="toast.type" />
        <div class="ms-3 text-sm font-normal">{{ toast.message }}</div>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toasts-enter-active {
  transition: all 0.5s ease;
}
.toasts-enter-from {
  opacity: 0;
  transform: translateY(50px);
}
</style>