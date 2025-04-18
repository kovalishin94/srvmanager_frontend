<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { AxiosError } from 'axios'
import apiClient from '@/services/api.ts'
import { useUser } from '@/stores/user.ts'
import DataTable from '@/components/DataTable.vue'
import { useToast } from '@/stores/toast.ts'
import type { Host } from '@/types/HostType.ts'
import Modal from '@/components/Modal.vue'
import MainButton from '@/components/UI/MainButton.vue'
import InputField from '@/components/UI/InputField.vue'
import SelectField from '@/components/UI/SelectField.vue'

const userStore = useUser()
const toastStore = useToast()
const router = useRouter()
const osTypes = ref([
  { value: 'linux', label: 'Linux' },
  { value: 'windows', label: 'Windows' },
])

const columns = ref<Array<string>>(['Id', 'Имя', 'IP адрес', 'Операционная система'])
const hosts = ref<Array<Host>>([])
const newHost = ref<Omit<Host, 'id'>>({
  name: '',
  os: 'linux',
  ip: '',
})

async function getHosts() {
  try {
    const response = await apiClient.get('/host')
    hosts.value = response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      switch (error.status) {
        case 401:
          await userStore.refreshToken(getHosts)
          break
        case 403:
          await router.push({ name: 'forbidden' })
          break
        case undefined:
          await router.push({ name: 'forbidden' })
          toastStore.addToast('Нет связи с сервером', 'danger')
          console.error(error)
          break
      }
    }
  }
}

async function createHost() {
  try {
    const response = await apiClient.post('/create/host', newHost.value)
    console.log(response.data)
  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  getHosts()
})
</script>

<template>
  <div>
    <MainButton class="mx-6" data-modal-target="createHost" data-modal-toggle="createHost"
      >Добавить</MainButton
    >
    <DataTable class="px-6 py-2" :columns :rows="hosts" />
    <Modal id="createHost">
      <template #title> Создать новый хост </template>
      <template #body>
        <div class="flex flex-col gap-y-3 px-12">
          <InputField id="host-name" v-model="newHost.name" placeholder="Имя хоста" />
          <SelectField id="host-os" :options="osTypes" v-model="newHost.os" />
          <InputField id="host-ip" v-model="newHost.ip" placeholder="IP адрес" />
        </div>
      </template>
      <template #footer>
        <MainButton @click="createHost">Сохранить</MainButton>
      </template>
    </Modal>
  </div>
</template>
