<script setup lang="ts">
import { computed, inject } from 'vue'
import type { Ref } from 'vue'

type PaginatorFn = (page: number) => void

interface Paginator {
  count: number
  next: number | null
  previous: number | null
  current: number
  num_pages: number
}

const paginator = inject<Ref<Paginator> | null>('paginator', null)
const paginatorFn = inject<Ref<PaginatorFn> | null>('paginatorFn', null)

const pages = computed(() => {
  const result: number[] = []

  if (!paginator?.value) return result

  if (paginator.value.num_pages <= 5) {
    for (let i = 1; i <= paginator.value.num_pages; i++) {
      result.push(i)
    }
    return result
  }

  let start = Math.max(1, paginator.value.current - 2)
  let end = Math.min(paginator.value.num_pages, paginator.value.current + 2)

  if (paginator.value.current <= 3) {
    start = 1
    end = 5
  }
  if (paginator.value.current >= paginator.value.num_pages - 2) {
    start = paginator.value.num_pages - 4
    end = paginator.value.num_pages
  }
  for (let i = start; i <= end; i++) {
    result.push(i)
  }
  return result
})

</script>

<template>
  <nav v-if="paginator && paginator.num_pages > 1">
    <ul class="flex items-center -space-x-px h-8 text-sm">
      <li>
        <button
          @click="paginatorFn && paginatorFn(paginator.previous!)"
          :disabled="!paginator?.previous"
          class="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          :class="[!paginator?.previous ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer']"
        >
          <span class="sr-only">Previous</span>
          <svg
            class="w-2.5 h-2.5 rtl:rotate-180"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 1 1 5l4 4"
            />
          </svg>
        </button>
      </li>
      <li v-for="num in pages">
        <button
          :disabled="paginator?.current === num"
          :class="[
            paginator?.current === num
              ? 'cursor-not-allowed z-10 text-blue-600 border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:bg-gray-700 dark:text-white'
              : 'cursor-pointer text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white',
          ]"
          class="flex items-center justify-center px-3 h-8 leading-tight border dark:border-gray-700"
          @click="paginatorFn && paginatorFn(num)"
        >
          {{ num }}
        </button>
      </li>
      <li>
        <button
          @click="paginatorFn && paginatorFn(paginator.next!)"
          :disabled="!paginator?.next"
          class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          :class="[!paginator?.next ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer']"
        >
          <span class="sr-only">Next</span>
          <svg
            class="w-2.5 h-2.5 rtl:rotate-180"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m1 9 4-4-4-4"
            />
          </svg>
        </button>
      </li>
    </ul>
  </nav>
</template>
