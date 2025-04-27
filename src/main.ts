import './main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import icons from '@/components/UI/Icons/icons.ts'
import buttons from '@/components/UI/Buttons/buttons.ts'


const app = createApp(App)
app.use(createPinia())
app.use(router)
Object.entries(icons).forEach(el => app.component(...el))
Object.entries(buttons).forEach(el => app.component(...el))

app.mount('#app')
