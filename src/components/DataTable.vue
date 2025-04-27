<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import type { DataTableAction } from '@/types/DataTableAction.ts'

type ObjectWithId = {
  id: string | number
} & {
  [key: string]: any
}

const coords = ref({ x: 0, y: 0 })
const visible = ref(false)
const currentId = ref<string | number>(0)

const {
  columns,
  rows,
  actions = [],
} = defineProps<{
  columns: string[]
  rows: ObjectWithId[]
  actions?: DataTableAction[]
}>()

function rightClick(event: MouseEvent, id: string | number) {
  coords.value = { x: event.clientX, y: event.clientY }
  visible.value = true
  currentId.value = id
}
function onGlobalClick() {
  if (visible.value) visible.value = false
}

onMounted(() => {
  window.addEventListener('click', onGlobalClick)
})
onBeforeUnmount(() => {
  window.removeEventListener('click', onGlobalClick)
})
</script>

<template>
  <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
      <thead
        class="text-center text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
      >
        <tr>
          <th scope="col" class="px-6 py-3" v-for="column in columns">{{ column }}</th>
        </tr>
      </thead>
      <tbody v-if="rows.length">
        <template v-for="row in rows" :key="row.id">
            <tr
              class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 text-center hover:bg-gray-50 dark:hover:bg-gray-600"
              @contextmenu.prevent="rightClick($event, row.id)"
            >
              <template v-for="(value, key) in row" :key="key">
                <slot name="cell" :col="key" :value="value">
                  <td class="px-6 py-4">{{ value }}</td>
                </slot>
              </template>
            </tr>
        </template>
      </tbody>
      <tbody v-else>
        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
          <td
            @contextmenu.prevent="rightClick($event, 0)"
            :colspan="columns.length"
            class="px-6 py-4 text-xl text-center"
          >
            Нет данных для отображения
          </td>
        </tr>
      </tbody>
    </table>
    <div
      v-if="visible"
      :style="{ top: `${coords.y}px`, left: `${coords.x}px` }"
      class="fixed z-50 w-48 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600"
    >
      <ul class="py-1 text-sm text-gray-700 dark:text-gray-200">
        <li v-for="action in actions" :key="action.label">
          <button
            @click="action.action(currentId)"
            class="w-full text-left block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
          >
            {{ action.label }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
