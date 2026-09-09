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
          Data UMKM
        </router-link>

        <router-link to="/admin/rasio" class="nav-link" active-class="active">
          Rasio Kewirausahaan
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
            placeholder="Cari berdasarkan Tahun..."
          />
        </div>

        <!-- Filter Urutan -->
        <div class="sort-box">
          <select v-model="sortOrder" @change="onSortChange" class="sort-select">
            <option value="desc">Tahun Terbaru &rarr; Terlama</option>
            <option value="asc">Tahun Terlama &rarr; Terbaru</option>
          </select>
        </div>

        <button class="btn-add" @click="openAddModal">
          + Tambah Data
        </button>
      </div>

      <!-- Error Alert -->
      <div v-if="errorMessage" class="error-alert">
        {{ errorMessage }}
      </div>

      <!-- Table Card Wrapper -->
      <div class="data-card">
        <div class="card-header-navy">
          <h3>Data Penduduk & Rasio Kewirausahaan</h3>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th class="text-center" style="width: 60px;">No</th>
                <th class="text-center">Tahun</th>
                <th class="text-right">Total UMKM</th>
                <th class="text-right">Jumlah Penduduk</th>
                <th class="text-center">Rasio Kewirausahaan</th>
                <th class="text-center" style="width: 110px;">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <!-- Loading State -->
              <tr v-if="loading">
                <td colspan="6" class="text-center py-5">
                  <div class="spinner"></div>
                  <p class="loading-text">Memuat data rasio kewirausahaan...</p>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-else-if="displayedRasioList.length === 0">
                <td colspan="6" class="text-center py-5 empty-text">
                  Data penduduk & rasio tidak ditemukan.
                </td>
              </tr>

              <!-- Data Rows -->
              <tr v-else v-for="(item, index) in displayedRasioList" :key="item.id || index">
                <td class="text-center font-bold">{{ calculateRowIndex(index) }}</td>
                <td class="text-center font-bold">{{ item.tahun }}</td>
                <td class="text-right font-mono">{{ formatNumber(item.total_umkm) }}</td>
                <td class="text-right font-mono">{{ formatNumber(item.jumlah_penduduk) }}</td>
                <td class="text-center">
                  <span class="badge badge-ratio">{{ formatRasio(item.rasio) }}</span>
                </td>
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
            <span class="total-info">Total: {{ pagination.total }} Data</span>
          </div>

          <div v-if="pagination.last_page > 1" class="pagination-controls">
            <button 
              class="btn-page" 
              :disabled="pagination.current_page === 1"
              @click="changePage(pagination.current_page - 1)"
            >
              &laquo; Prev
            </button>

            <button 
              v-for="page in displayedPages" 
              :key="page"
              class="btn-page"
              :class="{ active: page === pagination.current_page }"
              :disabled="page === '...'"
              @click="page !== '...' && changePage(page)"
            >
              {{ page }}
            </button>

            <button 
              class="btn-page" 
              :disabled="pagination.current_page === pagination.last_page"
              @click="changePage(pagination.current_page + 1)"
            >
              Next &raquo;
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal Detail Pop-up -->
    <transition name="modal-fade">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-container">
          <div class="modal-header">
            <h3>Detail Rasio Kewirausahaan</h3>
            <button class="btn-close" @click="closeModal">&times;</button>
          </div>
          
          <div class="modal-body">
            <div v-if="loadingDetail" class="text-center py-5">
              <div class="spinner"></div>
              <p class="loading-text mt-3">Menarik data dari server...</p>
            </div>

            <div v-else-if="modalError" class="error-alert">
              {{ modalError }}
            </div>

            <div v-else-if="selectedDetail" class="detail-grid">
              <div class="detail-group">
                <label>Tahun</label>
                <p class="font-bold text-xl">{{ selectedDetail.tahun }}</p>
              </div>
              <div class="detail-group">
                <label>Rasio Kewirausahaan</label>
                <p><span class="badge badge-ratio-lg">{{ formatRasio(selectedDetail.rasio) }}</span></p>
              </div>
              <div class="detail-group">
                <label>Total UMKM</label>
                <p class="font-mono font-bold">{{ formatNumber(selectedDetail.total_umkm) }} Unit</p>
              </div>
              <div class="detail-group">
                <label>Jumlah Penduduk</label>
                <p class="font-mono font-bold">{{ formatNumber(selectedDetail.jumlah_penduduk) }} Jiwa</p>
              </div>
              <div class="detail-group">
                <label>Dibuat Pada</label>
                <p>{{ formatDate(selectedDetail.created_at) }}</p>
              </div>
              <div class="detail-group">
                <label>Terakhir Diperbarui</label>
                <p>{{ formatDate(selectedDetail.updated_at) }}</p>
              </div>
            </div>
          </div>
          
          <div class="modal-footer">
            <button class="btn-tutup" @click="closeModal">Tutup</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal Form (Tambah & Edit) -->
    <transition name="modal-fade">
      <div v-if="showFormModal" class="modal-overlay" @click.self="closeFormModal">
        <div class="modal-container modal-sm">
          <div class="modal-header">
            <h3>{{ isEditMode ? 'Edit Data Rasio' : 'Tambah Data Rasio' }}</h3>
            <button class="btn-close" @click="closeFormModal">&times;</button>
          </div>
          
          <form @submit.prevent="submitForm">
            <div class="modal-body">
              <div v-if="formError" class="error-alert">
                {{ formError }}
              </div>

              <!-- Form Stack -->
              <div class="form-stack">
                <!-- 1. Tahun -->
                <div class="form-group">
                  <label>Tahun <span class="required">*</span></label>
                  <input 
                    type="number" 
                    min="2000" 
                    max="2099" 
                    v-model.number="formData.tahun" 
                    @input="onTahunChange"
                    required 
                    placeholder="Contoh: 2026"
                  />
                </div>

                <!-- 2. Total UMKM (READONLY) -->
                <div class="form-group">
                  <label>Total UMKM <span class="required">*</span></label>
                  <input 
                    type="number" 
                    v-model.number="formData.total_umkm" 
                    readonly 
                    class="input-readonly"
                    placeholder="0"
                  />
                  <small class="help-text">*Diambil otomatis dari data UMKM yang tersimpan</small>
                </div>

                <!-- 3. Jumlah Penduduk -->
                <div class="form-group">
                  <label>Jumlah Penduduk <span class="required">*</span></label>
                  <input 
                    type="number" 
                    min="1" 
                    v-model.number="formData.jumlah_penduduk" 
                    @input="autoCalculateRasio"
                    required 
                    placeholder="0"
                  />
                </div>

                <!-- 4. Rasio (%) (READONLY) -->
                <div class="form-group">
                  <label>Rasio Kewirausahaan (%) <span class="required">*</span></label>
                  <input 
                    type="number" 
                    step="0.01" 
                    v-model.number="formData.rasio" 
                    readonly 
                    class="input-readonly"
                    placeholder="0"
                  />
                  <small class="help-text">*Rasio otomatis dihitung dari (Total UMKM / Jumlah Penduduk) * 100</small>
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn-cancel" @click="closeFormModal" :disabled="submittingForm">Batal</button>
              <button type="submit" class="btn-submit" :disabled="submittingForm">
                <span v-if="submittingForm" class="spinner-sm"></span>
                <span>{{ submittingForm ? 'Menyimpan...' : (isEditMode ? 'Update Data' : 'Simpan Data') }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- Modal Konfirmasi Hapus Data -->
    <transition name="modal-fade">
      <div v-if="showDeleteModal" class="modal-overlay" @click.self="closeDeleteModal">
        <div class="modal-container modal-sm">
          <div class="modal-header header-delete">
            <h3>Konfirmasi Hapus</h3>
            <button class="btn-close" @click="closeDeleteModal">&times;</button>
          </div>
          <div class="modal-body text-center py-4">
            <div class="delete-icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </div>
            <h4 class="delete-title">Hapus Data Rasio?</h4>
            <p class="delete-desc">
              Apakah kamu yakin ingin menghapus data rasio tahun <strong>"{{ itemToDelete?.tahun }}"</strong>? Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
          <div class="modal-footer footer-center">
            <button type="button" class="btn-cancel" @click="closeDeleteModal" :disabled="deleting">Batal</button>
            <button type="button" class="btn-delete-confirm" @click="confirmDelete" :disabled="deleting">
              <span v-if="deleting" class="spinner-sm"></span>
              <span>{{ deleting ? 'Menghapus...' : 'Ya, Hapus Data' }}</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'RasioKewirausahaanView',
  data() {
    return {
      showDropdown: false,
      loading: false,
      errorMessage: '',
      searchQuery: '',
      searchTimeout: null,
      perPage: 10,
      sortOrder: 'desc',
      
      displayedRasioList: [],
      pagination: {
        current_page: 1,
        last_page: 1,
        total: 0
      },

      showModal: false,
      loadingDetail: false,
      selectedDetail: null,
      modalError: '',

      showFormModal: false,
      isEditMode: false,
      submittingForm: false,
      formError: '',

      showDeleteModal: false,
      itemToDelete: null,
      deleting: false,

      formData: {
        id: null,
        tahun: new Date().getFullYear(),
        total_umkm: 0,
        jumlah_penduduk: 0,
        rasio: 0
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
    this.fetchRasioData(1)
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

    async fetchRasioData(page = 1) {
      this.loading = true
      this.errorMessage = ''
      try {
        const token = this.getAuthToken()
        const queryParams = new URLSearchParams({
          page: page,
          per_page: this.perPage,
          'ngrok-skip-browser-warning': '69420'
        })

        if (this.searchQuery.trim()) {
          queryParams.append('search', this.searchQuery.trim())
        }

        const headers = {
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': '69420'
        }

        if (token) headers['Authorization'] = `Bearer ${token}`

        const url = `https://harvest-protegee-symptom.ngrok-free.dev/api/admin/penduduk?${queryParams.toString()}`
        const response = await fetch(url, { method: 'GET', headers })

        if (response.status === 401) {
          this.$router.push('/login')
          return
        }

        if (!response.ok) throw new Error(`Gagal mengambil data. Status: ${response.status}`)

        const result = await response.json()
        const pageData = result.data || {}

        if (pageData && Array.isArray(pageData.data)) {
          this.displayedRasioList = this.sortListLocally(pageData.data)
          this.pagination = {
            current_page: Number(pageData.current_page) || page,
            last_page: Number(pageData.last_page) || 1,
            total: Number(pageData.total) || 0
          }
        } else if (Array.isArray(result.data)) {
          this.displayedRasioList = this.sortListLocally(result.data)
          this.pagination = {
            current_page: 1,
            last_page: 1,
            total: result.data.length
          }
        }

      } catch (error) {
        this.errorMessage = `Error: ${error.message || 'Gagal terhubung ke API.'}`
        this.displayedRasioList = []
      } finally {
        this.loading = false
      }
    },

    // HIT API DETAIL: GET /api/admin/penduduk/{id}
    async handleDetail(item) {
      this.showModal = true
      this.loadingDetail = true
      this.modalError = ''
      this.selectedDetail = null

      try {
        const token = this.getAuthToken()
        const headers = {
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': '69420'
        }
        if (token) headers['Authorization'] = `Bearer ${token}`

        const url = `https://harvest-protegee-symptom.ngrok-free.dev/api/admin/penduduk/${item.id}?ngrok-skip-browser-warning=69420`
        const response = await fetch(url, { method: 'GET', headers })

        if (!response.ok) throw new Error('Gagal menarik data detail dari server.')

        const result = await response.json()
        console.log('[DEBUG] Detail Response API:', result)

        const apiData = result.data || {}
        
        // Gabungkan dengan total_umkm dari tabel & hitung rasio real-time
        const totalUmkm = Number(item.total_umkm) || 0
        const jumlahPenduduk = Number(apiData.jumlah_penduduk) || 0
        const rasioCalc = jumlahPenduduk > 0 ? (totalUmkm / jumlahPenduduk) * 100 : 0

        this.selectedDetail = {
          id: apiData.id,
          tahun: apiData.tahun || item.tahun,
          jumlah_penduduk: jumlahPenduduk,
          total_umkm: totalUmkm,
          rasio: parseFloat(rasioCalc.toFixed(2)),
          created_at: apiData.created_at,
          updated_at: apiData.updated_at
        }

      } catch (error) {
        console.error('[DEBUG] Fetch Detail Error:', error)
        // Fallback memakai data baris jika API error
        this.selectedDetail = item
      } finally {
        this.loadingDetail = false
      }
    },

    syncTotalUmkm() {
      const found = this.displayedRasioList.find(item => Number(item.tahun) === Number(this.formData.tahun))
      if (found && found.total_umkm !== undefined) {
        this.formData.total_umkm = Number(found.total_umkm)
      } else if (this.displayedRasioList.length > 0) {
        this.formData.total_umkm = Number(this.displayedRasioList[0].total_umkm) || 0
      } else {
        this.formData.total_umkm = 0
      }
      this.autoCalculateRasio()
    },

    onTahunChange() {
      this.syncTotalUmkm()
    },

    autoCalculateRasio() {
      if (this.formData.jumlah_penduduk > 0 && this.formData.total_umkm >= 0) {
        const calc = (this.formData.total_umkm / this.formData.jumlah_penduduk) * 100
        this.formData.rasio = parseFloat(calc.toFixed(2))
      } else {
        this.formData.rasio = 0
      }
    },

    openAddModal() {
      this.isEditMode = false
      this.formError = ''
      this.resetFormData()
      this.syncTotalUmkm()
      this.showFormModal = true
    },

    handleEdit(item) {
      this.isEditMode = true
      this.formError = ''
      this.formData = {
        id: item.id,
        tahun: item.tahun || new Date().getFullYear(),
        total_umkm: item.total_umkm || 0,
        jumlah_penduduk: item.jumlah_penduduk || 0,
        rasio: item.rasio || 0
      }
      this.autoCalculateRasio()
      this.showFormModal = true
    },

    resetFormData() {
      this.formData = {
        id: null,
        tahun: new Date().getFullYear(),
        total_umkm: 0,
        jumlah_penduduk: 0,
        rasio: 0
      }
    },

    closeFormModal() {
      this.showFormModal = false
      setTimeout(() => {
        this.resetFormData()
        this.formError = ''
      }, 300)
    },

    async submitForm() {
      this.submittingForm = true
      this.formError = ''

      try {
        const token = this.getAuthToken()
        const headers = {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': '69420'
        }
        if (token) headers['Authorization'] = `Bearer ${token}`

        const isEdit = this.isEditMode && this.formData.id
        const url = isEdit 
          ? `https://harvest-protegee-symptom.ngrok-free.dev/api/admin/penduduk/${this.formData.id}`
          : `https://harvest-protegee-symptom.ngrok-free.dev/api/admin/penduduk`

        const method = isEdit ? 'PUT' : 'POST'

        const payload = {
          tahun: String(this.formData.tahun),
          jumlah_penduduk: Number(this.formData.jumlah_penduduk)
        }

        console.log('[DEBUG] Sending Payload to API:', payload)

        const response = await fetch(url, {
          method: method,
          headers: headers,
          body: JSON.stringify(payload)
        })

        const resJson = await response.json().catch(() => ({}))

        console.log('[DEBUG] Response Status Code:', response.status)
        console.log('[DEBUG] Response Body:', resJson)

        if (!response.ok) {
          throw new Error(resJson.message || 'Gagal menyimpan data. Pastikan input sudah benar.')
        }

        this.closeFormModal()
        this.fetchRasioData(this.pagination.current_page)
      } catch (err) {
        console.error('[DEBUG] Submit Form Error:', err)
        this.formError = err.message || 'Terjadi kesalahan saat memproses data.'
      } finally {
        this.submittingForm = false
      }
    },

    handleDelete(item) {
      this.itemToDelete = item
      this.showDeleteModal = true
    },

    closeDeleteModal() {
      if (this.deleting) return
      this.showDeleteModal = false
      setTimeout(() => {
        this.itemToDelete = null
      }, 300)
    },

    // FIX HAPUS DATA MODAL STUCK:
    async confirmDelete() {
      if (!this.itemToDelete) return
      this.deleting = true
      try {
        const token = this.getAuthToken()
        const headers = {
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': '69420'
        }
        if (token) headers['Authorization'] = `Bearer ${token}`

        const url = `https://harvest-protegee-symptom.ngrok-free.dev/api/admin/penduduk/${this.itemToDelete.id}`
        const response = await fetch(url, { method: 'DELETE', headers })

        if (!response.ok) throw new Error('Gagal menghapus data dari server.')

        // Reset state & tutup modal
        this.deleting = false
        this.showDeleteModal = false
        this.itemToDelete = null

        // Reload data tabel
        this.fetchRasioData(this.pagination.current_page)
      } catch (error) {
        console.error('[DEBUG] Delete Error:', error)
        alert(`Error: ${error.message}`)
        this.deleting = false
      }
    },

    sortListLocally(list) {
      if (!Array.isArray(list)) return []
      return [...list].sort((a, b) => {
        const yearA = Number(a.tahun) || 0
        const yearB = Number(b.tahun) || 0
        return this.sortOrder === 'desc' ? yearB - yearA : yearA - yearB
      })
    },

    onSortChange() {
      this.displayedRasioList = this.sortListLocally(this.displayedRasioList)
    },

    changePage(page) {
      if (page < 1 || page > this.pagination.last_page || page === this.pagination.current_page) return
      this.fetchRasioData(page)
    },

    calculateRowIndex(index) {
      return (this.pagination.current_page - 1) * this.perPage + index + 1
    },

    handleSearch() {
      clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(() => {
        this.fetchRasioData(1)
      }, 400)
    },

    formatNumber(val) {
      if (val === null || val === undefined || isNaN(val)) return '0'
      return Number(val).toLocaleString('id-ID')
    },

    formatRasio(val) {
      if (val === null || val === undefined || isNaN(val)) return '0%'
      return `${Number(val).toFixed(2)}%`
    },

    formatDate(dateStr) {
      if (!dateStr) return '-'
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) return dateStr

      const day = String(date.getDate()).padStart(2, '0')
      const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ]
      const month = months[date.getMonth()]
      const year = date.getFullYear()
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')

      return `${day} ${month} ${year} pukul ${hours}.${minutes}`
    },

    closeModal() {
      this.showModal = false
      setTimeout(() => {
        this.selectedDetail = null
        this.modalError = ''
      }, 300)
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
  background-color: #f4f5f7;
  font-family: 'Poppins', sans-serif;
  color: #1e293b;
}

.admin-navbar {
  background-color: #1e385c;
  color: #1e385c;
  padding: 14px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-left { display: flex; gap: 25px; }
.nav-link {
  color: #ffffff; text-decoration: none; font-weight: 600; font-size: 0.95rem;
  display: flex; align-items: center; gap: 8px; padding-bottom: 6px; transition: all 0.2s;
  border-bottom: 2px solid transparent;
}
.nav-link.active, .nav-link:hover {
  color: #ffffff;
  border-bottom: 2px solid #ffffff;
}

.profile-container { position: relative; }
.user-profile {
  display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 0.9rem;
  cursor: pointer; color: #ffffff; padding: 6px 12px; border-radius: 6px; user-select: none;
}
.user-profile:hover { background-color: #27272a; }
.rotate-icon { transform: rotate(180deg); transition: transform 0.2s ease; }
.profile-dropdown {
  position: absolute; top: 110%; right: 0; background-color: #27272a; border: 1px solid #3f3f46;
  border-radius: 8px; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3); padding: 6px; min-width: 160px; z-index: 100;
}
.dropdown-item {
  width: 100%; display: flex; align-items: center; gap: 10px; background: transparent; border: none;
  color: #f87171; padding: 10px 12px; font-family: 'Poppins', sans-serif; font-size: 0.85rem;
  font-weight: 600; cursor: pointer; border-radius: 6px;
}
.dropdown-item:hover { background-color: #ef4444; color: #ffffff; }

.admin-content { padding: 28px 40px; max-width: 1400px; margin: 0 auto; }
.error-alert {
  background-color: #fef2f2; border: 1px solid #fca5a5; color: #991b1b;
  padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; font-size: 0.9rem; font-weight: 500;
}

.action-bar {
  display: flex; gap: 16px; align-items: center; margin-bottom: 20px;
  background-color: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; padding: 4px;
}
.search-box { position: relative; flex: 1; display: flex; align-items: center; }
.search-icon { position: absolute; left: 16px; color: #94a3b8; }
.search-box input {
  width: 100%; padding: 12px 16px 12px 48px; border: none; font-family: 'Poppins', sans-serif;
  font-size: 0.9rem; outline: none; color: #334155;
}
.sort-box { display: flex; align-items: center; }
.sort-select {
  padding: 10px 14px; border-radius: 6px; border: 1px solid #cbd5e1; background-color: #f8fafc;
  font-family: 'Poppins', sans-serif; font-size: 0.85rem; font-weight: 600; color: #334155; outline: none; cursor: pointer;
}
.btn-add {
  background-color: #1e385c; color: #ffffff; border: none; padding: 12px 32px;
  border-radius: 6px; font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: background-color 0.2s;
}
.btn-add:hover { background-color: #162a45; }

.data-card { background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03); }
.card-header-navy { background-color: #1e385c; color: #ffffff; padding: 16px 24px; }
.card-header-navy h3 { margin: 0; font-size: 1.05rem; font-weight: 700; }
.table-container { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
.data-table th { background-color: #ffffff; color: #1e293b; font-weight: 700; padding: 16px 18px; border-bottom: 2px solid #f1f5f9; text-align: left; }
.data-table td { padding: 16px 18px; border-bottom: 1px solid #f1f5f9; color: #334155; vertical-align: middle; }
.data-table tbody tr:hover { background-color: #f8fafc; }

.badge-ratio {
  background-color: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 20px; font-weight: 700; font-size: 0.85rem; display: inline-block;
}
.badge-ratio-lg {
  background-color: #dbeafe; color: #1e40af; padding: 6px 16px; border-radius: 20px; font-weight: 700; font-size: 1.1rem; display: inline-block;
}

.action-buttons { display: flex; align-items: center; justify-content: center; gap: 10px; }
.btn-icon { background: none; border: none; cursor: pointer; padding: 4px; display: flex; align-items: center; justify-content: center; transition: transform 0.15s; }
.btn-icon:hover { transform: scale(1.2); }
.btn-icon:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-info { color: #1e293b; }
.btn-edit { color: #1e385c; }
.btn-delete { color: #dc2626; }

.card-footer-pagination {
  padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f1f5f9;
}
.total-info { font-size: 0.85rem; color: #64748b; font-weight: 600; }

.pagination-controls { display: flex; gap: 6px; align-items: center; }
.btn-page {
  background-color: #ffffff; border: 1px solid #cbd5e1; color: #334155; padding: 6px 12px;
  border-radius: 6px; font-family: 'Poppins', sans-serif; font-size: 0.85rem; font-weight: 500; cursor: pointer; transition: all 0.2s;
}
.btn-page:hover:not(:disabled) { background-color: #f1f5f9; border-color: #94a3b8; }
.btn-page.active { background-color: #1e385c; color: #ffffff; border-color: #1e385c; font-weight: 600; }
.btn-page:disabled { opacity: 0.5; cursor: not-allowed; }

.text-center { text-align: center; }
.text-right { text-align: right; }
.font-bold { font-weight: 700; }
.font-mono { font-family: monospace; font-size: 0.95rem; }
.font-xl { font-size: 1.25rem; }
.py-5 { padding-top: 40px; padding-bottom: 40px; }
.py-4 { padding-top: 24px; padding-bottom: 24px; }
.mt-3 { margin-top: 12px; }
.loading-text, .empty-text { color: #64748b; font-weight: 500; margin-top: 10px; }

.spinner {
  width: 28px; height: 28px; border: 3px solid #f3f3f3; border-top: 3px solid #1e385c;
  border-radius: 50%; margin: 0 auto; animation: spin 0.8s linear infinite;
}
.spinner-sm {
  width: 16px; height: 16px; border: 2px solid #ffffff; border-top: 2px solid transparent;
  border-radius: 50%; display: inline-block; animation: spin 0.8s linear infinite;
}
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background-color: rgba(15, 23, 42, 0.4); 
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  display: flex; justify-content: center; align-items: center; z-index: 9999;
}
.modal-container {
  background-color: #ffffff; width: 90%; max-width: 580px; border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2); overflow: hidden;
}
.modal-sm { max-width: 440px; }

.modal-header {
  background-color: #1e385c; color: #ffffff; padding: 16px 24px;
  display: flex; justify-content: space-between; align-items: center;
}
.header-delete { background-color: #991b1b; }
.modal-header h3 { margin: 0; font-size: 1.1rem; font-weight: 600; }
.btn-close { background: none; border: none; color: #ffffff; font-size: 1.5rem; cursor: pointer; opacity: 0.8; }
.btn-close:hover { opacity: 1; }
.modal-body { padding: 24px; max-height: 75vh; overflow-y: auto; overflow-x: hidden; }

.detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.detail-group { background-color: #f8fafc; padding: 12px 16px; border-radius: 8px; border: 1px solid #e2e8f0; }
.detail-group label { display: block; font-size: 0.75rem; color: #64748b; font-weight: 600; margin-bottom: 4px; text-transform: uppercase; }
.detail-group p { margin: 0; font-size: 0.9rem; color: #1e293b; word-break: break-word; }

.form-stack { display: flex; flex-direction: column; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label { font-size: 0.8rem; font-weight: 600; color: #475569; }
.required { color: #dc2626; }
.form-group input {
  width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px;
  font-family: 'Poppins', sans-serif; font-size: 0.85rem; color: #1e293b; outline: none; transition: border-color 0.2s; box-sizing: border-box;
}
.form-group input:focus { border-color: #1e385c; }

.input-readonly {
  background-color: #f1f5f9 !important;
  color: #64748b !important;
  cursor: not-allowed;
  border-color: #e2e8f0 !important;
}

.help-text { font-size: 0.75rem; color: #64748b; font-style: italic; }

.delete-icon-wrapper {
  width: 64px; height: 64px; background-color: #fef2f2; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto;
}
.delete-title { font-size: 1.15rem; font-weight: 700; color: #1e293b; margin: 0 0 8px 0; }
.delete-desc { font-size: 0.88rem; color: #64748b; margin: 0; line-height: 1.5; }
.footer-center { justify-content: center; }

.modal-footer {
  padding: 16px 24px; background-color: #f8fafc; border-top: 1px solid #e2e8f0;
  display: flex; justify-content: flex-end; gap: 12px;
}
.btn-tutup, .btn-cancel {
  background-color: #64748b; color: #ffffff; border: none; padding: 10px 24px;
  border-radius: 6px; font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: background-color 0.2s;
}
.btn-tutup:hover, .btn-cancel:hover { background-color: #475569; }

.btn-submit {
  background-color: #1e385c; color: #ffffff; border: none; padding: 10px 24px;
  border-radius: 6px; font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 0.9rem;
  cursor: pointer; transition: background-color 0.2s; display: flex; align-items: center; gap: 8px;
}
.btn-submit:hover:not(:disabled) { background-color: #162a45; }

.btn-delete-confirm {
  background-color: #dc2626; color: #ffffff; border: none; padding: 10px 24px;
  border-radius: 6px; font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 0.9rem;
  cursor: pointer; transition: background-color 0.2s; display: flex; align-items: center; gap: 8px;
}
.btn-delete-confirm:hover:not(:disabled) { background-color: #b91c1c; }
.btn-submit:disabled, .btn-cancel:disabled, .btn-delete-confirm:disabled { opacity: 0.6; cursor: not-allowed; }

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
</style>