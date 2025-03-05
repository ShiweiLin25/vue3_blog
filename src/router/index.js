import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/post',
    name: 'post',
    component: () => import('../views/PostView.vue')
  }
]

const router = createRouter({
  // 改成 Hash 模式
  history: createWebHashHistory(),
  routes
})

export default router