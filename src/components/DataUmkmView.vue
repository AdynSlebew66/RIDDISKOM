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

        <!-- Filter Urutan -->
        <div class="sort-box">
          <select v-model="sortOrder" @change="onSortChange" class="sort-select">
            <option value="desc">Terbaru &rarr; Terlama</option>
            <option value="asc">Terlama &rarr; Terbaru</option>
          </select>
        </div>

        <button class="btn-add" @click="openAddModal">
          Tambah
        </button>
      </div>

      <!-- Error Alert -->
      <div v-if="errorMessage" class="error-alert">
        {{ errorMessage }}
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
                <th>Kab/Kota Usaha</th>
                <th>Kecamatan</th>
                <th>Kelurahan</th>
                <th>Judul KBLI</th>
                <th class="text-center" style="width: 110px;">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <!-- Loading State -->
              <tr v-if="loading">
                <td colspan="8" class="text-center py-5">
                  <div class="spinner"></div>
                  <p class="loading-text">Memuat data UMKM...</p>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-else-if="displayedUmkmList.length === 0">
                <td colspan="8" class="text-center py-5 empty-text">
                  Data UMKM tidak ditemukan.
                </td>
              </tr>

              <!-- Data Rows -->
              <tr v-else v-for="(item, index) in displayedUmkmList" :key="item.id || index">
                <td class="text-center font-bold">{{ calculateRowIndex(index) }}</td>
                <td class="font-bold text-uppercase">{{ formatText(item?.nama_perusahaan) }}</td>
                <td>{{ formatText(item?.nama_proyek) }}</td>
                <td>{{ formatText(item?.kab_kota_usaha || item?.kab_kota?.nama) }}</td>
                <td>{{ formatText(item?.kecamatan_usaha || item?.kecamatan?.nama) }}</td>
                <td>{{ formatText(item?.kelurahan_usaha || item?.kelurahan?.nama) }}</td>
                <td>{{ formatText(item?.judul_kbli || item?.kbli_data?.judul) }}</td>
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
            <h3>Informasi Detail UMKM</h3>
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
                <label>Nama Perusahaan</label>
                <p class="font-bold text-uppercase">{{ formatText(selectedDetail.nama_perusahaan) }}</p>
              </div>
              <div class="detail-group">
                <label>Nama Proyek</label>
                <p>{{ formatText(selectedDetail.nama_proyek) }}</p>
              </div>
              <div class="detail-group">
                <label>Jenis Perusahaan</label>
                <p>{{ formatText(selectedDetail.jenis_perusahaan) }}</p>
              </div>
              <div class="detail-group">
                <label>Risiko Proyek</label>
                <p><span class="badge badge-risk">{{ formatText(selectedDetail.risiko_proyek) }}</span></p>
              </div>
              <div class="detail-group">
                <label>Skala Usaha</label>
                <p>{{ formatText(selectedDetail.skala_usaha) }}</p>
              </div>
              <div class="detail-group">
                <label>Sektor Pembina</label>
                <p>{{ formatText(selectedDetail.sektor_pembina) }}</p>
              </div>
              <div class="detail-group col-span-2">
                <label>Alamat Usaha</label>
                <p>{{ formatText(selectedDetail.alamat_usaha) }}</p>
              </div>
              <div class="detail-group">
                <label>Kecamatan</label>
                <p>{{ formatText(selectedDetail.kecamatan_usaha || selectedDetail.kecamatan?.nama) }}</p>
              </div>
              <div class="detail-group">
                <label>Kelurahan</label>
                <p>{{ formatText(selectedDetail.kelurahan_usaha || selectedDetail.kelurahan?.nama) }}</p>
              </div>
              <div class="detail-group">
                <label>Kab / Kota Usaha</label>
                <p>{{ formatText(selectedDetail.kab_kota_usaha || selectedDetail.kab_kota?.nama) }}</p>
              </div>
              <div class="detail-group">
                <label>Jumlah Tenaga Kerja (TKI)</label>
                <p>{{ selectedDetail.jumlah_tki || 0 }} Orang</p>
              </div>
              <div class="detail-group col-span-2">
                <label>Data KBLI</label>
                <div class="kbli-box">
                  <strong>Kode:</strong> {{ formatText(selectedDetail.kbli || selectedDetail.kbli_data?.kode) }} <br/>
                  <strong>Judul:</strong> {{ formatText(selectedDetail.judul_kbli || selectedDetail.kbli_data?.judul) }}
                </div>
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
            <h3>{{ isEditMode ? 'Edit Data UMKM' : 'Tambah Data UMKM Baru' }}</h3>
            <button class="btn-close" @click="closeFormModal">&times;</button>
          </div>
          
          <form @submit.prevent="submitForm">
            <div class="modal-body">
              <div v-if="formError" class="error-alert">
                {{ formError }}
              </div>

              <!-- Form Grid -->
              <div class="form-grid">
                <!-- 1. Nama Perusahaan -->
                <div class="form-group">
                  <label>Nama Perusahaan <span class="required">*</span></label>
                  <input type="text" v-model="formData.nama_perusahaan"  />
                </div>

                <!-- 2. Nama Proyek -->
                <div class="form-group">
                  <label>Nama Proyek</label>
                  <input type="text" v-model="formData.nama_proyek"  />
                </div>

                <!-- 3. Jenis Perusahaan -->
                <div class="form-group">
                  <label>Jenis Perusahaan</label>
                  <input type="text" v-model="formData.jenis_perusahaan"  />
                </div>

                <!-- 4. Risiko Proyek -->
                <div class="form-group">
                  <label>Risiko Proyek</label>
                  <select v-model="formData.risiko_proyek" class="form-select">
                    <option value="">-- Pilih Risiko --</option>
                    <option value="Rendah">Rendah</option>
                    <option value="Menengah Rendah">Menengah Rendah</option>
                    <option value="Menengah Tinggi">Menengah Tinggi</option>
                    <option value="Tinggi">Tinggi</option>
                  </select>
                </div>

                <!-- 5. Skala Usaha -->
                <div class="form-group">
                  <label>Skala Usaha</label>
                  <select v-model="formData.skala_usaha" class="form-select">
                    <option value="">-- Pilih Skala --</option>
                    <option value="Usaha Mikro">Usaha Mikro</option>
                    <option value="Usaha Kecil">Usaha Kecil</option>
                    <option value="Usaha Menengah">Usaha Menengah</option>
                    <option value="Usaha Besar">Usaha Besar</option>
                  </select>
                </div>

                <!-- 6. Sektor Pembina -->
                <div class="form-group">
                  <label>Sektor Pembina</label>
                  <input type="text" v-model="formData.sektor_pembina" />
                </div>

                <!-- 7. Alamat Usaha -->
                <div class="form-group col-span-2">
                  <label>Alamat Usaha</label>
                  <textarea v-model="formData.alamat_usaha" rows="2" ></textarea>
                </div>

                <!-- 8. Kecamatan -->
                <div class="form-group">
                  <label>Kecamatan <span class="required">*</span></label>
                  <select v-model="formData.kecamatan_usaha" class="form-select" @change="onKecamatanChange" required>
                    <option value="">-- Pilih Kecamatan --</option>
                    <option v-for="(kelurahans, kec) in dataBanjarmasin" :key="kec" :value="kec">
                      {{ kec }}
                    </option>
                  </select>
                </div>

                <!-- 9. Kelurahan -->
                <div class="form-group">
                  <label>Kelurahan <span class="required">*</span></label>
                  <select 
                    v-model="formData.kelurahan_usaha" 
                    class="form-select" 
                    :disabled="!formData.kecamatan_usaha"
                    required
                  >
                    <option value="">-- Pilih Kelurahan --</option>
                    <option v-for="kel in listKelurahan" :key="kel" :value="kel">
                      {{ kel }}
                    </option>
                  </select>
                </div>

                <!-- 10. Kab / Kota Usaha -->
                <div class="form-group">
                  <label>Kab / Kota Usaha</label>
                  <input type="text" v-model="formData.kab_kota_usaha" class="form-readonly" readonly />
                </div>

                <!-- 11. Jumlah Tenaga Kerja (TKI) -->
                <div class="form-group">
                  <label>Jumlah Tenaga Kerja (TKI)</label>
                  <input type="number" min="0" v-model.number="formData.jumlah_tki" placeholder="0" />
                </div>

                <!-- 12. Data KBLI -->
                <div class="form-group col-span-2 kbli-input-box">
                  <label class="kbli-section-label">Data KBLI</label>
                  <div class="form-grid inner-grid">
                    <div class="form-group">
                      <label>Kode KBLI</label>
                      <input type="text" v-model="formData.kbli"/>
                    </div>
                    <div class="form-group">
                      <label>Judul KBLI</label>
                      <input type="text" v-model="formData.judul_kbli"  />
                    </div>
                  </div>
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

    <!-- Modal Konfirmasi Hapus Data (dengan Backdrop Blur) -->
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
            <h4 class="delete-title">Hapus Data UMKM?</h4>
            <p class="delete-desc">
              Apakah kamu yakin ingin menghapus data <strong>"{{ itemToDelete?.nama_perusahaan }}"</strong>? Tindakan ini tidak dapat dibatalkan.
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
  name: 'DataUmkmView',
  data() {
    return {
      showDropdown: false,
      loading: false,
      errorMessage: '',
      searchQuery: '',
      searchTimeout: null,
      perPage: 10,
      sortOrder: 'desc',
      
      displayedUmkmList: [],
      pagination: {
        current_page: 1,
        last_page: 1,
        total: 0
      },

      // Modal Detail States
      showModal: false,
      loadingDetail: false,
      selectedDetail: null,
      modalError: '',

      // Modal Form States (Tambah & Edit)
      showFormModal: false,
      isEditMode: false,
      submittingForm: false,
      formError: '',

      // Modal Delete States
      showDeleteModal: false,
      itemToDelete: null,
      deleting: false,

      // Master Data Kecamatan & Kelurahan Kota Banjarmasin
      dataBanjarmasin: {
        "Banjarmasin Barat": [
          "Basirih", "Belitung Selatan", "Belitung Utara", "Kuin Cerucuk", "Kuin Selatan", "Pelambuan", "Telaga Biru", "Teluk Tiram"
        ],
        "Banjarmasin Selatan": [
          "Basirih Selatan", "Kelayan Barat", "Kelayan Dalam", "Kelayan Selatan", "Kelayan Tengah", "Kelayan Timur", "Mantuil", "Murung Raya", "Pekauman", "Pemurus Baru", "Pemurus Dalam", "Tanjung Pagar"
        ],
        "Banjarmasin Tengah": [
          "Antasan Besar", "Gadang", "Kelayan Luar", "Kertak Baru Ilir", "Kertak Baru Ulu", "Mawar", "Melayu", "Pasar Lama", "Pekapuran Laut", "Seberang Masjid", "Teluk Dalam"
        ],
        "Banjarmasin Timur": [
          "Benua Anyar", "Karang Mekar", "Kebun Bunga", "Kuripan", "Pekapuran Raya", "Pemurus Luar", "Pengambangan", "Sungai Bilu"
        ],
        "Banjarmasin Utara": [
          "Alalak Selatan", "Alalak Tengah", "Alalak Utara", "Antasan Kecil Timur", "Kuin Utara", "Pangeran", "Sungai Miai", "Sungai Andai", "Surgi Mufti"
        ]
      },

      // Form Data Structure
      formData: {
        id: null,
        nama_perusahaan: '',
        nama_proyek: '',
        jenis_perusahaan: '',
        risiko_proyek: '',
        skala_usaha: '',
        sektor_pembina: '',
        alamat_usaha: '',
        kecamatan_usaha: '',
        kelurahan_usaha: '',
        kab_kota_usaha: 'Kota Banjarmasin',
        jumlah_tki: 0,
        kbli: '',
        judul_kbli: '',
        is_publik: true // Tetap dikirim default true ke backend jika dibutuhkan
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
    },

    listKelurahan() {
      if (!this.formData.kecamatan_usaha) return []
      return this.dataBanjarmasin[this.formData.kecamatan_usaha] || []
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
            console.error('Error parsing token:', e)
          }
        }
      }
      return token || ''
    },

    async fetchUmkmData(page = 1) {
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

        const url = `https://harvest-protegee-symptom.ngrok-free.dev/api/admin/umkm?${queryParams.toString()}`
        const response = await fetch(url, { method: 'GET', headers })

        if (response.status === 401) {
          this.$router.push('/login')
          return
        }

        if (!response.ok) throw new Error(`Gagal mengambil data. Status: ${response.status}`)

        const result = await response.json()
        const pageData = result.data || {}

        if (pageData && Array.isArray(pageData.data)) {
          this.displayedUmkmList = this.sortListLocally(pageData.data)
          this.pagination = {
            current_page: Number(pageData.current_page) || page,
            last_page: Number(pageData.last_page) || 1,
            total: Number(pageData.total) || 0
          }
        } else if (Array.isArray(result.data)) {
          this.displayedUmkmList = this.sortListLocally(result.data)
          this.pagination = {
            current_page: 1,
            last_page: 1,
            total: result.data.length
          }
        }

      } catch (error) {
        this.errorMessage = `Error: ${error.message || 'Gagal terhubung ke API.'}`
        this.displayedUmkmList = []
      } finally {
        this.loading = false
      }
    },

    onKecamatanChange() {
      this.formData.kelurahan_usaha = ''
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
        nama_perusahaan: item.nama_perusahaan || '',
        nama_proyek: item.nama_proyek || '',
        jenis_perusahaan: item.jenis_perusahaan || '',
        risiko_proyek: item.risiko_proyek || '',
        skala_usaha: item.skala_usaha || '',
        sektor_pembina: item.sektor_pembina || '',
        alamat_usaha: item.alamat_usaha || '',
        kecamatan_usaha: item.kecamatan_usaha || item.kecamatan?.nama || '',
        kelurahan_usaha: item.kelurahan_usaha || item.kelurahan?.nama || '',
        kab_kota_usaha: 'Kota Banjarmasin',
        jumlah_tki: item.jumlah_tki || 0,
        kbli: item.kbli || item.kbli_data?.kode || '',
        judul_kbli: item.judul_kbli || item.kbli_data?.judul || '',
        is_publik: true
      }
      this.showFormModal = true
    },

    resetFormData() {
      this.formData = {
        id: null,
        nama_perusahaan: '',
        nama_proyek: '',
        jenis_perusahaan: '',
        risiko_proyek: '',
        skala_usaha: '',
        sektor_pembina: '',
        alamat_usaha: '',
        kecamatan_usaha: '',
        kelurahan_usaha: '',
        kab_kota_usaha: 'Kota Banjarmasin',
        jumlah_tki: 0,
        kbli: '',
        judul_kbli: '',
        is_publik: true
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
          ? `https://harvest-protegee-symptom.ngrok-free.dev/api/admin/umkm/${this.formData.id}`
          : `https://harvest-protegee-symptom.ngrok-free.dev/api/admin/umkm`

        const method = isEdit ? 'PUT' : 'POST'

        const payload = { 
          ...this.formData,
          kab_kota_usaha: 'Kota Banjarmasin',
          is_publik: true
        }
        delete payload.id

        const response = await fetch(url, {
          method: method,
          headers: headers,
          body: JSON.stringify(payload)
        })

        const resJson = await response.json().catch(() => ({}))

        if (!response.ok) {
          throw new Error(resJson.message || 'Gagal menyimpan data. Pastikan semua field wajib diisi.')
        }

        this.closeFormModal()
        this.fetchUmkmData(this.pagination.current_page)
      } catch (err) {
        this.formError = err.message || 'Terjadi kesalahan saat memproses data.'
      } finally {
        this.submittingForm = false
      }
    },

    sortListLocally(list) {
      if (!Array.isArray(list)) return []
      return [...list].sort((a, b) => {
        const idA = Number(a.id) || 0
        const idB = Number(b.id) || 0
        return this.sortOrder === 'desc' ? idB - idA : idA - idB
      })
    },

    onSortChange() {
      this.displayedUmkmList = this.sortListLocally(this.displayedUmkmList)
    },

    changePage(page) {
      if (page < 1 || page > this.pagination.last_page || page === this.pagination.current_page) return
      this.fetchUmkmData(page)
    },

    calculateRowIndex(index) {
      return (this.pagination.current_page - 1) * this.perPage + index + 1
    },

    handleSearch() {
      clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(() => {
        this.fetchUmkmData(1)
      }, 400)
    },

    formatText(val) {
      if (!val || val === 'null' || val === 'string' || val === '-' || val === 'undefined') return '-'
      return val
    },

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

        const url = `https://harvest-protegee-symptom.ngrok-free.dev/api/admin/umkm/${item.id}?ngrok-skip-browser-warning=69420`
        const response = await fetch(url, { method: 'GET', headers })

        if (!response.ok) throw new Error('Gagal menarik data detail dari server.')

        const result = await response.json()
        this.selectedDetail = result.data

      } catch (error) {
        this.modalError = error.message || 'Terjadi kesalahan sistem.'
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

    // Buka Pop-up Hapus
    handleDelete(item) {
      this.itemToDelete = item
      this.showDeleteModal = true
    },

    // Tutup Pop-up Hapus
    closeDeleteModal() {
      if (this.deleting) return
      this.showDeleteModal = false
      setTimeout(() => {
        this.itemToDelete = null
      }, 300)
    },

    // Eksekusi API Hapus
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

        const url = `https://harvest-protegee-symptom.ngrok-free.dev/api/admin/umkm/${this.itemToDelete.id}`
        const response = await fetch(url, { method: 'DELETE', headers })

        if (!response.ok) throw new Error('Gagal menghapus data dari server.')

        this.closeDeleteModal()
        this.fetchUmkmData(this.pagination.current_page)
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
  background-color: #18181b;
  color: #ffffff;
  padding: 14px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-left { display: flex; gap: 25px; }
.nav-link {
  color: #a1a1aa; text-decoration: none; font-weight: 600; font-size: 0.95rem;
  display: flex; align-items: center; gap: 8px; padding-bottom: 6px; transition: all 0.2s;
  border-bottom: 2px solid transparent;
}
.nav-link.active, .nav-link:hover {
  color: #ffffff;
  border-bottom: 2px solid #dc2626;
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
  background-color: #dc2626; color: #ffffff; border: none; padding: 12px 32px;
  border-radius: 6px; font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: background-color 0.2s;
}
.btn-add:hover { background-color: #b91c1c; }

.data-card { background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03); }
.card-header-title { background-color: #1f2937; color: #ffffff; padding: 16px 24px; }
.card-header-title h3 { margin: 0; font-size: 1.05rem; font-weight: 700; }
.table-container { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
.data-table th { background-color: #ffffff; color: #1e293b; font-weight: 700; padding: 16px 18px; border-bottom: 2px solid #f1f5f9; text-align: left; }
.data-table td { padding: 16px 18px; border-bottom: 1px solid #f1f5f9; color: #334155; vertical-align: middle; }
.data-table tbody tr:hover { background-color: #f8fafc; }

.action-buttons { display: flex; align-items: center; justify-content: center; gap: 10px; }
.btn-icon { background: none; border: none; cursor: pointer; padding: 4px; display: flex; align-items: center; justify-content: center; transition: transform 0.15s; }
.btn-icon:hover { transform: scale(1.2); }
.btn-icon:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-info { color: #1e293b; }
.btn-edit { color: #dc2626; }
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
.btn-page.active { background-color: #dc2626; color: #ffffff; border-color: #dc2626; font-weight: 600; }
.btn-page:disabled { opacity: 0.5; cursor: not-allowed; }

.text-center { text-align: center; }
.font-bold { font-weight: 700; }
.text-uppercase { text-transform: uppercase; }
.py-5 { padding-top: 40px; padding-bottom: 40px; }
.py-4 { padding-top: 24px; padding-bottom: 24px; }
.mt-3 { margin-top: 12px; }
.loading-text, .empty-text { color: #64748b; font-weight: 500; margin-top: 10px; }

.spinner {
  width: 28px; height: 28px; border: 3px solid #f3f3f3; border-top: 3px solid #dc2626;
  border-radius: 50%; margin: 0 auto; animation: spin 0.8s linear infinite;
}
.spinner-sm {
  width: 16px; height: 16px; border: 2px solid #ffffff; border-top: 2px solid transparent;
  border-radius: 50%; display: inline-block; animation: spin 0.8s linear infinite;
}
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

/* MODAL OVERLAY WITH BLUR BACKDROP */
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background-color: rgba(15, 23, 42, 0.4); 
  backdrop-filter: blur(6px); /* Backdrop Blur Effect */
  -webkit-backdrop-filter: blur(6px);
  display: flex; justify-content: center; align-items: center; z-index: 9999;
}
.modal-container {
  background-color: #ffffff; width: 90%; max-width: 680px; border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2); overflow: hidden;
}
.modal-sm { max-width: 440px; }

.modal-header {
  background-color: #1f2937; color: #ffffff; padding: 16px 24px;
  display: flex; justify-content: space-between; align-items: center;
}
.header-delete { background-color: #991b1b; }
.modal-header h3 { margin: 0; font-size: 1.1rem; font-weight: 600; }
.btn-close { background: none; border: none; color: #ffffff; font-size: 1.5rem; cursor: pointer; opacity: 0.8; }
.btn-close:hover { opacity: 1; }
.modal-body { padding: 24px; max-height: 75vh; overflow-y: auto; overflow-x: hidden; }

/* MODAL DETAIL STYLES */
.detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.detail-group { background-color: #f8fafc; padding: 12px 16px; border-radius: 8px; border: 1px solid #e2e8f0; }
.col-span-2 { grid-column: span 2; }
.detail-group label { display: block; font-size: 0.75rem; color: #64748b; font-weight: 600; margin-bottom: 4px; text-transform: uppercase; }
.detail-group p { margin: 0; font-size: 0.9rem; color: #1e293b; word-break: break-word; }
.badge-risk { background-color: #fef08a; color: #854d0e; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: 600; }
.kbli-box { background-color: #ffffff; padding: 10px; border-radius: 6px; border: 1px dashed #cbd5e1; font-size: 0.85rem; color: #334155; margin-top: 4px; }

/* FORM MODAL STYLES */
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.inner-grid { margin-top: 6px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label { font-size: 0.8rem; font-weight: 600; color: #475569; }
.required { color: #dc2626; }
.form-group input, .form-group textarea, .form-select {
  width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px;
  font-family: 'Poppins', sans-serif; font-size: 0.85rem; color: #1e293b; outline: none; transition: border-color 0.2s; box-sizing: border-box;
}
.form-group input:focus, .form-group textarea:focus, .form-select:focus { border-color: #dc2626; }
.form-select:disabled { background-color: #f1f5f9; cursor: not-allowed; }
.form-readonly { background-color: #f8fafc; color: #64748b; cursor: not-allowed; border-color: #e2e8f0; }

.kbli-input-box {
  background-color: #f8fafc; border: 1px dashed #cbd5e1; padding: 12px 16px; border-radius: 8px;
}
.kbli-section-label { font-size: 0.8rem; font-weight: 700; color: #334155; text-transform: uppercase; }

/* DELETE MODAL STYLES */
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

.btn-submit, .btn-delete-confirm {
  background-color: #dc2626; color: #ffffff; border: none; padding: 10px 24px;
  border-radius: 6px; font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 0.9rem;
  cursor: pointer; transition: background-color 0.2s; display: flex; align-items: center; gap: 8px;
}
.btn-submit:hover:not(:disabled), .btn-delete-confirm:hover:not(:disabled) { background-color: #b91c1c; }
.btn-submit:disabled, .btn-cancel:disabled, .btn-delete-confirm:disabled { opacity: 0.6; cursor: not-allowed; }

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
</style>