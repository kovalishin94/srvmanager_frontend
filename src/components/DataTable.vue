<script setup lang="ts">
type ObjectWithId = {
  id: string | number
} & {
  [key: string]: any
}

defineProps<{
  columns: string[]
  rows: ObjectWithId[]
}>()
</script>

<template>
  <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" class="px-6 py-3" v-for="column in columns">{{ column }}</th>
        </tr>
      </thead>
      <tbody v-if="rows.length">
        <tr
          class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
          v-for="row in rows"
          :key="row.id"
        >
          <td class="px-6 py-4" v-for="cell in Object.values(row)">{{ cell }}</td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr
          class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
        >
          <td :colspan="columns.length" class="px-6 py-4 text-xl text-center">Нет данных для отображения</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
