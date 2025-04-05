<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useUser } from '@/stores/user.ts'

const userStore = useUser()

userStore.initUser()
</script>

<template>
  <RouterView />
</template>
