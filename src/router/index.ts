import { createRouter, createWebHistory } from 'vue-router'
import HostsView from '@/views/HostsView.vue'
import LoginView from '@/views/LoginView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import ForbiddenView from '@/views/ForbiddenView.vue'
import { useUser } from '@/stores/user.ts'
import CredentialView from '@/views/CredentialView.vue'
import TheSSHCredentials from '@/components/TheSSHCredentials.vue'
import TheWinrmCredentials from '@/components/TheWinrmCredentials.vue'
import ExecuteCommandView from '@/views/Operations/ExecuteCommandView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      name: 'notfound',
      component: NotFoundView,
      meta: { requiresAuth: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'forbidden',
      component: ForbiddenView,
      meta: { requiresAuth: true },
    },
    {
      path: '/',
      redirect: '/hosts',
      name: 'home',
    },
    {
      path: '/hosts',
      name: 'hosts',
      component: HostsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/credentials',
      name: 'credentials',
      component: CredentialView,
      redirect: '/credentials/ssh',
      children: [
        { path: 'ssh', component: TheSSHCredentials, name: 'ssh-credentials' },
        { path: 'winrm', component: TheWinrmCredentials, name: 'winrm-credentials' },
      ],
      meta: { requiresAuth: true },
    },
    {
      path: '/ops/exec',
      name: 'execute-command',
      component: ExecuteCommandView,
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
  ],
})

router.beforeEach((to, _, next) => {
  const userStore = useUser()
  if (to.matched.some((record) => record.meta.requiresAuth) && !userStore.user.isAuthenticated) {
    next({ name: 'login' })
  } else if (to.name === 'login' && userStore.user.isAuthenticated) {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
