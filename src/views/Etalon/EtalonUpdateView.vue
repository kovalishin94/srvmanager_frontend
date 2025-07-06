<script setup lang="ts">
import type {
  EtalonInstance,
  EtalonUpdate,
  EtalonUpdateErrors,
  EtalonUpdateNew,
  UpdateFile,
} from '@/types/Etalon.ts'
import { useItemsDefault } from '@/composables/items_default.ts'
import { onMounted, provide, ref } from 'vue'
import type { DataTableAction } from '@/types/DataTableAction.ts'
import apiClient from '@/services/api.ts'
import Badge from '@/components/UI/Badge.vue'
import DataTable from '@/components/DataTable.vue'
import Popover from '@/components/UI/Popover.vue'
import Modal from '@/components/Modal.vue'
import SelectTable from '@/components/SelectTable.vue'
import SelectField from '@/components/UI/SelectField.vue'
import { AxiosError } from 'axios'

const columns: Partial<Record<keyof EtalonUpdate, string>> = {
  id: 'Id',
  created_by: 'Автор',
  status: 'Статус',
  created_at: 'Создана',
  updated_at: 'Время последнего обновления',
  instances: 'Площадки',
  update_file: 'Обновление',
}

const {
  items: etalonUpdates,
  current: currentEtalonUpdate,
  newItem: newEtalonUpdate,
  errors,
  toRepresentation,
  showCreateModal,
  showDeleteModal,
  toastStore,
  pageSize,
  paginator,
  getItems: getEtalonUpdates,
  askDelete,
  deleteItem: deleteEtalonUpdate,
} = useItemsDefault<EtalonUpdate, EtalonUpdateNew, EtalonUpdateErrors>(
  '/etalon-update/',
  () => ({
    instances: [],
    update_file: null,
  }),
  'etalonUpdatePage',
  columns,
)

const actions = ref<DataTableAction[]>([
  { label: 'Создать', action: () => (showCreateModal.value = true) },
  { label: 'Удалить', action: askDelete },
])

const etalonInstances = ref<
  Array<Pick<EtalonInstance, 'id' | 'url' | 'stand' | 'version' | 'tag'>>
>([])
const updateFilesOptions = ref<Array<{ label: string; value: number }>>([])

async function createEtalonUpdate() {
  try {
    await apiClient.post('/etalon-update/', newEtalonUpdate.value)
    await getEtalonUpdates()
    showCreateModal.value = false
    toastStore.defaultSuccess()
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.message.includes('400')) {
        errors.value = error.response?.data
      }
    }
  }
}

async function getEtalonInstances() {
  const { data } = await apiClient.get<{ results: EtalonInstance[]; [key: string]: any }>(
    '/etalon-instance/?page_size=10000',
  )
  etalonInstances.value = data.results.map(({ id, url, stand, version, tag }) => ({
    id,
    url,
    stand,
    version,
    tag,
  }))
}
async function getUpdateFiles() {
  const { data } = await apiClient.get<{ results: UpdateFile[]; [key: string]: any }>(
    '/update-file/?page_size=10000',
  )
  updateFilesOptions.value = data.results.map(({ id, version, tag }) => ({
    label: `${version} ${tag}`,
    value: id,
  }))
}

provide('paginator', paginator)
provide('paginatorFn', getEtalonUpdates)

onMounted(async () => {
  await getEtalonInstances()
  await getUpdateFiles()
})
</script>

<template>
  <div>
    <DataTable
      class="px-6 py-2"
      :actions="etalonUpdates.length ? actions : actions.filter((el) => el.label === 'Создать')"
      :columns="Object.values(columns)"
      :rows="toRepresentation"
      v-model:page-size="pageSize"
    >
      <template #cell="{ col, value }">
        <td class="px-6 py-4" colspan="2" v-if="col === 'created_by'">
          {{ value.first_name }} {{ value.last_name }}
        </td>
        <td class="px-6 py-4" colspan="2" v-if="col === 'status'">
          <Badge v-if="value === 'queue'">В очереди</Badge>
          <Badge v-if="value === 'progress'" color="yellow">Выполняется</Badge>
          <Badge v-if="value === 'error'" color="red">Ошибка</Badge>
          <Badge v-if="value === 'completed'" color="green">Выполнено</Badge>
        </td>
        <td class="px-6 py-4" colspan="2" v-if="col === 'instances'">
          <div v-if="value.length">
            <Popover v-for="instance in value">
              <template #object>{{ instance.url }}</template>
              <template #title>{{ instance.url }}</template>
              <template #body
                >Stand: {{ instance.stand }}, Version: {{ instance.version }}-{{ instance.tag }}</template
              >
            </Popover>
          </div>
        </td>
        <td class="px-6 py-4" colspan="2" v-if="col === 'update_file'">
          <div v-if="value">{{ value.version }}-{{ value.tag }}</div>
        </td>
      </template>
    </DataTable>
    <Teleport to="body">
      <Modal v-model="showCreateModal">
        <template #title>Запуск процесса обновления</template>
        <template #body>
          <div class="flex flex-col gap-y-3 px-12">
            <h5 class="text-xl font-bold dark:text-white">Выберите площадки:</h5>
            <SelectTable
              :columns="['Id', 'url', 'stand', 'Версия', 'Тэг']"
              :rows="etalonInstances"
              v-model="newEtalonUpdate.instances"
            />
            <SelectField
              :options="updateFilesOptions"
              v-model="newEtalonUpdate.update_file"
              placeholder="Файл обновления"
            />
          </div>
        </template>
        <template #footer>
          <MainButton @click="createEtalonUpdate">Сохранить</MainButton>
        </template>
      </Modal>
      <Modal v-model="showDeleteModal" type="delete">
        <template #body>
          Вы действительно хотите удалить информацию об обновлении {{ currentEtalonUpdate?.id }}
        </template>
        <template #footer>
          <DangerButton @click="deleteEtalonUpdate">Удалить</DangerButton>
          <SecondaryButton @click="showDeleteModal = false">Отмена</SecondaryButton>
        </template>
      </Modal>
    </Teleport>
  </div>
</template>
