import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import LayoutMain from '../components/LayoutMain.vue'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: LayoutMain,
    redirect: '/screenshot',
    children: [
      {
        path: '/screenshot',
        component: () => import('../views/Screenshot.vue')
      },
      {
        path: '/record',
        component: () => import('../views/Record.vue')
      },
      {
        path: '/setting',
        component: () => import('../views/Setting.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(''),
  routes
})

export default router