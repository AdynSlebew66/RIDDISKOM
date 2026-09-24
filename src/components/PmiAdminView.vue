<template>
  <div class="admin-wrapper" @click="closeDropdownOnClickOutside">
    <!-- Top Navbar Admin -->
    <header class="admin-navbar">
      <div class="nav-left">
        <router-link to="/admin/pencaker" class="nav-link" active-class="active">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          Dashboard
        </router-link>
        <router-link to="/admin/pmi" class="nav-link" active-class="active">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
          PMI
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
        <h2>Data Pekerja Migran Indonesia (PMI)</h2>
        <div class="action-buttons-group">
          <button class="btn-add" @click="openAddModal">
            + Tambah
          </button>

          <button class="btn-import" @click="openImportModal" title="Import file Excel data PMI">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
            <span>Import Excel</span>
          </button>

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
            placeholder="Cari Nama / No. Penempatan / Jabatan..."
          />
        </div>

        <div class="sort-box">
          <select v-model="filterTahun" @change="onFilterChange" class="sort-select" title="Filter tahun">
            <option value="">Semua Tahun</option>
            <option v-for="t in tahunOptions" :key="t" :value="t">{{ t }}</option>
          </select>
        </div>

        <div class="sort-box">
          <select v-model="filterNegaraId" @change="onFilterChange" class="sort-select" title="Filter negara tujuan">
            <option value="">Semua Negara</option>
            <option v-for="n in negaraOptions" :key="n.id" :value="n.id">{{ n.nama }}</option>
          </select>
        </div>

        <div class="sort-box">
          <select v-model="filterSektorId" @change="onFilterChange" class="sort-select" title="Filter sektor">
            <option value="">Semua Sektor</option>
            <option v-for="s in sektorOptions" :key="s.id" :value="s.id">{{ s.nama }}</option>
          </select>
        </div>

        <div class="sort-box">
          <select v-model="filterJenisKelamin" @change="onFilterChange" class="sort-select" title="Filter jenis kelamin">
            <option value="">Semua JK</option>
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>
        </div>
      </div>

      <!-- Error Alert -->
      <div v-if="errorMessage" class="error-alert">
        {{ errorMessage }}
      </div>

      <!-- Info Alert -->
      <div v-if="infoMessage" class="info-alert">
        {{ infoMessage }}
      </div>

      <!-- Table Card Wrapper -->
      <div class="data-card">
        <div class="card-header-navy">
          <h3>Data PMI</h3>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th class="text-center" style="width: 60px;">No</th>
                <th>Nama</th>
                <th class="text-center">JK</th>
                <th class="text-center" style="width: 70px;">Umur</th>
                <th>Negara Tujuan</th>
                <th>Jabatan</th>
                <th>Sektor</th>
                <th>Status</th>
                <th class="text-center" style="width: 140px;">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <!-- Loading State -->
              <tr v-if="loading">
                <td colspan="9" class="text-center py-5">
                  <div class="spinner"></div>
                  <p class="loading-text">Memuat data pekerja migran...</p>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-else-if="pmiList.length === 0">
                <td colspan="9" class="text-center py-5 empty-text">
                  Data pekerja migran tidak ditemukan.
                </td>
              </tr>

              <!-- Data Rows -->
              <tr v-else v-for="(item, index) in pmiList" :key="item.id || index">
                <td class="text-center font-bold">{{ calculateRowIndex(index) }}</td>
                <td class="font-bold">{{ formatText(item?.nama) }}</td>
                <td class="text-center">{{ formatJenisKelamin(item?.jenis_kelamin) }}</td>
                <td class="text-center">{{ item?.umur ?? '-' }}</td>
                <td>{{ resolveNegara(item) }}</td>
                <td class="td-alamat" :title="item?.jabatan">{{ formatText(item?.jabatan) }}</td>
                <td>{{ resolveSektor(item) }}</td>
                <td>{{ formatText(item?.status) }}</td>
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
            <h3>Detail Pekerja Migran</h3>
            <button class="btn-close" @click="closeDetailModal">&times;</button>
          </div>
          <div class="modal-body">
            <div v-if="detailLoading" class="text-center py-5">
              <div class="spinner"></div>
              <p class="loading-text">Memuat detail pekerja migran...</p>
            </div>
            <div v-else-if="detailError && !detailItem" class="error-alert">{{ detailError }}</div>
            <div v-if="detailItem" class="detail-grid">
              <div v-if="detailError" class="error-alert" style="margin-bottom: 8px;">{{ detailError }} (menampilkan data tabel)</div>
              <div class="detail-row"><span class="detail-label">No. Penempatan</span><span class="detail-value">{{ formatText(detailItem.id_penempatan) }}</span></div>
              <div class="detail-row"><span class="detail-label">Nama</span><span class="detail-value">{{ formatText(detailItem.nama) }}</span></div>
              <div class="detail-row"><span class="detail-label">Jenis Kelamin</span><span class="detail-value">{{ formatJenisKelamin(detailItem.jenis_kelamin) }}</span></div>
              <div class="detail-row"><span class="detail-label">Umur</span><span class="detail-value">{{ detailItem.umur ?? '-' }}</span></div>
              <div class="detail-row"><span class="detail-label">Pendidikan</span><span class="detail-value">{{ resolvePendidikan(detailItem) }}</span></div>
              <div class="detail-row"><span class="detail-label">Negara Tujuan</span><span class="detail-value">{{ resolveNegara(detailItem) }}</span></div>
              <div class="detail-row"><span class="detail-label">Jabatan</span><span class="detail-value">{{ formatText(detailItem.jabatan) }}</span></div>
              <div class="detail-row"><span class="detail-label">JO</span><span class="detail-value">{{ formatText(detailItem.jo) }}</span></div>
              <div class="detail-row"><span class="detail-label">P3MI</span><span class="detail-value">{{ formatText(detailItem.p3mi) }}</span></div>
              <div class="detail-row"><span class="detail-label">Agency</span><span class="detail-value">{{ formatText(detailItem.agency) }}</span></div>
              <div class="detail-row"><span class="detail-label">Pemberi Kerja</span><span class="detail-value">{{ formatText(detailItem.pemberi_kerja) }}</span></div>
              <div class="detail-row"><span class="detail-label">Asal</span><span class="detail-value">{{ formatText(detailItem.asal_kabupaten) }}, {{ formatText(detailItem.asal_provinsi) }}</span></div>
              <div class="detail-row"><span class="detail-label">Program</span><span class="detail-value">{{ resolveProgram(detailItem) }}</span></div>
              <div class="detail-row"><span class="detail-label">Sektor</span><span class="detail-value">{{ resolveSektor(detailItem) }}</span></div>
              <div class="detail-row"><span class="detail-label">Status</span><span class="detail-value">{{ formatText(detailItem.status) }}</span></div>
              <div class="detail-row"><span class="detail-label">No. Rekom Paspor</span><span class="detail-value">{{ formatText(detailItem.id_rekom_paspor) }}</span></div>
              <div class="detail-row"><span class="detail-label">No. Paspor</span><span class="detail-value">{{ formatText(detailItem.no_paspor) }}</span></div>
              <div class="detail-row"><span class="detail-label">Tgl EPMI</span><span class="detail-value">{{ formatDate(detailItem.tanggal_epmi) }}</span></div>
              <div class="detail-row"><span class="detail-label">EPMI Berakhir</span><span class="detail-value">{{ formatDate(detailItem.tanggal_berakhir_epmi) }}</span></div>
              <div class="detail-row"><span class="detail-label">Tahun</span><span class="detail-value">{{ detailItem.tahun ?? '-' }}</span></div>
              <div class="detail-row"><span class="detail-label">PK Baru</span><span class="detail-value">{{ formatText(detailItem.pk_baru) }}</span></div>
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
            <h3>{{ isEditMode ? 'Edit' : 'Tambah' }} Pekerja Migran</h3>
            <button class="btn-close" @click="closeFormModal">&times;</button>
          </div>
          <form @submit.prevent="submitForm">
            <div class="modal-body">
              <div v-if="formError" class="error-alert">{{ formError }}</div>
              <div class="form-grid">
                <div class="form-group">
                  <label>Nama Lengkap <span class="req">*</span></label>
                  <input type="text" v-model="formData.nama" placeholder="Nama pekerja migran" :class="{ invalid: fieldError('nama') }" />
                  <small v-if="fieldError('nama')" class="field-error">{{ fieldError('nama') }}</small>
                </div>
                <div class="form-group">
                  <label>No. Penempatan</label>
                  <input type="text" v-model="formData.id_penempatan" placeholder="Nomor penempatan" :class="{ invalid: fieldError('id_penempatan') }" />
                  <small v-if="fieldError('id_penempatan')" class="field-error">{{ fieldError('id_penempatan') }}</small>
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
                  <label>Umur</label>
                  <input type="number" v-model.number="formData.umur" placeholder="Umur" min="10" max="100" />
                </div>
                <div class="form-group">
                  <label>Pendidikan</label>
                  <select v-model="formData.pendidikan_id">
                    <option value="">-- Pilih --</option>
                    <option v-for="p in pendidikanOptions" :key="p.id" :value="p.id">{{ p.nama }}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Negara Tujuan</label>
                  <select v-model="formData.negara_tujuan_id">
                    <option value="">-- Pilih negara --</option>
                    <option v-for="n in negaraOptions" :key="n.id" :value="n.id">{{ n.nama }}</option>
                    <option v-if="!negaraOptions.length" value="" disabled>Memuat daftar negara...</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Jabatan</label>
                  <input type="text" v-model="formData.jabatan" placeholder="Jabatan / pekerjaan" />
                </div>
                <div class="form-group">
                  <label>JO (Job Order)</label>
                  <input type="text" v-model="formData.jo" placeholder="Nomor JO" />
                </div>
                <div class="form-group">
                  <label>P3MI</label>
                  <input type="text" v-model="formData.p3mi" placeholder="P3MI" />
                </div>
                <div class="form-group">
                  <label>Agency</label>
                  <input type="text" v-model="formData.agency" placeholder="Agency" />
                </div>
                <div class="form-group">
                  <label>Pemberi Kerja</label>
                  <input type="text" v-model="formData.pemberi_kerja" placeholder="Pemberi kerja / employer" />
                </div>
                <div class="form-group">
                  <label>Sektor</label>
                  <select v-model="formData.sektor_id">
                    <option value="">-- Pilih sektor --</option>
                    <option v-for="s in sektorOptions" :key="s.id" :value="s.id">{{ s.nama }}</option>
                    <option v-if="!sektorOptions.length" value="" disabled>Memuat daftar sektor...</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Program Penempatan</label>
                  <select v-model="formData.program_penempatan_id">
                    <option value="">-- Pilih program --</option>
                    <option v-for="p in programOptions" :key="p.id" :value="p.id">{{ p.nama }}</option>
                    <option v-if="!programOptions.length" value="" disabled>Memuat daftar program...</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Status</label>
                  <input type="text" v-model="formData.status" placeholder="Status penempatan" />
                </div>
                <div class="form-group">
                  <label>Asal Kabupaten</label>
                  <input type="text" v-model="formData.asal_kabupaten" placeholder="Kabupaten asal" />
                </div>
                <div class="form-group">
                  <label>Asal Provinsi</label>
                  <input type="text" v-model="formData.asal_provinsi" placeholder="Provinsi asal" />
                </div>
                <div class="form-group">
                  <label>No. Rekom Paspor</label>
                  <input type="text" v-model="formData.id_rekom_paspor" placeholder="Nomor rekomendasi paspor" />
                </div>
                <div class="form-group">
                  <label>No. Paspor</label>
                  <input type="text" v-model="formData.no_paspor" placeholder="Nomor paspor" />
                </div>
                <div class="form-group">
                  <label>Tanggal EPMI</label>
                  <input type="date" v-model="formData.tanggal_epmi" />
                </div>
                <div class="form-group">
                  <label>Tanggal Berakhir EPMI</label>
                  <input type="date" v-model="formData.tanggal_berakhir_epmi" />
                </div>
                <div class="form-group">
                  <label>Tahun</label>
                  <input type="number" v-model.number="formData.tahun" placeholder="cth: 2025" min="2000" max="2100" />
                </div>
                <div class="form-group">
                  <label>PK Baru</label>
                  <input type="text" v-model="formData.pk_baru" placeholder="PK baru" />
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

    <!-- Modal Import Excel -->
    <transition name="modal-fade">
      <div v-if="showImportModal" class="modal-overlay" @click.self="closeImportModal">
        <div class="modal-container modal-sm">
          <div class="modal-header">
            <h3>Import Excel PMI</h3>
            <button class="btn-close" @click="closeImportModal">&times;</button>
          </div>
          <form @submit.prevent="submitImport">
            <div class="modal-body">
              <div v-if="importError" class="error-alert">{{ importError }}</div>
              <p class="import-hint">File Excel data PMI. Maksimal 20 MB, format .xlsx / .xls.</p>
              <div class="form-grid form-grid-1col">
                <div class="form-group">
                  <label>File Excel <span class="req">*</span></label>
                  <input ref="importFile" type="file" accept=".xlsx,.xls" @change="onImportFileChange" />
                  <small v-if="importFileName" class="file-name">{{ importFileName }}</small>
                </div>
                <div class="form-group">
                  <label>Tahun (opsional)</label>
                  <input type="number" v-model.number="importTahun" placeholder="cth: 2025" min="2000" max="2100" />
                </div>
              </div>
              <div v-if="importResult" class="import-result">
                <p class="import-result-title">{{ importResult.message }}</p>
                <p v-if="importResult.tahun">Tahun: <strong>{{ importResult.tahun }}</strong></p>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn-secondary" @click="closeImportModal" :disabled="importing">Batal</button>
              <button type="submit" class="btn-primary" :disabled="importing || !importFile">{{ importing ? 'Mengunggah...' : 'Upload' }}</button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
const API_BASE = 'https://harvest-protegee-symptom.ngrok-free.dev/api/admin/pekerja-migran'
const API_STATISTIK_PMI = 'https://harvest-protegee-symptom.ngrok-free.dev/api/statistik/pekerja-migran'
const API_PENDIDIKAN = 'https://harvest-protegee-symptom.ngrok-free.dev/api/admin/pendidikan'

// Kandidat endpoint master (dicoba berurutan, yang 404 dilewati otomatis)
const NEGARA_CANDIDATES = [
  'https://harvest-protegee-symptom.ngrok-free.dev/api/admin/pekerja-migran-master/negara'
]
const SEKTOR_CANDIDATES = [
  'https://harvest-protegee-symptom.ngrok-free.dev/api/admin/pekerja-migran-master/sektor',
  'https://harvest-protegee-symptom.ngrok-free.dev/api/admin/sektor'
]
const PROGRAM_CANDIDATES = [
  'https://harvest-protegee-symptom.ngrok-free.dev/api/admin/pekerja-migran-master/program-penempatan',
  'https://harvest-protegee-symptom.ngrok-free.dev/api/admin/pekerja-migran-master/program',
  'https://harvest-protegee-symptom.ngrok-free.dev/api/admin/program-penempatan',
  'https://harvest-protegee-symptom.ngrok-free.dev/api/admin/program'
]

export default {
  name: 'PmiAdminView',
  data() {
    return {
      pmiList: [],
      loading: false,
      errorMessage: '',
      infoMessage: '',
      searchQuery: '',
      searchTimer: null,
      filterTahun: '',
      filterNegaraId: '',
      filterSektorId: '',
      filterJenisKelamin: '',
      exportingExcel: false,
      perPage: 10,
      pagination: {
        current_page: 1,
        last_page: 1,
        total: 0
      },
      tahunOptions: [],
      showDropdown: false,
      showDetailModal: false,
      detailItem: null,
      detailLoading: false,
      detailError: '',
      showFormModal: false,
      isEditMode: false,
      editingId: null,
      showDeleteModal: false,
      deleting: false,
      deleteItem: null,
      showImportModal: false,
      importing: false,
      importFile: null,
      importFileName: '',
      importTahun: null,
      importError: '',
      importResult: null,
      saving: false,
      formError: '',
      validationErrors: {},
      pendidikanOptions: [],
      negaraOptions: [],
      sektorOptions: [],
      programOptions: [],
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
    this.fetchNegaraOptions()
    this.fetchSektorOptions()
    this.fetchProgramOptions()
    this.fetchPmi(1)
  },
  methods: {
    blankForm() {
      return {
        id_penempatan: '',
        nama: '',
        pendidikan_id: '',
        negara_tujuan_id: '',
        jabatan: '',
        jo: '',
        p3mi: '',
        agency: '',
        jenis_kelamin: '',
        umur: null,
        asal_kabupaten: '',
        asal_provinsi: '',
        program_penempatan_id: '',
        sektor_id: '',
        status: '',
        id_rekom_paspor: '',
        tanggal_epmi: '',
        tanggal_berakhir_epmi: '',
        tahun: new Date().getFullYear(),
        pk_baru: '',
        pemberi_kerja: '',
        no_paspor: ''
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
      // Coba endpoint khusus tahun dulu, fallback ke statistik umum (by_tahun)
      try {
        const res = await fetch(`${API_STATISTIK_PMI}/tahun`, {
          method: 'GET',
          headers: this.buildHeaders()
        })
        const json = await res.json().catch(() => ({}))
        if (res.ok && Array.isArray(json.data)) {
          this.tahunOptions = json.data
          return
        }
      } catch (e) {
        console.error('[PmiAdmin] gagal ambil daftar tahun:', e)
      }
      try {
        const res = await fetch(API_STATISTIK_PMI, {
          method: 'GET',
          headers: { 'ngrok-skip-browser-warning': '69420', Accept: 'application/json' }
        })
        const json = await res.json().catch(() => ({}))
        const byTahun = json.data?.by_tahun
        if (res.ok && Array.isArray(byTahun)) {
          this.tahunOptions = byTahun
            .map((i) => Number(i.tahun))
            .filter((t) => t)
            .sort((a, b) => b - a)
        }
      } catch (e) {
        console.error('[PmiAdmin] gagal ambil daftar tahun (fallback):', e)
      }
    },
    async fetchPmi(page = 1) {
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
        if (this.filterNegaraId) params.append('negara_tujuan_id', this.filterNegaraId)
        if (this.filterSektorId) params.append('sektor_id', this.filterSektorId)
        if (this.filterJenisKelamin) params.append('jenis_kelamin', this.filterJenisKelamin)

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
          this.pmiList = pageData.data
          this.pagination = {
            current_page: Number(pageData.current_page) || page,
            last_page: Number(pageData.last_page) || 1,
            total: Number(pageData.total) || 0
          }
        } else if (Array.isArray(result.data)) {
          this.pmiList = result.data
          this.pagination = { current_page: 1, last_page: 1, total: result.data.length }
        } else {
          this.pmiList = []
          this.pagination = { current_page: 1, last_page: 1, total: 0 }
        }
      } catch (error) {
        this.errorMessage = `Error: ${error.message || 'Gagal terhubung ke API.'}`
        this.pmiList = []
      } finally {
        this.loading = false
      }
    },
    handleSearch() {
      clearTimeout(this.searchTimer)
      this.searchTimer = setTimeout(() => {
        this.fetchPmi(1)
      }, 500)
    },
    onFilterChange() {
      this.fetchPmi(1)
    },
    onPerPageChange() {
      this.fetchPmi(1)
    },
    changePage(page) {
      if (page < 1 || page > this.pagination.last_page) return
      this.fetchPmi(page)
    },
    calculateRowIndex(index) {
      return (this.pagination.current_page - 1) * this.perPage + index + 1
    },
    async handleDetail(item) {
      // GET /api/admin/pekerja-migran/{pekerjaMigran} untuk data detail terbaru.
      // Fallback ke data baris tabel bila request gagal (misal item tanpa id).
      this.detailItem = item
      this.detailError = ''
      this.showDetailModal = true
      if (!item?.id) return
      this.detailLoading = true
      try {
        const response = await fetch(`${API_BASE}/${item.id}`, {
          method: 'GET',
          headers: this.buildHeaders()
        })
        if (response.status === 401) {
          this.$router.push('/login')
          return
        }
        if (!response.ok) throw new Error(`Gagal mengambil detail (status ${response.status}).`)
        const result = await response.json().catch(() => ({}))
        if (result.data && typeof result.data === 'object') {
          this.detailItem = result.data
        }
      } catch (error) {
        // Tetap tampilkan data baris + info kecil bahwa refresh detail gagal
        this.detailError = error.message || 'Gagal memuat ulang detail dari server.'
      } finally {
        this.detailLoading = false
      }
    },
    closeDetailModal() {
      this.showDetailModal = false
      this.detailItem = null
      this.detailError = ''
      this.detailLoading = false
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
        id_penempatan: item.id_penempatan || '',
        nama: item.nama || '',
        pendidikan_id: item.pendidikan_id ?? '',
        negara_tujuan_id: item.negara_tujuan_id ?? '',
        jabatan: item.jabatan || '',
        jo: item.jo || '',
        p3mi: item.p3mi || '',
        agency: item.agency || '',
        jenis_kelamin: this.toJenisKelaminKode(item.jenis_kelamin),
        umur: item.umur ?? null,
        asal_kabupaten: item.asal_kabupaten || '',
        asal_provinsi: item.asal_provinsi || '',
        program_penempatan_id: item.program_penempatan_id ?? '',
        sektor_id: item.sektor_id ?? '',
        status: item.status || '',
        id_rekom_paspor: item.id_rekom_paspor || '',
        tanggal_epmi: this.toDateInput(item.tanggal_epmi),
        tanggal_berakhir_epmi: this.toDateInput(item.tanggal_berakhir_epmi),
        tahun: item.tahun ?? new Date().getFullYear(),
        pk_baru: item.pk_baru || '',
        pemberi_kerja: item.pemberi_kerja || '',
        no_paspor: item.no_paspor || ''
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
        const res = await fetch(API_PENDIDIKAN, {
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
        console.error('[PmiAdmin] gagal ambil opsi pendidikan:', e)
      }
    },
    async fetchOptionsFromCandidates(candidates) {
      for (const url of candidates) {
        try {
          const res = await fetch(url, { method: 'GET', headers: this.buildHeaders() })
          if (res.status === 401) return []
          if (!res.ok) continue
          const json = await res.json().catch(() => ({}))
          const raw = json.data?.data || json.data || []
          if (Array.isArray(raw) && raw.length) {
            return raw.map((o) => ({
              id: o.id,
              nama: o.nama || o.name || o.negara || `#${o.id}`
            }))
          }
        } catch (e) {
          console.error('[PmiAdmin] gagal ambil opsi:', url, e)
        }
      }
      return []
    },
    async fetchNegaraOptions() {
      this.negaraOptions = await this.fetchOptionsFromCandidates(NEGARA_CANDIDATES)
    },
    async fetchSektorOptions() {
      this.sektorOptions = await this.fetchOptionsFromCandidates(SEKTOR_CANDIDATES)
    },
    async fetchProgramOptions() {
      this.programOptions = await this.fetchOptionsFromCandidates(PROGRAM_CANDIDATES)
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
        const numOrNull = (v) => (v === '' || v === null || v === undefined ? null : Number(v))
        const strOrNull = (v) => {
          const s = (v ?? '').toString().trim()
          return s ? s : null
        }
        const payload = {
          id_penempatan: strOrNull(f.id_penempatan),
          nama: (f.nama || '').trim(),
          pendidikan_id: numOrNull(f.pendidikan_id),
          negara_tujuan_id: numOrNull(f.negara_tujuan_id),
          jabatan: strOrNull(f.jabatan),
          jo: strOrNull(f.jo),
          p3mi: strOrNull(f.p3mi),
          agency: strOrNull(f.agency),
          jenis_kelamin: f.jenis_kelamin || null,
          umur: numOrNull(f.umur),
          asal_kabupaten: strOrNull(f.asal_kabupaten),
          asal_provinsi: strOrNull(f.asal_provinsi),
          program_penempatan_id: numOrNull(f.program_penempatan_id),
          sektor_id: numOrNull(f.sektor_id),
          status: strOrNull(f.status),
          id_rekom_paspor: strOrNull(f.id_rekom_paspor),
          tanggal_epmi: f.tanggal_epmi || null,
          tanggal_berakhir_epmi: f.tanggal_berakhir_epmi || null,
          tahun: numOrNull(f.tahun),
          pk_baru: strOrNull(f.pk_baru),
          pemberi_kerja: strOrNull(f.pemberi_kerja),
          no_paspor: strOrNull(f.no_paspor)
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
        this.infoMessage = result.message || (this.isEditMode ? 'Data PMI berhasil diperbarui.' : 'Data PMI berhasil ditambahkan.')
        setTimeout(() => { this.infoMessage = '' }, 4000)
        this.fetchPmi(this.pagination.current_page)
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
    },    closeDeleteModal() {
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
        this.infoMessage = result.message || 'Data PMI berhasil dihapus.'
        setTimeout(() => { this.infoMessage = '' }, 4000)

        // Jika halaman jadi kosong dan bukan halaman 1, mundur satu halaman
        if (this.pmiList.length <= 1 && this.pagination.current_page > 1) {
          this.fetchPmi(this.pagination.current_page - 1)
        } else {
          this.fetchPmi(this.pagination.current_page)
        }
      } catch (error) {
        this.formError = error.message || 'Gagal terhubung ke API.'
      } finally {
        this.deleting = false
      }
    },
    openImportModal() {
      this.importFile = null
      this.importFileName = ''
      this.importTahun = null
      this.importError = ''
      this.importResult = null
      if (this.$refs.importFile) this.$refs.importFile.value = ''
      this.showImportModal = true
    },
    closeImportModal() {
      if (this.importing) return
      this.showImportModal = false
    },
    onImportFileChange(event) {
      const file = event.target.files?.[0] || null
      this.importError = ''
      this.importResult = null
      if (!file) {
        this.importFile = null
        this.importFileName = ''
        return
      }
      const maxBytes = 20480 * 1024 // 20 MB sesuai validasi backend
      if (file.size > maxBytes) {
        this.importError = `Ukuran file ${(file.size / 1024 / 1024).toFixed(1)} MB melebihi batas 20 MB.`
        this.importFile = null
        this.importFileName = ''
        event.target.value = ''
        return
      }
      if (!/\.(xlsx|xls)$/i.test(file.name)) {
        this.importError = 'Format file harus .xlsx atau .xls.'
        this.importFile = null
        this.importFileName = ''
        event.target.value = ''
        return
      }
      this.importFile = file
      this.importFileName = `${file.name} (${(file.size / 1024).toFixed(0)} KB)`
    },
    async submitImport() {
      if (!this.importFile || this.importing) return
      this.importing = true
      this.importError = ''
      this.importResult = null
      try {
        const token = this.getAuthToken()
        if (!token) {
          this.$router.push('/login')
          return
        }
        const form = new FormData()
        form.append('file', this.importFile)
        if (this.importTahun) form.append('tahun', this.importTahun)

        const response = await fetch(`${API_BASE}/import`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'ngrok-skip-browser-warning': '69420',
            Authorization: `Bearer ${token}`
          },
          body: form
        })

        if (response.status === 401) {
          this.$router.push('/login')
          return
        }

        const result = await response.json().catch(() => ({}))
        if (response.status === 422) {
          const errs = result.errors || {}
          const first = Object.values(errs).flat()[0]
          this.importError = first || result.message || 'Validasi file gagal. Periksa format dan ukuran file.'
          return
        }
        if (!response.ok) {
          throw new Error(result.message || `Import gagal (status ${response.status}).`)
        }

        const data = result.data || {}
        this.importResult = { message: result.message || 'Import berhasil.', tahun: data.tahun || null }
        this.infoMessage = result.message || `Import Excel berhasil (tahun ${data.tahun || ''}).`
        setTimeout(() => { this.infoMessage = '' }, 5000)
        this.fetchTahunOptions()
        this.fetchPmi(1)
      } catch (error) {
        this.importError = error.message || 'Gagal terhubung ke API.'
      } finally {
        this.importing = false
      }
    },
    async exportToExcel() {
      // GET /api/admin/pekerja-migran/export?tahun=&negara_tujuan_id=&sektor_id=&jenis_kelamin=&search=
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
        if (this.filterNegaraId) params.append('negara_tujuan_id', this.filterNegaraId)
        if (this.filterSektorId) params.append('sektor_id', this.filterSektorId)
        if (this.filterJenisKelamin) params.append('jenis_kelamin', this.filterJenisKelamin)
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
          throw new Error(j.message || `Export gagal (status ${response.status}). Periksa filter yang aktif.`)
        }
        if (!response.ok) {
          throw new Error(`Export gagal (status ${response.status}).`)
        }

        const blob = await response.blob()
        if (!blob || blob.size === 0) throw new Error('File kosong dari server.')

        const dateStr = new Date().toISOString().slice(0, 10)
        const parts = ['Data_PMI', dateStr]
        if (this.filterTahun) parts.push(this.filterTahun)
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
    resolveNegara(item) {
      if (!item) return '-'
      const nama = item.negara_tujuan?.nama || item.negara_tujuan_nama || item.negara_nama || item.negara
      if (nama) return String(nama)
      const id = item.negara_tujuan_id
      if (id === null || id === undefined || id === '') return '-'
      const found = this.negaraOptions.find((n) => Number(n.id) === Number(id))
      return found ? found.nama : `#${id}`
    },
    resolveSektor(item) {
      if (!item) return '-'
      const nama = item.sektor?.nama || item.sektor_nama
      if (nama) return String(nama)
      const id = item.sektor_id
      if (id === null || id === undefined || id === '') return '-'
      const found = this.sektorOptions.find((s) => Number(s.id) === Number(id))
      return found ? found.nama : `#${id}`
    },
    resolveProgram(item) {
      if (!item) return '-'
      const nama = item.program_penempatan?.nama || item.program_penempatan_nama || item.program_nama || item.program
      if (nama) return String(nama)
      const id = item.program_penempatan_id
      if (id === null || id === undefined || id === '') return '-'
      const found = this.programOptions.find((p) => Number(p.id) === Number(id))
      return found ? found.nama : `#${id}`
    },
    resolvePendidikan(item) {
      if (!item) return '-'
      const nama = item.pendidikan?.nama || item.pendidikan_nama
      if (nama) return String(nama)
      const id = item.pendidikan_id
      if (id === null || id === undefined || id === '') return '-'
      const found = this.pendidikanOptions.find((p) => Number(p.id) === Number(id))
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
    formatDate(val) {
      if (!val) return '-'
      const d = new Date(val)
      if (isNaN(d.getTime())) return String(val)
      return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
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

/* Grup tombol aksi: selalu sebaris, turun bersama kalau layar sempit */
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

.btn-import {
  background-color: #dc2626;
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

.btn-import:hover { background-color: #b91c1c; }

/* Import modal */
.form-grid-1col { grid-template-columns: 1fr; }
.import-hint { font-size: 0.85rem; color: #64748b; margin: 0 0 14px 0; line-height: 1.6; }
.file-name { color: #1e385c; font-size: 0.78rem; margin-top: 6px; font-weight: 600; }
.import-result {
  margin-top: 14px;
  background-color: #f0fdf4;
  border: 1px solid #86efac;
  color: #166534;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 0.85rem;
}
.import-result p { margin: 2px 0; }
.import-result-title { font-weight: 700; }

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
