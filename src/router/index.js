import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/HomePage.vue')
  },
  {
    path: '/character/create',
    name: 'CharacterCreate',
    component: () => import('@/pages/CharacterCreate.vue')
  },
  {
    path: '/character/:id',
    name: 'CharacterDetail',
    component: () => import('@/pages/CharacterDetail.vue')
  },
  {
    path: '/library',
    name: 'Library',
    component: () => import('@/pages/Library.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/pages/Dashboard.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
