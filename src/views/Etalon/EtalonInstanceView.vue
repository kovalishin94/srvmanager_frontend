<script setup lang="ts">
import { useItemsDefault } from '@/composables/items_default.ts'
import type { EtalonInstance, EtalonInstanceErrors, NewEtalonInstance } from '@/types/Etalon.ts'
import { onMounted, provide, ref } from 'vue'
import type { DataTableAction } from '@/types/DataTableAction.ts'
import apiClient from '@/services/api.ts'
import { AxiosError } from 'axios'
import type { Host } from '@/types/Host.ts'
import DataTable from '@/components/DataTable.vue'
import SelectField from '@/components/UI/SelectField.vue'
import Modal from '@/components/Modal.vue'
import InputField from '@/components/UI/InputField.vue'

const columns: Partial<Record<keyof EtalonInstance, string>> = {
  id: 'id',
  url: 'url',
  version: 'Версия',
  tag: 'Тег',
  stand: 'stand',
  is_valid: 'Валидность',
}
const {
  items: etalonInstances,
  current: currentEtalonInstance,
  newItem: newEtalonInstance,
  errors,
  toRepresentation,
  toastStore,
  pageSize,
  paginator,
  showCreateModal,
  showDeleteModal,
  getItems: getEtalonInstances,
  askDelete,
  deleteItem: deleteEtalonInstance,
} = useItemsDefault<EtalonInstance, NewEtalonInstance, EtalonInstanceErrors>(
  '/etalon-instance/',
  () => ({
    path_to_instance: '',
    host: null,
    docker_command: 'docker compose',
  }),
  'etalonInstancesPage',
  columns,
)
const actions = ref<DataTableAction[]>([
  { label: 'Создать', action: () => (showCreateModal.value = true) },
  { label: 'Удалить', action: askDelete },
])
const hosts = ref<Array<{ label: string; value: number }>>([])
async function createEtalonInstance() {
  try {
    await apiClient.post('/etalon-instance/', newEtalonInstance.value)
    await getEtalonInstances()
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

async function getHosts() {
  const { data } = await apiClient.get<{ results: Host[]; [key: string]: any }>(
    '/host/?page_size=10000',
  )
  hosts.value = data.results.map(({ id, name, ip }) => ({ label: `${name}-${ip}`, value: id }))
}

provide('paginator', paginator)
provide('paginatorFn', getEtalonInstances)
onMounted(async () => {
  await getHosts()
})
</script>

<template>
  <div>
    <DataTable
      class="px-6 py-2"
      :actions="etalonInstances.length ? actions : actions.filter((el) => el.label === 'Создать')"
      :columns="Object.values(columns)"
      :rows="toRepresentation"
      v-model:page-size="pageSize"
    >
    </DataTable>
    <Teleport to="body">
      <Modal v-model="showCreateModal">
        <template #title>Создать новый хост</template>
        <template #body>
          <div class="flex flex-col gap-y-3 px-12">
            <SelectField :options="hosts" v-model="newEtalonInstance.host!" placeholder="Хост" />
            <InputField
              v-model.trim="newEtalonInstance.path_to_instance"
              placeholder="Путь к директории эталона"
              :errors="errors.path_to_instance"
            />
            <SelectField
              :options="[
                { label: 'docker compose', value: 'docker compose' },
                { label: 'docker-compose', value: 'docker-compose' },
              ]"
              placeholder="Докер команда"
              v-model="newEtalonInstance.docker_command"
            />
          </div>
        </template>
        <template #footer>
          <MainButton @click="createEtalonInstance">Сохранить</MainButton>
        </template>
      </Modal>
      <Modal v-model="showDeleteModal" :type="'delete'" size="max-w-md">
        <template #body>
          Вы действительно хотите удалить площадку
          <strong>"{{ currentEtalonInstance?.url }}"?</strong>
        </template>
        <template #footer>
          <DangerButton @click="deleteEtalonInstance">Удалить</DangerButton>
          <SecondaryButton @click="showDeleteModal = false">Отмена</SecondaryButton>
        </template>
      </Modal>
    </Teleport>
  </div>
</template>
