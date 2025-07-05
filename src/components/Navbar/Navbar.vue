<script setup lang="ts">
import { ref } from 'vue'
import { useUser } from '@/stores/user.ts'
import TheSidebar from '@/components/Navbar/TheSidebar.vue'
import Logo from '@/components/UI/Icons/Logo.vue'

const userStore = useUser()
const showSidebar = ref(false)

</script>

<template>
  <nav class="bg-white border-gray-200 dark:bg-gray-900 h-18">
    <div class="flex items-center p-4">
      <TransparentButton @click.stop="showSidebar = true">
        <MenuIcon />
      </TransparentButton>
      <Logo class="ml-2"/>
      <TransparentButton class="ml-auto" @click="userStore.toggleTheme">
        <ThemeIcon />
      </TransparentButton>
    </div>
  </nav>
  <TheSidebar v-model="showSidebar"/>
</template>
