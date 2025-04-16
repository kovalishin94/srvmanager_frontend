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

const userStore = useUser()
const toastStore = useToast()
const router = useRouter()

const columns = ref<Array<string>>(['Id', 'Имя', 'IP адрес', 'Операционная система'])
const hosts = ref<Array<Host>>([])

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

onMounted(() => {
  getHosts()
})
</script>

<template>
  <MainButton class="mx-6 my-2" data-modal-target="createHost" data-modal-toggle="createHost"
    >Создать</MainButton
  >
  <DataTable class="px-6 py-2" :columns :rows="hosts" />
  <Modal id="createHost"></Modal>
</template>
