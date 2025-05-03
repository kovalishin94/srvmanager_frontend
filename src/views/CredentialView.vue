<script setup lang="ts">
import { ref, watch } from 'vue'
import Tabs from '@/components/UI/Tabs.vue'
import { useRoute, useRouter } from 'vue-router'

type CredentialType = 'ssh' | 'winrm'

const route = useRoute()
const router = useRouter()

const current = ref<CredentialType>((route.path.split('/').pop() as CredentialType) || 'ssh')

watch(current, (newValue: CredentialType) => {
  router.push(`/credentials/${newValue}`)
})
</script>

<template>
  <div class="flex flex-col gap-y-5">
    <Tabs
      class="mx-18"
      v-model="current"
      :tabs="[
        { label: 'Учетные записи SSH', value: 'ssh' },
        { label: 'Учетные записи WinRM', value: 'winrm' },
      ]"
    />
    <router-view />
  </div>
</template>
