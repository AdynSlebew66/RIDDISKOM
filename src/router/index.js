import { createRouter, createWebHistory } from 'vue-router'
import PublicDashboard from '../components/Dashboard.vue'
import LoginView from '../components/LoginView.vue'
import UmkmView from '../components/UmkmView.vue'
import UmkmPublicView from '../components/UmkmPublicView.vue'
import DataUmkmView from '../components/DataUmkmView.vue'
import RasioUmkmView from '../components/RasioUmkmView.vue' // Import komponen Rasio

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
    path: '/umkm',
    name: 'UmkmPublic',
    component: UmkmPublicView
  },
  {
    path: '/admin/umkm',
    alias: '/umkm-dashboard',
    name: 'UmkmDashboard',
    component: UmkmView
  },
  {
    path: '/admin/data',
    name: 'AdminData',
    component: DataUmkmView
  },
  {
    path: '/admin/rasio',
    name: 'AdminRasio',
    component: RasioUmkmView // Route untuk Halaman Rasio
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router