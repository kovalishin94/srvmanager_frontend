<script setup lang="ts">
import { initFlowbite } from 'flowbite'
import { onMounted } from 'vue'
import { useUser } from '@/stores/user.ts'
import MenuIcon from '@/components/UI/Icons/MenuIcon.vue'
import CloseIcon from '@/components/UI/Icons/CloseIcon.vue'
import ExitIcon from '@/components/UI/Icons/ExitIcon.vue'
import NavbarMenuButton from '@/components/Navbar/NavbarMenuButton.vue'
import NavbarDropdownMenuButton from '@/components/Navbar/NavbarDropdownMenuButton.vue'
import HostIcon from '@/components/UI/Icons/HostIcon.vue'
import ThemeIcon from '@/components/UI/Icons/ThemeIcon.vue'
import TransparentButton from '@/components/UI/Buttons/TransparentButton.vue'

const userStore = useUser()

onMounted(() => {
  initFlowbite()
})
</script>

<template>
  <nav class="bg-white border-gray-200 dark:bg-gray-900 h-18">
    <div class="flex items-center p-4">
      <TransparentButton
        aria-expanded="false"
        data-drawer-target="main-sidebar"
        data-drawer-show="main-sidebar"
        aria-controls="main-sidebar"
      >
        <MenuIcon />
      </TransparentButton>
      <TransparentButton class="ml-auto" @click="userStore.toggleTheme">
        <ThemeIcon />
      </TransparentButton>
    </div>
  </nav>
  <div
    id="main-sidebar"
    class="fixed top-0 left-0 z-40 w-64 h-screen p-4 overflow-y-auto transition-transform -translate-x-full bg-white dark:bg-gray-800"
    tabindex="-1"
    aria-labelledby="main-sidebar-label"
  >
    <h5
      id="main-sidebar-label"
      class="text-base font-semibold text-gray-500 uppercase dark:text-gray-400"
    >
      Меню
    </h5>
    <button
      type="button"
      data-drawer-hide="main-sidebar"
      aria-controls="main-sidebar"
      class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 end-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
    >
      <CloseIcon />
      <span class="sr-only">Close menu</span>
    </button>
    <div class="py-4 overflow-y-auto">
      <ul class="space-y-2 font-medium">
        <NavbarMenuButton name="Хосты" is_link link="hosts">
          <HostIcon />
        </NavbarMenuButton>
        <NavbarDropdownMenuButton />
        <NavbarMenuButton
          @click="userStore.removeUserData"
          data-drawer-hide="main-sidebar"
          name="Выход"
        >
          <ExitIcon />
        </NavbarMenuButton>
      </ul>
    </div>
  </div>
</template>
