import { computed, onMounted, ref, watchEffect } from 'vue'
import apiClient from '@/services/api.ts'
import { useToast } from '@/stores/toast.ts'
import { usePickKey } from '@/composables/pick_key.ts'

export function useItemsDefault<
  T extends { id: number | string },
  TNew,
  TError extends Record<string, any>,
>(url: string, defaultEmpty: TNew, columns: Record<string, keyof T> = {}) {
  const items = ref<T[]>([])
  const current = ref<T | undefined>(undefined)
  const newItem = ref<TNew>(defaultEmpty)
  const errors = ref<TError>({} as TError)
  const showCreateModal = ref(false)
  const showDeleteModal = ref(false)
  const toastStore = useToast()
  const toRepresentation = computed(() => {
    return items.value.map((item) =>
      usePickKey(item, Object.values(columns) as (keyof typeof item)[]),
    )
  })

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
    toRepresentation,
    showCreateModal,
    showDeleteModal,
    getItems,
    askDelete,
    deleteItem,
    toastStore,
  }
}
