import { defineStore } from 'pinia'
import type { Toast } from '@/types/Toast.ts'

export const useToast = defineStore('toast', {
  state: () => ({
    toasts: [] as Toast[],
  }),
  actions: {
    addToast(
      message: string,
      type: 'success' | 'warning' | 'danger',
      duration: number = 3000,
    ): void {
      const id = crypto.randomUUID()
      this.toasts.push({ id, message, type, duration })

      setTimeout(() => {
        this.toasts.splice(this.toasts.findIndex(item => item.id = id), 1)
      }, duration)
    },
  },
})
