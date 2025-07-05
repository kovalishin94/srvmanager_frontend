<script setup lang="ts">
import { computed, onMounted, provide, ref, watch } from 'vue'
import { useItemsDefault } from '@/composables/items_default.ts'
import apiClient from '@/services/api.ts'
import DataTable from '@/components/DataTable.vue'
import type { Host, NewHost, ErrorHosts } from '@/types/Host.ts'
import Modal from '@/components/Modal.vue'
import InputField from '@/components/UI/InputField.vue'
import { AxiosError } from 'axios'
import type { DataTableAction } from '@/types/DataTableAction.ts'
import type { SSHCredential, WinRMCredential } from '@/types/Credential.ts'
import SelectField from '@/components/UI/SelectField.vue'
import Popover from '@/components/UI/Popover.vue'


const columns: Record<keyof Host, string> = ({
  id: 'Id',
  name: 'Имя',
  ip: 'Ip адрес',
  os: 'Операционная система',
  ssh_credentials: 'Учетные записи SSH',
  winrm_credentials: 'Учетные записи Windows'
})
const {
  items: hosts,
  current: currentHost,
  newItem: newHost,
  errors,
  toRepresentation,
  toastStore,
  pageSize,
  paginator,
  showCreateModal,
  showDeleteModal,
  getItems: getHosts,
  askDelete,
  deleteItem: deleteHost,
} = useItemsDefault<Host, NewHost, ErrorHosts>('/host/', () => ({
  name: '',
  os: 'linux',
  ip: '',
  ssh_credentials: [],
  winrm_credentials: [],
}),
  'hostsPage',
  columns
)
const showEditModal = ref(false)

const actions = ref<DataTableAction[]>([
  { label: 'Создать', action: () => (showCreateModal.value = true) },
  { label: 'Удалить', action: askDelete },
  { label: 'Редактировать', action: askEdit },
])
const sshCredentials = ref<SSHCredential[]>([])
const winrmCredentials = ref<WinRMCredential[]>([])

function askEdit(id: number | string) {
  currentHost.value = hosts.value.find((host) => host.id === id)
  showEditModal.value = true
}

async function createHost() {
  if (newHost.value.ssh_credentials.includes('')) newHost.value.ssh_credentials = []
  if (newHost.value.winrm_credentials.includes('')) newHost.value.winrm_credentials = []
  if (newHost.value.os === 'linux') newHost.value.winrm_credentials = []
  try {
    await apiClient.post('/host/', newHost.value)
    await getHosts()
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
  if (currentHost.value.ssh_credentials.includes('')) currentHost.value.ssh_credentials = []
  if (currentHost.value.winrm_credentials.includes('')) currentHost.value.winrm_credentials = []
  if (currentHost.value.os === 'linux') currentHost.value.winrm_credentials = []
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

async function getSSHCredentials() {
  const { data } = await apiClient.get('/ssh-credential/?page_size=10000')
  sshCredentials.value = data.results
}

async function getWinRMCredentials() {
  const { data } = await apiClient.get('/winrm-credential/?page_size=10000')
  winrmCredentials.value = data.results
}

const sshOptions = computed(() => {
  return sshCredentials.value.map(({ id, username }) => ({ label: `${id}_${username}`, value: id }))
})

const winrmOptions = computed(() => {
  return winrmCredentials.value.map(({ id, username }) => ({
    label: `${id}_${username}`,
    value: id,
  }))
})

function findSSHCredential(id: number) {
  const credential = sshCredentials.value.find((el) => el.id === id)
  return credential ? `${credential.id}_${credential.username}` : ''
}

function findWinRMCredential(id: number) {
  const credential = winrmCredentials.value.find((el) => el.id === id)
  return credential ? `${credential.id}_${credential.username}` : ''
}

watch(showEditModal, (newValue: boolean) => {
  if (!newValue) {
    errors.value = {}
  }
})

onMounted(async () => {
  await getSSHCredentials()
  await getWinRMCredentials()
})

provide('paginator', paginator)
provide('paginatorFn', getHosts)
</script>

<template>
  <div>
    <!--  Таблица с данными   -->
    <DataTable
      class="px-6 py-2"
      :columns="Object.values(columns)"
      :rows="toRepresentation"
      :actions="hosts.length ? actions : actions.filter((el) => el.label === 'Создать')"
      v-model:page-size="pageSize"
    >
      <template #cell="{ col, value }">
        <td class="px-6 py-4" colspan="2" v-if="col === 'ssh_credentials'">
          <Popover v-if="value.length">
            <template #object><SecretIcon /></template>
            <template #title>SSH</template>
            <template #body>{{ findSSHCredential(value[0]) }}</template>
          </Popover>
        </td>
        <td class="px-6 py-4" colspan="2" v-else-if="col === 'winrm_credentials'">
          <Popover v-if="value.length">
            <template #object><SecretIcon /></template>
            <template #title>WinRM</template>
            <template #body>{{ findWinRMCredential(value[0]) }}</template>
          </Popover>
        </td>
        <td v-else class="px-6 py-4" colspan="2">
          <strong v-if="col === 'id'">{{ value }}</strong>
          <div class="inline-flex justify-center" v-else-if="col === 'os'">
            <LinuxIcon v-if="value === 'linux'" />
            <WindowsIcon v-else />
          </div>
          <span v-else>{{ value }}</span>
        </td>
      </template>
    </DataTable>
    <Teleport to="body">
      <!--  Modal: Создать хост   -->
      <Modal v-model="showCreateModal">
        <template #title>Создать новый хост</template>
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
            <SelectField
              :options="sshOptions"
              v-model.number="newHost.ssh_credentials[0]"
              placeholder="Учетная запись SSH не выбрана"
            />
            <SelectField
              v-if="newHost.os === 'windows'"
              :options="winrmOptions"
              v-model.number="newHost.winrm_credentials[0]"
              placeholder="Учетная запись WinRM не выбрана"
            />
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
            <SelectField
              :options="sshOptions"
              v-model.number="currentHost.ssh_credentials[0]"
              placeholder="Учетная запись SSH не выбрана"
            />
            <SelectField
              v-if="currentHost.os === 'windows'"
              :options="winrmOptions"
              v-model.number="currentHost.winrm_credentials[0]"
              placeholder="Учетная запись WinRM не выбрана"
            />
          </div>
        </template>
        <template #footer>
          <MainButton @click="updateHost">Сохранить</MainButton>
        </template>
      </Modal>
      <!--  Modal: Удалить хост  -->
      <Modal v-model="showDeleteModal" :type="'delete'" size="max-w-md">
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
