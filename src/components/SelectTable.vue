<script setup lang="ts">
type ObjectWithId = {
  id: string | number
} & {
  [key: string]: any
}

interface Props {
  columns: string[]
  rows: ObjectWithId[]
  modelValue: (string | number)[]
}

const { columns, rows, modelValue } = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: (string | number)[]): void
}>()

function omitKey<T, K extends keyof T>(obj: T, key: K): Omit<T, K> {
  const { [key]: _, ...rest } = obj
  return rest
}

function handleCheckboxChange(event: Event, value: string | number) {
  const checked = (event.target as HTMLInputElement).checked
  const set = new Set<string | number>(modelValue)
  checked ? set.add(value) : set.delete(value)
  emit('update:modelValue', Array.from(set))
}

function handleCheckboxAllChange(event: Event) {
  const checked = (event.target as HTMLInputElement).checked
  const set = new Set<string | number>(modelValue)
  checked ? rows.forEach((row) => set.add(row.id)) : set.clear()
  emit('update:modelValue', Array.from(set))
}
</script>

<template>
  <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900 dark:text-gray-400">
        <tr>
          <th scope="col" class="p-4">
            <div class="flex items-center">
              <input
                type="checkbox"
                :checked="modelValue.length === rows.length"
                @change="handleCheckboxAllChange"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </th>
          <th scope="col" class="px-6 py-3" v-for="column in columns">{{ column }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="row in rows"
          :key="row.id"
          class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
        >
          <td class="w-4 p-4">
            <div class="flex items-center">
              <input
                :value="row.id"
                :checked="modelValue.includes(row.id)"
                @change="handleCheckboxChange($event, row.id)"
                type="checkbox"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </td>
          <th
            scope="row"
            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
          >
            {{ row.id }}
          </th>
          <td class="px-6 py-4" v-for="value in Object.values(omitKey(row, 'id'))">{{ value }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
