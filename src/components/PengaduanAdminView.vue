<template>
  <AdminLayout group="phijs" title="Pengaduan Perselisihan">
    <main class="admin-content">
      <div class="page-title">
        <h2>Arsip Pengaduan Perselisihan</h2>
        <div class="action-buttons-group">
          <button class="btn-excel" @click="exportToExcel" :disabled="exportingExcel" title="Download Excel dari server sesuai filter yang aktif">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            <span>{{ exportingExcel ? 'Mengekspor...' : 'Export Excel' }}</span>
          </button>
        </div>
      </div>

      <!-- Search & Filter Bar -->
      <div class="action-bar">
        <div class="search-box">
          <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input
            type="text"
            v-model="searchQuery"
            @input="handleSearch"
            placeholder="Cari nomor tiket / pelapor / perusahaan..."
          />
        </div>

        <div class="sort-box">
          <select v-model="filterStatus" @change="onFilterChange" class="sort-select" title="Filter status">
            <option value="">Semua Status</option>
            <option value="baru">Baru</option>
            <option value="diproses">Diproses</option>
            <option value="selesai">Selesai</option>
            <option value="ditolak">Ditolak</option>
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
          <select v-model="filterTahun" @change="onFilterChange" class="sort-select" title="Filter tahun">
            <option value="">Semua Tahun</option>
            <option v-for="t in tahunOptions" :key="t" :value="String(t)">{{ t }}</option>
          </select>
        </div>

        <div class="sort-box">
          <select v-model="filterBulan" @change="onFilterChange" class="sort-select" title="Filter bulan">
            <option value="">Semua Bulan</option>
            <option v-for="b in bulanOptions" :key="b.value" :value="String(b.value)">{{ b.label }}</option>
          </select>
        </div>

        <div class="sort-box date-box">
          <input type="date" v-model="filterTanggalDari" @change="onFilterChange" class="date-input" title="Tanggal dari" />
          <span class="date-sep">s/d</span>
          <input type="date" v-model="filterTanggalSampai" @change="onFilterChange" class="date-input" title="Tanggal sampai" />
        </div>

        <div class="sort-box">
          <select v-model.number="perPage" @change="onFilterChange" class="sort-select" title="Jumlah per halaman">
            <option :value="15">15 / halaman</option>
            <option :value="25">25 / halaman</option>
            <option :value="50">50 / halaman</option>
            <option :value="100">100 / halaman</option>
          </select>
        </div>
      </div>

      <!-- Alerts -->
      <div v-if="errorMessage" class="error-alert">{{ errorMessage }}</div>
      <div v-if="infoMessage" class="info-alert">{{ infoMessage }}</div>

      <!-- Table Card -->
      <div class="data-card">
        <div class="card-header-navy">
          <h3>Daftar Pengaduan</h3>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th class="text-center" style="width: 50px;">No</th>
                <th>Nomor Tiket</th>
                <th>Pelapor</th>
                <th>Perusahaan</th>
                <th>Tanggal</th>
                <th class="text-center">Status</th>
                <th class="text-center" style="width: 140px;">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td colspan="7" class="text-center py-5">
                  <div class="spinner"></div>
                  <p class="loading-text">Memuat arsip pengaduan...</p>
                </td>
              </tr>

              <tr v-else-if="pengaduanList.length === 0">
                <td colspan="7" class="text-center py-5 empty-text">
                  Belum ada pengaduan yang cocok dengan filter.
                </td>
              </tr>

              <tr v-else v-for="(item, index) in pengaduanList" :key="item.id || index">
                <td class="text-center font-bold">{{ calculateRowIndex(index) }}</td>
                <td class="font-bold ticket-cell">{{ formatText(item.nomor_tiket) }}</td>
                <td>
                  <div class="cell-main">{{ formatText(item.nama_pelapor) }}</div>
                  <div class="cell-sub">{{ formatText(item.no_kontak_pekerja) }}</div>
                </td>
                <td class="td-perusahaan" :title="item.nama_perusahaan">{{ formatText(item.nama_perusahaan) }}</td>
                <td class="nowrap">{{ formatDate(item.created_at) }}</td>
                <td class="text-center">
                  <span class="badge" :class="statusClass(item.status)">{{ statusLabel(item.status) }}</span>
                </td>
                <td class="text-center">
                  <div class="action-buttons">
                    <button class="btn-icon btn-info" title="Detail / Tindak Lanjut" @click="openDetail(item)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                    </button>
                    <button
                      v-if="item.lampiran_path || item.lampiran_nama"
                      class="btn-icon btn-attach"
                      title="Unduh lampiran"
                      @click="downloadLampiran(item)"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
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
            <span class="total-info">Total: {{ formatNumber(pagination.total) }} Pengaduan</span>
          </div>

          <div v-if="pagination.last_page > 1" class="pagination-controls">
            <button class="btn-page" :disabled="pagination.current_page === 1" @click="changePage(pagination.current_page - 1)">
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

            <button class="btn-page" :disabled="pagination.current_page === pagination.last_page" @click="changePage(pagination.current_page + 1)">
              Next &raquo;
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal Detail & Tindak Lanjut -->
    <transition name="modal-fade">
      <div v-if="showDetailModal" class="modal-overlay" @click.self="closeDetailModal">
        <div class="modal-container modal-lg">
          <div class="modal-header">
            <h3>Detail Pengaduan</h3>
            <button class="btn-close" @click="closeDetailModal">&times;</button>
          </div>
          <div class="modal-body">
            <div v-if="detailLoading" class="text-center py-5">
              <div class="spinner"></div>
              <p class="loading-text">Memuat detail pengaduan...</p>
            </div>
            <div v-else-if="detailError && !detailItem" class="error-alert">{{ detailError }}</div>

            <div v-if="detailItem" class="detail-wrap">
              <div v-if="detailError" class="error-alert" style="margin-bottom: 8px;">{{ detailError }} (menampilkan data tabel)</div>

              <h4 class="detail-section">Informasi Tiket</h4>
              <div class="detail-grid">
                <div class="detail-row"><span class="detail-label">Nomor Tiket</span><span class="detail-value">{{ formatText(detailItem.nomor_tiket) }}</span></div>
                <div class="detail-row"><span class="detail-label">Status</span><span class="detail-value"><span class="badge" :class="statusClass(detailItem.status)">{{ statusLabel(detailItem.status) }}</span></span></div>
                <div class="detail-row"><span class="detail-label">Dikirim</span><span class="detail-value">{{ formatDateTime(detailItem.created_at) }}</span></div>
                <div class="detail-row"><span class="detail-label">Ditindaklanjuti</span><span class="detail-value">{{ formatDateTime(detailItem.ditindaklanjuti_pada) }}</span></div>
                <div class="detail-row"><span class="detail-label">IP Pelapor</span><span class="detail-value">{{ formatText(detailItem.ip_pelapor) }}</span></div>
              </div>

              <h4 class="detail-section">Data Pelapor</h4>
              <div class="detail-grid">
                <div class="detail-row"><span class="detail-label">Nama Pelapor</span><span class="detail-value">{{ formatText(detailItem.nama_pelapor) }}</span></div>
                <div class="detail-row"><span class="detail-label">Jenis Kelamin</span><span class="detail-value">{{ formatJenisKelamin(detailItem.jenis_kelamin) }}</span></div>
                <div class="detail-row"><span class="detail-label">No. Kontak Pekerja</span><span class="detail-value">{{ formatText(detailItem.no_kontak_pekerja) }}</span></div>
                <div class="detail-row"><span class="detail-label">No. Kontak Perusahaan</span><span class="detail-value">{{ formatText(detailItem.no_kontak_perusahaan) }}</span></div>
              </div>

              <h4 class="detail-section">Perusahaan</h4>
              <div class="detail-grid">
                <div class="detail-row"><span class="detail-label">Nama Perusahaan</span><span class="detail-value">{{ formatText(detailItem.nama_perusahaan) }}</span></div>
                <div class="detail-row"><span class="detail-label">Alamat</span><span class="detail-value">{{ formatText(detailItem.alamat_perusahaan) }}</span></div>
              </div>

              <h4 class="detail-section">Permasalahan</h4>
              <div class="uraian-box">{{ formatText(detailItem.permasalahan) }}</div>

              <div v-if="detailItem.lampiran_path || detailItem.lampiran_nama" class="lampiran-row">
                <span class="detail-label">Lampiran</span>
                <button class="btn-chip btn-chip-outline" @click="downloadLampiran(detailItem)">
                  {{ detailItem.lampiran_nama || 'Unduh lampiran' }}
                </button>
              </div>

              <h4 class="detail-section">Tindak Lanjut</h4>
              <div v-if="formError" class="error-alert">{{ formError }}</div>
              <div class="form-grid form-grid-1col">
                <div class="form-group">
                  <label>Status</label>
                  <select v-model="tindakForm.status">
                    <option value="baru">Baru</option>
                    <option value="diproses">Diproses</option>
                    <option value="selesai">Selesai</option>
                    <option value="ditolak">Ditolak</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Catatan Petugas</label>
                  <textarea v-model="tindakForm.catatan_petugas" rows="4" maxlength="5000" placeholder="Tuliskan tindak lanjut, hasil mediasi, atau alasan penolakan."></textarea>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" @click="closeDetailModal" :disabled="saving">Tutup</button>
            <button v-if="detailItem" class="btn-primary" @click="submitTindakLanjut" :disabled="saving">
              {{ saving ? 'Menyimpan...' : 'Simpan Tindak Lanjut' }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal Konfirmasi Hapus -->
    <transition name="modal-fade">
      <div v-if="showDeleteModal" class="modal-overlay" @click.self="closeDeleteModal">
        <div class="modal-container modal-sm">
          <div class="modal-header modal-header-danger">
            <h3>Hapus Pengaduan</h3>
            <button class="btn-close" @click="closeDeleteModal">&times;</button>
          </div>
          <div class="modal-body">
            <div v-if="deleteError" class="error-alert">{{ deleteError }}</div>
            <p class="delete-text">
              Yakin ingin menghapus pengaduan <strong>{{ deleteItem?.nomor_tiket || '-' }}</strong>?
              Lampiran yang tersimpan juga akan ikut terhapus.
            </p>
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" @click="closeDeleteModal" :disabled="deleting">Batal</button>
            <button class="btn-danger" @click="confirmDelete" :disabled="deleting">{{ deleting ? 'Menghapus...' : 'Ya, Hapus' }}</button>
          </div>
        </div>
      </div>
    </transition>
  </AdminLayout>
</template>

<script>
import AdminLayout from './AdminLayout.vue'

const BASE = 'https://harvest-protegee-symptom.ngrok-free.dev/api'
const API_BASE = `${BASE}/admin/pengaduan`

export default {
  name: 'PengaduanAdminView',
  components: { AdminLayout },
  data() {
    return {
      pengaduanList: [],
      loading: false,
      errorMessage: '',
      infoMessage: '',
      searchQuery: '',
      searchTimer: null,

      filterStatus: '',
      filterJenisKelamin: '',
      filterTahun: '',
      filterBulan: '',
      filterTanggalDari: '',
      filterTanggalSampai: '',

      perPage: 15,
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

      showDetailModal: false,
      detailItem: null,
      detailLoading: false,
      detailError: '',
      tindakForm: { status: 'baru', catatan_petugas: '' },
      saving: false,
      formError: '',

      showDeleteModal: false,
      deleting: false,
      deleteItem: null,
      deleteError: '',

      exportingExcel: false
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
    this.fetchPengaduan(1)
    this.buildTahunOptions()
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
    handleUnauthorized(status) {
      if (status === 401) {
        this.$router.push('/login')
        return true
      }
      return false
    },
    buildTahunOptions() {
      const now = new Date().getFullYear()
      const years = []
      for (let y = now; y >= now - 5; y--) years.push(y)
      this.tahunOptions = years
    },
    calculateRowIndex(index) {
      const start = (this.pagination.current_page - 1) * this.perPage
      return start + index + 1
    },
    formatNumber(val) {
      return (Number(val) || 0).toLocaleString('id-ID')
    },
    formatText(val) {
      if (val === null || val === undefined || val === '') return '-'
      return String(val)
    },
    formatDate(val) {
      if (!val) return '-'
      const d = new Date(val)
      if (isNaN(d.getTime())) return String(val)
      return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    },
    formatDateTime(val) {
      if (!val) return '-'
      const d = new Date(val)
      if (isNaN(d.getTime())) return String(val)
      return d.toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    },
    formatJenisKelamin(val) {
      const s = String(val || '').toUpperCase()
      if (s === 'L') return 'Laki-laki'
      if (s === 'P') return 'Perempuan'
      return this.formatText(val)
    },
    statusLabel(status) {
      const s = String(status || '').toLowerCase()
      if (s === 'baru') return 'Baru'
      if (s === 'diproses') return 'Diproses'
      if (s === 'selesai') return 'Selesai'
      if (s === 'ditolak') return 'Ditolak'
      return status || '-'
    },
    statusClass(status) {
      const s = String(status || '').toLowerCase()
      if (s === 'selesai') return 'badge-done'
      if (s === 'diproses') return 'badge-process'
      if (s === 'ditolak') return 'badge-rejected'
      return 'badge-new'
    },

    /* ================== List ================== */
    buildListParams() {
      const params = new URLSearchParams()
      if (this.filterStatus) params.append('status', this.filterStatus)
      if (this.filterTahun) params.append('tahun', this.filterTahun)
      if (this.filterBulan) params.append('bulan', this.filterBulan)
      if (this.filterJenisKelamin) params.append('jenis_kelamin', this.filterJenisKelamin)
      if (this.filterTanggalDari) params.append('tanggal_dari', this.filterTanggalDari)
      if (this.filterTanggalSampai) params.append('tanggal_sampai', this.filterTanggalSampai)
      const q = (this.searchQuery || '').trim()
      if (q) params.append('search', q)
      return params
    },
    async fetchPengaduan(page = 1) {
      this.loading = true
      this.errorMessage = ''
      try {
        const params = this.buildListParams()
        params.append('page', page)
        params.append('per_page', this.perPage)
        const res = await fetch(`${API_BASE}?${params.toString()}`, {
          method: 'GET',
          headers: this.buildHeaders()
        })
        if (this.handleUnauthorized(res.status)) return
        if (!res.ok) throw new Error(`Gagal mengambil arsip pengaduan. Status: ${res.status}`)
        const result = await res.json()
        const pageData = result.data || {}
        if (Array.isArray(pageData.data)) {
          this.pengaduanList = pageData.data
          this.pagination = {
            current_page: Number(pageData.current_page) || page,
            last_page: Number(pageData.last_page) || 1,
            total: Number(pageData.total) || 0
          }
          if (pageData.per_page) this.perPage = Number(pageData.per_page)
        } else {
          this.pengaduanList = []
          this.pagination = { current_page: 1, last_page: 1, total: 0 }
        }
      } catch (e) {
        this.errorMessage = `Error: ${e.message || 'Gagal terhubung ke API.'}`
        this.pengaduanList = []
      } finally {
        this.loading = false
      }
    },
    handleSearch() {
      clearTimeout(this.searchTimer)
      this.searchTimer = setTimeout(() => this.fetchPengaduan(1), 500)
    },
    onFilterChange() {
      this.fetchPengaduan(1)
    },
    changePage(page) {
      if (page < 1 || page > this.pagination.last_page) return
      this.fetchPengaduan(page)
    },

    /* ================== Detail & Tindak Lanjut ================== */
    async openDetail(item) {
      this.detailItem = item
      this.detailError = ''
      this.formError = ''
      this.tindakForm = {
        status: item.status || 'baru',
        catatan_petugas: item.catatan_petugas || ''
      }
      this.showDetailModal = true
      if (!item?.id) return
      this.detailLoading = true
      try {
        const res = await fetch(`${API_BASE}/${item.id}`, { headers: this.buildHeaders() })
        if (this.handleUnauthorized(res.status)) return
        const result = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(result.message || `Gagal mengambil detail (status ${res.status}).`)
        this.detailItem = result.data || item
        this.tindakForm = {
          status: this.detailItem.status || 'baru',
          catatan_petugas: this.detailItem.catatan_petugas || ''
        }
      } catch (e) {
        this.detailError = e.message || 'Gagal memuat detail.'
      } finally {
        this.detailLoading = false
      }
    },
    closeDetailModal() {
      if (this.saving) return
      this.showDetailModal = false
      this.detailItem = null
      this.detailError = ''
      this.formError = ''
    },
    async submitTindakLanjut() {
      if (!this.detailItem?.id || this.saving) return
      this.saving = true
      this.formError = ''
      try {
        const res = await fetch(`${API_BASE}/${this.detailItem.id}`, {
          method: 'PUT',
          headers: this.buildHeaders(true),
          body: JSON.stringify({
            status: this.tindakForm.status,
            catatan_petugas: (this.tindakForm.catatan_petugas || '').trim() || null
          })
        })
        if (this.handleUnauthorized(res.status)) return
        const result = await res.json().catch(() => ({}))
        if (res.status === 422) {
          this.formError = result.message || 'Periksa kembali status dan catatan.'
          return
        }
        if (!res.ok) throw new Error(result.message || `Gagal menyimpan tindak lanjut (status ${res.status}).`)

        this.showDetailModal = false
        this.detailItem = null
        this.infoMessage = result.message || 'Tindak lanjut berhasil disimpan.'
        setTimeout(() => { this.infoMessage = '' }, 4000)
        this.fetchPengaduan(this.pagination.current_page)
      } catch (e) {
        this.formError = e.message || 'Gagal terhubung ke API.'
      } finally {
        this.saving = false
      }
    },

    /* ================== Lampiran ================== */
    async downloadLampiran(item) {
      if (!item?.id) return
      try {
        const token = this.getAuthToken()
        if (!token) {
          this.$router.push('/login')
          return
        }
        const res = await fetch(`${API_BASE}/${item.id}/lampiran`, {
          method: 'GET',
          headers: {
            Accept: 'application/octet-stream, */*',
            'ngrok-skip-browser-warning': '69420',
            Authorization: `Bearer ${token}`
          }
        })
        if (this.handleUnauthorized(res.status)) return

        const ctype = (res.headers.get('content-type') || '').toLowerCase()
        if (!res.ok || ctype.includes('json')) {
          const j = ctype.includes('json') ? await res.json().catch(() => ({})) : {}
          throw new Error(j.message || `Gagal mengunduh lampiran (status ${res.status}).`)
        }

        const blob = await res.blob()
        const fallback = item.lampiran_nama || `lampiran-${item.nomor_tiket || item.id}`
        this.downloadBlob(blob, fallback, res.headers.get('content-disposition'))
      } catch (e) {
        this.errorMessage = `Error lampiran: ${e.message || 'Gagal terhubung ke API.'}`
      }
    },
    downloadBlob(blob, fallbackName, contentDisposition) {
      let fileName = fallbackName
      if (contentDisposition) {
        const match = contentDisposition.match(/filename\*?=(?:UTF-8'')?["']?([^"';\\n]+)["']?/i)
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

    /* ================== Hapus ================== */
    openDeleteModal(item) {
      this.deleteItem = item
      this.deleteError = ''
      this.showDeleteModal = true
    },
    closeDeleteModal() {
      if (this.deleting) return
      this.showDeleteModal = false
      this.deleteItem = null
    },
    async confirmDelete() {
      if (!this.deleteItem?.id || this.deleting) return
      this.deleting = true
      this.deleteError = ''
      try {
        const res = await fetch(`${API_BASE}/${this.deleteItem.id}`, {
          method: 'DELETE',
          headers: this.buildHeaders()
        })
        if (this.handleUnauthorized(res.status)) return
        const result = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(result.message || `Gagal menghapus pengaduan (status ${res.status}).`)

        this.showDeleteModal = false
        this.deleteItem = null
        this.infoMessage = result.message || 'Pengaduan berhasil dihapus.'
        setTimeout(() => { this.infoMessage = '' }, 4000)

        if (this.pengaduanList.length <= 1 && this.pagination.current_page > 1) {
          this.fetchPengaduan(this.pagination.current_page - 1)
        } else {
          this.fetchPengaduan(this.pagination.current_page)
        }
      } catch (e) {
        this.deleteError = e.message || 'Gagal terhubung ke API.'
      } finally {
        this.deleting = false
      }
    },

    /* ================== Export ================== */
    async exportToExcel() {
      if (this.exportingExcel) return
      this.exportingExcel = true
      this.errorMessage = ''
      try {
        const token = this.getAuthToken()
        if (!token) {
          this.$router.push('/login')
          return
        }
        const params = this.buildListParams()
        const query = params.toString() ? `?${params.toString()}` : ''

        const res = await fetch(`${API_BASE}/export${query}`, {
          method: 'GET',
          headers: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/octet-stream, */*',
            'ngrok-skip-browser-warning': '69420',
            Authorization: `Bearer ${token}`
          }
        })
        if (this.handleUnauthorized(res.status)) return

        const ctype = (res.headers.get('content-type') || '').toLowerCase()
        if (res.status === 422 || ctype.includes('json')) {
          const j = await res.json().catch(() => ({}))
          throw new Error(j.message || `Export gagal (status ${res.status}).`)
        }
        if (!res.ok) throw new Error(`Export gagal (status ${res.status}).`)

        const blob = await res.blob()
        if (!blob || blob.size === 0) throw new Error('File kosong dari server.')

        const dateStr = new Date().toISOString().slice(0, 10)
        this.downloadBlob(blob, `Arsip_Pengaduan_${dateStr}.xlsx`, res.headers.get('content-disposition'))

        this.infoMessage = 'File Excel berhasil diunduh.'
        setTimeout(() => { this.infoMessage = '' }, 4000)
      } catch (e) {
        this.errorMessage = `Error export: ${e.message || 'Gagal terhubung ke API.'}`
      } finally {
        this.exportingExcel = false
      }
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

.admin-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px 28px 48px 28px;
}

.page-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 18px;
}

.page-title h2 {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 800;
  color: #1e293b;
}

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

.date-box {
  display: flex;
  align-items: center;
  gap: 6px;
}

.date-input {
  padding: 9px 10px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background-color: #f8fafc;
  font-family: 'Poppins', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  color: #334155;
  outline: none;
}

.date-sep { font-size: 0.78rem; font-weight: 700; color: #94a3b8; }

.action-buttons-group {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: nowrap;
  margin-left: auto;
}

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

.data-table { width: 100%; border-collapse: collapse; font-size: 0.87rem; }

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
.nowrap { white-space: nowrap; }

.ticket-cell { white-space: nowrap; color: #1e385c; }

.cell-main { font-weight: 600; color: #1e293b; }
.cell-sub { font-size: 0.76rem; color: #94a3b8; margin-top: 2px; }

.td-perusahaan { max-width: 240px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.badge {
  display: inline-block;
  padding: 3px 11px;
  border-radius: 999px;
  font-size: 0.73rem;
  font-weight: 700;
  white-space: nowrap;
}

.badge-new { background-color: #e0e7ff; color: #3730a3; }
.badge-process { background-color: #fef3c7; color: #92400e; }
.badge-done { background-color: #dcfce7; color: #166534; }
.badge-rejected { background-color: #fee2e2; color: #991b1b; }

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
.btn-attach { color: #7c3aed; }
.btn-attach:hover { background-color: #7c3aed; color: #ffffff; border-color: #7c3aed; }
.btn-delete { color: #dc2626; }
.btn-delete:hover { background-color: #dc2626; color: #ffffff; border-color: #dc2626; }

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

.per-page-selector { display: flex; align-items: center; gap: 12px; }
.total-info { font-size: 0.85rem; font-weight: 600; color: #475569; }

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

.modal-container.modal-lg { max-width: 820px; }
.modal-container.modal-sm { max-width: 460px; }

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
.modal-header-danger { background-color: #991b1b; }

.btn-close {
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 1.6rem;
  line-height: 1;
  cursor: pointer;
}

.modal-body { padding: 20px; overflow-y: auto; flex: 1; min-height: 0; }

.detail-wrap { display: flex; flex-direction: column; }
.detail-grid { display: flex; flex-direction: column; }

.detail-section {
  margin: 18px 0 8px 0;
  font-size: 0.86rem;
  font-weight: 800;
  color: #1e385c;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 6px;
}

.detail-wrap .detail-section:first-of-type { margin-top: 0; }

.detail-row {
  display: grid;
  grid-template-columns: 190px 1fr;
  gap: 12px;
  padding: 7px 0;
  border-bottom: 1px solid #f8fafc;
  font-size: 0.86rem;
}

.detail-row:last-child { border-bottom: none; }
.detail-label { font-weight: 600; color: #64748b; }
.detail-value { font-weight: 600; color: #1e293b; word-break: break-word; }

.uraian-box {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px 14px;
  font-size: 0.86rem;
  color: #1e293b;
  line-height: 1.75;
  white-space: pre-line;
}

.lampiran-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 14px;
  flex-wrap: wrap;
}

.btn-chip {
  padding: 7px 14px;
  border-radius: 6px;
  font-family: 'Poppins', sans-serif;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  border: 1px solid transparent;
  white-space: nowrap;
  transition: all 0.15s ease;
}

.btn-chip-outline {
  background-color: #ffffff;
  color: #475569;
  border-color: #cbd5e1;
}
.btn-chip-outline:hover { background-color: #1e385c; color: #ffffff; border-color: #1e385c; }

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

.btn-secondary:hover:not(:disabled) { background-color: #f1f5f9; }
.btn-secondary:disabled { opacity: 0.6; cursor: not-allowed; }

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

.delete-text { font-size: 0.92rem; color: #334155; line-height: 1.6; margin: 0; }

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px 16px;
}
.form-grid-1col { grid-template-columns: 1fr; }

.form-group { display: flex; flex-direction: column; min-width: 0; }

.form-group label {
  font-size: 0.82rem;
  font-weight: 600;
  color: #475569;
  margin-bottom: 6px;
}

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

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.18s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

@media (max-width: 768px) {
  .admin-content { padding: 16px 14px 36px 14px; }
  .page-title h2 { font-size: 1.15rem; }
  .action-buttons-group { flex-wrap: wrap; margin-left: 0; }
  .date-box { flex-wrap: wrap; }
  .detail-row { grid-template-columns: 1fr; gap: 2px; }
  .form-grid { grid-template-columns: 1fr; }
  .card-footer-pagination { flex-direction: column; align-items: stretch; }
  .pagination-controls { justify-content: center; }
}
</style>
