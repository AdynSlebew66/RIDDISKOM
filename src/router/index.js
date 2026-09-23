import { createRouter, createWebHistory } from 'vue-router'
import PublicDashboard from '../components/Dashboard.vue'
import LoginView from '../components/LoginView.vue'
import UmkmView from '../components/UmkmView.vue'
import UmkmPublicView from '../components/UmkmPublicView.vue'
import DataUmkmView from '../components/DataUmkmView.vue'
import RasioUmkmView from '../components/RasioUmkmView.vue'
import KegiatanView from '../components/KegiatanView.vue'
import LayananUmkmView from '../components/LayananUmkmView.vue'
import GaleriView from '../components/GaleriView.vue' // 1. Import komponen Galeri
import JadwalView from '../components/JadwalView.vue'
import JadwalAdminView from '../components/JadwalAdminView.vue'
import PegawaiAdminView from '../components/PegawaiAdminView.vue'
import StrukturOrganisasiView from '../components/profil/StrukturOrganisasiView.vue'
import VisiMisiView from '../components/profil/VisiMisiView.vue'
import MottoPelayananView from '../components/profil/MottoPelayananView.vue'
import TataNilaiPelayananView from '../components/profil/TataNilaiPelayananView.vue'
import TataTertibPegawaiView from '../components/profil/TataTertibPegawaiView.vue'
import KodeEtikPegawaiView from '../components/profil/KodeEtikPegawaiView.vue'
import ProfilPlaceholderView from '../components/profil/ProfilPlaceholderView.vue'
import SekretariatView from '../components/SekretariatView.vue'
import P3tkPublicView from '../components/P3tkPublicView.vue'
import PencakerAdminView from '../components/PencakerAdminView.vue'

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
    path: '/layanan',
    name: 'LayananUmkm',
    component: LayananUmkmView
  },
  {
    path: '/galeri',
    name: 'Galeri',
    component: GaleriView // 2. Route menu Galeri
  },
  {
    path: '/jadwal',
    name: 'Jadwal',
    component: JadwalView
  },
  {
    path: '/sekretariat',
    name: 'Sekretariat',
    component: SekretariatView
  },
  {
    path: '/p3tk',
    alias: '/blk',
    name: 'P3tkPublic',
    component: P3tkPublicView
  },
  {
    path: '/profil/visi-misi',
    name: 'VisiMisi',
    component: VisiMisiView
  },
  {
    path: '/profil/motto-pelayanan',
    name: 'MottoPelayanan',
    component: MottoPelayananView
  },
  {
    path: '/profil/tata-nilai-pelayanan',
    name: 'TataNilaiPelayanan',
    component: TataNilaiPelayananView
  },
  {
    path: '/profil/tata-tertib-pegawai',
    name: 'TataTertibPegawai',
    component: TataTertibPegawaiView
  },
  {
    path: '/profil/kode-etik-pegawai',
    name: 'KodeEtikPegawai',
    component: KodeEtikPegawaiView
  },
  {
    path: '/profil/struktur-organisasi',
    name: 'StrukturOrganisasi',
    component: StrukturOrganisasiView
  },
  {
    path: '/profil/:slug',
    name: 'ProfilPlaceholder',
    component: ProfilPlaceholderView
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
    component: RasioUmkmView
  },
  {
    path: '/admin/kegiatan',
    name: 'AdminKegiatan',
    component: KegiatanView
  },
  {
    path: '/admin/jadwal',
    name: 'AdminJadwal',
    component: JadwalAdminView
  },
  {
    path: '/admin/pegawai',
    name: 'AdminPegawai',
    component: PegawaiAdminView
  },
  {
    path: '/admin/pencaker',
    name: 'AdminPencaker',
    component: PencakerAdminView
  },
  // Alias lama / halaman setelah login — arahkan ke dashboard admin UMKM
  // Sebelumnya '/dashboard' tidak terdaftar sehingga halaman blank putih.
  {
    path: '/dashboard',
    redirect: '/admin/umkm'
  },
  // Fallback agar route tidak dikenal tidak blank putih, kembali ke beranda
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router