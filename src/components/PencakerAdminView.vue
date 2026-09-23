<template>
  <div class="admin-wrapper" @click="closeDropdownOnClickOutside">
    <!-- Top Navbar Admin -->
    <header class="admin-navbar">
      <div class="nav-left">
        <router-link to="/admin/pencaker" class="nav-link" active-class="active">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          Dashboard
        </router-link>
      </div>

      <!-- Right Nav / Profile -->
      <div class="nav-right">
        <div class="profile-container">
          <div class="user-profile" @click.stop="toggleDropdown">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span>AdminP3TK</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="{ 'rotate-icon': showDropdown }"><path d="M6 9l6 6 6-6"/></svg>
          </div>

          <!-- Dropdown Logout -->
          <transition name="dropdown-fade">
            <div v-if="showDropdown" class="profile-dropdown">
              <button @click="handleLogout" class="dropdown-item logout-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2 2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
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
        <h2>Data Pencari Kerja (P3TK)</h2>
      </div>

      <!-- Search & Filter Bar -->
      <div class="action-bar">
        <div class="search-box">
          <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input
            type="text"
            v-model="searchQuery"
            @input="handleSearch"
            placeholder="Cari Nama / Telepon / Alamat..."
          />
        </div>

        <div class="sort-box">
          <select v-model="filterTahun" @change="onFilterChange" class="sort-select" title="Filter tahun">
            <option value="">Semua Tahun</option>
            <option v-for="t in tahunOptions" :key="t" :value="t">{{ t }}</option>
          </select>
        </div>

        <div class="sort-box">
          <select v-model="filterBulan" @change="onFilterChange" class="sort-select" title="Filter bulan">
            <option value="">Semua Bulan</option>
            <option v-for="b in bulanOptions" :key="b.value" :value="b.value">{{ b.label }}</option>
          </select>
        </div>

        <div class="sort-box">
          <select v-model="filterJenisKelamin" @change="onFilterChange" class="sort-select" title="Filter jenis kelamin">
            <option value="">Semua JK</option>
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>
        </div>

        <div class="sort-box">
          <select v-model="filterPendidikanId" @change="onFilterChange" class="sort-select" title="Filter pendidikan">
            <option value="">Semua Pendidikan</option>
            <option v-for="p in pendidikanOptions" :key="p.id" :value="p.id">{{ p.nama }}</option>
          </select>
        </div>

        <button class="btn-add" @click="openAddModal">
          + Tambah
        </button>

        <button class="btn-excel" @click="exportToExcel" :disabled="exportingExcel" title="Download Excel dari server sesuai filter yang aktif">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          <span>{{ exportingExcel ? 'Mengekspor...' : 'Export Excel' }}</span>
        </button>
      </div>

      <!-- Error Alert -->
      <div v-if="errorMessage" class="error-alert">
        {{ errorMessage }}
      </div>

      <!-- Info Alert (stub CRUD) -->
      <div v-if="infoMessage" class="info-alert">
        {{ infoMessage }}
      </div>

      <!-- Table Card Wrapper -->
      <div class="data-card">
        <div class="card-header-navy">
          <h3>Data Pencaker</h3>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th class="text-center" style="width: 60px;">No</th>
                <th>Nama</th>
                <th class="text-center">Jenis Kelamin</th>
                <th>Pendidikan</th>
                <th>Tgl Lahir</th>
                <th>Telepon</th>
                <th>Alamat</th>
                <th>Tgl Daftar</th>
                <th class="text-center" style="width: 140px;">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <!-- Loading State -->
              <tr v-if="loading">
                <td colspan="9" class="text-center py-5">
                  <div class="spinner"></div>
                  <p class="loading-text">Memuat data pencari kerja...</p>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-else-if="pencakerList.length === 0">
                <td colspan="9" class="text-center py-5 empty-text">
                  Data pencari kerja tidak ditemukan.
                </td>
              </tr>

              <!-- Data Rows -->
              <tr v-else v-for="(item, index) in pencakerList" :key="item.id || index">
                <td class="text-center font-bold">{{ calculateRowIndex(index) }}</td>
                <td class="font-bold">{{ formatText(item?.nama) }}</td>
                <td class="text-center">{{ formatJenisKelamin(item?.jenis_kelamin) }}</td>
                <td>{{ formatPendidikan(item) }}</td>
                <td>{{ formatDate(item?.tanggal_lahir) }}</td>
                <td>{{ formatText(item?.telepon) }}</td>
                <td class="td-alamat" :title="item?.alamat">{{ formatText(item?.alamat) }}</td>
                <td>{{ formatDate(item?.tanggal_daftar) }}</td>
                <td class="text-center">
                  <div class="action-buttons">
                    <button class="btn-icon btn-info" title="Detail" @click="handleDetail(item)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                    </button>
                    <button class="btn-icon btn-edit" title="Edit" @click="openEditModal(item)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button class="btn-icon btn-delete" title="Hapus" @click="openDeleteModal(item)">
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
            <select v-model.number="perPage" @change="onPerPageChange" class="per-page-select">
              <option :value="10">10 / halaman</option>
              <option :value="15">15 / halaman</option>
              <option :value="25">25 / halaman</option>
              <option :value="50">50 / halaman</option>
            </select>
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

    <!-- Modal Detail -->
    <transition name="modal-fade">
      <div v-if="showDetailModal" class="modal-overlay" @click.self="closeDetailModal">
        <div class="modal-container">
          <div class="modal-header">
            <h3>Detail Pencari Kerja</h3>
            <button class="btn-close" @click="closeDetailModal">&times;</button>
          </div>
          <div class="modal-body">
            <div v-if="detailItem" class="detail-grid">
              <div class="detail-row"><span class="detail-label">Nama</span><span class="detail-value">{{ formatText(detailItem.nama) }}</span></div>
              <div class="detail-row"><span class="detail-label">Tempat, Tgl Lahir</span><span class="detail-value">{{ formatText(detailItem.tempat_lahir) }}, {{ formatDate(detailItem.tanggal_lahir) }}</span></div>
              <div class="detail-row"><span class="detail-label">Jenis Kelamin</span><span class="detail-value">{{ formatJenisKelamin(detailItem.jenis_kelamin) }}</span></div>
              <div class="detail-row"><span class="detail-label">Pendidikan</span><span class="detail-value">{{ formatPendidikan(detailItem) }}</span></div>
              <div class="detail-row"><span class="detail-label">Jurusan</span><span class="detail-value">{{ formatText(detailItem.jurusan) }}</span></div>
              <div class="detail-row"><span class="detail-label">Status Perkawinan</span><span class="detail-value">{{ resolveStatusPerkawinan(detailItem.status_perkawinan_id) }}</span></div>
              <div class="detail-row"><span class="detail-label">Agama</span><span class="detail-value">{{ resolveAgama(detailItem.agama_id) }}</span></div>
              <div class="detail-row"><span class="detail-label">Tahun Lulus</span><span class="detail-value">{{ detailItem.tahun_lulus || '-' }}</span></div>
              <div class="detail-row"><span class="detail-label">Alamat</span><span class="detail-value">{{ formatText(detailItem.alamat) }}</span></div>
              <div class="detail-row"><span class="detail-label">Telepon</span><span class="detail-value">{{ formatText(detailItem.telepon) }}</span></div>
              <div class="detail-row"><span class="detail-label">Tahun / Bulan</span><span class="detail-value">{{ detailItem.tahun || '-' }} / {{ namaBulan(detailItem.bulan) }}</span></div>
              <div class="detail-row"><span class="detail-label">Tanggal Daftar</span><span class="detail-value">{{ formatDate(detailItem.tanggal_daftar) }}</span></div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" @click="closeDetailModal">Tutup</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal Tambah / Edit -->
    <transition name="modal-fade">
      <div v-if="showFormModal" class="modal-overlay" @click.self="closeFormModal">
        <div class="modal-container modal-lg">
          <div class="modal-header">
            <h3>{{ isEditMode ? 'Edit' : 'Tambah' }} Pencari Kerja</h3>
            <button class="btn-close" @click="closeFormModal">&times;</button>
          </div>
          <form @submit.prevent="submitForm">
            <div class="modal-body">
              <div v-if="formError" class="error-alert">{{ formError }}</div>
              <div class="form-grid">
                <div class="form-group">
                  <label>Nama Lengkap <span class="req">*</span></label>
                  <input type="text" v-model="formData.nama" placeholder="Nama pencari kerja" :class="{ invalid: fieldError('nama') }" />
                  <small v-if="fieldError('nama')" class="field-error">{{ fieldError('nama') }}</small>
                </div>
                <div class="form-group">
                  <label>Telepon</label>
                  <input type="text" v-model="formData.telepon" placeholder="No. telepon / HP" :class="{ invalid: fieldError('telepon') }" />
                  <small v-if="fieldError('telepon')" class="field-error">{{ fieldError('telepon') }}</small>
                </div>
                <div class="form-group">
                  <label>Tempat Lahir</label>
                  <input type="text" v-model="formData.tempat_lahir" placeholder="Tempat lahir" />
                </div>
                <div class="form-group">
                  <label>Tanggal Lahir</label>
                  <input type="date" v-model="formData.tanggal_lahir" />
                </div>
                <div class="form-group">
                  <label>Jenis Kelamin <span class="req">*</span></label>
                  <select v-model="formData.jenis_kelamin" :class="{ invalid: fieldError('jenis_kelamin') }">
                    <option value="">-- Pilih --</option>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                  <small v-if="fieldError('jenis_kelamin')" class="field-error">{{ fieldError('jenis_kelamin') }}</small>
                </div>
                <div class="form-group">
                  <label>Pendidikan</label>
                  <select v-model="formData.pendidikan_id">
                    <option value="">-- Pilih --</option>
                    <option v-for="p in pendidikanOptions" :key="p.id" :value="p.id">{{ p.nama }}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Jurusan</label>
                  <input type="text" v-model="formData.jurusan" placeholder="Jurusan / program studi" />
                </div>
                <div class="form-group">
                  <label>Tahun Lulus</label>
                  <input type="number" v-model.number="formData.tahun_lulus" placeholder="cth: 2024" min="1950" max="2100" />
                </div>
                <div class="form-group form-full form-row-3col">
                  <div class="form-group">
                    <label>Tanggal Daftar</label>
                    <input type="date" v-model="formData.tanggal_daftar" />
                  </div>
                  <div class="form-group">
                    <label>Tahun</label>
                    <input type="number" v-model.number="formData.tahun" min="2000" max="2100" />
                  </div>
                  <div class="form-group">
                    <label>Bulan</label>
                    <select v-model.number="formData.bulan">
                      <option v-for="b in bulanOptions" :key="b.value" :value="b.value">{{ b.label }}</option>
                    </select>
                  </div>
                </div>
                <div class="form-group form-full form-row-2col">
                  <div class="form-group">
                    <label>Status Perkawinan</label>
                    <select v-model.number="formData.status_perkawinan_id" :class="{ invalid: fieldError('status_perkawinan_id') }">
                      <option :value="null">-- Pilih --</option>
                      <option v-for="s in statusPerkawinanOptions" :key="s.id" :value="s.id">{{ s.nama }}</option>
                    </select>
                    <small v-if="fieldError('status_perkawinan_id')" class="field-error">{{ fieldError('status_perkawinan_id') }}</small>
                  </div>
                  <div class="form-group">
                    <label>Agama</label>
                    <select v-model.number="formData.agama_id" :class="{ invalid: fieldError('agama_id') }">
                      <option :value="null">-- Pilih --</option>
                      <option v-for="a in agamaOptions" :key="a.id" :value="a.id">{{ a.nama }}</option>
                    </select>
                    <small v-if="fieldError('agama_id')" class="field-error">{{ fieldError('agama_id') }}</small>
                  </div>
                </div>
                <div class="form-group form-full">
                  <label>Alamat</label>
                  <textarea v-model="formData.alamat" rows="2" placeholder="Alamat lengkap"></textarea>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn-secondary" @click="closeFormModal" :disabled="saving">Batal</button>
              <button type="submit" class="btn-primary" :disabled="saving">{{ saving ? 'Menyimpan...' : (isEditMode ? 'Simpan Perubahan' : 'Simpan') }}</button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- Modal Konfirmasi Hapus -->
    <transition name="modal-fade">
      <div v-if="showDeleteModal" class="modal-overlay" @click.self="closeDeleteModal">
        <div class="modal-container modal-sm">
          <div class="modal-header modal-header-danger">
            <h3>Hapus Data</h3>
            <button class="btn-close" @click="closeDeleteModal">&times;</button>
          </div>
          <div class="modal-body">
            <div v-if="formError" class="error-alert">{{ formError }}</div>
            <p class="delete-text">
              Yakin ingin menghapus data <strong>{{ deleteItem?.nama || '-' }}</strong>?
              Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" @click="closeDeleteModal" :disabled="deleting">Batal</button>
            <button class="btn-danger" @click="confirmDelete" :disabled="deleting">{{ deleting ? 'Menghapus...' : 'Ya, Hapus' }}</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
const API_BASE = 'https://harvest-protegee-symptom.ngrok-free.dev/api/admin/pencaker'

// ============================================================
// PETA ID MASTER — sesuaikan angka `id` jika berbeda dengan
// data master di backend (tidak ada endpoint master publik
// untuk agama & status perkawinan, jadi dipetakan manual).
// ============================================================
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

export default {
  name: 'PencakerAdminView',
  data() {
    return {
      pencakerList: [],
      loading: false,
      errorMessage: '',
      infoMessage: '',
      searchQuery: '',
      searchTimer: null,
      filterTahun: '',
      filterBulan: '',
      filterJenisKelamin: '',
      filterPendidikanId: '',
      exportingExcel: false,
      perPage: 10,
      pagination: {
        current_page: 1,
        last_page: 1,
        total: 0
      },
      tahunOptions: [],
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
      ],
      showDropdown: false,
      showDetailModal: false,
      detailItem: null,
      showFormModal: false,
      isEditMode: false,
      editingId: null,
      showDeleteModal: false,
      deleting: false,
      deleteItem: null,
      saving: false,
      formError: '',
      validationErrors: {},
      pendidikanOptions: [],
      statusPerkawinanOptions: STATUS_PERKAWINAN_OPTIONS,
      agamaOptions: AGAMA_OPTIONS,
      formData: this.blankForm()
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
    this.fetchTahunOptions()
    this.fetchPendidikanOptions()
    this.fetchPencaker(1)
  },
  methods: {
    blankForm() {
      const now = new Date()
      const pad = (n) => String(n).padStart(2, '0')
      return {
        nama: '',
        telepon: '',
        tempat_lahir: '',
        tanggal_lahir: '',
        jenis_kelamin: '',
        pendidikan_id: '',
        jurusan: '',
        tahun_lulus: null,
        tanggal_daftar: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
        tahun: now.getFullYear(),
        bulan: now.getMonth() + 1,
        status_perkawinan_id: null,
        agama_id: null,
        alamat: ''
      }
    },
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
    async fetchTahunOptions() {
      try {
        const res = await fetch('https://harvest-protegee-symptom.ngrok-free.dev/api/statistik/pencaker/tahun', {
          method: 'GET',
          headers: this.buildHeaders()
        })
        const json = await res.json().catch(() => ({}))
        if (res.ok && Array.isArray(json.data)) {
          this.tahunOptions = json.data
        }
      } catch (e) {
        console.error('[PencakerAdmin] gagal ambil daftar tahun:', e)
      }
    },
    async fetchPencaker(page = 1) {
      this.loading = true
      this.errorMessage = ''
      try {
        const params = new URLSearchParams({
          page: page,
          per_page: this.perPage
        })
        const q = (this.searchQuery || '').trim()
        if (q) params.append('search', q)
        if (this.filterTahun) params.append('tahun', this.filterTahun)
        if (this.filterBulan) params.append('bulan', this.filterBulan)
        if (this.filterJenisKelamin) params.append('jenis_kelamin', this.filterJenisKelamin)
        if (this.filterPendidikanId) params.append('pendidikan_id', this.filterPendidikanId)

        const response = await fetch(`${API_BASE}?${params.toString()}`, {
          method: 'GET',
          headers: this.buildHeaders()
        })

        if (response.status === 401) {
          this.$router.push('/login')
          return
        }
        if (!response.ok) {
          const body = await response.text().catch(() => '')
          throw new Error(`Gagal mengambil data. Status: ${response.status}${body ? ` - ${body.slice(0, 200)}` : ''}`)
        }

        const result = await response.json()
        const pageData = result.data || {}

        if (pageData && Array.isArray(pageData.data)) {
          this.pencakerList = pageData.data
          this.pagination = {
            current_page: Number(pageData.current_page) || page,
            last_page: Number(pageData.last_page) || 1,
            total: Number(pageData.total) || 0
          }
        } else if (Array.isArray(result.data)) {
          this.pencakerList = result.data
          this.pagination = { current_page: 1, last_page: 1, total: result.data.length }
        } else {
          this.pencakerList = []
          this.pagination = { current_page: 1, last_page: 1, total: 0 }
        }
      } catch (error) {
        this.errorMessage = `Error: ${error.message || 'Gagal terhubung ke API.'}`
        this.pencakerList = []
      } finally {
        this.loading = false
      }
    },
    handleSearch() {
      clearTimeout(this.searchTimer)
      this.searchTimer = setTimeout(() => {
        this.fetchPencaker(1)
      }, 500)
    },
    onFilterChange() {
      this.fetchPencaker(1)
    },
    onPerPageChange() {
      this.fetchPencaker(1)
    },
    changePage(page) {
      if (page < 1 || page > this.pagination.last_page) return
      this.fetchPencaker(page)
    },
    calculateRowIndex(index) {
      return (this.pagination.current_page - 1) * this.perPage + index + 1
    },
    handleDetail(item) {
      this.detailItem = item
      this.showDetailModal = true
    },
    closeDetailModal() {
      this.showDetailModal = false
      this.detailItem = null
    },
    // CRUD tambah/edit/hapus selesai.
    openAddModal() {
      this.isEditMode = false
      this.editingId = null
      this.formData = this.blankForm()
      this.validationErrors = {}
      this.formError = ''
      this.showFormModal = true
    },
    openEditModal(item) {
      this.isEditMode = true
      this.editingId = item.id
      this.formData = {
        nama: item.nama || '',
        telepon: item.telepon || '',
        tempat_lahir: item.tempat_lahir || '',
        tanggal_lahir: this.toDateInput(item.tanggal_lahir),
        jenis_kelamin: this.toJenisKelaminKode(item.jenis_kelamin),
        pendidikan_id: item.pendidikan_id ?? '',
        jurusan: item.jurusan || '',
        tahun_lulus: item.tahun_lulus ?? null,
        tanggal_daftar: this.toDateInput(item.tanggal_daftar) || this.blankForm().tanggal_daftar,
        tahun: item.tahun ?? new Date().getFullYear(),
        bulan: item.bulan ?? (new Date().getMonth() + 1),
        status_perkawinan_id: item.status_perkawinan_id ?? null,
        agama_id: item.agama_id ?? null,
        alamat: item.alamat || ''
      }
      this.validationErrors = {}
      this.formError = ''
      this.showFormModal = true
    },
    closeFormModal() {
      if (this.saving) return
      this.showFormModal = false
    },
    async fetchPendidikanOptions() {
      try {
        const res = await fetch('https://harvest-protegee-symptom.ngrok-free.dev/api/admin/pendidikan', {
          method: 'GET',
          headers: this.buildHeaders()
        })
        if (res.status === 401) return
        const json = await res.json().catch(() => ({}))
        const raw = json.data?.data || json.data || []
        this.pendidikanOptions = (Array.isArray(raw) ? raw : []).map((p) => ({
          id: p.id,
          nama: p.nama || p.name || `Pendidikan #${p.id}`
        }))
      } catch (e) {
        console.error('[PencakerAdmin] gagal ambil opsi pendidikan:', e)
      }
    },
    fieldError(name) {
      const errs = this.validationErrors[name]
      if (Array.isArray(errs) && errs.length) return errs[0]
      return ''
    },
    async submitForm() {
      this.saving = true
      this.formError = ''
      this.validationErrors = {}
      try {
        const f = this.formData
        const payload = {
          nama: (f.nama || '').trim(),
          telepon: (f.telepon || '').trim() || null,
          tempat_lahir: (f.tempat_lahir || '').trim() || null,
          tanggal_lahir: f.tanggal_lahir || null,
          jenis_kelamin: f.jenis_kelamin || null,
          pendidikan_id: f.pendidikan_id === '' || f.pendidikan_id === null ? null : Number(f.pendidikan_id),
          jurusan: (f.jurusan || '').trim() || null,
          tahun_lulus: f.tahun_lulus || null,
          tanggal_daftar: f.tanggal_daftar || null,
          tahun: f.tahun || null,
          bulan: f.bulan || null,
          status_perkawinan_id: f.status_perkawinan_id || null,
          agama_id: f.agama_id || null,
          alamat: (f.alamat || '').trim() || null
        }
        if (payload.tanggal_lahir) {
          const d = new Date(payload.tanggal_lahir)
          if (!isNaN(d.getTime())) payload.tahun_lahir = d.getFullYear()
        }

        const url = this.isEditMode ? `${API_BASE}/${this.editingId}` : API_BASE
        const response = await fetch(url, {
          method: this.isEditMode ? 'PUT' : 'POST',
          headers: this.buildHeaders(true),
          body: JSON.stringify(payload)
        })

        if (response.status === 401) {
          this.$router.push('/login')
          return
        }

        const result = await response.json().catch(() => ({}))

        if (response.status === 422) {
          this.validationErrors = result.errors || {}
          this.formError = result.message || 'Periksa kembali isian form (validasi gagal).'
          return
        }
        if (!response.ok) {
          throw new Error(result.message || `Gagal menyimpan data. Status: ${response.status}`)
        }

        this.showFormModal = false
        this.infoMessage = result.message || (this.isEditMode ? 'Data pencari kerja berhasil diperbarui.' : 'Data pencari kerja berhasil ditambahkan.')
        setTimeout(() => { this.infoMessage = '' }, 4000)
        this.fetchPencaker(this.pagination.current_page)
      } catch (error) {
        this.formError = error.message || 'Gagal terhubung ke API.'
      } finally {
        this.saving = false
      }
    },
    openDeleteModal(item) {
      this.deleteItem = item
      this.formError = ''
      this.showDeleteModal = true
    },
    closeDeleteModal() {
      if (this.deleting) return
      this.showDeleteModal = false
      this.deleteItem = null
    },
    async confirmDelete() {
      if (!this.deleteItem?.id) return
      this.deleting = true
      this.formError = ''
      try {
        const response = await fetch(`${API_BASE}/${this.deleteItem.id}`, {
          method: 'DELETE',
          headers: this.buildHeaders()
        })

        if (response.status === 401) {
          this.$router.push('/login')
          return
        }

        const result = await response.json().catch(() => ({}))
        if (!response.ok) {
          throw new Error(result.message || `Gagal menghapus data. Status: ${response.status}`)
        }

        this.showDeleteModal = false
        this.deleteItem = null
        this.infoMessage = result.message || 'Data pencari kerja berhasil dihapus.'
        setTimeout(() => { this.infoMessage = '' }, 4000)

        // Jika halaman jadi kosong dan bukan halaman 1, mundur satu halaman
        if (this.pencakerList.length <= 1 && this.pagination.current_page > 1) {
          this.fetchPencaker(this.pagination.current_page - 1)
        } else {
          this.fetchPencaker(this.pagination.current_page)
        }
      } catch (error) {
        this.formError = error.message || 'Gagal terhubung ke API.'
      } finally {
        this.deleting = false
      }
    },
    async exportToExcel() {
      // GET /api/admin/pencaker/export?tahun=&bulan=&jenis_kelamin=&pendidikan_id=&search=
      // -> file .xlsx langsung dari backend (Bearer Auth).
      if (this.exportingExcel) return
      this.exportingExcel = true
      this.errorMessage = ''
      try {
        const token = this.getAuthToken()
        if (!token) {
          this.$router.push('/login')
          return
        }
        const params = new URLSearchParams()
        if (this.filterTahun) params.append('tahun', this.filterTahun)
        if (this.filterBulan) params.append('bulan', this.filterBulan)
        if (this.filterJenisKelamin) params.append('jenis_kelamin', this.filterJenisKelamin)
        if (this.filterPendidikanId) params.append('pendidikan_id', this.filterPendidikanId)
        const q = (this.searchQuery || '').trim()
        if (q) params.append('search', q)

        const query = params.toString() ? `?${params.toString()}` : ''
        const response = await fetch(`${API_BASE}/export${query}`, {
          method: 'GET',
          headers: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/octet-stream, */*',
            'ngrok-skip-browser-warning': '69420',
            Authorization: `Bearer ${token}`
          }
        })

        if (response.status === 401) {
          this.$router.push('/login')
          return
        }

        const ctype = (response.headers.get('content-type') || '').toLowerCase()
        if (response.status === 422 || ctype.includes('json')) {
          const j = await response.json().catch(() => ({}))
          throw new Error(j.message || `Export gagal (status ${response.status}). Periksa filter tahun/bulan.`)
        }
        if (!response.ok) {
          throw new Error(`Export gagal (status ${response.status}).`)
        }

        const blob = await response.blob()
        if (!blob || blob.size === 0) throw new Error('File kosong dari server.')

        const dateStr = new Date().toISOString().slice(0, 10)
        const parts = ['Data_Pencaker', dateStr]
        if (this.filterTahun) parts.push(this.filterTahun)
        if (this.filterBulan) parts.push(`bln${this.filterBulan}`)
        this.downloadBlob(blob, `${parts.join('_')}.xlsx`, response.headers.get('content-disposition'))

        this.infoMessage = 'File Excel berhasil diunduh.'
        setTimeout(() => { this.infoMessage = '' }, 4000)
      } catch (error) {
        this.errorMessage = `Error export: ${error.message || 'Gagal terhubung ke API.'}`
      } finally {
        this.exportingExcel = false
      }
    },
    downloadBlob(blob, fallbackName, contentDisposition) {
      let fileName = fallbackName
      if (contentDisposition) {
        const match = contentDisposition.match(/filename\*?=(?:UTF-8'')?["']?([^"';\n]+)["']?/i)
        if (match && match[1]) {
          try {
            fileName = decodeURIComponent(match[1].trim())
          } catch (e) {
            fileName = match[1].trim()
          }
        }
      }
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      a.remove()
      setTimeout(() => window.URL.revokeObjectURL(url), 2000)
    },
    toDateInput(val) {
      if (!val) return ''
      const d = new Date(val)
      if (isNaN(d.getTime())) return ''
      const pad = (n) => String(n).padStart(2, '0')
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
    },
    toJenisKelaminKode(val) {
      if (!val) return ''
      const s = String(val).trim().toUpperCase()
      if (s.startsWith('L')) return 'L'
      if (s.startsWith('P')) return 'P'
      return s
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
      // API relasi bisa bernama `pendidikan`; fallback ke pendidikan_id + jurusan
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
    },
    namaBulan(val) {
      const found = this.bulanOptions.find((b) => Number(b.value) === Number(val))
      return found ? found.label : (val ?? '-')
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
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

/* Layout Admin (mengikuti halaman admin lain) */
.admin-wrapper {
  min-height: 100vh;
  background-color: #f4f5f7;
  font-family: 'Poppins', sans-serif;
  color: #1e293b;
}

.admin-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 28px;
  background-color: #1e385c;
  color: #ffffff;
  position: sticky;
  top: 0;
  z-index: 50;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #ffffff;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  padding: 8px 14px;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.nav-link:hover { background-color: #27272a; }
.nav-link.active { border-bottom: 2px solid #ffffff; border-radius: 6px 6px 0 0; }

.nav-right { position: relative; }

.profile-container { position: relative; }

.user-profile {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #ffffff;
  padding: 6px 12px;
  border-radius: 6px;
  user-select: none;
  font-weight: 600;
  font-size: 0.9rem;
}

.user-profile:hover { background-color: #27272a; }
.rotate-icon { transform: rotate(180deg); transition: transform 0.2s ease; }

.profile-dropdown {
  position: absolute;
  top: 110%;
  right: 0;
  min-width: 200px;
  background-color: #27272a;
  border: 1px solid #3f3f46;
  border-radius: 8px;
  padding: 6px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  background: transparent;
  border: none;
  color: #f87171;
  padding: 10px 12px;
  font-family: 'Poppins', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
}

.dropdown-item:hover { background-color: #ef4444; color: #ffffff; }

.dropdown-fade-enter-active, .dropdown-fade-leave-active { transition: opacity 0.15s ease; }
.dropdown-fade-enter-from, .dropdown-fade-leave-to { opacity: 0; }

.admin-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px 28px 48px 28px;
}

.page-title h2 {
  margin: 0 0 18px 0;
  font-size: 1.4rem;
  font-weight: 800;
  color: #1e293b;
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
  min-width: 220px;
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

.search-box input:focus { border-color: #1e385c; }

.sort-box .sort-select {
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background-color: #f8fafc;
  font-family: 'Poppins', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  color: #334155;
  outline: none;
  cursor: pointer;
}

.btn-add {
  padding: 10px 22px;
  border-radius: 8px;
  border: none;
  background-color: #1e385c;
  color: #ffffff;
  font-family: 'Poppins', sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-add:hover { background-color: #152a47; }

.btn-excel {
  background-color: #217346;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.btn-excel:hover:not(:disabled) { background-color: #1a5c38; }
.btn-excel:disabled { opacity: 0.6; cursor: not-allowed; }

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

.info-alert {
  background-color: #eff6ff;
  border: 1px solid #93c5fd;
  color: #1e40af;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 0.9rem;
  font-weight: 500;
}

/* Table Card */
.data-card {
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
}

.card-header-navy {
  background-color: #1e385c;
  color: #ffffff;
  padding: 14px 20px;
}

.card-header-navy h3 { margin: 0; font-size: 1.05rem; font-weight: 700; }

.table-container { overflow-x: auto; }

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.87rem;
}

.data-table thead th {
  background-color: #f8fafc;
  color: #475569;
  font-weight: 700;
  text-align: left;
  padding: 12px 14px;
  border-bottom: 2px solid #e2e8f0;
  white-space: nowrap;
}

.data-table tbody td {
  padding: 11px 14px;
  border-bottom: 1px solid #f1f5f9;
  color: #334155;
  vertical-align: middle;
}

.data-table tbody tr:hover { background-color: #f8fafc; }

.text-center { text-align: center; }
.py-5 { padding-top: 28px; padding-bottom: 28px; }
.font-bold { font-weight: 700; }

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

.loading-text { color: #64748b; font-size: 0.9rem; }
.empty-text { color: #94a3b8; font-size: 0.92rem; }

.action-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
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

.btn-info { color: #2563eb; }
.btn-info:hover { background-color: #2563eb; color: #ffffff; border-color: #2563eb; }
.btn-edit { color: #d97706; }
.btn-edit:hover { background-color: #d97706; color: #ffffff; border-color: #d97706; }
.btn-delete { color: #dc2626; }
.btn-delete:hover { background-color: #dc2626; color: #ffffff; border-color: #dc2626; }

/* Pagination */
.card-footer-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  padding: 14px 20px;
  border-top: 1px solid #e2e8f0;
  background-color: #f8fafc;
}

.per-page-selector {
  display: flex;
  align-items: center;
  gap: 12px;
}

.total-info { font-size: 0.85rem; font-weight: 600; color: #475569; }

.per-page-select {
  padding: 7px 10px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  background-color: #ffffff;
  font-family: 'Poppins', sans-serif;
  font-size: 0.82rem;
  font-weight: 600;
  color: #334155;
  outline: none;
  cursor: pointer;
}

.pagination-controls { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }

.btn-page {
  min-width: 36px;
  padding: 7px 12px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  background-color: #ffffff;
  font-family: 'Poppins', sans-serif;
  font-size: 0.82rem;
  font-weight: 600;
  color: #334155;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-page:hover:not(:disabled) { background-color: #1e385c; color: #ffffff; border-color: #1e385c; }
.btn-page.active { background-color: #1e385c; color: #ffffff; border-color: #1e385c; }
.btn-page:disabled { opacity: 0.45; cursor: not-allowed; }

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 100;
}

.modal-container {
  background-color: #ffffff;
  border-radius: 12px;
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-container.modal-lg { max-width: 720px; }
.modal-container.modal-sm { max-width: 440px; }

.modal-header-danger { background-color: #991b1b; }

.delete-text { font-size: 0.92rem; color: #334155; line-height: 1.6; margin: 0; }

.btn-danger {
  padding: 9px 24px;
  border-radius: 8px;
  border: none;
  background-color: #dc2626;
  font-family: 'Poppins', sans-serif;
  font-size: 0.87rem;
  font-weight: 700;
  color: #ffffff;
  cursor: pointer;
}

.btn-danger:hover:not(:disabled) { background-color: #b91c1c; }
.btn-danger:disabled { opacity: 0.6; cursor: not-allowed; }

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background-color: #1e385c;
  color: #ffffff;
  flex-shrink: 0;
}

.modal-header h3 { margin: 0; font-size: 1.05rem; font-weight: 700; }

.btn-close {
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 1.6rem;
  line-height: 1;
  cursor: pointer;
}

.modal-body { padding: 20px; overflow-y: auto; flex: 1; min-height: 0; }

/* Form di dalam modal harus ikut flex agar body bisa scroll */
.modal-container > form {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.detail-grid { display: flex; flex-direction: column; }

.detail-row {
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 12px;
  padding: 9px 0;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.88rem;
}

.detail-row:last-child { border-bottom: none; }
.detail-label { font-weight: 600; color: #64748b; }
.detail-value { font-weight: 600; color: #1e293b; word-break: break-word; }

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 14px 20px;
  border-top: 1px solid #e2e8f0;
  background-color: #ffffff;
  flex-shrink: 0;
}

.btn-secondary {
  padding: 9px 20px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background-color: #ffffff;
  font-family: 'Poppins', sans-serif;
  font-size: 0.87rem;
  font-weight: 600;
  color: #334155;
  cursor: pointer;
}

.btn-secondary:hover { background-color: #f1f5f9; }

.btn-primary {
  padding: 9px 24px;
  border-radius: 8px;
  border: none;
  background-color: #1e385c;
  font-family: 'Poppins', sans-serif;
  font-size: 0.87rem;
  font-weight: 700;
  color: #ffffff;
  cursor: pointer;
}

.btn-primary:hover:not(:disabled) { background-color: #152a47; }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

/* Form Tambah */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px 16px;
}

.form-group { display: flex; flex-direction: column; min-width: 0; }
.form-group.form-full { grid-column: 1 / -1; }
.form-group.form-row-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 14px 16px; }
.form-group.form-row-3col { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px 16px; }

.form-group label {
  font-size: 0.82rem;
  font-weight: 600;
  color: #475569;
  margin-bottom: 6px;
}

.form-group label .req { color: #dc2626; }

.form-group input,
.form-group select,
.form-group textarea {
  padding: 9px 12px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background-color: #ffffff;
  font-family: 'Poppins', sans-serif;
  font-size: 0.87rem;
  color: #1e293b;
  outline: none;
  width: 100%;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus { border-color: #1e385c; }
.form-group textarea { resize: vertical; }

.form-group input.invalid,
.form-group select.invalid { border-color: #dc2626; }

.field-error {
  color: #dc2626;
  font-size: 0.75rem;
  margin-top: 4px;
}

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.18s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

@media (max-width: 768px) {
  .admin-navbar { padding: 12px 16px; }
  .admin-content { padding: 16px 14px 36px 14px; }
  .page-title h2 { font-size: 1.15rem; }
  .detail-row { grid-template-columns: 1fr; gap: 2px; }
  .form-grid { grid-template-columns: 1fr; }
  .card-footer-pagination { flex-direction: column; align-items: stretch; }
  .pagination-controls { justify-content: center; }
}
</style>
