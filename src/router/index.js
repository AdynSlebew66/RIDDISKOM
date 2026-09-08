import { createRouter, createWebHistory } from 'vue-router'
import PublicDashboard from '../components/Dashboard.vue'
import LoginView from '../components/LoginView.vue'
import UmkmView from '../components/UmkmView.vue'
import UmkmPublicView from '../components/UmkmPublicView.vue' // Import komponen Publik UMKM

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
    path: '/umkm', // Route Halaman Publik UMKM (saat diklik dari Dashboard)
    name: 'UmkmPublic',
    component: UmkmPublicView
  },
  {
    path: '/umkm-dashboard', // Route Khusus setelah Login UMKM
    name: 'UmkmDashboard',
    component: UmkmView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router