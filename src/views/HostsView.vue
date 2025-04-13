<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { AxiosError } from 'axios'
import apiClient from '@/services/api.ts'
import { useUser } from '@/stores/user.ts'
import DataTable from '@/components/DataTable.vue'
import { useToast } from '@/stores/toast.ts'

const userStore = useUser()
const toastStore = useToast()
const router = useRouter()

const columns = ref<Array<String>>([
  'Id',
  'Имя',
  'IP адрес',
  'Операционная система',
])
const hosts = ref<Array<Object>>([])

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
          await router.push({name: 'forbidden'})
          break
        case undefined:
          await router.push({name: 'forbidden'})
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
  <DataTable class="p-6" :columns @create="console.log('create')"/>
</template>
