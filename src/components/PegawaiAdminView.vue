<template>
  <div class="admin-wrapper" @click="closeDropdownOnClickOutside">
    <!-- Top Navbar Admin -->
    <header class="admin-navbar">
      <div class="nav-left">
        <router-link to="/admin/pegawai" class="nav-link" active-class="active">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          Dashboard
        </router-link>
      </div>

      <!-- Right Nav / Profile -->
      <div class="nav-right">
        <div class="profile-container">
          <div class="user-profile" @click.stop="toggleDropdown">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span>AdminSekretariat</span>
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
        <h2>Data Pegawai ASN Sekretariat</h2>
      </div>

      <!-- Search & Add Button Bar -->
      <div class="action-bar">
        <div class="search-box">
          <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input
            type="text"
            v-model="searchQuery"
            @input="handleSearch"
            placeholder="Cari Nama / NIP / Jabatan..."
          />
        </div>

        <button class="btn-add" @click="openAddModal">
          + Tambah
        </button>

        <button
          v-if="orderDirty"
          class="btn-save-order"
          :disabled="savingOrder"
          @click="saveOrder"
          title="Simpan urutan baru ke server"
        >
          <span v-if="savingOrder" class="spinner-sm spinner-dark"></span>
          <span>{{ savingOrder ? 'Menyimpan...' : 'Simpan Urutan' }}</span>
        </button>
        <button
          v-if="orderDirty"
          class="btn-reset-order"
          :disabled="savingOrder"
          @click="resetOrder"
          title="Kembalikan urutan semula"
        >
          Reset
        </button>
      </div>

      <div v-if="orderDirty" class="order-hint">
        Urutan berubah — klik <strong>Simpan Urutan</strong> untuk menyimpan ke server.
        <span v-if="searchQuery.trim()">(Kosongkan pencarian agar tombol geser aktif.)</span>
        <span v-else>Tips: tampilkan 50 baris agar geser antar halaman terlihat.</span>
      </div>
      <div v-else-if="(searchQuery || '').trim()" class="order-hint order-hint-lock">
        Hapus pencarian untuk mengatur urutan.
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
          <h3>Data Pegawai</h3>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th class="text-center" style="width: 55px;">No</th>
                <th class="text-center" style="width: 70px;">Foto</th>
                <th>Nama Pegawai</th>
                <th>NIP</th>
                <th>Jabatan</th>
                <th>Unit Kerja</th>
                <th class="text-center" style="width: 120px;">Urutan</th>
                <th class="text-center">Status</th>
                <th class="text-center" style="width: 130px;">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <!-- Loading State -->
              <tr v-if="loading">
                <td colspan="9" class="text-center py-5">
                  <div class="spinner"></div>
                  <p class="loading-text">Memuat data pegawai...</p>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-else-if="displayedPegawaiList.length === 0">
                <td colspan="9" class="text-center py-5 empty-text">
                  Data pegawai tidak ditemukan.
                </td>
              </tr>

              <!-- Data Rows (drag-drop antar baris untuk ubah urutan) -->
              <tr
                v-else
                v-for="(item, index) in displayedPegawaiList"
                :key="item.id || index"
                :draggable="!isReorderLocked"
                :class="{ 'row-draggable': !isReorderLocked, 'row-dragging': dragItemId === item.id }"
                @dragstart="onDragStart(item, $event)"
                @dragover.prevent
                @drop="onDropOnRow(item, $event)"
                @dragend="onDragEnd"
                :title="!isReorderLocked ? 'Seret baris untuk mengubah urutan' : ''"
              >
                <td class="text-center font-bold">{{ calculateRowIndex(index) }}</td>
                <td class="text-center">
                  <div class="thumb-wrapper">
                    <img
                      v-if="photoVisible(item)"
                      :src="resolvedPhoto(item)"
                      :alt="item.nama_pegawai"
                      class="thumb-img"
                      loading="lazy"
                      @error="onPhotoError(item)"
                    />
                    <div v-else class="thumb-initials">{{ initialsOf(item.nama_pegawai) }}</div>
                  </div>
                </td>
                <td class="font-bold">{{ item.nama_pegawai || '-' }}</td>
                <td>{{ item.nip || '-' }}</td>
                <td>{{ item.jabatan || '-' }}</td>
                <td>{{ item.unit_kerja || '-' }}</td>
                <td class="text-center">
                  <div class="order-cell">
                    <span class="order-num">{{ item.urutan ?? '-' }}</span>
                    <div class="order-btns">
                      <button
                        class="btn-order"
                        :title="isReorderLocked ? 'Hapus pencarian untuk mengatur urutan' : 'Geser ke atas'"
                        :disabled="isReorderLocked || isFirstInList(item)"
                        @click="moveUp(item)"
                      >▲</button>
                      <button
                        class="btn-order"
                        :title="isReorderLocked ? 'Hapus pencarian untuk mengatur urutan' : 'Geser ke bawah'"
                        :disabled="isReorderLocked || isLastInList(item)"
                        @click="moveDown(item)"
                      >▼</button>
                    </div>
                  </div>
                </td>
                <td class="text-center">
                  <span class="status-pill" :class="{ active: (item.status_aktif || '').toLowerCase() === 'aktif' }">
                    {{ item.status_aktif || '-' }}
                  </span>
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
            <h3>Detail Pegawai</h3>
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
              <div class="detail-group col-span-2 text-center">
                <div class="detail-photo-wrapper">
                  <img
                    v-if="photoVisible(selectedDetail)"
                    :src="resolvedPhoto(selectedDetail)"
                    :alt="selectedDetail.nama_pegawai"
                    class="detail-photo"
                    @error="onPhotoError(selectedDetail)"
                  />
                  <div v-else class="detail-initials">{{ initialsOf(selectedDetail.nama_pegawai) }}</div>
                </div>
                <p class="font-bold">{{ selectedDetail.nama_pegawai || '-' }}</p>
              </div>
              <div class="detail-group">
                <label>NIP</label>
                <p>{{ selectedDetail.nip || '-' }}</p>
              </div>
              <div class="detail-group">
                <label>Status</label>
                <p>{{ selectedDetail.status_aktif || '-' }}</p>
              </div>
              <div class="detail-group">
                <label>Jabatan</label>
                <p>{{ selectedDetail.jabatan || '-' }}</p>
              </div>
              <div class="detail-group">
                <label>Golongan</label>
                <p>{{ selectedDetail.golongan || '-' }}</p>
              </div>
              <div class="detail-group">
                <label>Unit Kerja</label>
                <p>{{ selectedDetail.unit_kerja || '-' }}</p>
              </div>
              <div class="detail-group">
                <label>Urutan</label>
                <p>{{ selectedDetail.urutan ?? '-' }}</p>
              </div>
              <div class="detail-group col-span-2">
                <label>Foto</label>
                <p>
                  <a v-if="photoOf(selectedDetail)" :href="photoOf(selectedDetail)" target="_blank" rel="noopener" class="link-daftar">Buka Foto</a>
                  <span v-else>-</span>
                </p>
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
            <h3>{{ isEditMode ? 'Edit Data Pegawai' : 'Tambah Data Pegawai' }}</h3>
            <button class="btn-close" @click="closeFormModal">&times;</button>
          </div>

          <form @submit.prevent="submitForm">
            <div class="modal-body">
              <div v-if="formError" class="error-alert">
                {{ formError }}
              </div>

              <div class="form-stack">
                <div class="form-group">
                  <label>Nama Pegawai <span class="required">*</span></label>
                  <input
                    type="text"
                    v-model="formData.nama_pegawai"
                    required
                    placeholder="Contoh: Dr. Machli Riyadi, S.H., M.H."
                  />
                  <small v-if="fieldErrors.nama_pegawai" class="field-error">{{ fieldErrors.nama_pegawai[0] }}</small>
                </div>

                <div class="form-group">
                  <label>Jabatan <span class="required">*</span></label>
                  <input
                    type="text"
                    v-model="formData.jabatan"
                    required
                    placeholder="Contoh: Sekretaris"
                  />
                  <small v-if="fieldErrors.jabatan" class="field-error">{{ fieldErrors.jabatan[0] }}</small>
                </div>

                <div class="form-group">
                  <label>Status <span class="required">*</span></label>
                  <select v-model="formData.status_aktif" required>
                    <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
                      {{ opt.label }}
                    </option>
                  </select>
                  <small v-if="fieldErrors.status_aktif" class="field-error">{{ fieldErrors.status_aktif[0] }}</small>
                </div>

                <div class="form-group">
                  <label>NIP <span class="optional-tag">(opsional)</span></label>
                  <input
                    type="text"
                    v-model="formData.nip"
                    placeholder="Contoh: 19701124 199101 1 004"
                  />
                  <small v-if="fieldErrors.nip" class="field-error">{{ fieldErrors.nip[0] }}</small>
                </div>

                <div class="form-group">
                  <label>Golongan <span class="optional-tag">(opsional)</span></label>
                  <input
                    type="text"
                    v-model="formData.golongan"
                    placeholder="Contoh: Pembina"
                  />
                  <small v-if="fieldErrors.golongan" class="field-error">{{ fieldErrors.golongan[0] }}</small>
                </div>

                <div class="form-group">
                  <label>Unit Kerja <span class="optional-tag">(opsional)</span></label>
                  <select v-model="formData.unit_kerja">
                    <option value="">— Tanpa Unit Kerja —</option>
                    <option v-for="unit in unitOptions" :key="unit" :value="unit">
                      {{ unit }}
                    </option>
                  </select>
                  <small class="help-text">Pilih unit kerja dari daftar agar penulisan selalu konsisten.</small>
                </div>

                <div class="form-group">
                  <label>Link Foto (Google Drive) <span class="optional-tag">(opsional)</span></label>
                  <input
                    type="url"
                    v-model="formData.foto_url"
                    placeholder="https://drive.google.com/file/d/.../view"
                  />
                  <small v-if="fieldErrors.foto_url" class="field-error">{{ fieldErrors.foto_url[0] }}</small>
                  <small class="help-text">Tempel link sharing Drive. Pastikan file di-share "Anyone with the link". Kosongkan jika belum ada foto.</small>
                </div>

                <div v-if="formData.foto_url" class="form-group">
                  <label>Pratinjau Foto</label>
                  <div class="thumb-wrapper thumb-lg">
                    <img
                      v-if="!formPhotoBroken"
                      :src="toDirectImageUrl(formData.foto_url)"
                      alt="Pratinjau foto"
                      class="thumb-img"
                      @error="formPhotoBroken = true"
                    />
                    <div v-else class="thumb-initials">{{ initialsOf(formData.nama_pegawai) }}</div>
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
            <h4 class="delete-title">Hapus Data Pegawai?</h4>
            <p class="delete-desc">
              Apakah kamu yakin ingin menghapus pegawai <strong>"{{ itemToDelete?.nama_pegawai }}"</strong>? Tindakan ini tidak dapat dibatalkan.
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
const API_BASE = 'https://harvest-protegee-symptom.ngrok-free.dev/api/admin/pegawai'
// Turunan dari API_BASE agar URL ngrok hanya ditulis 1x (ganti 1 tempat saat rotate).
const PUBLIC_BASE = API_BASE.replace('/admin/pegawai', '')

export default {
  name: 'PegawaiAdminView',
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

      allPegawaiList: [],
      currentPage: 1,
      brokenPhotos: {},
      savingOrder: false,
      originalOrderSnapshot: [],

      showModal: false,
      loadingDetail: false,
      selectedDetail: null,
      modalError: '',

      showFormModal: false,
      isEditMode: false,
      submittingForm: false,
      formError: '',
      fieldErrors: {},
      formPhotoBroken: false,
      dragItemId: null,

      showDeleteModal: false,
      itemToDelete: null,
      deleting: false,

      // Sumber kebenaran: GET /api/pegawai/status-options
      // { value: 'Aktif' | 'Tidak Aktif' | 'Dipindahtugaskan' | 'Pensiun', label }
      statusOptions: [
        { value: 'Aktif', label: 'Aktif' },
        { value: 'Tidak Aktif', label: 'Tidak Aktif' },
        { value: 'Dipindahtugaskan', label: 'Dipindahtugaskan' },
        { value: 'Pensiun', label: 'Pensiun' }
      ],

      formData: {
        id: null,
        nama_pegawai: '',
        nip: '',
        jabatan: '',
        golongan: '',
        unit_kerja: '',
        foto_url: '',
        status_aktif: 'Aktif'
      }
    }
  },
  computed: {
    // Filter lokal berdasarkan nama / NIP / jabatan / unit kerja
    filteredPegawaiList() {
      const q = (this.searchQuery || '').trim().toLowerCase()
      if (!q) return this.allPegawaiList
      return this.allPegawaiList.filter((item) =>
        String(item.nama_pegawai || '').toLowerCase().includes(q) ||
        String(item.nip || '').toLowerCase().includes(q) ||
        String(item.jabatan || '').toLowerCase().includes(q) ||
        String(item.unit_kerja || '').toLowerCase().includes(q)
      )
    },
    // Potongan data sesuai halaman & jumlah baris (client-side)
    displayedPegawaiList() {
      const start = (this.currentPage - 1) * this.perPage
      return this.filteredPegawaiList.slice(start, start + this.perPage)
    },
    pagination() {
      const total = this.filteredPegawaiList.length
      const last_page = Math.max(1, Math.ceil(total / this.perPage))
      const current_page = Math.min(this.currentPage, last_page)
      return { current_page, last_page, total }
    },
    // Opsi dropdown Unit Kerja: diambil dari data yang sudah ada
    // (diurutkan berdasar urutan terkecil, Kepala Dinas selalu paling atas),
    // ditambah opsi bawaan agar tetap ada pilihan saat data masih kosong.
    unitOptions() {
      const statics = ['Kepala Dinas', 'Sekretariat', 'Bidang Koperasi', 'Bidang Usaha Mikro']
      const seen = new Map()
      this.allPegawaiList.forEach((p) => {
        const name = (p.unit_kerja || '').trim()
        if (!name) return
        const u = Number(p.urutan)
        const order = Number.isFinite(u) ? u : 9999
        if (!seen.has(name) || order < seen.get(name)) seen.set(name, order)
      })
      const merged = [...seen.entries()]
        .sort((a, b) => a[1] - b[1])
        .map(([name]) => name)
      statics.forEach((s) => {
        if (!merged.includes(s)) merged.push(s)
      })
      merged.sort((a, b) => {
        if (/kepala dinas/i.test(a)) return -1
        if (/kepala dinas/i.test(b)) return 1
        return 0
      })
      return merged
    },
    // Dirty = nilai urutan saat ini beda dari snapshot server.
    // Computed (bukan flag): geser-balik ke nilai semula otomatis mematikan banner.
    orderDirty() {
      if (this.allPegawaiList.length !== this.originalOrderSnapshot.length) {
        return this.originalOrderSnapshot.length > 0
      }
      const orig = new Map(this.originalOrderSnapshot.map((o) => [o.id, o.urutan]))
      return this.allPegawaiList.some(
        (p) => (Number(orig.get(p.id)) || 0) !== (Number(p.urutan) || 0)
      )
    },
    // Geser urutan dinonaktifkan saat pencarian aktif / loading / menyimpan,
    // agar urutan global (allPegawaiList) tidak rusak oleh filter & pagination.
    isReorderLocked() {
      return this.loading || this.savingOrder || !!(this.searchQuery || '').trim()
    },
    displayedPages() {      const current = this.pagination.current_page
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
    this.fetchStatusOptions()
    this.fetchPegawaiData(1)
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

    async fetchPegawaiPage(page = 1, perPage = 100) {
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

    async fetchPegawaiData(page = 1) {
      this.loading = true
      this.errorMessage = ''
      try {
        const first = await this.fetchPegawaiPage(1)
        if (!first) return

        let all = [...first.list]
        for (let p = 2; p <= first.last_page; p++) {
          const next = await this.fetchPegawaiPage(p)
          if (!next) break
          all = all.concat(next.list)
        }

        this.allPegawaiList = all
        this.sortByUrutan()
        this.snapshotOrder()
        this.brokenPhotos = {}
        this.currentPage = page || 1
        if (this.currentPage > this.pagination.last_page) {
          this.currentPage = this.pagination.last_page
        }
      } catch (error) {
        this.errorMessage = `Error: ${error.message || 'Gagal terhubung ke API.'}`
        this.allPegawaiList = []
        this.currentPage = 1
      } finally {
        this.loading = false
      }
    },

    onPerPageChange() {
      this.currentPage = 1
    },

    // ---------- Reorder (POST /api/admin/pegawai/reorder) ----------
    // Body: { items: [{ id, urutan }] }
    sortByUrutan() {
      this.allPegawaiList.sort(
        (a, b) => (Number(a.urutan) || 0) - (Number(b.urutan) || 0)
      )
    },
    snapshotOrder() {
      this.originalOrderSnapshot = this.allPegawaiList.map((p) => ({
        id: p.id,
        urutan: Number(p.urutan) || 0
      }))
    },
    globalIndexOf(item) {
      return this.allPegawaiList.findIndex((p) => p.id === item.id)
    },
    isFirstInList(item) {
      return this.globalIndexOf(item) <= 0
    },
    isLastInList(item) {
      const i = this.globalIndexOf(item)
      return i === -1 || i >= this.allPegawaiList.length - 1
    },
    moveUp(item) {
      this.moveItem(item, -1)
    },
    moveDown(item) {
      this.moveItem(item, 1)
    },
    moveItem(item, dir) {
      if (this.isReorderLocked) return
      const i = this.globalIndexOf(item)
      const j = i + dir
      if (i === -1 || j < 0 || j >= this.allPegawaiList.length) return
      // Kontrak backend: tukar 2 nilai urutan saja (10,20,30...).
      // JANGAN renumber 1..N — jeda kelipatan 10 harus dipertahankan.
      const arr = this.allPegawaiList
      const tmp = Number(arr[i].urutan) || 0
      arr[i].urutan = Number(arr[j].urutan) || 0
      arr[j].urutan = tmp
      this.sortByUrutan()
    },
    onDragStart(item, event) {
      if (this.isReorderLocked) {
        event.preventDefault()
        return
      }
      this.dragItemId = item.id
      try {
        event.dataTransfer.effectAllowed = 'move'
        event.dataTransfer.setData('text/plain', String(item.id))
      } catch (e) { /* abaikan */ }
    },
    onDropOnRow(targetItem, event) {
      if (this.isReorderLocked) return
      event.preventDefault()
      const draggedId = this.dragItemId
      this.dragItemId = null
      if (draggedId == null || draggedId === targetItem.id) return
      const from = this.allPegawaiList.findIndex((p) => p.id === draggedId)
      const to = this.allPegawaiList.findIndex((p) => p.id === targetItem.id)
      if (from === -1 || to === -1) return
      // Kontrak yang sama dengan ▲/▼: tukar 2 nilai urutan saja.
      const arr = this.allPegawaiList
      const tmp = Number(arr[from].urutan) || 0
      arr[from].urutan = Number(arr[to].urutan) || 0
      arr[to].urutan = tmp
      this.sortByUrutan()
    },
    onDragEnd() {
      this.dragItemId = null
    },
    resetOrder() {
      if (this.savingOrder || this.loading) return
      // Sinkron ulang dengan server, bukan undo lokal.
      this.fetchPegawaiData(this.pagination.current_page)
    },
    async saveOrder() {
      if (this.savingOrder || !this.orderDirty) return
      this.savingOrder = true
      this.errorMessage = ''
      try {
        // Kirim full list berurutan [{id, urutan}] dengan nilai asli hasil tukar.
        const items = this.allPegawaiList.map((p) => ({
          id: p.id,
          urutan: Number(p.urutan) || 0
        }))
        const response = await fetch(`${API_BASE}/reorder`, {
          method: 'POST',
          headers: this.buildHeaders(true),
          body: JSON.stringify({ items })
        })
        const resJson = await response.json().catch(() => ({}))
        if (response.status === 401) {
          this.$router.push('/login')
          return
        }
        if (!response.ok) {
          const serverMsg = resJson.message
            || (resJson.errors ? Object.values(resJson.errors).flat().join(' ') : '')
            || 'Gagal menyimpan urutan.'
          throw new Error(serverMsg)
        }
        // Respons server = kebenaran: ganti state dengan list fresh terurut.
        const fresh = Array.isArray(resJson.data)
          ? resJson.data
          : (resJson.data && Array.isArray(resJson.data.data) ? resJson.data.data : null)
        if (fresh && fresh.length > 0) {
          this.allPegawaiList = fresh
        } else {
          await this.fetchPegawaiData(this.pagination.current_page)
        }
        this.snapshotOrder()
        this.showSuccess('Urutan pegawai berhasil disimpan.')
      } catch (err) {
        this.errorMessage = err.message || 'Gagal menyimpan urutan.'
      } finally {
        this.savingOrder = false
      }
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

    // Link sharing Google Drive (…/file/d/ID/view) bukan direct image.
    // Ubah ke endpoint thumbnail langsung agar bisa tampil di <img>.
    toDirectImageUrl(url) {
      if (!url) return ''
      const s = String(url).trim()
      const m = s.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/)
        || s.match(/drive\.google\.com\/open\?[^#]*[?&]id=([a-zA-Z0-9_-]+)/)
        || s.match(/drive\.google\.com\/uc\?[^#]*[?&]id=([a-zA-Z0-9_-]+)/)
      if (m && m[1]) return `https://drive.google.com/thumbnail?id=${m[1]}&sz=w500`
      return s
    },
    photoOf(item) {
      if (!item) return ''
      return item.foto_direct_url || item.foto_url || ''
    },
    resolvedPhoto(item) {
      return this.toDirectImageUrl(this.photoOf(item))
    },
    photoKey(item) {
      return (item && item.id) ?? this.photoOf(item)
    },
    isPhotoBroken(item) {
      return !!this.brokenPhotos[this.photoKey(item)]
    },
    photoVisible(item) {
      return !!this.photoOf(item) && !this.isPhotoBroken(item)
    },
    onPhotoError(item) {
      const key = this.photoKey(item)
      if (key !== '' && key !== undefined) {
        this.brokenPhotos = { ...this.brokenPhotos, [key]: true }
      }
    },
    initialsOf(name) {
      if (!name) return '-'
      const parts = String(name).split(' ').filter(Boolean).slice(0, 2)
      return parts.map((w) => w.charAt(0).toUpperCase()).join('') || '-'
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
      this.fieldErrors = {}
      this.resetFormData()
      this.showFormModal = true
    },

    handleEdit(item) {
      this.isEditMode = true
      this.formError = ''
      this.formPhotoBroken = false
      this.formData = {
        id: item.id,
        nama_pegawai: item.nama_pegawai || '',
        nip: item.nip || '',
        jabatan: item.jabatan || '',
        golongan: item.golongan || '',
        unit_kerja: item.unit_kerja || '',
        foto_url: item.foto_url || item.foto_direct_url || '',
        status_aktif: this.resolveStatus(item.status_aktif || 'Aktif')
      }
      this.showFormModal = true
    },

    resetFormData() {
      this.formData = {
        id: null,
        nama_pegawai: '',
        nip: '',
        jabatan: '',
        golongan: '',
        unit_kerja: '',
        foto_url: '',
        status_aktif: this.statusOptions[0]?.value || 'Aktif'
      }
      this.formPhotoBroken = false
    },

    closeFormModal() {
      this.showFormModal = false
      setTimeout(() => {
        this.resetFormData()
        this.formError = ''
        this.fieldErrors = {}
      }, 300)
    },

    validateForm() {
      // Wajib hanya: nama_pegawai, jabatan, status_aktif.
      // nip, golongan, unit_kerja, foto_url opsional (kirim null).
      if (!(this.formData.nama_pegawai || '').trim()) return 'Nama pegawai wajib diisi.'
      if (!(this.formData.jabatan || '').trim()) return 'Jabatan wajib diisi.'
      if (!this.statusOptions.some((o) => o.value === this.formData.status_aktif)) return 'Status tidak valid. Pilih dari daftar.'
      if (this.formData.foto_url && this.formData.foto_url.trim()) {
        const s = this.formData.foto_url.trim()
        const isDrive = /drive\.google\.com/.test(s) || /docs\.google\.com/.test(s)
        if (!isDrive) {
          try {
            new URL(s)
          } catch (e) {
            return 'Link foto tidak valid.'
          }
        }
      }
      return ''
    },

    resolveStatus(v) {
      const s = String(v || '').trim()
      if (this.statusOptions.some((o) => o.value === s)) return s
      // Cocokkan case-insensitive agar data lama ("aktif") tetap kepilih
      const found = this.statusOptions.find(
        (o) => o.value.toLowerCase() === s.toLowerCase()
      )
      return found ? found.value : 'Aktif'
    },

    async fetchStatusOptions() {
      try {
        const response = await fetch(`${PUBLIC_BASE}/pegawai/status-options`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'ngrok-skip-browser-warning': '69420'
          }
        })
        if (!response.ok) return
        const result = await response.json()
        const list = Array.isArray(result.data) ? result.data : []
        const cleaned = list
          .filter((o) => o && o.value)
          .map((o) => ({ value: String(o.value), label: String(o.label || o.value) }))
        if (cleaned.length > 0) {
          this.statusOptions = cleaned
          // Selaraskan default form bila value lama tidak ada di list baru
          this.formData.status_aktif = this.resolveStatus(this.formData.status_aktif)
        }
      } catch (e) {
        console.warn('Gagal memuat status-options, pakai daftar bawaan.', e)
      }
    },

    async submitForm() {
      const validationError = this.validateForm()
      if (validationError) {
        this.formError = validationError
        return
      }
      this.submittingForm = true
      this.formError = ''
      this.fieldErrors = {}

      try {
        const isEdit = this.isEditMode && this.formData.id
        const url = isEdit ? `${API_BASE}/${this.formData.id}` : API_BASE
        const method = isEdit ? 'PUT' : 'POST'

        // Auto-urutan: JANGAN kirim `urutan` sama sekali (backend yang atur).
        // Wajib: nama_pegawai, jabatan, status_aktif.
        // Opsional (null bila kosong): nip, golongan, unit_kerja, foto_url.
        const orNull = (v) => {
          const s = (v || '').trim()
          return s ? s : null
        }
        const payload = {
          nama_pegawai: this.formData.nama_pegawai.trim(),
          jabatan: this.formData.jabatan.trim(),
          status_aktif: this.formData.status_aktif,
          unit_kerja: orNull(this.formData.unit_kerja),
          nip: orNull(this.formData.nip),
          golongan: orNull(this.formData.golongan),
          foto_url: orNull(this.formData.foto_url)
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
          console.error('Gagal menyimpan pegawai.', { url, method, payload, resJson })
          // 422: tampilkan error per-input + ringkasan di atas form
          if (response.status === 422 && resJson.errors) {
            this.fieldErrors = resJson.errors
          }
          const serverMsg = resJson.message
            || (resJson.errors ? Object.values(resJson.errors).flat().join(' ') : '')
            || 'Gagal menyimpan data. Pastikan semua field wajib diisi.'
          throw new Error(serverMsg)
        }

        this.closeFormModal()
        this.showSuccess(isEdit ? 'Data pegawai berhasil diperbarui.' : 'Data pegawai berhasil ditambahkan.')
        this.fetchPegawaiData(this.pagination.current_page)
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
        this.showSuccess('Data pegawai berhasil dihapus.')
        this.fetchPegawaiData(this.pagination.current_page)
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
  },
  watch: {
    'formData.foto_url'() {
      this.formPhotoBroken = false
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
.btn-save-order {
  background-color: #15803d; color: #ffffff; border: none; padding: 12px 24px;
  border-radius: 6px; font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: background-color 0.2s;
  white-space: nowrap; display: flex; align-items: center; gap: 8px;
}
.btn-save-order:hover:not(:disabled) { background-color: #166534; }
.btn-save-order:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-reset-order {
  background-color: #ffffff; color: #475569; border: 1px solid #cbd5e1; padding: 12px 20px;
  border-radius: 6px; font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: background-color 0.2s;
  white-space: nowrap;
}
.btn-reset-order:hover:not(:disabled) { background-color: #f1f5f9; }
.order-hint {
  background-color: #fefce8; border: 1px solid #fde68a; color: #92400e;
  padding: 10px 16px; border-radius: 8px; margin-bottom: 16px; font-size: 0.85rem;
}
.order-hint-lock {
  background-color: #f8fafc; border-color: #e2e8f0; color: #64748b;
}
.order-cell { display: flex; align-items: center; justify-content: center; gap: 8px; }
.order-num { font-weight: 700; min-width: 28px; }
.order-btns { display: flex; flex-direction: column; gap: 2px; }
.btn-order {
  background-color: #f1f5f9; border: 1px solid #cbd5e1; color: #1e385c;
  width: 26px; height: 22px; line-height: 1; border-radius: 5px; cursor: pointer;
  font-size: 0.7rem; padding: 0; transition: background-color 0.15s;
}
.btn-order:hover:not(:disabled) { background-color: #e2e8f0; }
.btn-order:disabled { opacity: 0.35; cursor: not-allowed; }
.spinner-dark { border-color: #15803d; border-top-color: transparent; }

.data-card { background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03); }
.card-header-navy { background-color: #1e385c; color: #ffffff; padding: 16px 24px; }
.card-header-navy h3 { margin: 0; font-size: 1.05rem; font-weight: 700; }
.table-container { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; min-width: 1000px; }
.data-table th { background-color: #ffffff; color: #1e293b; font-weight: 700; padding: 16px 18px; border-bottom: 2px solid #f1f5f9; text-align: left; white-space: nowrap; }
.data-table td { padding: 12px 18px; border-bottom: 1px solid #f1f5f9; color: #334155; vertical-align: middle; }
.data-table tbody tr:hover { background-color: #f8fafc; }

.thumb-wrapper {
  width: 40px; height: 40px; border-radius: 50%; overflow: hidden; margin: 0 auto;
  background-color: #e8f5e9; flex-shrink: 0;
}
.thumb-lg { width: 84px; height: 84px; margin: 0; }
.thumb-img { width: 100%; height: 100%; object-fit: cover; display: block; }
.thumb-initials {
  width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;
  font-size: 0.85rem; font-weight: 800; color: #2e7d32;
}
.thumb-lg .thumb-initials { font-size: 1.5rem; }

.status-pill {
  display: inline-block; font-size: 0.75rem; font-weight: 700; color: #666666;
  background-color: #f1f1ec; border: 1px solid #e1e1db; padding: 4px 12px; border-radius: 20px; white-space: nowrap;
}
.status-pill.active { color: #2e7d32; background-color: #e8f5e9; border-color: #c8e6c9; }

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
  overflow-y: auto;
}
.modal-container {
  background-color: #ffffff; width: 90%; max-width: 580px; border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2); overflow: hidden;
  max-height: calc(100vh - 40px); display: flex; flex-direction: column;
  margin: auto;
}
/* Form di dalam modal harus ikut flex agar footer tidak terdorong keluar */
.modal-container > form {
  display: flex; flex-direction: column;
  flex: 1 1 auto; min-height: 0; overflow: hidden;
}
.modal-sm { max-width: 440px; }

.modal-header {
  background-color: #1e385c; color: #ffffff; padding: 16px 24px;
  display: flex; justify-content: space-between; align-items: center;
  flex-shrink: 0;
}
.header-delete { background-color: #991b1b; }
.modal-header h3 { margin: 0; font-size: 1.1rem; font-weight: 600; }
.btn-close { background: none; border: none; color: #ffffff; font-size: 1.5rem; cursor: pointer; opacity: 0.8; }
.btn-close:hover { opacity: 1; }
.modal-body {
  padding: 24px;
  flex: 1 1 auto; min-height: 0;
  overflow-y: auto; overflow-x: hidden;
  max-height: calc(100vh - 220px);
}

.detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.detail-group { background-color: #f8fafc; padding: 12px 16px; border-radius: 8px; border: 1px solid #e2e8f0; }
.col-span-2 { grid-column: span 2; }
.detail-group label { display: block; font-size: 0.75rem; color: #64748b; font-weight: 600; margin-bottom: 4px; text-transform: uppercase; }
.detail-group p { margin: 0; font-size: 0.9rem; color: #1e293b; word-break: break-word; }
.link-daftar { color: #1d4ed8; word-break: break-all; }
.detail-photo-wrapper {
  width: 96px; height: 96px; border-radius: 50%; overflow: hidden; margin: 0 auto 12px auto;
  background-color: #e8f5e9;
}
.detail-photo { width: 100%; height: 100%; object-fit: cover; display: block; }
.detail-initials {
  width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;
  font-size: 1.8rem; font-weight: 800; color: #2e7d32;
}

.form-stack { display: flex; flex-direction: column; gap: 16px; }
.form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label { font-size: 0.8rem; font-weight: 600; color: #475569; }
.required { color: #dc2626; }
.optional-tag { color: #94a3b8; font-weight: 500; }
.field-error { font-size: 0.75rem; color: #dc2626; font-weight: 600; }
.row-draggable { cursor: grab; }
.row-draggable:active { cursor: grabbing; }
.row-dragging { opacity: 0.45; }
.help-text { font-size: 0.75rem; color: #64748b; font-style: italic; }
.form-group input, .form-group textarea, .form-group select {
  width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px;
  font-family: 'Poppins', sans-serif; font-size: 0.85rem; color: #1e293b; outline: none; transition: border-color 0.2s; box-sizing: border-box;
  background-color: #ffffff;
}
.form-group input:focus, .form-group textarea:focus, .form-group select:focus { border-color: #1e385c; }

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
  flex-shrink: 0;
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
