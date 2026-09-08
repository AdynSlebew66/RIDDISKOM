<template>
  <div class="admin-wrapper" @click="closeDropdownOnClickOutside">
    <!-- Top Navbar Admin -->
    <header class="admin-navbar">
      <div class="nav-left">
        <router-link to="/admin/umkm" class="nav-link" active-class="active">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          Dashboard
        </router-link>
        <router-link to="/admin/data" class="nav-link" active-class="active">
          Data
        </router-link>
      </div>
      
      <!-- Right Nav / Profile & Logout -->
      <div class="nav-right">
        <div class="profile-container">
          <div class="user-profile" @click.stop="toggleDropdown">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span>AdminUMKM</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="{ 'rotate-icon': showDropdown }"><path d="M6 9l6 6 6-6"/></svg>
          </div>

          <!-- Dropdown Menu Logout -->
          <transition name="dropdown-fade">
            <div v-if="showDropdown" class="profile-dropdown">
              <button @click="handleLogout" class="dropdown-item logout-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                Keluar / Logout
              </button>
            </div>
          </transition>
        </div>
      </div>
    </header>

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
                <tr>
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
  </div>
</template>

<script>
export default {
  name: 'UmkmView',
  data() {
    return {
      showSuccessAlert: true,
      showDropdown: false,
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
    
    setTimeout(() => {
      this.showSuccessAlert = false
    }, 4000)
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
    toggleDropdown() {
      this.showDropdown = !this.showDropdown
    },
    closeDropdownOnClickOutside() {
      this.showDropdown = false
    },
    handleLogout() {
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

.admin-wrapper {
  min-height: 100vh;
  background-color: #f7f7f8;
  font-family: 'Poppins', sans-serif;
}

/* Navbar Admin Dark */
.admin-navbar {
  background-color: #1a1a1a;
  color: #ffffff;
  padding: 14px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #2a2a2a;
}

.nav-left {
  display: flex;
  gap: 25px;
}

.nav-link {
  color: #a0a0a0;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 4px;
  transition: all 0.2s ease;
}

.nav-link.active, .nav-link:hover {
  color: #ffffff;
  border-bottom: 2px solid #c0392b;
}

/* Profile & Dropdown Logout */
.profile-container {
  position: relative;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  color: #ffffff;
  padding: 6px 12px;
  border-radius: 6px;
  user-select: none;
  transition: background-color 0.2s ease;
}

.user-profile:hover {
  background-color: #2a2a2a;
}

.rotate-icon {
  transform: rotate(180deg);
  transition: transform 0.2s ease;
}

.profile-dropdown {
  position: absolute;
  top: 110%;
  right: 0;
  background-color: #24272c;
  border: 1px solid #333333;
  border-radius: 8px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  padding: 6px;
  min-width: 160px;
  z-index: 100;
}

.dropdown-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  background: transparent;
  border: none;
  color: #ff6b6b;
  padding: 10px 12px;
  font-family: 'Poppins', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  border-radius: 6px;
  text-align: left;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background-color: #c0392b;
  color: #ffffff;
}

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
  color: #c0392b;
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -14px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #c0392b;
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
  border-top: 3px solid #c0392b;
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

.custom-table th {
  background-color: #fafafa;
  color: #444444;
  font-weight: 700;
  padding: 14px 18px;
  border-bottom: 2px solid #eaeaea;
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
  background-color: #fcf8f8;
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
  background-color: #f8f9fa;
  border-top: 2px solid #e2e8f0;
}

.summary-row td {
  padding: 16px 18px;
  color: #1a1a1a;
  font-size: 0.95rem;
}

.total-val {
  color: #c0392b;
  font-size: 1.1rem;
}

/* Animations */
.fade-leave-active { transition: opacity 0.5s ease; }
.fade-leave-to { opacity: 0; }

.dropdown-fade-enter-active, .dropdown-fade-leave-active { transition: all 0.2s ease; }
.dropdown-fade-enter-from, .dropdown-fade-leave-to { opacity: 0; transform: translateY(-8px); }
</style>