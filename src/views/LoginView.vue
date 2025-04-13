<script setup lang="ts">
import { useUser } from '@/stores/user.ts'
import { ref } from 'vue'
import apiClient from '@/services/api.ts'
import { useRouter } from 'vue-router'
import { AxiosError } from 'axios'
import InputField from '@/components/UI/InputField.vue'
import MainButton from '@/components/UI/MainButton.vue'

const router = useRouter()
const userStore = useUser()

const username = ref<string>('')
const password = ref<string>('')
const errors = ref({
  username: '',
  password: '',
})
const showLoginError = ref(false)

function resetErrors() {
  errors.value.username = ''
  errors.value.password = ''
  showLoginError.value = false
}

function validateLoginData(): boolean {
  let isValid = true
  if (username.value === '') {
    errors.value.username = 'Это поле обязательное'
    isValid = false
  }
  if (password.value === '') {
    errors.value.password = 'Это поле обязательное'
    isValid = false
  }
  return isValid
}

async function login() {
  resetErrors()
  if (!validateLoginData()) {
    return
  }
  try {
    const response = await apiClient.post('/token/', {
      username: username.value,
      password: password.value,
    })
    userStore.setTokens(response.data?.access, response.data?.refresh)
    await userStore.getMyData()
    await router.push({ name: 'home' })
  } catch (error) {
    if (error instanceof AxiosError) {
      switch (error.status) {
        case 400:
          showLoginError.value = true
          break
        default:
          console.error(error)
      }
    }
  }
}
</script>

<template>
  <div @keyup.enter="login" class="flex flex-col max-w-sm gap-y-6 mx-auto h-dvh justify-center">
    <InputField
      id="username"
      :errors="errors.username ? [errors.username] : []"
      placeholder="Логин"
      v-model="username"
    />
    <InputField
      id="password"
      type="password"
      :errors="errors.password ? [errors.password] : []"
      placeholder="Пароль"
      v-model="password"
    />
    <MainButton @click="login" class="mt-5 w-full">Войти</MainButton>
  </div>
</template>
