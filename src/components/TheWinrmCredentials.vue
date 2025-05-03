<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue'
import { useToast } from '@/stores/toast.ts'
import type { DataTableAction } from '@/types/DataTableAction.ts'
import type { ErrorWinRMCredentials, NewWinRMCredential, WinRMCredential } from '@/types/Credential.ts'
import apiClient from '@/services/api.ts'
import { AxiosError } from 'axios'
import DataTable from '@/components/DataTable.vue'
import InputField from '@/components/UI/InputField.vue'
import Modal from '@/components/Modal.vue'
import Toggle from '@/components/UI/Toggle.vue'

const toastStore = useToast()
const actions = ref<DataTableAction[]>([
  { label: 'Создать', action: () => (showCreateModal.value = true) },
  { label: 'Удалить', action: askDelete },
])
const credentials = ref<Array<WinRMCredential>>([])
const showCreateModal = ref(false)
const showDeleteModal = ref(false)
const newCredential = ref<NewWinRMCredential>({
  username: '',
  password: '',
  port: 5985,
  ssl: false,
})
const errors = ref<ErrorWinRMCredentials>({})
const currentCredential = ref<WinRMCredential | undefined>()

function askDelete(id: number | string) {
  currentCredential.value = credentials.value.find((credential) => credential.id === id)
  showDeleteModal.value = true
}

async function getCredentials() {
  const { data } = await apiClient.get('/winrm-credential/')
  credentials.value = data
}

async function createCredential() {
  try {
    const { data } = await apiClient.post('/winrm-credential/', newCredential.value)
    credentials.value.push(data)
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

async function deleteCredential() {
  if (!currentCredential.value) return
  const { status } = await apiClient.delete(`/winrm-credential/${currentCredential.value.id}/`)
  if (status === 204) {
    const idx = credentials.value.findIndex((credential) => credential.id === currentCredential.value?.id)
    credentials.value.splice(idx, 1)
    showDeleteModal.value = false
    currentCredential.value = undefined
    toastStore.defaultSuccess()
  }
}

onMounted(() => {
  getCredentials()
})

watchEffect(() => {
  if (!showCreateModal.value) {
    newCredential.value = {
      username: '',
      password: '',
      port: 5985,
      ssl: false,
    }
    errors.value = {}
  }
})

</script>

<template>
  <DataTable class="px-6 py-2" :columns="['Id', 'Username', 'Port', 'SSL']" :rows="credentials" :actions>
    <template #cell="{ col, value }">
      <div class="hidden" v-if="col === 'host'"></div>
      <td class="px-6 py-4" colspan="2" v-else>
        <strong v-if="col === 'id'">{{ value }}</strong>
        <span v-else>{{ value }}</span>
      </td>
    </template>
  </DataTable>
  <Teleport to="body">
    <Modal v-model="showCreateModal" size="max-w-2xl">
      <template #title>Создать учетную запись WinRM</template>
      <template #body>
        <div class="flex flex-col gap-y-3 px-12">
          <InputField
            id="ssh-username"
            v-model="newCredential.username"
            placeholder="username"
            :errors="errors.username"
          />
          <InputField
            id="ssh-password"
            type="password"
            v-model="newCredential.password"
            placeholder="password"
            :errors="errors.password"
          />
          <InputField id="ssh-port" type="number" v-model="newCredential.port" placeholder="port" />
          <Toggle label="SSL" v-model="newCredential.ssl" />
        </div>
      </template>
      <template #footer>
        <MainButton @click="createCredential">Сохранить</MainButton>
      </template>
    </Modal>
    <Modal v-model="showDeleteModal" :type="'delete'" size="max-w-md">
      <template #body>
        Вы действительно хотите удалить учетную запись <strong>"{{ currentCredential?.username }}"</strong> с id <strong>"{{ currentCredential?.id }}"?</strong>
      </template>
      <template #footer>
        <DangerButton @click="deleteCredential">Удалить</DangerButton>
        <SecondaryButton @click="showDeleteModal = false">Отмена</SecondaryButton>
      </template>
    </Modal>
  </Teleport>
</template>