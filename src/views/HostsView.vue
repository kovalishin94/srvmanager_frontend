<script setup lang="ts">
import DataTable from '@/components/DataTable.vue'
import { ref } from 'vue'
import type { DropDownItem } from '@/types/dropdownitem.ts'

const actions = ref<Array<DropDownItem>>([
  {name: 'Создать', action: 'create'},
  {name: 'Удалить', action: 'delete'},
])

const columns = ref<Array<String>>([
  'Имя',
  'IP адрес',
  'Операционная система',
])

</script>

<template>
  <DataTable class="p-6" :columns :actions @create="console.log('create')"/>
</template>
