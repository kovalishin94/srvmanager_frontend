<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue'
import apiClient from '@/services/api.ts'
import DataTable from '@/components/DataTable.vue'
import type { Host, ErrorHosts } from '@/types/Host.ts'
import Modal from '@/components/Modal.vue'
import MainButton from '@/components/UI/MainButton.vue'
import InputField from '@/components/UI/InputField.vue'
import SelectField from '@/components/UI/SelectField.vue'
import { AxiosError } from 'axios'

const osTypes = ref([
  { value: 'linux', label: 'Linux' },
  { value: 'windows', label: 'Windows' },
])
const showCreateHostModal = ref(false)
const columns = ref<Array<string>>(['Id', 'Имя', 'IP адрес', 'Операционная система'])
const hosts = ref<Array<Host>>([])
const newHost = ref<Omit<Host, 'id'>>({
  name: '',
  os: 'linux',
  ip: '',
})
const errors = ref<ErrorHosts>({})

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
    showCreateHostModal.value = false
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.status === 400) {
        errors.value = error.response?.data
      }
    }
  }
}

watchEffect(() => {
  if (!showCreateHostModal.value) {
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
    <MainButton class="mx-6" @click="showCreateHostModal = true"
      >Добавить</MainButton
    >
    <DataTable class="px-6 py-2" :columns :rows="hosts" />
    <Modal v-model="showCreateHostModal">
      <template #title> Создать новый хост </template>
      <template #body>
        <div class="flex flex-col gap-y-3 px-12">
          <InputField id="host-name" v-model="newHost.name" placeholder="Имя хоста" :errors="errors.name"/>
          <SelectField id="host-os" :options="osTypes" v-model="newHost.os" />
          <InputField id="host-ip" v-model="newHost.ip" placeholder="IP адрес" :errors="errors.ip"/>
        </div>
      </template>
      <template #footer>
        <MainButton @click="createHost">Сохранить</MainButton>
      </template>
    </Modal>
  </div>
</template>
