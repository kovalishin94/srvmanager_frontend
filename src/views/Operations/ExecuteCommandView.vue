<script setup lang="ts">
import { computed, onMounted, ref, provide } from 'vue'
import type { ExecuteCommand, ExecuteCommandNew } from '@/types/Ops.ts'
import apiClient from '@/services/api.ts'
import { usePickKey } from '@/composables/pick_key.ts'
import DataTable from '@/components/DataTable.vue'
import Badge from '@/components/UI/Badge.vue'
import Modal from '@/components/Modal.vue'
import type { Host } from '@/types/Host.ts'
import type { DataTableAction } from '@/types/DataTableAction.ts'
import SelectTable from '@/components/SelectTable.vue'
import TextareaField from '@/components/UI/TextareaField.vue'
import SelectField from '@/components/UI/SelectField.vue'
import Toggle from '@/components/UI/Toggle.vue'
import { AxiosError } from 'axios'
import { useOperationDefault } from '@/composables/operation_default.ts'

interface Errors {
  command?: string[]
}

const {
  operations: executeCommands,
  current: currentExecuteCommand,
  newOperation: newExecuteCommand,
  errors,
  showCreateModal,
  showDeleteModal,
  toastStore,
  pageSize,
  paginator,
  getOperations: getExecuteCommands,
  askDelete,
  deleteOperation: deleteExecuteCommand
} = useOperationDefault<ExecuteCommand, ExecuteCommandNew, Errors>(
  '/execute-command/', () => ({hosts: [], command: [], protocol: 'ssh', sudo: false}),
  'executeCommandPage'
)

const columns = ref<Record<string, keyof ExecuteCommand>>({
  'Id': 'id',
  'Автор': 'created_by',
  'Статус': 'status',
  'Создана': 'created_at',
  'Время последнего изменения': 'updated_at',
  'Протокол': 'protocol',
})
const actionList = ref<DataTableAction[]>([
  { label: 'Создать', action: () => (showCreateModal.value = true) },
  { label: 'Удалить', action: askDelete },
  { label: 'Лог', action: showLog },
  { label: 'Std', action: showStd },
])

const numberOfCommands = ref(1)
const showLogModal = ref<boolean>(false)
const showStdModal = ref<boolean>(false)
const stdError = ref<boolean>(false)
const hosts = ref<Host[]>([])
const toRepresentation = computed(() => {
  return executeCommands.value.map((item) => usePickKey(item, Object.values(columns.value)))
})
const actions = computed(() => {
  return executeCommands.value.length
    ? actionList.value
    : actionList.value.filter((el) => el.label === 'Создать')
})
const hostsOptions = computed(() => {
  if (newExecuteCommand.value.protocol === 'ssh') {
    return hosts.value
      .filter((el) => el.ssh_credentials.length > 0)
      .map(({ id, name, ip }) => ({ id, name, ip }))
  } else {
    return hosts.value
      .filter((el) => el.winrm_credentials.length > 0)
      .map(({ id, name, ip }) => ({ id, name, ip }))
  }
})

async function createExecuteCommand() {
  try {
    await apiClient.post('/execute-command/', newExecuteCommand.value)
    await getExecuteCommands()
    showCreateModal.value = false
    numberOfCommands.value = 1
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
  hosts.value = data
}

function showLog(id: number | string) {
  currentExecuteCommand.value = executeCommands.value.find((item) => item.id === id)
  showLogModal.value = true
}

function showStd(id: number | string) {
  currentExecuteCommand.value = executeCommands.value.find((item) => item.id === id)
  showStdModal.value = true
}

provide('paginator', paginator)
provide('paginatorFn', getExecuteCommands)


onMounted(() => {
  getHosts()
})

</script>

<template>
  <div>
    <DataTable
      class="px-6 py-2"
      :actions
      :columns="Object.keys(columns)"
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
          <Badge v-if="value === 'ssh'">SSH</Badge>
          <Badge v-if="value === 'winrm'" color="purple">WinRM</Badge>
        </td>
      </template>
    </DataTable>
    <Teleport to="body">
      <Modal v-model="showCreateModal" size="max-w-5xl">
        <template #title>Запустить новую команду</template>
        <template #body>
          <div class="flex flex-col gap-y-3 px-12">
            <h5 class="text-xl font-bold dark:text-white">Выберите хосты:</h5>
            <SelectTable
              :columns="['Id', 'Имя', 'Ip']"
              :rows="hostsOptions"
              v-model="newExecuteCommand.hosts"
            />
            <div class="flex flex-col" v-for="i in numberOfCommands" :key="i">
              <div class="flex gap-x-2 items-center">
                <TextareaField
                  v-model="newExecuteCommand.command[i - 1]"
                  placeholder="Введите исполняемую команду"
                />
                <DangerButton
                  @click="newExecuteCommand.command.splice(i - 1, 1); numberOfCommands--"
                  v-if="numberOfCommands > 1"
                  class="h-fit"
                  >Удалить</DangerButton
                >
              </div>
            </div>
            <SecondaryButton @click="numberOfCommands++">Добавить команду</SecondaryButton>
            <SelectField
              :options="[
                { label: 'SSH', value: 'ssh' },
                { label: 'WinRM', value: 'winrm' },
              ]"
              v-model="newExecuteCommand.protocol"
            />
            <Toggle v-model="newExecuteCommand.sudo" label="Sudo" />
          </div>
        </template>
        <template #footer>
          <MainButton @click="createExecuteCommand">Сохранить</MainButton>
        </template>
      </Modal>
      <Modal v-model="showLogModal">
        <template #title>
          Лог операции <strong>{{ currentExecuteCommand?.id }}</strong>
        </template>
        <template #body>
          <div class="p-4 max-h-[calc(100vh-20rem)] overflow-y-scroll">
            <ol class="relative border-s border-gray-200 dark:border-gray-800">
              <li class="ms-4" v-for="(log, timestamp) in currentExecuteCommand?.log">
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
      <Modal v-model="showStdModal">
        <template #title>
          Вывод операции <strong>{{ currentExecuteCommand?.id }}</strong>
        </template>
        <template #body>
          <ul
            class="flex flex-wrap text-sm font-medium text-center text-gray-500 dark:text-gray-400"
          >
            <li class="me-2">
              <button
                @click="stdError = false"
                class="inline-block px-4 py-3 rounded-lg"
                :class="[stdError
                  ? 'hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white cursor-pointer'
                  : 'text-white bg-blue-600 active'
                ]"
              >
                StdOut
              </button>
            </li>
            <li class="me-2">
              <button
                @click="stdError = true"
                class="inline-block px-4 py-3 rounded-lg"
                :class="[!stdError
                  ? 'hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white cursor-pointer'
                  : 'text-white bg-blue-600 active'
                ]"
              >
                StdErr
              </button>
            </li>
          </ul>
          <div class="p-4 max-h-[calc(100vh-20rem)] overflow-y-scroll">
            <ol class="relative border-s border-gray-200 dark:border-gray-800">
              <li class="ms-4" v-for="(std, timestamp) in (stdError ? currentExecuteCommand?.stderr : currentExecuteCommand?.stdout)">
                <div
                  class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-800"
                ></div>
                <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500"
                  >{{ timestamp }}
                </time>
                <pre class="text-base font-normal text-gray-500 dark:text-gray-400">
                  {{ std }}
                </pre>
              </li>
            </ol>
          </div>
        </template>
        <template #footer>
          <SecondaryButton @click="showStdModal = false">Закрыть</SecondaryButton>
        </template>
      </Modal>
      <Modal v-model="showDeleteModal" type="delete">
        <template #body>
          Вы действительно хотите удалить информацию об операции {{ currentExecuteCommand?.id }}
        </template>
        <template #footer>
          <DangerButton @click="deleteExecuteCommand">Удалить</DangerButton>
          <SecondaryButton @click="showDeleteModal = false">Отмена</SecondaryButton>
        </template>
      </Modal>
    </Teleport>
  </div>
</template>
