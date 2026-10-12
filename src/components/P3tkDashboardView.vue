<template>
  <AdminLayout group="p3tk" title="Dashboard">
    <main class="admin-content">
      <!-- Header & Alert Toast -->
      <div class="content-header">
        <div class="welcome-text">
          <h2>Selamat Datang di, Dashboard Admin P3TK</h2>
          <p>Selamat Bekerja</p>
        </div>

        <!-- Success Alert Badge -->
        <transition name="fade">
          <div v-if="showSuccessAlert" class="login-alert">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            <span>Berhasil Login</span>
          </div>
        </transition>
      </div>

      <!-- Main Dashboard Card -->
      <div class="dashboard-card">
        <!-- Navigation Tabs -->
        <div class="card-tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            :class="['tab-btn', { active: activeTab === tab.id }]"
            @click="changeTab(tab.id)"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Search -->
        <div v-if="activeTabMeta.searchable" class="action-bar">
          <div class="search-box">
            <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input
              type="text"
              v-model="searchQuery"
              @input="handleSearch"
              :placeholder="activeTabMeta.searchPlaceholder"
            />
          </div>
        </div>

        <!-- Error Alert -->
        <div v-if="errorMessage" class="error-alert">
          {{ errorMessage }}
        </div>

        <!-- ===== TAB: Pencari Kerja ===== -->
        <div v-if="activeTab === 'pencaker'">
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th class="text-center" style="width: 50px;">No</th>
                  <th>Nama</th>
                  <th>Tempat Lahir</th>
                  <th>Tanggal Lahir</th>
                  <th class="text-center">JK</th>
                  <th>Agama</th>
                  <th>Alamat</th>
                  <th>Status</th>
                  <th>No Telepon</th>
                  <th>Pendidikan</th>
                  <th>Jurusan</th>
                  <th>Tahun Lulus</th>
                  <th class="text-center" style="width: 70px;">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="loading">
                  <td colspan="13" class="text-center py-5">
                    <div class="spinner"></div>
                    <p class="loading-text">Memuat data pencari kerja...</p>
                  </td>
                </tr>
                <tr v-else-if="pencakerList.length === 0">
                  <td colspan="13" class="text-center py-5 empty-text">
                    Data pencari kerja tidak ditemukan.
                  </td>
                </tr>
                <tr v-else v-for="(item, index) in pencakerList" :key="item.id || index">
                  <td class="text-center font-bold">{{ index + 1 }}</td>
                  <td class="font-bold">{{ formatText(item?.nama) }}</td>
                  <td>{{ formatText(item?.tempat_lahir) }}</td>
                  <td>{{ formatDate(item?.tanggal_lahir) }}</td>
                  <td class="text-center">{{ formatJenisKelamin(item?.jenis_kelamin) }}</td>
                  <td>{{ resolveAgama(item?.agama_id) }}</td>
                  <td class="td-alamat" :title="item?.alamat">{{ formatText(item?.alamat) }}</td>
                  <td>{{ resolveStatusPerkawinan(item?.status_perkawinan_id) }}</td>
                  <td>{{ formatText(item?.telepon) }}</td>
                  <td>{{ formatPendidikan(item) }}</td>
                  <td>{{ formatText(item?.jurusan) }}</td>
                  <td class="text-center">{{ item?.tahun_lulus ?? '-' }}</td>
                  <td class="text-center">
                    <button class="btn-icon btn-info" title="Lihat di Data Pencari Kerja" @click="navTo('/admin/pencaker')">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="card-footer-bar">
            <span class="total-info">Total: {{ pencakerTotal }} Data</span>
            <button class="btn-more" @click="navTo('/admin/pencaker')">Lihat Semua Data &raquo;</button>
          </div>
        </div>

        <!-- ===== TAB: PMI ===== -->
        <div v-else-if="activeTab === 'pmi'">
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th class="text-center" style="width: 50px;">No</th>
                  <th>Nama</th>
                  <th class="text-center">JK</th>
                  <th>Negara Tujuan</th>
                  <th>Jabatan</th>
                  <th>Sektor</th>
                  <th>Status</th>
                  <th class="text-center" style="width: 70px;">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="loading">
                  <td colspan="8" class="text-center py-5">
                    <div class="spinner"></div>
                    <p class="loading-text">Memuat data PMI...</p>
                  </td>
                </tr>
                <tr v-else-if="pmiList.length === 0">
                  <td colspan="8" class="text-center py-5 empty-text">
                    Data PMI tidak ditemukan.
                  </td>
                </tr>
                <tr v-else v-for="(item, index) in pmiList" :key="item.id || index">
                  <td class="text-center font-bold">{{ index + 1 }}</td>
                  <td class="font-bold">{{ formatText(item?.nama) }}</td>
                  <td class="text-center">{{ formatJenisKelamin(item?.jenis_kelamin) }}</td>
                  <td>{{ resolveNegara(item) }}</td>
                  <td class="td-alamat" :title="item?.jabatan">{{ formatText(item?.jabatan) }}</td>
                  <td>{{ resolveSektor(item) }}</td>
                  <td>{{ formatText(item?.status) }}</td>
                  <td class="text-center">
                    <button class="btn-icon btn-info" title="Lihat di Data PMI" @click="navTo('/admin/pmi')">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="card-footer-bar">
            <span class="total-info">Total: {{ pmiTotal }} Data</span>
            <button class="btn-more" @click="navTo('/admin/pmi')">Lihat Semua Data &raquo;</button>
          </div>
        </div>

        <!-- ===== TAB: BKK ===== -->
        <div v-else-if="activeTab === 'bkk'">
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th class="text-center" style="width: 50px;">No</th>
                  <th>Kategori</th>
                  <th>Nama Sekolah / Perguruan Tinggi</th>
                  <th>Surat Tanda Daftar</th>
                  <th>Tanggal</th>
                  <th>Keterangan</th>
                  <th class="text-center" style="width: 70px;">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="loading">
                  <td colspan="7" class="text-center py-5">
                    <div class="spinner"></div>
                    <p class="loading-text">Memuat data BKK...</p>
                  </td>
                </tr>
                <tr v-else-if="bkkList.length === 0">
                  <td colspan="7" class="text-center py-5 empty-text">
                    Data BKK tidak ditemukan.
                  </td>
                </tr>
                <tr v-else v-for="(item, index) in bkkList" :key="item.id || index">
                  <td class="text-center font-bold">{{ index + 1 }}</td>
                  <td>{{ formatKategori(item?.kategori) }}</td>
                  <td class="font-bold">{{ formatText(item?.nama) }}</td>
                  <td class="td-alamat" :title="item?.surat_tanda_daftar">{{ formatText(item?.surat_tanda_daftar) }}</td>
                  <td>{{ formatDate(item?.tanggal) }}</td>
                  <td>{{ formatText(item?.ket) }}</td>
                  <td class="text-center">
                    <button class="btn-icon btn-info" title="Lihat di Data BKK" @click="navTo('/admin/bkk')">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="card-footer-bar">
            <span class="total-info">Total: {{ bkkTotal }} Data</span>
            <button class="btn-more" @click="navTo('/admin/bkk')">Lihat Semua Data &raquo;</button>
          </div>
        </div>

        <!-- ===== TAB: Segera hadir ===== -->
        <div v-else class="empty-state">
          Data {{ activeTabMeta.label }} segera hadir. Halaman ini masih dalam tahap pengembangan.
        </div>
      </div>
    </main>
  </AdminLayout>
</template>

<script>
import AdminLayout from './AdminLayout.vue'

const API_PENCAKER = 'https://harvest-protegee-symptom.ngrok-free.dev/api/admin/pencaker'
const API_PMI = 'https://harvest-protegee-symptom.ngrok-free.dev/api/admin/pekerja-migran'
const API_BKK = 'https://harvest-protegee-symptom.ngrok-free.dev/api/admin/bkk'

const STATUS_PERKAWINAN_OPTIONS = [
  { id: 1, nama: 'Belum Kawin' },
  { id: 2, nama: 'Kawin' },
  { id: 3, nama: 'Janda' },
  { id: 4, nama: 'Duda' }
]

const AGAMA_OPTIONS = [
  { id: 1, nama: 'Islam' },
  { id: 2, nama: 'Kristen' },
  { id: 3, nama: 'Katolik' },
  { id: 4, nama: 'Hindu' },
  { id: 5, nama: 'Buddha' },
  { id: 6, nama: 'Konghucu' }
]

const PREVIEW_LIMIT = 6

export default {
  name: 'P3tkDashboardView',
  components: { AdminLayout },
  data() {
    return {
      showSuccessAlert: false,
      activeTab: 'pencaker',
      tabs: [
        { id: 'pencaker', label: 'Pencari Kerja', searchable: true, searchPlaceholder: 'Cari Nama, Tahun, ...' },
        { id: 'pmi', label: 'Pekerja Migran Indonesia', searchable: true, searchPlaceholder: 'Cari Nama, Negara, ...' },
        { id: 'bkk', label: 'Bursa Kerja Khusus', searchable: true, searchPlaceholder: 'Cari Nama, Surat, ...' },
        { id: 'lpk', label: 'Lembaga Pelatihan Kerja', searchable: false },
        { id: 'ditempatkan', label: 'Pencari Kerja Ditempatkan', searchable: false },
        { id: 'perluasan', label: 'Pelatihan Perluasan Kesempatan Kerja', searchable: false }
      ],
      searchQuery: '',
      searchTimer: null,
      loading: false,
      errorMessage: '',
      pencakerList: [],
      pencakerTotal: 0,
      pmiList: [],
      pmiTotal: 0,
      bkkList: [],
      bkkTotal: 0,
      fetchedTabs: {},
      statusPerkawinanOptions: STATUS_PERKAWINAN_OPTIONS,
      agamaOptions: AGAMA_OPTIONS
    }
  },
  computed: {
    activeTabMeta() {
      return this.tabs.find((t) => t.id === this.activeTab) || this.tabs[0]
    }
  },
  mounted() {
    // Alert login hanya sekali per sesi (mengikuti Dashboard UMKM)
    const hasShownAlert = sessionStorage.getItem('has_shown_login_alert')
    if (!hasShownAlert) {
      this.showSuccessAlert = true
      sessionStorage.setItem('has_shown_login_alert', 'true')

      setTimeout(() => {
        this.showSuccessAlert = false
      }, 4000)
    }
    this.fetchPreview(this.activeTab)
  },
  methods: {
    getAuthToken() {
      let token = localStorage.getItem('access_token') || localStorage.getItem('token')
      if (!token) {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser)
            token = parsed.token || parsed.access_token
          } catch (e) {
            console.error('Error parsing token:', e)
          }
        }
      }
      return token || ''
    },
    buildHeaders() {
      const headers = {
        Accept: 'application/json',
        'ngrok-skip-browser-warning': '69420'
      }
      const token = this.getAuthToken()
      if (token) headers.Authorization = `Bearer ${token}`
      return headers
    },
    navTo(path) {
      this.$router.push(path)
    },
    changeTab(tabId) {
      this.activeTab = tabId
      this.searchQuery = ''
      this.errorMessage = ''
      this.fetchPreview(tabId)
    },
    handleSearch() {
      clearTimeout(this.searchTimer)
      this.searchTimer = setTimeout(() => {
        this.fetchedTabs[this.activeTab] = false
        this.fetchPreview(this.activeTab)
      }, 500)
    },
    async fetchPreview(tabId) {
      const endpoints = {
        pencaker: API_PENCAKER,
        pmi: API_PMI,
        bkk: API_BKK
      }
      const base = endpoints[tabId]
      if (!base) return
      if (this.fetchedTabs[tabId] && !(this.searchQuery || '').trim()) return
      this.loading = true
      this.errorMessage = ''
      try {
        const params = new URLSearchParams({
          page: 1,
          per_page: PREVIEW_LIMIT
        })
        const q = (this.searchQuery || '').trim()
        if (q) params.append('search', q)
        const response = await fetch(`${base}?${params.toString()}`, {
          method: 'GET',
          headers: this.buildHeaders()
        })
        if (response.status === 401) {
          this.$router.push('/login')
          return
        }
        if (!response.ok) {
          throw new Error(`Gagal mengambil data. Status: ${response.status}`)
        }
        const result = await response.json()
        const pageData = result.data || {}
        const rows = pageData && Array.isArray(pageData.data) ? pageData.data : (Array.isArray(result.data) ? result.data : [])
        const total = Number(pageData.total) || rows.length
        if (tabId === 'pencaker') {
          this.pencakerList = rows
          this.pencakerTotal = total
        } else if (tabId === 'pmi') {
          this.pmiList = rows
          this.pmiTotal = total
        } else if (tabId === 'bkk') {
          this.bkkList = rows
          this.bkkTotal = total
        }
        if (!q) this.fetchedTabs[tabId] = true
      } catch (error) {
        this.errorMessage = `Error: ${error.message || 'Gagal terhubung ke API.'}`
      } finally {
        this.loading = false
      }
    },
    resolveStatusPerkawinan(id) {
      if (id === null || id === undefined || id === '') return '-'
      const found = this.statusPerkawinanOptions.find((s) => Number(s.id) === Number(id))
      return found ? found.nama : `#${id}`
    },
    resolveAgama(id) {
      if (id === null || id === undefined || id === '') return '-'
      const found = this.agamaOptions.find((a) => Number(a.id) === Number(id))
      return found ? found.nama : `#${id}`
    },
    resolveNegara(item) {
      if (!item) return '-'
      return item.negara_tujuan?.nama || item.negara_tujuan_nama || item.negara_nama || item.negara || '-'
    },
    resolveSektor(item) {
      if (!item) return '-'
      return item.sektor?.nama || item.sektor_nama || '-'
    },
    formatKategori(val) {
      if (val === null || val === undefined || val === '') return '-'
      const s = String(val).trim().toLowerCase()
      if (s === 'perguruan_tinggi' || s === 'perguruan tinggi') return 'Perguruan Tinggi'
      if (s === 'smk' || s === 'sma' || s.includes('smk') || s.includes('sma')) return 'SMA/SMK/Sederajat'
      return String(val)
    },
    formatText(val) {
      if (val === null || val === undefined || val === '') return '-'
      return String(val)
    },
    formatJenisKelamin(val) {
      if (!val) return '-'
      const s = String(val).trim().toUpperCase()
      if (s === 'L' || s === 'LAKI-LAKI' || s === 'LAKI LAKI') return 'Laki-laki'
      if (s === 'P' || s === 'PEREMPUAN') return 'Perempuan'
      return String(val)
    },
    formatPendidikan(item) {
      if (!item) return '-'
      const nama = item.pendidikan?.nama || item.pendidikan_nama
      if (nama) return item.jurusan ? `${nama} - ${item.jurusan}` : String(nama)
      const pid = item.pendidikan_id
      if (pid === null || pid === undefined || pid === '') return '-'
      return item.jurusan ? `#${pid} - ${item.jurusan}` : `#${pid}`
    },
    formatDate(val) {
      if (!val) return '-'
      const d = new Date(val)
      if (isNaN(d.getTime())) return String(val)
      return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

/* Content Area */
.admin-content {
  padding: 30px 40px;
  max-width: 1300px;
  margin: 0 auto;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 25px;
}

.welcome-text h2 {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 800;
  color: #1a1a1a;
}

.welcome-text p {
  margin: 4px 0 0 0;
  color: #666666;
  font-weight: 500;
}

/* Alert Toast Green */
.login-alert {
  background-color: #27ae60;
  color: #ffffff;
  padding: 10px 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  box-shadow: 0 4px 12px rgba(39, 174, 96, 0.2);
  white-space: nowrap;
}

/* Dashboard Card */
.dashboard-card {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
}

.card-tabs {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
  row-gap: 12px;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 12px;
  margin-bottom: 25px;
}

.tab-btn {
  background: none;
  border: none;
  font-family: 'Poppins', sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  color: #777777;
  cursor: pointer;
  padding: 0 0 4px 0;
  position: relative;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.tab-btn.active {
  color: #1e385c;
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -14px;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: #1e385c;
}

/* Action Bar */
.action-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 180px;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  pointer-events: none;
}

.search-box input {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 14px 10px 40px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background-color: #ffffff;
  font-family: 'Poppins', sans-serif;
  font-size: 0.9rem;
  outline: none;
  color: #334155;
}

.search-box input:focus {
  border-color: #1e385c;
}

/* Alerts */
.error-alert {
  background-color: #fef2f2;
  border: 1px solid #fca5a5;
  color: #991b1b;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 0.9rem;
  font-weight: 500;
}

/* Table */
.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}

.data-table thead th {
  background-color: #1e385c;
  color: #ffffff;
  font-weight: 700;
  text-align: left;
  padding: 12px 14px;
  white-space: nowrap;
}

.data-table tbody td {
  padding: 11px 14px;
  border-bottom: 1px solid #f1f5f9;
  color: #334155;
  vertical-align: middle;
}

.data-table tbody tr:hover {
  background-color: #f8fafc;
}

.text-center {
  text-align: center;
}

.py-5 {
  padding-top: 28px;
  padding-bottom: 28px;
}

.font-bold {
  font-weight: 700;
}

.td-alamat {
  max-width: 220px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.spinner {
  width: 36px;
  height: 36px;
  margin: 0 auto 10px auto;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #1e385c;
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: #64748b;
  font-size: 0.9rem;
}

.empty-text {
  color: #94a3b8;
  font-size: 0.92rem;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  font-weight: 600;
  color: #666666;
}

.btn-icon {
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background-color: #ffffff;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-info {
  color: #2563eb;
}

.btn-info:hover {
  background-color: #2563eb;
  color: #ffffff;
  border-color: #2563eb;
}

/* Footer bar */
.card-footer-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  padding-top: 16px;
}

.total-info {
  font-size: 0.85rem;
  font-weight: 600;
  color: #475569;
}

.btn-more {
  padding: 9px 20px;
  border-radius: 8px;
  border: 1px solid #1e385c;
  background-color: #ffffff;
  color: #1e385c;
  font-family: 'Poppins', sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-more:hover {
  background-color: #1e385c;
  color: #ffffff;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .admin-content {
    padding: 16px 14px 36px 14px;
  }

  .content-header {
    flex-direction: column;
  }

  .welcome-text h2 {
    font-size: 1.15rem;
  }

  .dashboard-card {
    padding: 20px 16px;
  }

  .card-tabs {
    gap: 18px;
    overflow-x: auto;
    flex-wrap: nowrap;
    padding-bottom: 8px;
  }

  .tab-btn {
    flex-shrink: 0;
  }

  .tab-btn.active::after {
    bottom: -10px;
  }

  .data-table {
    font-size: 0.8rem;
  }
}
</style>
