<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue'
import apiClient from '@/services/api.ts'
import DataTable from '@/components/DataTable.vue'
import type { Host, ErrorHosts } from '@/types/Host.ts'
import Modal from '@/components/Modal.vue'
import MainButton from '@/components/UI/Buttons/MainButton.vue'
import InputField from '@/components/UI/InputField.vue'
import { AxiosError } from 'axios'
import type { DataTableAction } from '@/types/DataTableAction.ts'
import LinuxIcon from '@/components/UI/Icons/LinuxIcon.vue'
import WindowsIcon from '@/components/UI/Icons/WindowsIcon.vue'
import TransparentButton from '@/components/UI/Buttons/TransparentButton.vue'
import DangerButton from '@/components/UI/Buttons/DangerButton.vue'
import SecondaryButton from '@/components/UI/Buttons/SecondaryButton.vue'

const showCreateModal = ref(false)
const showDeleteModal = ref(false)
const currentHost = ref<Host | null>()
const columns = ref<Array<string>>(['Id', 'Имя', 'IP адрес', 'Операционная система'])
const hosts = ref<Array<Host>>([])
const newHost = ref<Omit<Host, 'id'>>({
  name: '',
  os: 'linux',
  ip: '',
})
const errors = ref<ErrorHosts>({})
const actions = ref<DataTableAction[]>([
  { label: 'Создать', action: () => (showCreateModal.value = true) },
  { label: 'Удалить', action: askDelete },
])

function askDelete(id: number | string) {
  currentHost.value = hosts.value.find((host) => host.id === id)
  showDeleteModal.value = true
}

async function deleteHost() {
  if (!currentHost.value) return
  const response = await apiClient.delete(`/host/${currentHost.value.id}/`)
  if (response.status === 204) {
    const idx = hosts.value.findIndex((host) => host.id === currentHost.value?.id)
    hosts.value.splice(idx, 1)
    showDeleteModal.value = false
    currentHost.value = null
  }
}

function clearCreateForm() {
  newHost.value.name = ''
  newHost.value.os = 'linux'
  newHost.value.ip = ''
}

async function getHosts() {
  const response = await apiClient.get('/host')
  hosts.value = response.data
}

async function createHost() {
  try {
    const response = await apiClient.post('/host/', newHost.value)
    hosts.value.push(response.data)
    showCreateModal.value = false
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
    clearCreateForm()
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
    <DataTable class="px-6 py-2" :columns :rows="hosts" :actions>
      <template #cell="{ col, value }">
        <td class="px-6 py-4">
          <strong v-if="col === 'id'">{{ value }}</strong>
          <span v-else-if="col === 'os'">
            <LinuxIcon v-if="value === 'linux'" />
            <WindowsIcon v-else />
          </span>
          <span v-else>{{ value }}</span>
        </td>
      </template>
    </DataTable>
    <!--  Modal: Создать хост   -->
    <Modal v-model="showCreateModal">
      <template #title> Создать новый хост </template>
      <template #body>
        <div class="flex flex-col gap-y-3 px-12">
          <InputField
            id="host-name"
            v-model="newHost.name"
            placeholder="Имя хоста"
            :errors="errors.name"
          />
          <InputField
            id="host-ip"
            v-model="newHost.ip"
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
    <Modal v-model="showDeleteModal" :type="'delete'">
      <template #body>
        Вы действительно хотите удалить хост <strong>"{{ currentHost?.name }}"?</strong>
      </template>
      <template #footer>
        <DangerButton @click="deleteHost">Удалить</DangerButton>
        <SecondaryButton @click="showDeleteModal=false">Отмена</SecondaryButton>
      </template>
    </Modal>
  </div>
</template>
