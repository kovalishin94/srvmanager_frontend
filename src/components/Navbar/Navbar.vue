<script setup lang="ts">
import { initFlowbite } from 'flowbite'
import { onMounted, ref } from 'vue'
import { useUser } from '@/stores/user.ts'
import TheSidebar from '@/components/Navbar/TheSidebar.vue'

const userStore = useUser()
const showSidebar = ref(false)

onMounted(() => {
  initFlowbite()
})
</script>

<template>
  <nav class="bg-white border-gray-200 dark:bg-gray-900 h-18">
    <div class="flex items-center p-4">
      <TransparentButton @click.stop="showSidebar = true">
        <MenuIcon />
      </TransparentButton>
      <TransparentButton class="ml-auto" @click="userStore.toggleTheme">
        <ThemeIcon />
      </TransparentButton>
    </div>
  </nav>
  <TheSidebar v-model="showSidebar"/>
</template>
