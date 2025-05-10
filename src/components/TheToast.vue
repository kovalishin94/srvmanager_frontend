<script setup lang="ts">
import { useToast } from '@/stores/toast.ts'
import ToastIcons from '@/components/UI/Icons/ToastIcons.vue'
import { computed, ref } from 'vue'

const toastStore = useToast()

const leavingCount = ref(0)

const showContainer = computed(
  () => toastStore.toasts.length > 0 || leavingCount.value > 0
)

function onBeforeLeave() {
  leavingCount.value++
}
function onAfterLeave() {
  leavingCount.value--
}

</script>

<template>
  <div
    v-show="showContainer"
    class="fixed flex flex-col items-center w-full max-w-xs p-4 space-y-4 text-gray-500 bg-white rounded-lg shadow-sm right-5 bottom-5 dark:text-gray-400 dark:bg-gray-800"
    role="alert"
  >
    <TransitionGroup
      name="toasts"
      tag="div"
      @before-leave="onBeforeLeave"
      @after-leave="onAfterLeave"
    >
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

<!--suppress CssUnusedSymbol -->
<style scoped>
.toasts-enter-active,
.toasts-leave-active {
  transition: all 0.5s ease;
}
.toasts-enter-from,
.toasts-leave-to {
  opacity: 0;
  transform: translateY(50px);
}
</style>