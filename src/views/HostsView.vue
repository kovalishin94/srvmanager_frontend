<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue'
import apiClient from '@/services/api.ts'
import DataTable from '@/components/DataTable.vue'
import type { Host, NewHost, ErrorHosts } from '@/types/Host.ts'
import Modal from '@/components/Modal.vue'
import InputField from '@/components/UI/InputField.vue'
import { AxiosError } from 'axios'
import type { DataTableAction } from '@/types/DataTableAction.ts'
import { useToast } from '@/stores/toast.ts'

const toastStore = useToast()
const showCreateModal = ref(false)
const showDeleteModal = ref(false)
const showEditModal = ref(false)
const currentHost = ref<Host | null>()
const columns = ref<Array<string>>(['Id', 'Имя', 'IP адрес', 'Операционная система'])
const hosts = ref<Array<Host>>([])
const newHost = ref<NewHost>({
  name: '',
  os: 'linux',
  ip: '',
  ssh_credentials_ids: [],
  winrm_credentials_ids: []
})
const errors = ref<ErrorHosts>({})
const actions = ref<DataTableAction[]>([
  { label: 'Создать', action: () => (showCreateModal.value = true) },
  { label: 'Удалить', action: askDelete },
  { label: 'Редактировать', action: askEdit },
])

function askDelete(id: number | string) {
  currentHost.value = hosts.value.find((host) => host.id === id)
  showDeleteModal.value = true
}

function askEdit(id: number | string) {
  currentHost.value = { ...hosts.value.find((host) => host.id === id)! }
  showEditModal.value = true
}

async function deleteHost() {
  if (!currentHost.value) return
  const { status } = await apiClient.delete(`/host/${currentHost.value.id}/`)
  if (status === 204) {
    const idx = hosts.value.findIndex((host) => host.id === currentHost.value?.id)
    hosts.value.splice(idx, 1)
    showDeleteModal.value = false
    currentHost.value = null
    toastStore.defaultSuccess()
  }
}

async function getHosts() {
  const { data } = await apiClient.get('/host')
  hosts.value = data
}

async function createHost() {
  try {
    const { data } = await apiClient.post('/host/', newHost.value)
    hosts.value.push(data)
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

async function updateHost() {
  if (!currentHost.value) return
  try {
    const { data } = await apiClient.put(`/host/${currentHost.value.id}/`, currentHost.value)
    hosts.value = hosts.value.map((el) => (el.id === data.id ? data : el))
    showEditModal.value = false
    toastStore.defaultSuccess()
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.status === 400) {
        errors.value = error.response?.data
      }
    }
  }
}

watchEffect(() => {
  if (!showCreateModal.value) {
    newHost.value.name = ''
    newHost.value.os = 'linux'
    newHost.value.ip = ''
    errors.value = {}
  }
  if (!showEditModal.value) {
    errors.value = {}
  }
})

onMounted(() => {
  getHosts()
})
</script>

<template>
  <div>
    <!--  Таблица с данными   -->
    <DataTable
      class="px-6 py-2"
      :columns
      :rows="hosts"
      :actions="hosts.length ? actions : actions.filter((el) => el.label === 'Создать')"
    >
      <template #cell="{ col, value }">
        <td
          class="px-6 py-4"
          v-if="!['ssh_credentials', 'winrm_credentials'].includes(String(col))"
        >
          <strong v-if="col === 'id'">{{ value }}</strong>
          <div class="inline-flex justify-center" v-else-if="col === 'os'">
            <LinuxIcon v-if="value === 'linux'" />
            <WindowsIcon v-else />
          </div>
          <span v-else>{{ value }}</span>
        </td>
        <div class="hidden" v-else></div>
      </template>
    </DataTable>
    <Teleport to="body">
      <!--  Modal: Создать хост   -->
      <Modal v-model="showCreateModal">
        <template #title> Создать новый хост </template>
        <template #body>
          <div class="flex flex-col gap-y-3 px-12">
            <InputField
              id="host-name"
              v-model.trim="newHost.name"
              placeholder="Имя хоста"
              :errors="errors.name"
            />
            <InputField
              id="host-ip"
              v-model.trim="newHost.ip"
              placeholder="IP адрес"
              :errors="errors.ip"
            />
            <div class="flex gap-x-2 items-center">
              <span class="font-semibold text-gray-500 dark:text-gray-400">Тип ос: </span>
              <TransparentButton
                :class="{ 'bg-gray-200 dark:bg-gray-500': newHost.os === 'linux' }"
                @click="newHost.os = 'linux'"
              >
                <LinuxIcon />
              </TransparentButton>
              <TransparentButton
                @click="newHost.os = 'windows'"
                :class="{ 'bg-gray-200 dark:bg-gray-500': newHost.os === 'windows' }"
              >
                <WindowsIcon />
              </TransparentButton>
            </div>
          </div>
        </template>
        <template #footer>
          <MainButton @click="createHost">Сохранить</MainButton>
        </template>
      </Modal>
      <!--  Modal: Редактировать хост  -->
      <Modal v-model="showEditModal">
        <template #title> Редактирование хоста </template>
        <template #body>
          <div class="flex flex-col gap-y-3 px-12" v-if="currentHost">
            <InputField
              id="host-name"
              v-model.trim="currentHost.name"
              placeholder="Имя хоста"
              :errors="errors.name"
            />
            <InputField
              id="host-ip"
              v-model.trim="currentHost.ip"
              placeholder="IP адрес"
              :errors="errors.ip"
            />
            <div class="flex gap-x-2 items-center">
              <span class="font-semibold text-gray-500 dark:text-gray-400">Тип ос: </span>
              <TransparentButton
                :class="{ 'bg-gray-200 dark:bg-gray-500': currentHost.os === 'linux' }"
                @click="currentHost.os = 'linux'"
              >
                <LinuxIcon />
              </TransparentButton>
              <TransparentButton
                @click="currentHost.os = 'windows'"
                :class="{ 'bg-gray-200 dark:bg-gray-500': currentHost.os === 'windows' }"
              >
                <WindowsIcon />
              </TransparentButton>
            </div>
          </div>
        </template>
        <template #footer>
          <MainButton @click="updateHost">Сохранить</MainButton>
        </template>
      </Modal>
      <!--  Modal: Удалить хост  -->
      <Modal v-model="showDeleteModal" :type="'delete'">
        <template #body>
          Вы действительно хотите удалить хост <strong>"{{ currentHost?.name }}"?</strong>
        </template>
        <template #footer>
          <DangerButton @click="deleteHost">Удалить</DangerButton>
          <SecondaryButton @click="showDeleteModal = false">Отмена</SecondaryButton>
        </template>
      </Modal>
    </Teleport>
  </div>
</template>
