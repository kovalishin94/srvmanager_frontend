<script setup lang="ts">
import CloseIcon from '@/components/UI/Icons/CloseIcon.vue'
import AttentionIcon from '@/components/UI/Icons/AttentionIcon.vue'

const { modelValue, type = 'default' } = defineProps<{
  modelValue: boolean
  type?: 'default' | 'delete'
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-300"
    enter-from-class="opacity-0 -translate-y-80"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-300"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-80"
  >
    <div
      v-show="modelValue"
      @click.self="emit('update:modelValue', false)"
      class="overflow-y-auto overflow-x-hidden flex fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
    >
      <div
        class="relative p-4 w-full max-w-5xl max-h-full"
        :class="{ 'max-w-5xl': type === 'default', 'max-w-md': type === 'delete' }"
      >
        <div
          class="relative bg-white rounded-lg shadow-sm dark:bg-gray-700"
          v-if="type === 'default'"
        >
          <div
            class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200"
          >
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              <slot name="title">DefaultTitle</slot>
            </h3>
            <button
              type="button"
              class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              @click="emit('update:modelValue', false)"
            >
              <CloseIcon />
            </button>
          </div>
          <div class="p-4 md:p-5 space-y-4">
            <slot name="body">DefaultBody</slot>
          </div>
          <div
            class="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600"
          >
            <slot name="footer"> </slot>
          </div>
        </div>
        <div
          v-if="type === 'delete'"
          class="relative bg-white rounded-lg shadow-sm dark:bg-gray-700"
        >
          <button
            @click="emit('update:modelValue', false)"
            type="button"
            class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
          >
            <CloseIcon />
          </button>
          <div class="p-4 md:p-5 text-center">
            <AttentionIcon/>
            <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              <slot name="body"></slot>
            </h3>
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>
