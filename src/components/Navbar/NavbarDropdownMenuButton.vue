<script setup lang="ts">
import NavbarMenuButton from '@/components/Navbar/NavbarMenuButton.vue'
import OperationsIcon from '@/components/UI/Icons/OperationsIcon.vue'
</script>

<template>
  <button
    type="button"
    class="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
    aria-controls="dropdown-menu-button"
    data-collapse-toggle="dropdown-menu-button"
  >
    <OperationsIcon />
    <span class="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Операции</span>
    <svg
      class="w-3 h-3"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 10 6"
    >
      <path
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="m1 1 4 4 4-4"
      />
    </svg>
  </button>
  <ul id="dropdown-menu-button" class="hidden py-2 space-y-2">
    <li>
      <NavbarMenuButton></NavbarMenuButton>
    </li>
  </ul>
</template>
