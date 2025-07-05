<script setup lang="ts">
import type { UpdateFile, UpdateFileErrors, UpdateFileNew } from '@/types/Etalon.ts'
import type { DataTableAction } from '@/types/DataTableAction.ts'
import { useItemsDefault } from '@/composables/items_default.ts'
import { provide, ref } from 'vue'
import apiClient from '@/services/api.ts'
import { AxiosError } from 'axios'
import DataTable from '@/components/DataTable.vue'
import Modal from '@/components/Modal.vue'
import FileInput from '@/components/UI/FileInput.vue'

const columns: Partial<Record<keyof UpdateFile, string>> = {
  id: "ID",
  version: "Версия",
  tag: "Тэг",
  loaded_by: "Автор",
  created_at: "Создан"
}

const {
  items: updateFiles,
  current: currentUpdateFile,
  newItem: newUpdateFile,
  errors,
  toRepresentation,
  toastStore,
  pageSize,
  paginator,
  showCreateModal,
  showDeleteModal,
  getItems: getUpdateFiles,
  askDelete,
  deleteItem: deleteUpdateFile,
} = useItemsDefault<UpdateFile, UpdateFileNew, UpdateFileErrors>(
  '/update-file/',
  ()=>({
    file: null,
  }),
  'updateFilePage',
  columns
)
const actions = ref<DataTableAction[]>([
  { label: 'Создать', action: () => (showCreateModal.value = true) },
  { label: 'Удалить', action: askDelete },
])

async function createUpdateFile() {
  if (!newUpdateFile.value.file) return
  const formData = new FormData()
  formData.append('file', newUpdateFile.value.file)
  try {
    await apiClient.post('/update-file/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    await getUpdateFiles()
    showCreateModal.value = false
    toastStore.defaultSuccess()
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.status === 400) {
        errors.value = error.response?.data
      }
    }
  }
}
provide('paginator', paginator)
provide('paginatorFn', getUpdateFiles)
</script>

<template>
  <div>
    <DataTable
      class="px-6 py-2"
      :actions="updateFiles.length ? actions : actions.filter((el) => el.label === 'Создать')"
      :columns="Object.values(columns)"
      :rows="toRepresentation"
      v-model:page-size="pageSize"
    >
      <template #cell="{col, value}">
        <td class="px-6 py-4" colspan="2" v-if="col === 'loaded_by'">
          {{ value.first_name }} {{ value.last_name }}
        </td>
      </template>
    </DataTable>
    <Teleport to="body">
      <Modal v-model="showCreateModal">
        <template #title>Загрузите новый файл обновления</template>
        <template #body>
          <FileInput v-model="newUpdateFile.file" formats="tar.gz" label="Файл обновления"/>
        </template>
        <template #footer>
          <MainButton @click="createUpdateFile">Сохранить</MainButton>
        </template>
      </Modal>
      <Modal v-model="showDeleteModal" :type="'delete'" size="max-w-md">
        <template #body>
          Вы действительно хотите удалить файл обновления с id <strong>"{{ currentUpdateFile?.id }}"?</strong>
        </template>
        <template #footer>
          <DangerButton @click="deleteUpdateFile">Удалить</DangerButton>
          <SecondaryButton @click="showDeleteModal = false">Отмена</SecondaryButton>
        </template>
      </Modal>
    </Teleport>
  </div>
</template>