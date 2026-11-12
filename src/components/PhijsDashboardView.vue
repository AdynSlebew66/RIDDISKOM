<template>
  <AdminLayout group="phijs" title="Dashboard">
    <main class="admin-content">
      <!-- Header & Alert Toast -->
      <div class="content-header">
        <div class="welcome-text">
          <h2>Selamat Datang di, Dashboard Admin PHIJS</h2>
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

      <!-- Statistik Ringkas -->
      <div class="stats-row">
        <div class="stat-card">
          <span class="stat-value">{{ formatNumber(statPerusahaan) }}</span>
          <span class="stat-label">Total Perusahaan</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ formatNumber(statPeriode) }}</span>
          <span class="stat-label">Periode Data</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ formatNumber(statTenagaKerja) }}</span>
          <span class="stat-label">Total Tenaga Kerja</span>
        </div>
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

        <!-- ===== TAB: Perusahaan ===== -->
        <div v-if="activeTab === 'perusahaan'">
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th class="text-center" style="width: 50px;">No</th>
                  <th>Nama Perusahaan</th>
                  <th>NIB</th>
                  <th>Kecamatan</th>
                  <th>Klasifikasi</th>
                  <th class="text-center">Pria</th>
                  <th class="text-center">Wanita</th>
                  <th class="text-center">Total TK</th>
                  <th class="text-center" style="width: 70px;">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="loading">
                  <td colspan="9" class="text-center py-5">
                    <div class="spinner"></div>
                    <p class="loading-text">Memuat data perusahaan PHIJS...</p>
                  </td>
                </tr>
                <tr v-else-if="perusahaanList.length === 0">
                  <td colspan="9" class="text-center py-5 empty-text">
                    Data perusahaan PHIJS tidak ditemukan.
                  </td>
                </tr>
                <tr v-else v-for="(item, index) in perusahaanList" :key="item.id || index">
                  <td class="text-center font-bold">{{ index + 1 }}</td>
                  <td class="font-bold td-nama" :title="item?.nama_perusahaan">{{ formatText(item?.nama_perusahaan) }}</td>
                  <td class="td-nib" :title="item?.nib">{{ formatText(item?.nib) }}</td>
                  <td>{{ resolveKecamatan(item) }}</td>
                  <td>{{ formatText(item?.klasifikasi) }}</td>
                  <td class="text-center">{{ formatNumber(item?.pria) }}</td>
                  <td class="text-center">{{ formatNumber(item?.wanita) }}</td>
                  <td class="text-center font-bold">{{ formatNumber(resolveTotalTk(item)) }}</td>
                  <td class="text-center">
                    <button class="btn-icon btn-info" title="Lihat di Data PHIJS" @click="navTo('/admin/phijs/data')">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="card-footer-bar">
            <span class="total-info">Total: {{ formatNumber(perusahaanTotal) }} Data</span>
            <button class="btn-more" @click="navTo('/admin/phijs/data')">Lihat Semua Data &raquo;</button>
          </div>
        </div>

        <!-- ===== TAB: Periode ===== -->
        <div v-else-if="activeTab === 'periode'">
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th class="text-center" style="width: 50px;">No</th>
                  <th>Label Periode</th>
                  <th class="text-center">Tahun</th>
                  <th class="text-center">Bulan</th>
                  <th class="text-center">Perusahaan</th>
                  <th class="text-center">Baris Excel</th>
                  <th>Status</th>
                  <th>Sumber File</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="periodeLoading">
                  <td colspan="8" class="text-center py-5">
                    <div class="spinner"></div>
                    <p class="loading-text">Memuat periode PHIJS...</p>
                  </td>
                </tr>
                <tr v-else-if="periodeList.length === 0">
                  <td colspan="8" class="text-center py-5 empty-text">
                    Belum ada periode data PHIJS.
                  </td>
                </tr>
                <tr v-else v-for="(p, index) in periodeList" :key="p.id || index">
                  <td class="text-center font-bold">{{ index + 1 }}</td>
                  <td class="font-bold">{{ formatText(p?.label) }}</td>
                  <td class="text-center">{{ p?.tahun ?? '-' }}</td>
                  <td class="text-center">{{ p?.nama_bulan || bulanLabel(p?.bulan) }}</td>
                  <td class="text-center">{{ formatNumber(p?.total_perusahaan) }}</td>
                  <td class="text-center">{{ formatNumber(p?.total_baris_excel) }}</td>
                  <td>
                    <span class="badge" :class="p?.status === 'aktif' ? 'badge-yes' : 'badge-neutral'">{{ formatText(p?.status) }}</span>
                  </td>
                  <td class="td-sumber" :title="p?.sumber_file">{{ formatText(p?.sumber_file) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="card-footer-bar">
            <span class="total-info">Total: {{ periodeList.length }} Periode</span>
            <button class="btn-more" @click="navTo('/admin/phijs/data')">Kelola Data PHIJS &raquo;</button>
          </div>
        </div>
      </div>
    </main>
  </AdminLayout>
</template>

<script>
import AdminLayout from './AdminLayout.vue'

const API_BASE = 'https://harvest-protegee-symptom.ngrok-free.dev/api'
const API_DATA = `${API_BASE}/admin/data-phi-js`
const API_PERIODE = `${API_BASE}/admin/data-phi-js-periode`
const API_STATISTIK = `${API_BASE}/statistik/data-phi-js`

export default {
  name: 'PhijsDashboardView',
  components: { AdminLayout },
  data() {
    return {
      showSuccessAlert: false,
      activeTab: 'perusahaan',
      tabs: [
        { id: 'perusahaan', label: 'Perusahaan PHIJS', searchable: true, searchPlaceholder: 'Cari Nama Perusahaan, NIB, ...' },
        { id: 'periode', label: 'Periode Data', searchable: false }
      ],
      searchQuery: '',
      searchTimer: null,
      loading: false,
      errorMessage: '',
      perusahaanList: [],
      perusahaanTotal: 0,
      fetchedPerusahaan: false,
      periodeList: [],
      periodeLoading: false,
      statPerusahaan: 0,
      statPeriode: 0,
      statTenagaKerja: 0,
      bulanOptions: [
        { value: 1, label: 'Januari' },
        { value: 2, label: 'Februari' },
        { value: 3, label: 'Maret' },
        { value: 4, label: 'April' },
        { value: 5, label: 'Mei' },
        { value: 6, label: 'Juni' },
        { value: 7, label: 'Juli' },
        { value: 8, label: 'Agustus' },
        { value: 9, label: 'September' },
        { value: 10, label: 'Oktober' },
        { value: 11, label: 'November' },
        { value: 12, label: 'Desember' }
      ]
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
    this.fetchPreviewPerusahaan()
    this.fetchPeriode()
    this.fetchStats()
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
    },
    handleSearch() {
      clearTimeout(this.searchTimer)
      this.searchTimer = setTimeout(() => {
        this.fetchedPerusahaan = false
        this.fetchPreviewPerusahaan()
      }, 500)
    },
    async fetchPreviewPerusahaan() {
      const q = (this.searchQuery || '').trim()
      if (this.fetchedPerusahaan && !q) return
      this.loading = true
      this.errorMessage = ''
      try {
        const params = new URLSearchParams({ page: 1 })
        if (q) params.append('search', q)
        const response = await fetch(`${API_DATA}?${params.toString()}`, {
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
        if (Array.isArray(pageData.data)) {
          this.perusahaanList = pageData.data
          this.perusahaanTotal = Number(pageData.total) || 0
        } else if (Array.isArray(result.data)) {
          this.perusahaanList = result.data
          this.perusahaanTotal = result.data.length
        } else {
          this.perusahaanList = []
          this.perusahaanTotal = 0
        }
        if (!q) this.fetchedPerusahaan = true
      } catch (error) {
        this.errorMessage = `Error: ${error.message || 'Gagal terhubung ke API.'}`
      } finally {
        this.loading = false
      }
    },
    async fetchPeriode() {
      this.periodeLoading = true
      try {
        const response = await fetch(API_PERIODE, {
          method: 'GET',
          headers: this.buildHeaders()
        })
        if (response.status === 401) {
          this.$router.push('/login')
          return
        }
        if (!response.ok) return
        const result = await response.json()
        this.periodeList = Array.isArray(result.data) ? result.data : []
      } catch (e) {
        console.error('[PhijsDashboard] gagal ambil periode:', e)
      } finally {
        this.periodeLoading = false
      }
    },
    async fetchStats() {
      try {
        const response = await fetch(API_STATISTIK, {
          method: 'GET',
          headers: this.buildHeaders()
        })
        if (!response.ok) return
        const result = await response.json()
        const d = result.data || {}
        this.statPerusahaan = Number(d.total_perusahaan) || 0
        this.statTenagaKerja = Number(d.total_tenaga_kerja) || 0
        this.statPeriode = Number(d.total_periode) || this.periodeList.length
      } catch (e) {
        console.error('[PhijsDashboard] gagal ambil statistik:', e)
      }
    },
    resolveKecamatan(item) {
      if (!item) return '-'
      return item.kecamatan_master?.nama || item.kecamatan || '-'
    },
    resolveTotalTk(item) {
      if (!item) return 0
      if (item.total_tk !== null && item.total_tk !== undefined) return Number(item.total_tk) || 0
      return (Number(item.pria) || 0) + (Number(item.wanita) || 0)
    },
    bulanLabel(bulan) {
      const found = this.bulanOptions.find((b) => Number(b.value) === Number(bulan))
      return found ? found.label : '-'
    },
    formatText(val) {
      if (val === null || val === undefined || val === '') return '-'
      return String(val)
    },
    formatNumber(val) {
      return (Number(val) || 0).toLocaleString('id-ID')
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

/* Stats Row */
.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 25px;
}

.stat-card {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 18px 22px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1e385c;
}

.stat-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: #64748b;
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

.td-nama,
.td-nib,
.td-sumber {
  max-width: 240px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.badge {
  display: inline-block;
  padding: 2px 9px;
  border-radius: 20px;
  font-size: 0.72rem;
  font-weight: 700;
  white-space: nowrap;
}

.badge-yes {
  background-color: #dcfce7;
  color: #166534;
}

.badge-neutral {
  background-color: #e2e8f0;
  color: #475569;
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

  .stats-row {
    grid-template-columns: 1fr;
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
