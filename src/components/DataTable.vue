<script setup lang="ts">
import SearchIcon from '@/components/UI/Icons/SearchIcon.vue'
import DropDown from '@/components/UI/DropDown.vue'
import type { DropDownItem } from '@/types/dropdownitem.ts'

defineProps({
  actions: {
    type: Array<DropDownItem>,
    required: true,
  },
  columns: {
    type: Array<String>,
    required: true
  }
})

const emit = defineEmits()

function proxyEmit(action: string) {
  emit(action)
}

</script>

<template>
  <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <div
      class="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4"
    >
      <DropDown id="hostActions" name="Действия" :items="actions" @proxy="proxyEmit"/>
      <label for="table-search" class="sr-only">Search</label>
      <div class="relative">
        <div
          class="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none"
        >
          <SearchIcon />
        </div>
        <input
          type="text"
          id="table-search-users"
          class="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder=""
        />
      </div>
    </div>
    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" class="p-4">
            <div class="flex items-center">
              <input
                id="checkbox-all"
                type="checkbox"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label for="checkbox-all" class="sr-only">checkbox</label>
            </div>
          </th>
          <th scope="col" class="px-6 py-3" v-for="column in columns">{{ column }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          <td class="w-4 p-4">
            <div class="flex items-center">
              <input
                id="checkbox-table-1"
                type="checkbox"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label for="checkbox-table-1" class="sr-only">checkbox</label>
            </div>
          </td>
          <th
            scope="row"
            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
          >
            Apple MacBook Pro 17"
          </th>
          <td class="px-6 py-4">Silver</td>
          <td class="px-6 py-4">Laptop</td>
          <td class="px-6 py-4">$2999</td>
          <td class="px-6 py-4">
            <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
              >Edit</a
            >
          </td>
        </tr>
        <tr
          class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          <td class="w-4 p-4">
            <div class="flex items-center">
              <input
                id="checkbox-table-2"
                type="checkbox"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label for="checkbox-table-2" class="sr-only">checkbox</label>
            </div>
          </td>
          <th
            scope="row"
            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
          >
            Microsoft Surface Pro
          </th>
          <td class="px-6 py-4">White</td>
          <td class="px-6 py-4">Laptop PC</td>
          <td class="px-6 py-4">$1999</td>
          <td class="px-6 py-4">
            <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
              >Edit</a
            >
          </td>
        </tr>
        <tr
          class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          <td class="w-4 p-4">
            <div class="flex items-center">
              <input
                id="checkbox-table-3"
                type="checkbox"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label for="checkbox-table-3" class="sr-only">checkbox</label>
            </div>
          </td>
          <th
            scope="row"
            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
          >
            Magic Mouse 2
          </th>
          <td class="px-6 py-4">Black</td>
          <td class="px-6 py-4">Accessories</td>
          <td class="px-6 py-4">$99</td>
          <td class="px-6 py-4">
            <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
              >Edit</a
            >
          </td>
        </tr>
        <tr
          class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          <td class="w-4 p-4">
            <div class="flex items-center">
              <input
                id="checkbox-table-3"
                type="checkbox"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label for="checkbox-table-3" class="sr-only">checkbox</label>
            </div>
          </td>
          <th
            scope="row"
            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
          >
            Apple Watch
          </th>
          <td class="px-6 py-4">Silver</td>
          <td class="px-6 py-4">Accessories</td>
          <td class="px-6 py-4">$179</td>
          <td class="px-6 py-4">
            <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
              >Edit</a
            >
          </td>
        </tr>
        <tr
          class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          <td class="w-4 p-4">
            <div class="flex items-center">
              <input
                id="checkbox-table-3"
                type="checkbox"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label for="checkbox-table-3" class="sr-only">checkbox</label>
            </div>
          </td>
          <th
            scope="row"
            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
          >
            iPad
          </th>
          <td class="px-6 py-4">Gold</td>
          <td class="px-6 py-4">Tablet</td>
          <td class="px-6 py-4">$699</td>
          <td class="px-6 py-4">
            <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
              >Edit</a
            >
          </td>
        </tr>
        <tr class="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
          <td class="w-4 p-4">
            <div class="flex items-center">
              <input
                id="checkbox-table-3"
                type="checkbox"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label for="checkbox-table-3" class="sr-only">checkbox</label>
            </div>
          </td>
          <th
            scope="row"
            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
          >
            Apple iMac 27"
          </th>
          <td class="px-6 py-4">Silver</td>
          <td class="px-6 py-4">PC Desktop</td>
          <td class="px-6 py-4">$3999</td>
          <td class="px-6 py-4">
            <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
              >Edit</a
            >
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
