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
      
      <!-- Right Nav / Profile -->
      <div class="nav-right">
        <div class="profile-container">
          <div class="user-profile" @click.stop="toggleDropdown">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span>AdminUMKM</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="{ 'rotate-icon': showDropdown }"><path d="M6 9l6 6 6-6"/></svg>
          </div>

          <!-- Dropdown Logout -->
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

    <!-- Main Content -->
    <main class="admin-content">
      <!-- Search & Add Button Bar -->
      <div class="action-bar">
        <div class="search-box">
          <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input 
            type="text" 
            v-model="searchQuery" 
            @input="handleSearch"
            placeholder="Cari Nama Perusahaan, Proyek, atau Kecamatan..."
          />
        </div>
        <button class="btn-add" @click="openAddModal">
          Tambah
        </button>
      </div>

      <!-- Table Card Wrapper -->
      <div class="data-card">
        <div class="card-header-title">
          <h3>Data UMKM</h3>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th class="text-center" style="width: 60px;">No</th>
                <th>Nama Perusahaan</th>
                <th>Nama Proyek</th>
                <th>Kecamatan Usaha</th>
                <th>Kelurahan Usaha</th>
                <th>Judul KBLI</th>
                <th class="text-center" style="width: 110px;">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <!-- Loading State -->
              <tr v-if="loading">
                <td colspan="7" class="text-center py-5">
                  <div class="spinner"></div>
                  <p class="loading-text">Memuat data UMKM...</p>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-else-if="displayedUmkmList.length === 0">
                <td colspan="7" class="text-center py-5 empty-text">
                  Data UMKM tidak ditemukan.
                </td>
              </tr>

              <!-- Data Rows -->
              <tr v-else v-for="(item, index) in displayedUmkmList" :key="item.id || index">
                <td class="text-center font-bold">{{ calculateRowIndex(index) }}</td>
                <td class="font-bold text-uppercase">{{ formatText(item?.nama_perusahaan) }}</td>
                <td>{{ formatText(item?.nama_proyek) }}</td>
                <td>{{ item?.kecamatan?.nama || '-' }}</td>
                <td>{{ item?.kelurahan?.nama || '-' }}</td>
                <td>{{ item?.kbli_data?.judul || item?.kbli?.judul || '-' }}</td>
                <td class="text-center">
                  <div class="action-buttons">
                    <button class="btn-icon btn-info" title="Detail" @click="handleDetail(item)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                    </button>
                    <button class="btn-icon btn-edit" title="Edit" @click="handleEdit(item)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button class="btn-icon btn-delete" title="Hapus" @click="handleDelete(item)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Footer Pagination -->
        <div class="card-footer-pagination">
          <div class="per-page-selector">
            <select v-model.number="perPage" @change="onPerPageChange">
              <option :value="15">15 Baris</option>
              <option :value="25">25 Baris</option>
              <option :value="50">50 Baris</option>
              <option :value="100">100 Baris</option>
            </select>
            <span class="total-info">Total: {{ pagination.total }} Data</span>
          </div>

          <div class="pagination-controls">
            <button 
              class="page-nav-btn" 
              :disabled="pagination.current_page <= 1" 
              @click="changePage(pagination.current_page - 1)"
            >
              &larr; Previous
            </button>

            <div class="page-numbers">
              <button 
                v-for="(page, pIdx) in displayedPages" 
                :key="pIdx"
                :class="['page-num-btn', { active: page === pagination.current_page, disabled: page === '...' }]"
                @click="typeof page === 'number' && changePage(page)"
              >
                {{ page }}
              </button>
            </div>

            <button 
              class="page-nav-btn" 
              :disabled="pagination.current_page >= pagination.last_page" 
              @click="changePage(pagination.current_page + 1)"
            >
              Next &rarr;
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'DataUmkmView',
  data() {
    return {
      showDropdown: false,
      loading: false,
      searchQuery: '',
      searchTimeout: null,
      perPage: 15,
      
      displayedUmkmList: [],
      
      pagination: {
        current_page: 1,
        last_page: 1,
        total: 0
      }
    }
  },
  computed: {
    displayedPages() {
      const current = this.pagination.current_page
      const last = this.pagination.last_page
      const pages = []

      if (last <= 7) {
        for (let i = 1; i <= last; i++) pages.push(i)
      } else {
        pages.push(1)
        if (current > 3) pages.push('...')
        
        const start = Math.max(2, current - 1)
        const end = Math.min(last - 1, current + 1)
        
        for (let i = start; i <= end; i++) pages.push(i)
        
        if (current < last - 2) pages.push('...')
        pages.push(last)
      }
      return pages
    }
  },
  mounted() {
    this.fetchUmkmData(1)
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
            console.error('Error parsing user token:', e)
          }
        }
      }
      return token || ''
    },

    async fetchUmkmData(page = 1) {
      this.loading = true
      try {
        const token = this.getAuthToken()

        const queryParams = new URLSearchParams({
          page: page,
          per_page: this.perPage
        })

        if (this.searchQuery.trim()) {
          queryParams.append('search', this.searchQuery.trim())
        }

        const headers = {
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        }

        if (token) {
          headers['Authorization'] = `Bearer ${token}`
        }

        const response = await fetch(`https://harvest-protegee-symptom.ngrok-free.dev/api/admin/umkm?${queryParams.toString()}`, {
          method: 'GET',
          headers: headers
        })

        if (response.status === 401) {
          alert('Sesi login telah berakhir (401 Unauthorized). Silakan login kembali.')
          this.$router.push('/login')
          return
        }

        if (!response.ok) {
          throw new Error(`HTTP Error Status: ${response.status}`)
        }

        const result = await response.json()
        
        // Membaca paginated data dari objek result.data
        const pageData = result.data || {}

        this.displayedUmkmList = pageData.data || []
        this.pagination = {
          current_page: Number(pageData.current_page) || page,
          last_page: Number(pageData.last_page) || 1,
          total: Number(pageData.total) || 0
        }

      } catch (error) {
        console.error('Gagal mengambil data UMKM:', error)
        this.displayedUmkmList = []
        this.pagination = { current_page: 1, last_page: 1, total: 0 }
      } finally {
        this.loading = false
      }
    },

    changePage(page) {
      if (page < 1 || page > this.pagination.last_page || page === this.pagination.current_page) return
      this.fetchUmkmData(page)
    },

    onPerPageChange() {
      this.fetchUmkmData(1)
    },

    handleSearch() {
      clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(() => {
        this.fetchUmkmData(1)
      }, 400)
    },

    calculateRowIndex(index) {
      return (this.pagination.current_page - 1) * this.perPage + index + 1
    },

    formatText(val) {
      if (!val || val === 'null' || val === 'string') return '-'
      return val
    },

    openAddModal() {
      alert('Buka Form Tambah UMKM')
    },
    handleDetail(item) {
      alert(`Detail UMKM ID #${item.id}\nPerusahaan: ${item.nama_perusahaan || '-'}\nProyek: ${item.nama_proyek || '-'}\nAlamat: ${item.alamat_usaha || '-'}`)
    },
    handleEdit(item) {
      alert(`Edit UMKM: ${item.nama_perusahaan || '-'}`)
    },
    handleDelete(item) {
      if (confirm(`Apakah Anda yakin ingin menghapus "${item.nama_perusahaan}"?`)) {
        alert(`Data ID ${item.id} berhasil dihapus.`)
      }
    },

    toggleDropdown() {
      this.showDropdown = !this.showDropdown
    },
    closeDropdownOnClickOutside() {
      this.showDropdown = false
    },
    handleLogout() {
      localStorage.removeItem('access_token')
      localStorage.removeItem('token')
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
  background-color: #f1f3f6;
  font-family: 'Poppins', sans-serif;
  color: #1e293b;
}

/* Header Navbar Dark Navy */
.admin-navbar {
  background-color: #111827;
  color: #ffffff;
  padding: 14px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-left {
  display: flex;
  gap: 25px;
}

.nav-link {
  color: #9ca3af;
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
  border-bottom: 2px solid #ffffff;
}

/* User Profile Dropdown */
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
}

.user-profile:hover {
  background-color: #1f2937;
}

.rotate-icon {
  transform: rotate(180deg);
  transition: transform 0.2s ease;
}

.profile-dropdown {
  position: absolute;
  top: 110%;
  right: 0;
  background-color: #1f2937;
  border: 1px solid #374151;
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
  color: #f87171;
  padding: 10px 12px;
  font-family: 'Poppins', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  border-radius: 6px;
}

.dropdown-item:hover {
  background-color: #ef4444;
  color: #ffffff;
}

/* Main Content Layout */
.admin-content {
  padding: 28px 40px;
  max-width: 1400px;
  margin: 0 auto;
}

/* Search Bar & Button Action */
.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.search-box {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 16px;
  color: #94a3b8;
}

.search-box input {
  width: 100%;
  padding: 12px 16px 12px 48px;
  border: none;
  font-family: 'Poppins', sans-serif;
  font-size: 0.9rem;
  outline: none;
  color: #334155;
}

.btn-add {
  background-color: #1e385c;
  color: #ffffff;
  border: none;
  padding: 12px 32px;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-add:hover {
  background-color: #142640;
}

/* Data Card & Table */
.data-card {
  background-color: #ffffff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.card-header-title {
  background-color: #1e385c;
  color: #ffffff;
  padding: 16px 24px;
}

.card-header-title h3 {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
}

.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}

.data-table th {
  background-color: #ffffff;
  color: #1e293b;
  font-weight: 700;
  padding: 16px 18px;
  border-bottom: 2px solid #f1f5f9;
  text-align: left;
}

.data-table td {
  padding: 16px 18px;
  border-bottom: 1px solid #f1f5f9;
  color: #334155;
  vertical-align: middle;
}

.data-table tbody tr:hover {
  background-color: #f8fafc;
}

/* Action Icons */
.action-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease;
}

.btn-icon:hover {
  transform: scale(1.2);
}

.btn-info { color: #1e293b; }
.btn-edit { color: #dc2626; }
.btn-delete { color: #dc2626; }

/* Pagination Footer */
.card-footer-pagination {
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #f1f5f9;
}

.per-page-selector {
  display: flex;
  align-items: center;
  gap: 12px;
}

.per-page-selector select {
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  background-color: #ffffff;
  font-family: 'Poppins', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  color: #334155;
  outline: none;
  cursor: pointer;
}

.total-info {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 500;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-nav-btn {
  background: none;
  border: none;
  color: #64748b;
  font-family: 'Poppins', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
}

.page-nav-btn:disabled {
  color: #cbd5e1;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 4px;
}

.page-num-btn {
  background: none;
  border: none;
  min-width: 30px;
  height: 30px;
  border-radius: 6px;
  font-family: 'Poppins', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-num-btn.active {
  background-color: #1e293b;
  color: #ffffff;
}

.page-num-btn.disabled {
  cursor: default;
}

/* Utilities */
.text-center { text-align: center; }
.font-bold { font-weight: 700; }
.text-uppercase { text-transform: uppercase; }
.py-5 { padding-top: 40px; padding-bottom: 40px; }
.loading-text, .empty-text { color: #64748b; font-weight: 500; margin-top: 10px; }

.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #1e385c;
  border-radius: 50%;
  margin: 0 auto;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.dropdown-fade-enter-active, .dropdown-fade-leave-active { transition: all 0.2s ease; }
.dropdown-fade-enter-from, .dropdown-fade-leave-to { opacity: 0; transform: translateY(-8px); }
</style>