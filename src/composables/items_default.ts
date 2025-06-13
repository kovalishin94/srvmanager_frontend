import { onMounted, ref, watchEffect } from 'vue'
import apiClient from '@/services/api.ts'
import { useToast } from '@/stores/toast.ts'

export function useItemsDefault<
  T extends { id: number | string },
  TNew,
  TError extends Record<string, any>,
>(url: string, defaultEmpty: TNew) {
  const items = ref<T[]>([])
  const current = ref<T | undefined>(undefined)
  const newItem = ref<TNew>(defaultEmpty)
  const errors = ref<TError>({} as TError)
  const showCreateModal = ref(false)
  const showDeleteModal = ref(false)
  const toastStore = useToast()

  async function getItems() {
    const { data } = await apiClient.get(url)
    items.value = data
  }

  async function deleteItem() {
    if (!current.value) return
    const { status } = await apiClient.delete(`${url}${current.value.id}/`)
    if (status === 204) {
      const idx = items.value.findIndex((el) => el.id === current.value?.id)
      items.value.splice(idx, 1)
      showDeleteModal.value = false
      current.value = undefined
      toastStore.defaultSuccess()
    }
  }

  function askDelete(id: number | string) {
    current.value = items.value.find((el) => el.id === id)
    showDeleteModal.value = true
  }

  onMounted(async () => {
    await getItems()
  })

  watchEffect(() => {
    if (!showCreateModal.value) {
      newItem.value = {...defaultEmpty}
      errors.value = {}
    }
  })

  return {
    items,
    current,
    newItem,
    errors,
    showCreateModal,
    showDeleteModal,
    askDelete,
    deleteItem,
    toastStore,
  }
}
