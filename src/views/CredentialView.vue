<script setup lang="ts">
import { type Component, markRaw, ref } from 'vue'
import TheSSHCredentials from '@/components/TheSSHCredentials.vue'
import TheWinrmCredentials from '@/components/TheWinrmCredentials.vue'
import Tabs from '@/components/UI/Tabs.vue'

type CredentialType = 'ssh' | 'winrm'

const currentCredentialType = ref<CredentialType>('ssh')
const credentialTabs = markRaw<Record<CredentialType, Component>>({
  ssh: TheSSHCredentials,
  winrm: TheWinrmCredentials,
})

</script>

<template>
  <div class="flex flex-col gap-y-5">
    <Tabs
      class="mx-20"
      v-model="currentCredentialType"
      :tabs="[
      { label: 'Учетные записи SSH', value: 'ssh' },
      { label: 'Учетные записи WinRM', value: 'winrm' },
    ]"
    />
    <component :is="credentialTabs[currentCredentialType]" />
  </div>
</template>
