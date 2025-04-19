import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import { type User } from '@/types/User.ts'
import apiClient from '@/services/api.ts'

export const useUser = defineStore('user', {
  state: () => ({
    router: useRouter(),
    theme: 'dark',
    user: {
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      id: null,
      username: null,
      first_name: null,
      last_name: null,
      email: null,
      is_active: false,
      is_staff: false,
      is_superuser: false,
    } as User,
  }),
  actions: {
    getUserDataFromStorage() {
      this.user.id = Number(localStorage.getItem('id'))
      this.user.username = localStorage.getItem('username')
      this.user.first_name = localStorage.getItem('first_name')
      this.user.last_name = localStorage.getItem('last_name')
      this.user.email = localStorage.getItem('email')
      this.user.is_active = localStorage.getItem('is_active') === 'true'
      this.user.is_staff = localStorage.getItem('is_staff') === 'true'
      this.user.is_superuser = localStorage.getItem('is_superuser') === 'true'
    },

    initUser() {
      if (localStorage.getItem('accessToken')) {
        this.user.isAuthenticated = true
        this.user.accessToken = localStorage.getItem('accessToken')
        this.user.refreshToken = localStorage.getItem('refreshToken')
        this.getUserDataFromStorage()

        apiClient.defaults.headers.common['Authorization'] =
          `Bearer ${localStorage.getItem('accessToken')}`
      }
      this.theme = localStorage.getItem('theme') || 'dark'
      document.body.setAttribute('data-theme', this.theme)
    },

    removeUserData() {
      this.user.isAuthenticated = false
      this.user.accessToken = null
      this.user.refreshToken = null
      this.user.id = null
      this.user.username = null
      this.user.first_name = null
      this.user.last_name = null
      this.user.email = null
      this.user.is_active = false
      this.user.is_staff = false
      this.user.is_superuser = false

      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('id')
      localStorage.removeItem('username')
      localStorage.removeItem('first_name')
      localStorage.removeItem('last_name')
      localStorage.removeItem('email')
      localStorage.removeItem('is_active')
      localStorage.removeItem('is_staff')
      localStorage.removeItem('is_superuser')

      apiClient.defaults.headers.common['Authorization'] = ''
      this.router.push({ name: 'login' })
    },

    async getMyData() {
      try {
        const response = await apiClient.get('/users/me/')
        localStorage.setItem('id', response.data?.id)
        localStorage.setItem('username', response.data?.username)
        localStorage.setItem('first_name', response.data?.first_name)
        localStorage.setItem('last_name', response.data?.last_name)
        localStorage.setItem('email', response.data?.email)
        localStorage.setItem('is_active', response.data?.is_active)
        localStorage.setItem('is_staff', response.data?.is_staff)
        localStorage.setItem('is_superuser', response.data?.is_superuser)

        this.getUserDataFromStorage()
      } catch (error) {
        console.error(error)
        this.removeUserData()
      }
    },

    setTokens(accessToken: string, refreshToken: string) {
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)

      this.user.isAuthenticated = true
      this.user.accessToken = accessToken
      this.user.refreshToken = refreshToken

      apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
    },
    toggleTheme() {
      if (this.theme === 'dark') {
        this.theme = 'light'
        localStorage.setItem('theme', 'light')
      } else {
        this.theme = 'dark'
        localStorage.setItem('theme', 'dark')
      }
      document.body.setAttribute('data-theme', this.theme)
    },
  },
})
