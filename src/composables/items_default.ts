import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import apiClient from '@/services/api.ts'
import { useToast } from '@/stores/toast.ts'
import { usePickKey } from '@/composables/pick_key.ts'

interface Paginator {
  count: number
  next: number | null
  previous: number | null
  current: number
  num_pages: number
}

export function useItemsDefault<
  T extends { id: number | string },
  TNew,
  TError extends Record<string, any>,
>(
  url: string,
  defaultEmpty: () => TNew,
  localStoragePage: string,
  columns: Partial<Record<keyof T, string>>) {
  const items = ref<T[]>([])
  const current = ref<T | undefined>(undefined)
  const newItem = ref<TNew>(defaultEmpty())
  const errors = ref<TError>({} as TError)
  const showCreateModal = ref(false)
  const showDeleteModal = ref(false)
  const toastStore = useToast()
  const pageSize = ref<number>(Number(localStorage.getItem(`${localStoragePage}Size`)) || 10)
  const paginator = ref<Paginator>({} as Paginator)
  const toRepresentation = computed(() => {
    return items.value.map((item) =>
      usePickKey(item, Object.keys(columns) as (keyof typeof item)[]),
    )
  })

  let intervalId: number | null = null

  function checkStatus() {
    if (!items.value.every((el) => 'status' in el)) return

    const hasRunning = items.value.some(
      (el) => el.status === 'progress' || el.status === 'queue',
    )

    if (hasRunning && intervalId === null) {
      intervalId = window.setInterval(getItems, 10000)
    }

    if (!hasRunning && intervalId !== null) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  async function getItems(page: number = 0) {
    const { data } = await apiClient.get<{results: T[]} & Paginator>(
      page > 0
        ? `${url}?page_size=${pageSize.value}&page=${page}`
        : `${url}?page_size=${pageSize.value}`,
    )
    items.value = data.results
    const { results: _, ...rest } = data
    paginator.value = rest
    localStorage.setItem(localStoragePage, String(paginator.value.current))
    checkStatus()
  }

  async function deleteItem() {
    if (!current.value) return
    const { status } = await apiClient.delete(`${url}${current.value.id}/`)
    if (status === 204) {
      items.value.length === 1
        ? await getItems()
        : await getItems(paginator.value.current)
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
    const page = localStorage.getItem(localStoragePage)
    page ? await getItems(parseInt(page)) : await getItems()
  })

  watch(pageSize, async (value) => {
    await getItems()
    localStorage.setItem(`${localStoragePage}Size`, String(value))
  })

  watch(showCreateModal, (value: boolean) => {
    if (!value) {
      newItem.value = defaultEmpty()
      errors.value = {}
    }
  })

  onUnmounted(() => {
    if (intervalId !== null) {
      clearInterval(intervalId)
      intervalId = null
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
    toastStore,
    pageSize,
    paginator,
    getItems,
    askDelete,
    deleteItem,
  }
}
