import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/DashboardHome.vue'),
      meta: { title: '🏠 Home' }
    },
    {
      path: '/health',
      name: 'health',
      component: () => import('../views/DashboardHealth.vue'),
      meta: { title: '🏥 Health' }
    },
    {
      path: '/robot',
      name: 'robot',
      component: () => import('../views/DashboardRobot.vue'),
      meta: { title: '🤖 Robot' }
    },
    {
      path: '/system',
      name: 'system',
      component: () => import('../views/DashboardSystem.vue'),
      meta: { title: '💻 System' }
    },
    {
      path: '/tools',
      name: 'tools',
      component: () => import('../views/DashboardTools.vue'),
      meta: { title: '⚡ Tools' }
    }
  ]
})

export default router

