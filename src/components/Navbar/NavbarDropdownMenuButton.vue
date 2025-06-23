<script setup lang="ts">
import DownArrowIcon from '@/components/UI/Icons/DownArrowIcon.vue'
import { type DefineComponent, ref } from 'vue'

const { label } = defineProps<{
  label: string
  icon: DefineComponent<any, any, any>
}>()
const show = ref<boolean>(false)

defineEmits<{
  (e: 'buttonClick'): void
}>()
</script>

<template>
  <button
    @click="show = !show"
    type="button"
    class="cursor-pointer flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
  >
    <component :is="icon"/>
    <span class="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">{{ label }}</span>
    <DownArrowIcon />
  </button>
  <ul v-show="show" class="py-2 space-y-2" @click="$emit('buttonClick')">
    <slot name="menu-items"></slot>
  </ul>
</template>
