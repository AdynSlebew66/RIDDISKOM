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

        <router-link to="/admin/kegiatan" class="nav-link" active-class="active">
          Kegiatan
        </router-link>

        <router-link to="/admin/jadwal" class="nav-link" active-class="active">
          Jadwal
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
      <div class="page-title">
        <h2>Data Jadwal Admin UMKM</h2>
      </div>

      <!-- Search & Add Button Bar -->
      <div class="action-bar">
        <div class="search-box">
          <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input
            type="text"
            v-model="searchQuery"
            @input="handleSearch"
            placeholder="Cari Nama Kegiatan..."
          />
        </div>

        <button class="btn-add" @click="openAddModal">
          + Tambah
        </button>
      </div>

      <!-- Error Alert -->
      <div v-if="errorMessage" class="error-alert">
        {{ errorMessage }}
      </div>

      <!-- Success Alert -->
      <div v-if="successMessage" class="success-alert">
        {{ successMessage }}
      </div>

      <!-- Table Card Wrapper -->
      <div class="data-card">
        <div class="card-header-navy">
          <h3>Data Jadwal Kegiatan</h3>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th class="text-center" style="width: 60px;">No</th>
                <th>Nama Kegiatan</th>
                <th>Tanggal</th>
                <th class="text-center">Jam</th>
                <th class="text-center">Jumlah Peserta</th>
                <th class="text-center" style="width: 130px;">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <!-- Loading State -->
              <tr v-if="loading">
                <td colspan="6" class="text-center py-5">
                  <div class="spinner"></div>
                  <p class="loading-text">Memuat data jadwal...</p>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-else-if="displayedJadwalList.length === 0">
                <td colspan="6" class="text-center py-5 empty-text">
                  Data jadwal tidak ditemukan.
                </td>
              </tr>

              <!-- Data Rows -->
              <tr v-else v-for="(item, index) in displayedJadwalList" :key="item.id || index">
                <td class="text-center font-bold">{{ calculateRowIndex(index) }}</td>
                <td class="font-bold">{{ item.nama_kegiatan || '-' }}</td>
                <td>{{ formatTanggal(item.tanggal) }}</td>
                <td class="text-center">{{ formatJam(item.jam) }}</td>
                <td class="text-center">{{ formatPeserta(item.jumlah_peserta) }}</td>
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
            <select v-model.number="perPage" @change="onPerPageChange" class="per-page-select">
              <option :value="10">10 Baris</option>
              <option :value="25">25 Baris</option>
              <option :value="50">50 Baris</option>
            </select>
          </div>

          <div v-if="pagination.last_page > 1" class="pagination-controls">
            <button
              class="btn-page"
              :disabled="pagination.current_page === 1"
              @click="changePage(pagination.current_page - 1)"
            >
              &larr; Previous
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
              Next &rarr;
            </button>
          </div>
          <div v-else class="pagination-controls">
            <span class="total-info">Total: {{ pagination.total }} Data</span>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal Detail -->
    <transition name="modal-fade">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-container">
          <div class="modal-header">
            <h3>Detail Jadwal Kegiatan</h3>
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
              <div class="detail-group col-span-2">
                <label>Nama Kegiatan</label>
                <p class="font-bold">{{ selectedDetail.nama_kegiatan || '-' }}</p>
              </div>
              <div class="detail-group">
                <label>Tanggal</label>
                <p>{{ formatTanggal(selectedDetail.tanggal) }}</p>
              </div>
              <div class="detail-group">
                <label>Jam</label>
                <p>{{ formatJam(selectedDetail.jam) }}</p>
              </div>
              <div class="detail-group">
                <label>Jumlah Peserta</label>
                <p>{{ formatPeserta(selectedDetail.jumlah_peserta) }}</p>
              </div>
              <div class="detail-group">
                <label>Bulan</label>
                <p>{{ selectedDetail.bulan || '-' }}</p>
              </div>
              <div class="detail-group col-span-2">
                <label>Link Pendaftaran</label>
                <p>
                  <a v-if="selectedDetail.link_pendaftaran" :href="selectedDetail.link_pendaftaran" target="_blank" rel="noopener" class="link-daftar">{{ selectedDetail.link_pendaftaran }}</a>
                  <span v-else>-</span>
                </p>
              </div>
              <div class="detail-group col-span-2">
                <label>Keterangan</label>
                <p>{{ selectedDetail.keterangan || '-' }}</p>
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
        <div class="modal-container">
          <div class="modal-header">
            <h3>{{ isEditMode ? 'Edit Data Jadwal' : 'Tambah Data Jadwal' }}</h3>
            <button class="btn-close" @click="closeFormModal">&times;</button>
          </div>

          <form @submit.prevent="submitForm">
            <div class="modal-body">
              <div v-if="formError" class="error-alert">
                {{ formError }}
              </div>

              <div class="form-stack">
                <div class="form-group">
                  <label>Nama Kegiatan <span class="required">*</span></label>
                  <input
                    type="text"
                    v-model="formData.nama_kegiatan"
                    required
                    placeholder="Contoh: Sosialisasi Perizinan"
                  />
                </div>

                <div class="form-grid-2">
                  <div class="form-group">
                    <label>Tanggal <span class="required">*</span></label>
                    <input type="date" v-model="formData.tanggal" min="2000-01-01" max="2100-12-31" required />
                  </div>
                  <div class="form-group">
                    <label>Jam</label>
                    <input type="time" v-model="formData.jam" />
                    <small class="help-text">Kosongkan jika belum ada jam.</small>
                  </div>
                </div>

                <div class="form-group">
                  <label>Jumlah Peserta</label>
                  <input
                    type="number"
                    min="0"
                    v-model.number="formData.jumlah_peserta"
                    placeholder="0"
                  />
                  <small class="help-text">Isi 0 jika belum ada data peserta (tampil "-").</small>
                </div>

                <div class="form-group">
                  <label>Link Pendaftaran</label>
                  <input
                    type="url"
                    v-model="formData.link_pendaftaran"
                    placeholder="https://..."
                  />
                </div>

                <div class="form-group">
                  <label>Keterangan</label>
                  <textarea v-model="formData.keterangan" rows="3" placeholder="Contoh: Dilaksanakan 3x"></textarea>
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

    <!-- Modal Konfirmasi Hapus -->
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
            <h4 class="delete-title">Hapus Data Jadwal?</h4>
            <p class="delete-desc">
              Apakah kamu yakin ingin menghapus jadwal <strong>"{{ itemToDelete?.nama_kegiatan }}"</strong>? Tindakan ini tidak dapat dibatalkan.
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
const API_BASE = 'https://harvest-protegee-symptom.ngrok-free.dev/api/admin/jadwal'

export default {
  name: 'JadwalAdminView',
  data() {
    return {
      showDropdown: false,
      loading: false,
      errorMessage: '',
      successMessage: '',
      successTimeout: null,
      searchQuery: '',
      searchTimeout: null,
      perPage: 10,

      allJadwalList: [],
      currentPage: 1,

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
        nama_kegiatan: '',
        tanggal: '',
        jam: '',
        jumlah_peserta: 0,
        link_pendaftaran: '',
        keterangan: ''
      }
    }
  },
  computed: {
    // Filter lokal berdasarkan pencarian nama kegiatan
    filteredJadwalList() {
      const q = (this.searchQuery || '').trim().toLowerCase()
      if (!q) return this.allJadwalList
      return this.allJadwalList.filter((item) =>
        String(item.nama_kegiatan || '').toLowerCase().includes(q)
      )
    },
    // Potongan data sesuai halaman & jumlah baris (client-side)
    displayedJadwalList() {
      const start = (this.currentPage - 1) * this.perPage
      return this.filteredJadwalList.slice(start, start + this.perPage)
    },
    pagination() {
      const total = this.filteredJadwalList.length
      const last_page = Math.max(1, Math.ceil(total / this.perPage))
      const current_page = Math.min(this.currentPage, last_page)
      return { current_page, last_page, total }
    },
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
    this.fetchJadwalData(1)
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
    buildHeaders(isJson = false) {
      const headers = {
        Accept: 'application/json',
        'ngrok-skip-browser-warning': '69420'
      }
      const token = this.getAuthToken()
      if (token) headers.Authorization = `Bearer ${token}`
      if (isJson) headers['Content-Type'] = 'application/json'
      return headers
    },

    // Ambil SATU halaman paginator Laravel:
    // { message, data: { current_page, data: [...], last_page, total, ... } }
    // atau { message, data: [...] } untuk respons array polos.
    // Memakai ?page= & ?per_page= (parameter resmi sesuai dokumentasi).
    // TANPA parameter search agar tidak memicu error 500 di server.
    async fetchJadwalPage(page = 1, perPage = 100) {
      const params = new URLSearchParams({ page, per_page: perPage })
      const response = await fetch(`${API_BASE}?${params.toString()}`, {
        method: 'GET',
        headers: this.buildHeaders()
      })

      if (response.status === 401) {
        this.$router.push('/login')
        return null
      }

      if (!response.ok) {
        const body = await response.text().catch(() => '')
        throw new Error(`Gagal mengambil data. Status: ${response.status}${body ? ` - ${body.slice(0, 200)}` : ''}`)
      }

      const result = await response.json()
      const pageData = result.data || {}

      if (pageData && Array.isArray(pageData.data)) {
        return {
          list: pageData.data,
          current_page: Number(pageData.current_page) || page,
          last_page: Number(pageData.last_page) || 1
        }
      }
      if (Array.isArray(result.data)) {
        return { list: result.data, current_page: 1, last_page: 1 }
      }
      return { list: [], current_page: 1, last_page: 1 }
    },

    async fetchJadwalData(page = 1) {
      this.loading = true
      this.errorMessage = ''
      try {
        const first = await this.fetchJadwalPage(1)
        if (!first) return

        let all = [...first.list]
        // Ikuti paginator server sampai halaman terakhir agar
        // pencarian & pagination client-side mencakup seluruh data.
        for (let p = 2; p <= first.last_page; p++) {
          const next = await this.fetchJadwalPage(p)
          if (!next) break
          all = all.concat(next.list)
        }

        this.allJadwalList = all
        this.currentPage = page || 1
        if (this.currentPage > this.pagination.last_page) {
          this.currentPage = this.pagination.last_page
        }
      } catch (error) {
        this.errorMessage = `Error: ${error.message || 'Gagal terhubung ke API.'}`
        this.allJadwalList = []
        this.currentPage = 1
      } finally {
        this.loading = false
      }
    },

    onPerPageChange() {
      this.currentPage = 1
    },

    changePage(page) {
      if (page < 1 || page > this.pagination.last_page || page === this.pagination.current_page) return
      this.currentPage = page
    },

    calculateRowIndex(index) {
      return (this.pagination.current_page - 1) * this.perPage + index + 1
    },

    handleSearch() {
      clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(() => {
        this.currentPage = 1
      }, 400)
    },

    formatTanggal(dateString) {
      if (!dateString) return '-'
      const d = new Date(dateString)
      if (isNaN(d.getTime())) return dateString
      return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    },
    // MANIPULASI JAM: 00:00:00 / "-" / kosong -> "-"
    formatJam(jam) {
      if (!jam || jam === '-') return '-'
      const s = String(jam).trim()
      if (s === '-' || s.startsWith('00:00')) return '-'
      const match = s.match(/^(\d{2}):(\d{2})/)
      if (match) return `${match[1]}:${match[2]}`
      return s
    },
    // MANIPULASI PESERTA: 0 / kosong -> "-"
    formatPeserta(jumlah) {
      if (jumlah === null || jumlah === undefined || Number(jumlah) === 0) return '-'
      return Number(jumlah).toLocaleString('id-ID')
    },
    // Input time ("HH:MM") -> API ("HH:MM", format H:i); kosong -> null
    toApiJam(timeValue) {
      if (!timeValue) return null
      const s = String(timeValue).trim()
      const match = s.match(/^(\d{2}):(\d{2})/)
      return match ? `${match[1]}:${match[2]}` : s
    },
    // API ("HH:MM:SS" / "-") -> input time ("HH:MM"); "00:00:00" -> kosong
    toTimeInputValue(jam) {
      if (!jam || jam === '-') return ''
      const s = String(jam).trim()
      if (s === '-' || s.startsWith('00:00')) return ''
      const match = s.match(/^(\d{2}):(\d{2})/)
      return match ? `${match[1]}:${match[2]}` : ''
    },
    // API DATE ("YYYY-MM-DD...") -> input date ("YYYY-MM-DD")
    toDateInputValue(value) {
      if (!value) return ''
      if (/^\d{4}-\d{2}-\d{2}$/.test(String(value))) return String(value)
      const d = new Date(value)
      if (isNaN(d.getTime())) return ''
      const pad = (n) => String(n).padStart(2, '0')
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
    },

    showSuccess(msg) {
      this.successMessage = msg
      clearTimeout(this.successTimeout)
      this.successTimeout = setTimeout(() => {
        this.successMessage = ''
      }, 3500)
    },

    openAddModal() {
      this.isEditMode = false
      this.formError = ''
      this.resetFormData()
      this.showFormModal = true
    },

    handleEdit(item) {
      this.isEditMode = true
      this.formError = ''
      this.formData = {
        id: item.id,
        nama_kegiatan: item.nama_kegiatan || '',
        tanggal: this.toDateInputValue(item.tanggal),
        jam: this.toTimeInputValue(item.jam),
        jumlah_peserta: Number(item.jumlah_peserta) || 0,
        link_pendaftaran: item.link_pendaftaran || '',
        keterangan: item.keterangan || ''
      }
      this.showFormModal = true
    },

    resetFormData() {
      this.formData = {
        id: null,
        nama_kegiatan: '',
        tanggal: '',
        jam: '',
        jumlah_peserta: 0,
        link_pendaftaran: '',
        keterangan: ''
      }
    },

    closeFormModal() {
      this.showFormModal = false
      setTimeout(() => {
        this.resetFormData()
        this.formError = ''
      }, 300)
    },

    validateForm() {
      const nama = (this.formData.nama_kegiatan || '').trim()
      if (!nama) return 'Nama kegiatan wajib diisi.'
      if (!this.formData.tanggal) return 'Tanggal wajib diisi.'
      // Pastikan format YYYY-MM-DD dengan tahun 4 digit yang wajar.
      // Mencegah tahun seperti "14124" yang ditolak MySQL (error 1292).
      if (!/^\d{4}-\d{2}-\d{2}$/.test(this.formData.tanggal)) {
        return 'Format tanggal tidak valid. Gunakan kalender atau format YYYY-MM-DD.'
      }
      const d = new Date(this.formData.tanggal)
      if (isNaN(d.getTime())) return 'Format tanggal tidak valid.'
      const year = Number(this.formData.tanggal.slice(0, 4))
      if (year < 2000 || year > 2100) return 'Tahun pada tanggal harus antara 2000 sampai 2100.'
      if (this.formData.link_pendaftaran && this.formData.link_pendaftaran.trim()) {
        try {
          new URL(this.formData.link_pendaftaran.trim())
        } catch (e) {
          return 'Link pendaftaran tidak valid.'
        }
      }
      if (Number(this.formData.jumlah_peserta) < 0) return 'Jumlah peserta tidak boleh negatif.'
      return ''
    },

    async submitForm() {
      const validationError = this.validateForm()
      if (validationError) {
        this.formError = validationError
        return
      }
      this.submittingForm = true
      this.formError = ''

      try {
        const isEdit = this.isEditMode && this.formData.id
        const url = isEdit ? `${API_BASE}/${this.formData.id}` : API_BASE
        const method = isEdit ? 'PUT' : 'POST'

        const payload = {
          nama_kegiatan: this.formData.nama_kegiatan.trim(),
          tanggal: this.formData.tanggal.slice(0, 10),
          jam: this.toApiJam(this.formData.jam),
          jumlah_peserta: Number(this.formData.jumlah_peserta) || 0,
          link_pendaftaran: (this.formData.link_pendaftaran || '').trim() || null,
          keterangan: (this.formData.keterangan || '').trim() || null
        }

        const response = await fetch(url, {
          method,
          headers: this.buildHeaders(true),
          body: JSON.stringify(payload)
        })

        const resJson = await response.json().catch(() => ({}))

        if (response.status === 401) {
          this.$router.push('/login')
          return
        }

        if (!response.ok) {
          const serverMsg = resJson.message
            || (resJson.errors ? Object.values(resJson.errors).flat().join(' ') : '')
            || 'Gagal menyimpan data. Pastikan semua field wajib diisi.'
          throw new Error(serverMsg)
        }

        this.closeFormModal()
        this.showSuccess(isEdit ? 'Data jadwal berhasil diperbarui.' : 'Data jadwal berhasil ditambahkan.')
        this.fetchJadwalData(this.pagination.current_page)
      } catch (err) {
        this.formError = err.message || 'Terjadi kesalahan saat memproses data.'
      } finally {
        this.submittingForm = false
      }
    },

    // ---------- Detail ----------
    async handleDetail(item) {
      this.showModal = true
      this.loadingDetail = true
      this.modalError = ''
      this.selectedDetail = null

      try {
        const response = await fetch(`${API_BASE}/${item.id}`, {
          method: 'GET',
          headers: this.buildHeaders()
        })

        if (response.status === 401) {
          this.$router.push('/login')
          return
        }

        if (!response.ok) throw new Error('Gagal menarik data detail dari server.')

        const result = await response.json()
        this.selectedDetail = result.data || item
      } catch (error) {
        // Fallback: tampilkan data baris tabel agar tombol info tetap berguna
        // walau endpoint detail sedang bermasalah.
        this.selectedDetail = item
        this.modalError = ''
      } finally {
        this.loadingDetail = false
      }
    },

    closeModal() {
      this.showModal = false
      setTimeout(() => {
        this.selectedDetail = null
        this.modalError = ''
      }, 300)
    },

    // ---------- Delete ----------
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

    async confirmDelete() {
      if (!this.itemToDelete) return
      this.deleting = true
      try {
        const response = await fetch(`${API_BASE}/${this.itemToDelete.id}`, {
          method: 'DELETE',
          headers: this.buildHeaders()
        })

        if (response.status === 401) {
          this.$router.push('/login')
          return
        }

        if (!response.ok) throw new Error('Gagal menghapus data dari server.')

        this.showDeleteModal = false
        this.itemToDelete = null
        this.showSuccess('Data jadwal berhasil dihapus.')
        this.fetchJadwalData(this.pagination.current_page)
      } catch (error) {
        alert(`Error: ${error.message}`)
      } finally {
        this.deleting = false
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
  background-color: #f4f5f7;
  font-family: 'Poppins', sans-serif;
  color: #1e293b;
}

.admin-navbar {
  background-color: #1e385c;
  color: #ffffff;
  padding: 14px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-left { display: flex; gap: 25px; align-items: center; }
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
.page-title h2 { margin: 0 0 18px 0; font-size: 1.25rem; font-weight: 700; color: #1a1a1a; }

.error-alert {
  background-color: #fef2f2; border: 1px solid #fca5a5; color: #991b1b;
  padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; font-size: 0.9rem; font-weight: 500;
}
.success-alert {
  background-color: #f0fdf4; border: 1px solid #86efac; color: #166534;
  padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; font-size: 0.9rem; font-weight: 500;
}

.action-bar {
  display: flex; gap: 16px; align-items: center; margin-bottom: 20px;
}
.search-box { position: relative; flex: 1; display: flex; align-items: center; background-color: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 2px 6px rgba(0,0,0,0.04); }
.search-icon { position: absolute; left: 16px; color: #94a3b8; }
.search-box input {
  width: 100%; padding: 12px 16px 12px 48px; border: none; background: transparent; font-family: 'Poppins', sans-serif;
  font-size: 0.9rem; outline: none; color: #334155; border-radius: 8px;
}
.btn-add {
  background-color: #1e385c; color: #ffffff; border: none; padding: 12px 32px;
  border-radius: 6px; font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: background-color 0.2s;
  white-space: nowrap;
}
.btn-add:hover { background-color: #162a45; }

.data-card { background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03); }
.card-header-navy { background-color: #1e385c; color: #ffffff; padding: 16px 24px; }
.card-header-navy h3 { margin: 0; font-size: 1.05rem; font-weight: 700; }
.table-container { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
.data-table th { background-color: #ffffff; color: #1e293b; font-weight: 700; padding: 16px 18px; border-bottom: 2px solid #f1f5f9; text-align: left; }
.data-table td { padding: 16px 18px; border-bottom: 1px solid #f1f5f9; color: #334155; vertical-align: middle; }
.data-table tbody tr:hover { background-color: #f8fafc; }

.action-buttons { display: flex; align-items: center; justify-content: center; gap: 10px; }
.btn-icon { background: none; border: none; cursor: pointer; padding: 4px; display: flex; align-items: center; justify-content: center; transition: transform 0.15s; }
.btn-icon:hover { transform: scale(1.2); }
.btn-info { color: #1e293b; }
.btn-edit { color: #1e385c; }
.btn-delete { color: #dc2626; }

.card-footer-pagination {
  padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f1f5f9;
  flex-wrap: wrap; gap: 12px;
}
.per-page-select {
  padding: 8px 12px; border-radius: 6px; border: 1px solid #cbd5e1; background-color: #ffffff;
  font-family: 'Poppins', sans-serif; font-size: 0.85rem; font-weight: 600; color: #334155; outline: none; cursor: pointer;
}
.total-info { font-size: 0.85rem; color: #64748b; font-weight: 600; }

.pagination-controls { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
.btn-page {
  background-color: #ffffff; border: 1px solid #cbd5e1; color: #334155; padding: 6px 12px;
  border-radius: 6px; font-family: 'Poppins', sans-serif; font-size: 0.85rem; font-weight: 500; cursor: pointer; transition: all 0.2s;
}
.btn-page:hover:not(:disabled) { background-color: #f1f5f9; border-color: #94a3b8; }
.btn-page.active { background-color: #1e293b; color: #ffffff; border-color: #1e293b; font-weight: 600; }
.btn-page:disabled { opacity: 0.5; cursor: not-allowed; }

.text-center { text-align: center; }
.font-bold { font-weight: 700; }
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
  padding: 20px;
}
.modal-container {
  background-color: #ffffff; width: 90%; max-width: 580px; border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2); overflow: hidden;
  max-height: 90vh; display: flex; flex-direction: column;
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
.col-span-2 { grid-column: span 2; }
.detail-group label { display: block; font-size: 0.75rem; color: #64748b; font-weight: 600; margin-bottom: 4px; text-transform: uppercase; }
.detail-group p { margin: 0; font-size: 0.9rem; color: #1e293b; word-break: break-word; }
.link-daftar { color: #1d4ed8; word-break: break-all; }

.form-stack { display: flex; flex-direction: column; gap: 16px; }
.form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label { font-size: 0.8rem; font-weight: 600; color: #475569; }
.required { color: #dc2626; }
.help-text { font-size: 0.75rem; color: #64748b; font-style: italic; }
.form-group input, .form-group textarea {
  width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px;
  font-family: 'Poppins', sans-serif; font-size: 0.85rem; color: #1e293b; outline: none; transition: border-color 0.2s; box-sizing: border-box;
}
.form-group input:focus, .form-group textarea:focus { border-color: #1e385c; }

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

@media (max-width: 640px) {
  .admin-content { padding: 20px; }
  .action-bar { flex-direction: column; align-items: stretch; }
  .detail-grid, .form-grid-2 { grid-template-columns: 1fr; }
  .col-span-2 { grid-column: span 1; }
}
</style>
