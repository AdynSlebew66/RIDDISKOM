import { createRouter, createWebHistory } from 'vue-router'
import PublicDashboard from '../components/Dashboard.vue'
import LoginView from '../components/LoginView.vue'
import UmkmView from '../components/UmkmView.vue'
import UmkmPublicView from '../components/UmkmPublicView.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: PublicDashboard
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/umkm', // Layanan UMKM Publik (Akses dari landing page)
    name: 'UmkmPublic',
    component: UmkmPublicView
  },
  {
    path: '/admin/umkm', // Route Admin UMKM setelah Login
    alias: '/umkm-dashboard', // Alias agar URL /umkm-dashboard tetap bisa diakses
    name: 'UmkmDashboard',
    component: UmkmView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router