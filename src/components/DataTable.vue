<script setup lang="ts">
import { ref, watch } from 'vue'
import type { DataTableAction } from '@/types/DataTableAction.ts'
import Paginator from '@/components/UI/Paginator.vue'
import SelectField from '@/components/UI/SelectField.vue'

type ObjectWithId = {
  id: string | number
} & {
  [key: string]: any
}
const {
  columns,
  rows,
  actions = [],
  pageSize = 0,
} = defineProps<{
  columns: string[]
  rows: ObjectWithId[]
  actions?: DataTableAction[],
  pageSize?: number
}>()

const coords = ref({ x: 0, y: 0 })
const visible = ref(false)
const currentId = ref<string | number>(0)
const pageSizeLocal = ref<number>(pageSize)

const emit = defineEmits<{
  'update:pageSize': [pageSize: number]
}>()

function rightClick(event: MouseEvent, id: string | number) {
  coords.value = { x: event.clientX, y: event.clientY }
  visible.value = true
  currentId.value = id
}
function onGlobalClick() {
  if (visible.value) visible.value = false
}

watch(visible, (value) => {
  if (value) window.addEventListener('click', onGlobalClick)
  else window.removeEventListener('click', onGlobalClick)
})

watch(pageSizeLocal, (value) => {
  emit('update:pageSize', Number(value))
})
</script>

<template>
  <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
      <thead
        class="text-center text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
      >
        <tr>
          <th colspan="2" scope="col" class="px-6 py-3" v-for="column in columns">{{ column }}</th>
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
                <td class="px-6 py-4" colspan="2">{{ value }}</td>
              </slot>
            </template>
          </tr>
        </template>
      </tbody>
      <tbody v-else>
        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
          <td
            @contextmenu.prevent="rightClick($event, 0)"
            :colspan="columns.length * 2"
            class="px-6 py-4 text-xl text-center"
          >
            Нет данных для отображения
          </td>
        </tr>
      </tbody>
    </table>
    <div class="flex justify-center items-center p-6">
      <Paginator :class="{'ml-auto': pageSizeLocal}"/>
      <SelectField
        v-if="pageSizeLocal"
        class="max-w-14 ml-auto"
        :options="[
          { label: '10', value: 10 },
          { label: '20', value: 20 },
          { label: '50', value: 50 },
        ]"
        v-model="pageSizeLocal"
      />
    </div>
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
