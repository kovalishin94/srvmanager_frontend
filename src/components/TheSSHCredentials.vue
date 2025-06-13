<script setup lang="ts">
import { ref } from 'vue'
import apiClient from '@/services/api.ts'
import DataTable from '@/components/DataTable.vue'
import type { SSHCredential, NewSSHCredential, ErrorSSHCredentials } from '@/types/Credential.ts'
import Modal from '@/components/Modal.vue'
import type { DataTableAction } from '@/types/DataTableAction.ts'
import InputField from '@/components/UI/InputField.vue'
import { AxiosError } from 'axios'
import FileInput from '@/components/UI/FileInput.vue'
import Toggle from '@/components/UI/Toggle.vue'
import { useItemsDefault } from '@/composables/items_default.ts'

const {
  items: credentials,
  current: currentCredential,
  newItem: newCredential,
  errors,
  showCreateModal,
  showDeleteModal,
  askDelete,
  deleteItem: deleteCredential,
  toastStore,
} = useItemsDefault<SSHCredential, NewSSHCredential, ErrorSSHCredentials>('/ssh-credential/', {
  username: '',
  password: '',
  passphrase: '',
  ssh_key: null,
  port: 22,
})

const actions = ref<DataTableAction[]>([
  { label: 'Создать', action: () => (showCreateModal.value = true) },
  { label: 'Удалить', action: askDelete },
])

const showAddSSHKey = ref<boolean>(false)

function makeFormData() {
  const formData = new FormData()
  formData.append('username', newCredential.value.username)
  formData.append('password', newCredential.value.password)
  formData.append('port', String(newCredential.value.port))
  if (newCredential.value.ssh_key) formData.append('ssh_key', newCredential.value.ssh_key)
  if (newCredential.value.passphrase && formData.has('ssh_key')) {
    formData.append('passphrase', newCredential.value.passphrase)
  }
  return formData
}

async function createCredential() {
  try {
    const formData = makeFormData()
    const { data } = await apiClient.post('/ssh-credential/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
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
</script>

<template>
  <DataTable class="px-6 py-2" :columns="['Id', 'Username', 'Port']" :rows="credentials" :actions>
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
      <template #title>Создать учетную запись SSH</template>
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
          <Toggle label="Добавить ssh ключ" v-model="showAddSSHKey" />
          <FileInput v-model="newCredential.ssh_key" label="SSH ключ" v-if="showAddSSHKey" />
          <InputField
            id="ssh-passphrase"
            v-model="newCredential.passphrase"
            type="password"
            placeholder="passphrase"
            v-if="showAddSSHKey"
          />
        </div>
      </template>
      <template #footer>
        <MainButton @click="createCredential">Сохранить</MainButton>
      </template>
    </Modal>
    <Modal v-model="showDeleteModal" :type="'delete'" size="max-w-md">
      <template #body>
        Вы действительно хотите удалить учетную запись
        <strong>"{{ currentCredential?.username }}"</strong> с id
        <strong>"{{ currentCredential?.id }}"?</strong>
      </template>
      <template #footer>
        <DangerButton @click="deleteCredential">Удалить</DangerButton>
        <SecondaryButton @click="showDeleteModal = false">Отмена</SecondaryButton>
      </template>
    </Modal>
  </Teleport>
</template>
