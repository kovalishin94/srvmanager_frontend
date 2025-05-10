<script setup lang="ts">
import NavbarMenuButton from '@/components/Navbar/NavbarMenuButton.vue'
import OperationsIcon from '@/components/UI/Icons/OperationsIcon.vue'
import DownArrowIcon from '@/components/UI/Icons/DownArrowIcon.vue'

defineEmits<{
  (e: 'buttonClick'): void
}>()

</script>

<template>
  <button
    type="button"
    class="cursor-pointer flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
    aria-controls="dropdown-menu-button"
    data-collapse-toggle="dropdown-menu-button"
  >
    <OperationsIcon />
    <span class="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Операции</span>
    <DownArrowIcon />
  </button>
  <ul id="dropdown-menu-button" class="hidden py-2 space-y-2" @click="$emit('buttonClick')">
    <NavbarMenuButton name="ExecuteCommand" is_link link="execute-command"/>
    <NavbarMenuButton name="SendFile" is_link />
    <NavbarMenuButton name="PrepareUpdate" is_link />
  </ul>
</template>
