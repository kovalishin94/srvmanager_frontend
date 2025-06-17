import { useToast } from '@/stores/toast.ts'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import apiClient from '@/services/api.ts'

interface Paginator {
  count: number
  next: number | null
  previous: number | null
  current: number
  num_pages: number
}

export function useOperationDefault<
  T extends { id: string | number; status: 'queue' | 'progress' | 'error' | 'completed' },
  TNew,
  TError,
>(url: string, defaultEmpty: () => TNew, localStoragePage: string) {
  const operations = ref<T[]>([])
  const newOperation = ref<TNew>(defaultEmpty())
  const current = ref<T | undefined>(undefined)
  const errors = ref<TError>({} as TError)
  const showCreateModal = ref<boolean>(false)
  const showDeleteModal = ref<boolean>(false)
  const toastStore = useToast()
  const pageSize = ref<number>(Number(localStorage.getItem(`${localStoragePage}Size`)) || 10)
  const paginator = ref<Paginator>({} as Paginator)

  let intervalId: number | null = null

  async function getOperations (page: number = 0) {
    const { data } = await apiClient.get(
      page > 0
        ? `${url}?page_size=${pageSize.value}&page=${page}`
        : `${url}?page_size=${pageSize.value}`,
    )
    operations.value = data.results
    const { results: _, ...rest } = data
    paginator.value = rest
    localStorage.setItem(localStoragePage, paginator.value.current.toString())
    const hasRunning = operations.value.some(
      (el) => el.status === 'progress' || el.status === 'queue',
    )

    if (hasRunning && intervalId === null) {
      intervalId = window.setInterval(getOperations, 10000)
    }

    if (!hasRunning && intervalId !== null) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  async function deleteOperation () {
  if (!current.value) return
  const { status } = await apiClient.delete(`${url}${current.value.id}/`)
  if (status === 204) {
    operations.value.length === 1
      ? await getOperations()
      : await getOperations(paginator.value.current)
    showDeleteModal.value = false
    current.value = undefined
    toastStore.defaultSuccess()
  }
}
  function askDelete(id: number | string) {
  current.value = operations.value.find((el) => el.id === id)
  showDeleteModal.value = true
}

  watch(showCreateModal, (value: boolean) => {
    if (!value) {
      newOperation.value = defaultEmpty()
      errors.value = {}
    }
  })

  watch(pageSize, async (value) => {
    await getOperations()
    localStorage.setItem(`${localStoragePage}Size`, String(value))
  })


  onMounted(()=>{
    const page = localStorage.getItem(localStoragePage)
    page ? getOperations(parseInt(page)) : getOperations()
  })

  onUnmounted(() => {
  if (localStorage.getItem(localStoragePage)) {
    localStorage.removeItem(localStoragePage)
    }
  })

  return {
    operations,
    current,
    newOperation,
    errors,
    showCreateModal,
    showDeleteModal,
    toastStore,
    pageSize,
    paginator,
    getOperations,
    askDelete,
    deleteOperation,
  }
}
