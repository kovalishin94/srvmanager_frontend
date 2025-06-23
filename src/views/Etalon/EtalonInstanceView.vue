<script setup lang="ts">
import { useItemsDefault } from '@/composables/items_default.ts'
import type { EtalonInstance, EtalonInstanceErrors, NewEtalonInstance } from '@/types/Etalon.ts'
import { computed, onMounted, ref } from 'vue'
import type { DataTableAction } from '@/types/DataTableAction.ts'
import apiClient from '@/services/api.ts'
import { AxiosError } from 'axios'
import type { Host } from '@/types/Host.ts'
import Badge from '@/components/UI/Badge.vue'
import DataTable from '@/components/DataTable.vue'
import SelectField from '@/components/UI/SelectField.vue'
import Modal from '@/components/Modal.vue'
import InputField from '@/components/UI/InputField.vue'
import SelectTable from '@/components/SelectTable.vue'

const columns: Record<string, keyof EtalonInstance> = {
  'id': 'id',
  'url': 'url',
  'Версия': 'version',
  'Тэг': 'tag',
  'stand': 'stand',
  'valid': 'is_valid',
}
const {
  items: etalonInstances,
  current: currentEtalonInstance,
  newItem: newEtalonInstance,
  errors,
  toRepresentation,
  showCreateModal,
  showDeleteModal,
  getItems: getEtalonInstances,
  askDelete,
  deleteItem: deleteEtalonInstance,
  toastStore
} = useItemsDefault<EtalonInstance, NewEtalonInstance, EtalonInstanceErrors>(
  '/etalon-instance/',
  {
    path_to_instance: '',
    host: null,
    docker_command: 'docker compose'
  },
  columns
)
const actions = ref<DataTableAction[]>([
  { label: 'Создать', action: () => (showCreateModal.value = true) },
  { label: 'Удалить', action: askDelete },
])
const hosts = ref<Array<{ label: string, value: number }>>([])
async function createEtalonInstance() {
  try {
    const { data } = await apiClient.post('/etalon-instance/', newEtalonInstance.value)
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
  const { data } = await apiClient.get<Host[]>('/host')
  hosts.value = data.map(({ id, name, ip }) => ({ label: `${name}-${ip}`, value: id }))
}

onMounted(async () => {
  await getHosts()
})

</script>

<template>
  <div>
    <DataTable
      class="px-6 py-2"
      :actions
      :columns="Object.keys(columns)"
      :rows="toRepresentation"
    >
    </DataTable>
    <Teleport to="body">
      <Modal v-model="showCreateModal">
        <template #title>Создать новый хост</template>
        <template #body>
          <div class="flex flex-col gap-y-3 px-12">
            <SelectField :options="hosts" v-model="newEtalonInstance.host!"/>
            </div>
        </template>
        <template #footer>
          <MainButton @click="createEtalonInstance">Сохранить</MainButton>
        </template>
      </Modal>
    </Teleport>
  </div>
</template>