<template>
  <AdminLayout group="umkm" title="Dashboard">
<!-- Main Container -->
    <main class="admin-content">
      <!-- Header & Alert Toast -->
      <div class="content-header">
        <div class="welcome-text">
          <h2>Selamat Datang di, Dashboard UMKM</h2>
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
            :key="tab" 
            :class="['tab-btn', { active: activeTab === tab }]"
            @click="changeTab(tab)"
          >
            {{ tab }}
          </button>
        </div>

        <!-- Indicator Loading -->
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Memuat data statistik {{ activeTab }}...</p>
        </div>

        <!-- State Data Kosong -->
        <div v-else-if="activeData.length === 0" class="empty-state">
          Belum ada data untuk {{ activeTab }}
        </div>

        <!-- Tab Body: Data Table View -->
        <div v-else class="card-body-table">
          <div class="table-container">
            <table class="custom-table">
              <thead>
                <tr class="navy-header-row">
                  <th class="text-center" style="width: 70px;">No</th>
                  <th>{{ getColumnTitle(activeTab) }}</th>
                  <th v-if="activeTab === 'Kelurahan'">Kecamatan</th>
                  <th v-if="activeTab === 'Kecamatan'" class="text-center">Jumlah Kelurahan</th>
                  <th class="text-right">{{ getValueHeader(activeTab) }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in activeData" :key="index">
                  <td class="text-center rank-num">{{ index + 1 }}</td>
                  <td class="font-semibold">{{ item.nama }}</td>
                  <td v-if="activeTab === 'Kelurahan'" class="text-muted">{{ item.kecamatan }}</td>
                  <td v-if="activeTab === 'Kecamatan'" class="text-center">
                    <span class="badge">{{ item.jumlahKelurahan }}</span>
                  </td>
                  <td class="text-right font-bold count-val">{{ formatNumber(item.total) }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="summary-row">
                  <td :colspan="activeTab === 'Kelurahan' ? 3 : (activeTab === 'Kecamatan' ? 3 : 2)" class="text-right font-bold">
                    TOTAL KESELURUHAN
                  </td>
                  <td class="text-right font-bold total-val">{{ formatNumber(grandTotal) }}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </main>
  </AdminLayout>
</template>

<script>
import AdminLayout from './AdminLayout.vue'
export default {
  name: 'UmkmView',
  components: { AdminLayout },
  data() {
    return {
      showSuccessAlert: false,
      activeTab: 'Sektor Usaha',
      tabs: ['Sektor Usaha', 'Kelurahan', 'Kecamatan', 'Penyerapan Tenaga kerja'],
      sektorData: [],
      wilayahData: [],
      tenagaKerjaData: null,
      loading: false
    }
  },
  computed: {
    // List Kecamatan
    kecamatanList() {
      const raw = this.wilayahData.map(item => ({
        nama: item.kecamatan,
        jumlahKelurahan: Array.isArray(item.kelurahan) ? `${item.kelurahan.length} Kelurahan` : '-',
        total: Number(item.total) || 0
      }))
      return this.processAndSortData(raw)
    },

    // List Kelurahan
    kelurahanList() {
      const raw = []
      this.wilayahData.forEach(kec => {
        if (Array.isArray(kec.kelurahan)) {
          kec.kelurahan.forEach(kel => {
            raw.push({
              nama: kel.nama,
              kecamatan: kec.kecamatan,
              total: Number(kel.total) || 0
            })
          })
        }
      })
      return this.processAndSortData(raw)
    },

    // List Penyerapan Tenaga Kerja
    tenagaKerjaList() {
      if (!this.tenagaKerjaData || !Array.isArray(this.tenagaKerjaData.grafik_kecamatan)) return []
      const raw = this.tenagaKerjaData.grafik_kecamatan.map(item => ({
        nama: item.kecamatan,
        total: Number(item.total_tenaga_kerja) || 0
      }))
      return this.processAndSortData(raw)
    },

    // Data Aktif Sesuai Tab
    activeData() {
      if (this.activeTab === 'Sektor Usaha') {
        const raw = this.sektorData.map(i => ({ nama: i.nama, total: Number(i.total) || 0 }))
        return this.processAndSortData(raw)
      } else if (this.activeTab === 'Kecamatan') {
        return this.kecamatanList
      } else if (this.activeTab === 'Kelurahan') {
        return this.kelurahanList
      } else if (this.activeTab === 'Penyerapan Tenaga kerja') {
        return this.tenagaKerjaList
      }
      return []
    },

    // Grand Total
    grandTotal() {
      if (this.activeTab === 'Penyerapan Tenaga kerja' && this.tenagaKerjaData?.total_keseluruhan) {
        return Number(this.tenagaKerjaData.total_keseluruhan)
      }
      return this.activeData.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0)
    }
  },
  mounted() {
    this.fetchSektorData()
    
    // Cek apakah alert login sudah pernah muncul dalam sesi ini
    const hasShownAlert = sessionStorage.getItem('has_shown_login_alert')
    if (!hasShownAlert) {
      this.showSuccessAlert = true
      sessionStorage.setItem('has_shown_login_alert', 'true')
      
      setTimeout(() => {
        this.showSuccessAlert = false
      }, 4000)
    }
  },
  methods: {
    // Helper menyortir data & MENGHAPUS item "Lainnya"
    processAndSortData(list) {
      if (!list || list.length === 0) return []

      return list
        .filter(item => item.nama && item.nama.trim().toLowerCase() !== 'lainnya')
        .sort((a, b) => b.total - a.total)
    },

    async fetchSektorData() {
      this.loading = true
      try {
        const response = await fetch('https://harvest-protegee-symptom.ngrok-free.dev/api/statistik/sektor', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          }
        })
        const result = await response.json()
        if (response.ok && result.data) {
          this.sektorData = result.data
        }
      } catch (error) {
        console.error('Gagal mengambil data statistik sektor:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchWilayahData() {
      this.loading = true
      try {
        const response = await fetch('https://harvest-protegee-symptom.ngrok-free.dev/api/statistik/wilayah', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          }
        })
        const result = await response.json()
        if (response.ok && result.data) {
          this.wilayahData = result.data
        }
      } catch (error) {
        console.error('Gagal mengambil data statistik wilayah:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchTenagaKerjaData() {
      this.loading = true
      try {
        const response = await fetch('https://harvest-protegee-symptom.ngrok-free.dev/api/statistik/tenaga-kerja', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          }
        })
        const result = await response.json()
        if (response.ok && result.data) {
          this.tenagaKerjaData = result.data
        }
      } catch (error) {
        console.error('Gagal mengambil data penyerapan tenaga kerja:', error)
      } finally {
        this.loading = false
      }
    },

    changeTab(tab) {
      this.activeTab = tab
      if ((tab === 'Kecamatan' || tab === 'Kelurahan') && this.wilayahData.length === 0) {
        this.fetchWilayahData()
      } else if (tab === 'Sektor Usaha' && this.sektorData.length === 0) {
        this.fetchSektorData()
      } else if (tab === 'Penyerapan Tenaga kerja' && !this.tenagaKerjaData) {
        this.fetchTenagaKerjaData()
      }
    },

    getColumnTitle(tab) {
      if (tab === 'Sektor Usaha') return 'Nama Sektor'
      if (tab === 'Kecamatan' || tab === 'Penyerapan Tenaga kerja') return 'Nama Kecamatan'
      if (tab === 'Kelurahan') return 'Nama Kelurahan'
      return 'Kategori'
    },

    getValueHeader(tab) {
      if (tab === 'Penyerapan Tenaga kerja') return 'Total Tenaga Kerja (Orang)'
      return 'Total UMKM'
    },

    formatNumber(val) {
      return Number(val).toLocaleString('id-ID')
    },
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');


/* Navbar Admin Dark */




/* Profile & Dropdown Logout */







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
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 12px;
  margin-bottom: 25px;
}

.tab-btn {
  background: none;
  border: none;
  font-size: 0.95rem;
  font-weight: 700;
  color: #777777;
  cursor: pointer;
  padding: 0 0 4px 0;
  position: relative;
  transition: all 0.2s ease;
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

/* Loading & Empty State */
.loading-state, .empty-state {
  text-align: center;
  padding: 60px 20px;
  font-weight: 600;
  color: #666666;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #1e385c;
  border-radius: 50%;
  margin: 0 auto 12px auto;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Table Styling */
.table-container {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid #eaeaea;
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.9rem;
}

.navy-header-row th {
  background-color: #1e385c;
  color: #ffffff;
  font-weight: 700;
  padding: 14px 18px;
  border-bottom: 2px solid #162a45;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
}

.custom-table td {
  padding: 14px 18px;
  border-bottom: 1px solid #f0f0f0;
  color: #2c3e50;
}

.custom-table tbody tr:hover {
  background-color: #f8fafc;
}

.custom-table tbody tr:last-child td {
  border-bottom: none;
}

/* Text & Alignment Utilities */
.text-center { text-align: center; }
.text-right { text-align: right; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }
.text-muted { color: #888888; font-size: 0.85rem; }

.rank-num {
  color: #999999;
  font-weight: 600;
}

.count-val {
  color: #1a1a1a;
}

/* Badge untuk jumlah kelurahan */
.badge {
  background-color: #edf2f7;
  color: #4a5568;
  font-size: 0.8rem;
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: 600;
}

/* Row Total / Summary Footer */
.summary-row {
  background-color: #f8fafc;
  border-top: 2px solid #e2e8f0;
}

.summary-row td {
  padding: 16px 18px;
  color: #1a1a1a;
  font-size: 0.95rem;
}

.total-val {
  color: #1e385c;
  font-size: 1.1rem;
}

/* Animations */
.fade-leave-active { transition: opacity 0.5s ease; }
.fade-leave-to { opacity: 0; }

</style>