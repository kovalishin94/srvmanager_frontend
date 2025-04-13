import { defineStore } from 'pinia'
import type { ToastType } from '@/types/toastType.ts'

export const useToast = defineStore('toast', {
  state: () => ({
    toasts: [] as ToastType[],
  }),
  actions: {
    addToast(
      message: string,
      type: 'success' | 'warning' | 'danger',
      duration: number = 3000,
    ): void {
      const id = Date.now()
      this.toasts.push({ id, message, type, duration })

      setTimeout(() => {
        this.toasts.splice(this.toasts.findIndex(item => item.id = id), 1)
      }, duration)
    },
  },
})
