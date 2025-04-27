<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { useUser } from '@/stores/user.ts'
import Navbar from '@/components/Navbar/Navbar.vue'
import TheToast from '@/components/TheToast.vue'

const route = useRoute()
const userStore = useUser()

userStore.initUser()
</script>

<template>
  <Navbar v-if="route.name !== 'login'"/>
  <RouterView class="pt-14"/>
  <TheToast/>
</template>
