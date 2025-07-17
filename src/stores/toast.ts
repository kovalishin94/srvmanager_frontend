import { defineStore } from 'pinia'
import type { Toast } from '@/types/Toast.ts'
import { v4 as uuidv4 } from 'uuid'

export const useToast = defineStore('toast', {
  state: () => ({
    toasts: [] as Toast[],
  }),
  actions: {
    addToast(
      message: string,
      type: 'success' | 'warning' | 'danger',
      duration: number = 5000,
    ): void {
      const id = uuidv4()
      this.toasts.push({ id, message, type, duration })

      setTimeout(() => {
        this.toasts.splice(
          this.toasts.findIndex((item) => (item.id = id)),
          1,
        )
      }, duration)
    },
    defaultSuccess() {
      this.addToast('Успешно', 'success')
    },
  },
})
