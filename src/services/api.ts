import axios, { type AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios'
import { useUser } from '@/stores/user.ts'
import { useToast } from '@/stores/toast.ts'
import router from '@/router'

interface RequestConfigWithHandlers extends AxiosRequestConfig {
  _retry: boolean
  errorHandlers?: Record<number, (error: AxiosError) => any>
}

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

apiClient.interceptors.response.use(
  res => res,
  async (error: AxiosError) => {
    const status = error.response?.status
    const cfg = error.config as RequestConfigWithHandlers
    const url = cfg.url || ''
    const userStore  = useUser()
    const toastStore = useToast()

    // сразу исключаем отсутствие связи с бэкандом
    if (error.code === 'ERR_NETWORK') {
      toastStore.addToast('Нет связи с сервером', 'danger')
      return Promise.reject(error)
    }
    if (url.includes('/token/')) {
      return Promise.reject(error)
    }
    // не трогаем ошибки refresh
    if (url.includes('/token/refresh/')) {
      userStore.removeUserData()
      return Promise.reject(error)
    }
    // сначала пробуем «персональный» обработчик, если он есть
    if (status && cfg.errorHandlers?.[status]) {
      return cfg.errorHandlers[status](error)
    }
    // дальше — уже глобальная логика
    // в случае 401 пытаемся обновить access token 1 раз, если не получается - до свидания!
    if (status === 401 && !cfg._retry) {
      cfg._retry = true
      try {
        const response = await apiClient.post('/token/refresh/', {
          refresh: userStore.user.refreshToken,
        })
        const newToken = response.data.access
        localStorage.setItem('accessToken', newToken)
        userStore.user.accessToken = newToken
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
        // важный момент формирования cfg: несмотря на то что на строчку выше добавили
        // новый токен в defaults, мы собираемся в повторный запрос засунуть старый cfg
        // со старым токеном, поэтому хедер старого cfg мы тоже переписываем
        cfg.headers = {
          ...cfg.headers,
          Authorization: `Bearer ${newToken}`,
        }
        return apiClient(cfg)
      } catch (error) {
        userStore.removeUserData()
        return Promise.reject(error)
      }
    }
    if (status === 403) {
      await router.push({ name: 'forbidden' })
    }
    return Promise.reject(error)
  }
)

export default apiClient
