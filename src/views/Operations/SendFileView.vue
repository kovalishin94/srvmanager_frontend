<script setup lang="ts">
import type { SendFile, SendFileNew, SendFileErrors } from '@/types/Ops.ts'
import type { Host } from '@/types/Host.ts'
import { computed, onMounted, provide, ref } from 'vue'
import type { DataTableAction } from '@/types/DataTableAction.ts'
import apiClient from '@/services/api.ts'
import Badge from '@/components/UI/Badge.vue'
import DataTable from '@/components/DataTable.vue'
import Modal from '@/components/Modal.vue'
import SelectField from '@/components/UI/SelectField.vue'
import SelectTable from '@/components/SelectTable.vue'
import InputField from '@/components/UI/InputField.vue'
import FileInput from '@/components/UI/FileInput.vue'
import { AxiosError } from 'axios'
import { useItemsDefault } from '@/composables/items_default.ts'

const columns: Partial<Record<keyof SendFile, string>> = {
  id: 'Id',
  created_by: 'Автор',
  status: 'Статус',
  created_at: 'Создана',
  updated_at: 'Время последнего изменения',
  local_path: 'Локальная директория',
  target_path: 'Целевая директория',
  file: 'Файл',
  protocol: 'Протокол',
}

const {
  items: sendFiles,
  current: currentSendFile,
  newItem: newSendFile,
  errors,
  toRepresentation,
  showCreateModal,
  showDeleteModal,
  toastStore,
  pageSize,
  paginator,
  getItems: getSendFiles,
  askDelete,
  deleteItem: deleteSendFile,
} = useItemsDefault<SendFile, SendFileNew, SendFileErrors>(
  '/send-file/',
  () => ({ hosts: [], protocol: 'sftp', local_path: '', target_path: '', file: null }),
  'sendFilePage',
  columns,
)

const actionList = ref<DataTableAction[]>([
  { label: 'Создать', action: () => (showCreateModal.value = true) },
  { label: 'Удалить', action: askDelete },
  { label: 'Лог', action: showLog },
  {label: 'Повторить', action: repeatSendFile}
])

const showLogModal = ref<boolean>(false)
const hosts = ref<Host[]>([])
const actions = computed(() => {
  return sendFiles.value.length
    ? actionList.value
    : actionList.value.filter((el) => el.label === 'Создать')
})
const hostsOptions = computed(() => {
  if (newSendFile.value.protocol === 'sftp') {
    return hosts.value
      .filter((el) => el.ssh_credentials.length > 0)
      .map(({ id, name, ip }) => ({ id, name, ip }))
  } else {
    return hosts.value
      .filter((el) => el.winrm_credentials.length > 0)
      .map(({ id, name, ip }) => ({ id, name, ip }))
  }
})

const createFormFata = (): FormData => {
  const formData = new FormData()
  newSendFile.value.hosts.forEach((id) => {
    formData.append('hosts', id.toString())
  })
  formData.append('protocol', newSendFile.value.protocol)
  if (newSendFile.value.local_path) formData.append('local_path', newSendFile.value.local_path)
  formData.append('target_path', newSendFile.value.target_path)
  if (newSendFile.value.file) formData.append('file', newSendFile.value.file)
  return formData
}

async function createSendFile() {
  try {
    await apiClient.post('/send-file/', createFormFata(), {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    await getSendFiles()
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

async function repeatSendFile(id: number | string) {
  let file_url = null
  currentSendFile.value = sendFiles.value.find((el) => el.id === id)
  if (!currentSendFile.value) return
  currentSendFile.value.hosts.forEach(el => newSendFile.value.hosts.push(el.id))
  newSendFile.value.protocol = currentSendFile.value.protocol
  newSendFile.value.target_path = currentSendFile.value.target_path
  if (currentSendFile.value.file) file_url = new URL(currentSendFile.value.file)
  file_url ? newSendFile.value.local_path = `/app${file_url.pathname}` : newSendFile.value.local_path = currentSendFile.value.local_path
  if (!newSendFile.value.local_path) return
  await createSendFile()
  newSendFile.value = {
    hosts: [],
    protocol: 'sftp',
    local_path: '',
    target_path: '',
    file: null
  }
}

async function getHosts() {
  const { data } = await apiClient.get<{results: Host[], [key: string]: any}>('/host/?page_size=10000')
  hosts.value = data.results
}

function showLog(id: number | string) {
  currentSendFile.value = sendFiles.value.find((item) => item.id === id)
  showLogModal.value = true
}

provide('paginator', paginator)
provide('paginatorFn', getSendFiles)

onMounted(() => {
  getHosts()
})
</script>

<template>
  <div>
    <DataTable
      class="px-6 py-2"
      :actions
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
        <td class="px-6 py-4" colspan="2" v-if="col === 'protocol'">
          <Badge v-if="value === 'sftp'">SFTP</Badge>
          <Badge v-if="value === 'smb'" color="purple">SMB</Badge>
        </td>
      </template>
    </DataTable>
    <Teleport to="body">
      <Modal v-model="showCreateModal" size="max-w-5xl">
        <template #title>Отправить файл</template>
        <template #body>
          <div class="flex flex-col gap-y-3 px-12">
            <h5 class="text-xl font-bold dark:text-white">Выберите хосты:</h5>
            <SelectTable
              :columns="['Id', 'Имя', 'Ip']"
              :rows="hostsOptions"
              v-model="newSendFile.hosts"
            />
            <SelectField
              :options="[
                { label: 'SFTP', value: 'sftp' },
              ]"
              v-model="newSendFile.protocol"
            />
            <FileInput v-model="newSendFile.file" label="Файл для отправки" />
            <InputField
              v-model="newSendFile.local_path"
              placeholder="Локальный путь к файлу (необязательно)"
              :errors="errors?.local_path"
            />
            <InputField
              v-model="newSendFile.target_path"
              placeholder="Целевой путь"
              :errors="errors?.target_path"
            />
          </div>
        </template>
        <template #footer>
          <MainButton @click="createSendFile">Сохранить</MainButton>
        </template>
      </Modal>
      <Modal v-model="showLogModal">
        <template #title>
          Лог операции <strong>{{ currentSendFile?.id }}</strong>
        </template>
        <template #body>
          <div class="p-4 max-h-[calc(100vh-20rem)] overflow-y-scroll">
            <ol class="relative border-s border-gray-200 dark:border-gray-800">
              <li class="ms-4" v-for="(log, timestamp) in currentSendFile?.log">
                <div
                  class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-800"
                ></div>
                <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500"
                  >{{ timestamp }}
                </time>
                <p
                  class="text-base font-normal text-gray-500 dark:text-gray-400"
                  :class="{
                    'text-red-500 dark:text-red-400': log.includes('ошибка'),
                    'text-green-500 dark:text-green-500': log.includes('успешно'),
                  }"
                >
                  {{ log }}
                </p>
              </li>
            </ol>
          </div>
        </template>
        <template #footer>
          <SecondaryButton @click="showLogModal = false">Закрыть</SecondaryButton>
        </template>
      </Modal>
      <Modal v-model="showDeleteModal" type="delete">
        <template #body>
          Вы действительно хотите удалить информацию об операции {{ currentSendFile?.id }}
        </template>
        <template #footer>
          <DangerButton @click="deleteSendFile">Удалить</DangerButton>
          <SecondaryButton @click="showDeleteModal = false">Отмена</SecondaryButton>
        </template>
      </Modal>
    </Teleport>
  </div>
</template>
