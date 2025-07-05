<script setup lang="ts">
import NavbarMenuButton from '@/components/Navbar/NavbarMenuButton.vue'
import NavbarDropdownMenuButton from '@/components/Navbar/NavbarDropdownMenuButton.vue'
import { useUser } from '@/stores/user.ts'
import OperationsIcon from '@/components/UI/Icons/OperationsIcon.vue'

const userStore = useUser()
const { modelValue } = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [ value: boolean]
}>()

function close() {
  emit('update:modelValue', false)
}
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-300"
    enter-from-class="-translate-x-80"
    enter-to-class="translate-x-0"
    leave-active-class="transition-all duration-300"
    leave-from-class="translate-x-0"
    leave-to-class="-translate-x-80"
  >
    <div
      v-show="modelValue"
      v-click-outside="close"
      class="fixed top-0 left-0 z-40 w-64 h-screen p-4 overflow-y-auto bg-white dark:bg-gray-800"
    >
      <h5 class="text-base font-semibold text-gray-500 uppercase dark:text-gray-400">Меню</h5>
      <button
        @click="close"
        type="button"
        class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 end-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
      >
        <CloseIcon />
        <span class="sr-only">Close menu</span>
      </button>
      <div class="py-4 overflow-y-auto">
        <ul class="space-y-2 font-medium">
          <NavbarMenuButton name="Хосты" is_link link="hosts" @click="close">
            <HostIcon />
          </NavbarMenuButton>
          <NavbarMenuButton name="Учетные записи" is_link link="credentials" @click="close">
            <FingerprintIcon />
          </NavbarMenuButton>
          <NavbarDropdownMenuButton label="Эталон" :icon="OperationsIcon" @button-click="close">
            <template #menu-items>
              <NavbarMenuButton name="Площадки Эталона" is_link link="etalon-instances" />
              <NavbarMenuButton name="Файлы обновления" is_link link="update-file" />
              <NavbarMenuButton name="Установки обновления" is_link link="etalon-update" />
            </template>
          </NavbarDropdownMenuButton>
          <NavbarDropdownMenuButton label="Операции" :icon="OperationsIcon" @button-click="close">
            <template #menu-items>
              <NavbarMenuButton name="ExecuteCommand" is_link link="execute-command" />
              <NavbarMenuButton name="SendFile" is_link link="send-file" />
            </template>>
          </NavbarDropdownMenuButton>
          <NavbarMenuButton @click="userStore.removeUserData(); close()" name="Выход">
            <ExitIcon />
          </NavbarMenuButton>
        </ul>
      </div>
    </div>
  </Transition>
</template>
