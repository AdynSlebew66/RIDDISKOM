<template>
  <AdminLayout group="phijs" title="Data PHIJS">
    <!-- Main Content -->
    <main class="admin-content">
      <div class="page-title">
        <h2>Data PHIJS</h2>
        <div class="action-buttons-group">
          <button class="btn-add" @click="openAddModal">+ Tambah</button>

          <button class="btn-import" @click="openImportModal" title="Import file Excel Detail dan Rekap">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
            <span>Import Excel</span>
          </button>

          <button class="btn-excel" @click="exportToExcel" :disabled="exportingExcel" title="Download Excel dari server sesuai filter yang aktif">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            <span>{{ exportingExcel ? 'Mengekspor...' : 'Export Excel' }}</span>
          </button>
        </div>
      </div>

      <!-- Panel Periode -->
      <div class="periode-card">
        <div class="periode-head">
          <h3>Periode Data PHIJS</h3>
          <span class="periode-count">{{ periodeList.length }} periode</span>
        </div>
        <div class="periode-body">
          <div v-if="periodeLoading" class="periode-empty">Memuat periode...</div>
          <div v-else-if="!periodeList.length" class="periode-empty">Belum ada periode. Import Excel untuk membuat periode baru.</div>
          <table v-else class="periode-table">
            <thead>
              <tr>
                <th>Label</th>
                <th class="text-center">Tahun</th>
                <th class="text-center">Bulan</th>
                <th class="text-right">Perusahaan</th>
                <th class="text-right">Baris Excel</th>
                <th class="text-center">Status</th>
                <th class="text-center" style="width: 220px;">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in periodeList" :key="p.id" :class="{ 'periode-active': String(p.id) === String(filterPeriodeId) }">
                <td class="font-bold">{{ formatText(p.label) }}</td>
                <td class="text-center">{{ p.tahun ?? '-' }}</td>
                <td class="text-center">{{ p.nama_bulan || bulanLabel(p.bulan) }}</td>
                <td class="text-right">{{ formatNumber(p.total_perusahaan) }}</td>
                <td class="text-right">{{ formatNumber(p.total_baris_excel) }}</td>
                <td class="text-center">
                  <span class="badge" :class="p.status === 'aktif' ? 'badge-yes' : 'badge-neutral'">{{ formatText(p.status) }}</span>
                </td>
                <td class="text-center">
                  <div class="action-buttons">
                    <button class="btn-chip btn-chip-blue" @click="openPublikasiModal(p)" title="Terbitkan / sembunyikan seluruh data periode">
                      Publikasi
                    </button>
                    <button class="btn-chip btn-chip-outline" @click="applyPeriodeFilter(p)" title="Tampilkan hanya data periode ini">
                      Lihat Data
                    </button>
                    <button class="btn-icon btn-delete" title="Hapus periode beserta seluruh datanya" @click="openDeletePeriodeModal(p)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
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
            placeholder="Cari Nama Perusahaan / NIB / Pemilik..."
          />
        </div>

        <div class="sort-box">
          <select v-model="filterPeriodeId" @change="onFilterChange" class="sort-select" title="Filter periode">
            <option value="">Semua Periode</option>
            <option v-for="p in periodeList" :key="p.id" :value="String(p.id)">
              {{ p.label }} ({{ p.nama_bulan || bulanLabel(p.bulan) }} {{ p.tahun }})
            </option>
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

        <div class="sort-box">
          <select v-model="filterKecamatanId" @change="onFilterChange" class="sort-select" title="Filter kecamatan">
            <option value="">Semua Kecamatan</option>
            <option v-for="k in kecamatanOptions" :key="k.id" :value="String(k.id)">{{ k.nama }}</option>
          </select>
        </div>

        <div class="sort-box">
          <select v-model="filterKlasifikasi" @change="onFilterChange" class="sort-select" title="Filter klasifikasi">
            <option value="">Semua Klasifikasi</option>
            <option v-for="k in klasifikasiOptions" :key="k" :value="k">{{ k }}</option>
          </select>
        </div>

        <div class="sort-box">
          <select v-model="filterPp" @change="onFilterChange" class="sort-select" title="Filter PP">
            <option value="">Semua PP</option>
            <option value="Ya">PP: Ya</option>
            <option value="Tidak">PP: Tidak</option>
          </select>
        </div>

        <div class="sort-box">
          <select v-model="filterPkb" @change="onFilterChange" class="sort-select" title="Filter PKB">
            <option value="">Semua PKB</option>
            <option value="Ya">PKB: Ya</option>
            <option value="Tidak">PKB: Tidak</option>
          </select>
        </div>
      </div>

      <!-- Alerts -->
      <div v-if="errorMessage" class="error-alert">{{ errorMessage }}</div>
      <div v-if="infoMessage" class="info-alert">{{ infoMessage }}</div>

      <!-- Table Card -->
      <div class="data-card">
        <div class="card-header-navy">
          <h3>Daftar Perusahaan PHIJS</h3>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th class="text-center" style="width: 60px;">No</th>
                <th>Nama Perusahaan</th>
                <th>NIB</th>
                <th>Kecamatan</th>
                <th>Klasifikasi</th>
                <th>Sektor</th>
                <th class="text-center">Pria</th>
                <th class="text-center">Wanita</th>
                <th class="text-center">Total TK</th>
                <th class="text-center">PP</th>
                <th class="text-center">PKB</th>
                <th class="text-center" style="width: 140px;">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td colspan="12" class="text-center py-5">
                  <div class="spinner"></div>
                  <p class="loading-text">Memuat data PHIJS...</p>
                </td>
              </tr>

              <tr v-else-if="phijsList.length === 0">
                <td colspan="12" class="text-center py-5 empty-text">
                  Data PHIJS tidak ditemukan.
                </td>
              </tr>

              <tr v-else v-for="(item, index) in phijsList" :key="item.id || index">
                <td class="text-center font-bold">{{ calculateRowIndex(index) }}</td>
                <td class="td-perusahaan font-bold" :title="item.nama_perusahaan">{{ formatText(item.nama_perusahaan) }}</td>
                <td class="td-nib" :title="item.nib">{{ formatText(item.nib) }}</td>
                <td>{{ resolveKecamatan(item) }}</td>
                <td>{{ formatText(item.klasifikasi) }}</td>
                <td class="td-sektor" :title="item.sektor">{{ formatText(item.sektor) }}</td>
                <td class="text-center">{{ formatNumber(item.pria) }}</td>
                <td class="text-center">{{ formatNumber(item.wanita) }}</td>
                <td class="text-center font-bold">{{ formatNumber(resolveTotalTk(item)) }}</td>
                <td class="text-center">
                  <span class="badge" :class="item.pp === 'Ya' ? 'badge-yes' : 'badge-no'">{{ formatText(item.pp) }}</span>
                </td>
                <td class="text-center">
                  <span class="badge" :class="item.pkb === 'Ya' ? 'badge-yes' : 'badge-no'">{{ formatText(item.pkb) }}</span>
                </td>
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
            <span class="total-info">Total: {{ formatNumber(pagination.total) }} Data</span>
            <span class="per-page-fixed">{{ perPage }} / halaman</span>
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

    <!-- Modal Detail -->
    <transition name="modal-fade">
      <div v-if="showDetailModal" class="modal-overlay" @click.self="closeDetailModal">
        <div class="modal-container modal-lg">
          <div class="modal-header">
            <h3>Detail Perusahaan PHIJS</h3>
            <button class="btn-close" @click="closeDetailModal">&times;</button>
          </div>
          <div class="modal-body">
            <div v-if="detailLoading" class="text-center py-5">
              <div class="spinner"></div>
              <p class="loading-text">Memuat detail perusahaan...</p>
            </div>
            <div v-else-if="detailError && !detailItem" class="error-alert">{{ detailError }}</div>
            <div v-if="detailItem" class="detail-wrap">
              <div v-if="detailError" class="error-alert" style="margin-bottom: 8px;">{{ detailError }} (menampilkan data tabel)</div>

              <h4 class="detail-section">Identitas Perusahaan</h4>
              <div class="detail-grid">
                <div class="detail-row"><span class="detail-label">Nama Perusahaan</span><span class="detail-value">{{ formatText(detailItem.nama_perusahaan) }}</span></div>
                <div class="detail-row"><span class="detail-label">NIB</span><span class="detail-value">{{ formatText(detailItem.nib) }}</span></div>
                <div class="detail-row"><span class="detail-label">Kode Pendaftaran</span><span class="detail-value">{{ formatText(detailItem.kode_pendaftaran) }}</span></div>
                <div class="detail-row"><span class="detail-label">Tgl. Pendaftaran</span><span class="detail-value">{{ formatDate(detailItem.tgl_pendaftaran) }}</span></div>
                <div class="detail-row"><span class="detail-label">Masa Berlaku</span><span class="detail-value">{{ formatDate(detailItem.masa_berlaku) }}</span></div>
                <div class="detail-row"><span class="detail-label">Telp</span><span class="detail-value">{{ formatText(detailItem.telp) }}</span></div>
                <div class="detail-row"><span class="detail-label">Email</span><span class="detail-value">{{ formatText(detailItem.email) }}</span></div>
                <div class="detail-row"><span class="detail-label">Alamat</span><span class="detail-value">{{ formatText(detailItem.alamat) }}</span></div>
                <div class="detail-row"><span class="detail-label">No. HP Pengelola</span><span class="detail-value">{{ formatText(detailItem.no_hp_pengelola) }}</span></div>
              </div>

              <h4 class="detail-section">Wilayah</h4>
              <div class="detail-grid">
                <div class="detail-row"><span class="detail-label">Kelurahan</span><span class="detail-value">{{ formatText(detailItem.kelurahan) }}</span></div>
                <div class="detail-row"><span class="detail-label">Kecamatan</span><span class="detail-value">{{ formatText(detailItem.kecamatan) }}</span></div>
                <div class="detail-row"><span class="detail-label">Kota</span><span class="detail-value">{{ formatText(detailItem.kota) }}</span></div>
                <div class="detail-row"><span class="detail-label">Provinsi</span><span class="detail-value">{{ formatText(detailItem.provinsi) }}</span></div>
              </div>

              <h4 class="detail-section">Pemilik &amp; Pengurus</h4>
              <div class="detail-grid">
                <div class="detail-row"><span class="detail-label">Nama Pemilik</span><span class="detail-value">{{ formatText(detailItem.nama_pemilik) }}</span></div>
                <div class="detail-row"><span class="detail-label">Alamat Pemilik</span><span class="detail-value">{{ formatText(detailItem.alamat_pemilik) }}</span></div>
                <div class="detail-row"><span class="detail-label">Nama Pengurus</span><span class="detail-value">{{ formatText(detailItem.nama_pengurus) }}</span></div>
                <div class="detail-row"><span class="detail-label">Alamat Pengurus</span><span class="detail-value">{{ formatText(detailItem.alamat_pengurus) }}</span></div>
              </div>

              <h4 class="detail-section">Usaha &amp; Klasifikasi</h4>
              <div class="detail-grid">
                <div class="detail-row"><span class="detail-label">Sektor</span><span class="detail-value">{{ formatText(detailItem.sektor) }}</span></div>
                <div class="detail-row"><span class="detail-label">Klasifikasi</span><span class="detail-value">{{ formatText(detailItem.klasifikasi) }}</span></div>
                <div class="detail-row"><span class="detail-label">Status Kepemilikan</span><span class="detail-value">{{ formatText(detailItem.status_kepemilikan) }}</span></div>
                <div class="detail-row"><span class="detail-label">Permodalan</span><span class="detail-value">{{ formatText(detailItem.permodalan) }}</span></div>
                <div class="detail-row"><span class="detail-label">PP</span><span class="detail-value">{{ formatText(detailItem.pp) }}</span></div>
                <div class="detail-row"><span class="detail-label">PKB</span><span class="detail-value">{{ formatText(detailItem.pkb) }}</span></div>
              </div>

              <h4 class="detail-section">Tenaga Kerja</h4>
              <div class="detail-grid">
                <div class="detail-row"><span class="detail-label">Pria</span><span class="detail-value">{{ formatNumber(detailItem.pria) }}</span></div>
                <div class="detail-row"><span class="detail-label">Wanita</span><span class="detail-value">{{ formatNumber(detailItem.wanita) }}</span></div>
                <div class="detail-row"><span class="detail-label">Total TK</span><span class="detail-value">{{ formatNumber(detailItem.total_tk) }}</span></div>
                <div class="detail-row"><span class="detail-label">TKA Pria</span><span class="detail-value">{{ formatNumber(detailItem.tka_pria) }}</span></div>
                <div class="detail-row"><span class="detail-label">TKA Wanita</span><span class="detail-value">{{ formatNumber(detailItem.tka_wanita) }}</span></div>
                <div class="detail-row"><span class="detail-label">Total TKA</span><span class="detail-value">{{ formatNumber(detailItem.total_tka) }}</span></div>
                <div class="detail-row"><span class="detail-label">Grand Total</span><span class="detail-value">{{ formatNumber(detailItem.grand_total) }}</span></div>
                <div class="detail-row"><span class="detail-label">Disabilitas Pria</span><span class="detail-value">{{ formatNumber(detailItem.disabilitas_pria) }}</span></div>
                <div class="detail-row"><span class="detail-label">Disabilitas Wanita</span><span class="detail-value">{{ formatNumber(detailItem.disabilitas_wanita) }}</span></div>
                <div class="detail-row"><span class="detail-label">PKWTT Pria</span><span class="detail-value">{{ formatNumber(detailItem.pkwtt_pria) }}</span></div>
                <div class="detail-row"><span class="detail-label">PKWT Pria</span><span class="detail-value">{{ formatNumber(detailItem.pkwt_pria) }}</span></div>
                <div class="detail-row"><span class="detail-label">PKWTT Wanita</span><span class="detail-value">{{ formatNumber(detailItem.pkwtt_wanita) }}</span></div>
                <div class="detail-row"><span class="detail-label">PKWT Wanita</span><span class="detail-value">{{ formatNumber(detailItem.pkwt_wanita) }}</span></div>
                <div class="detail-row"><span class="detail-label">PKWTT Pria Disabilitas</span><span class="detail-value">{{ formatNumber(detailItem.pkwtt_pria_disabilitas) }}</span></div>
                <div class="detail-row"><span class="detail-label">PKWT Pria Disabilitas</span><span class="detail-value">{{ formatNumber(detailItem.pkwt_pria_disabilitas) }}</span></div>
                <div class="detail-row"><span class="detail-label">PKWTT Wanita Disabilitas</span><span class="detail-value">{{ formatNumber(detailItem.pkwtt_wanita_disabilitas) }}</span></div>
                <div class="detail-row"><span class="detail-label">PKWT Wanita Disabilitas</span><span class="detail-value">{{ formatNumber(detailItem.pkwt_wanita_disabilitas) }}</span></div>
              </div>

              <h4 class="detail-section">Metadata</h4>
              <div class="detail-grid">
                <div class="detail-row"><span class="detail-label">Periode</span><span class="detail-value">{{ detailItem.periode?.label || '-' }}</span></div>
                <div class="detail-row"><span class="detail-label">Tahun / Bulan</span><span class="detail-value">{{ detailItem.tahun ?? '-' }} / {{ bulanLabel(detailItem.bulan) }}</span></div>
                <div class="detail-row"><span class="detail-label">Publik</span><span class="detail-value">{{ detailItem.is_publik ? 'Ya' : 'Tidak' }}</span></div>
                <div class="detail-row"><span class="detail-label">Baris Duplikat</span><span class="detail-value">{{ detailItem.baris_duplikat ? 'Ya' : 'Tidak' }}</span></div>
                <div class="detail-row"><span class="detail-label">Jumlah Baris Excel</span><span class="detail-value">{{ formatNumber(detailItem.jumlah_baris_excel) }}</span></div>
                <div class="detail-row"><span class="detail-label">Dibuat</span><span class="detail-value">{{ formatDateTime(detailItem.created_at) }}</span></div>
                <div class="detail-row"><span class="detail-label">Diperbarui</span><span class="detail-value">{{ formatDateTime(detailItem.updated_at) }}</span></div>
              </div>
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
            <h3>{{ isEditMode ? 'Edit' : 'Tambah' }} Data PHIJS</h3>
            <button class="btn-close" @click="closeFormModal">&times;</button>
          </div>
          <form @submit.prevent="submitForm">
            <div class="modal-body">
              <div v-if="formError" class="error-alert">{{ formError }}</div>

              <h4 class="detail-section">Identitas Perusahaan</h4>
              <div class="form-grid">
                <div class="form-group">
                  <label>Periode <span class="req">*</span></label>
                  <select v-model="formData.periode_id" :class="{ invalid: fieldError('periode_id') }">
                    <option value="">-- Pilih periode --</option>
                    <option v-for="p in periodeList" :key="p.id" :value="p.id">{{ p.label }} ({{ bulanLabel(p.bulan) }} {{ p.tahun }})</option>
                  </select>
                  <small v-if="fieldError('periode_id')" class="field-error">{{ fieldError('periode_id') }}</small>
                </div>
                <div class="form-group">
                  <label>Nama Perusahaan <span class="req">*</span></label>
                  <input type="text" v-model="formData.nama_perusahaan" placeholder="Nama perusahaan" :class="{ invalid: fieldError('nama_perusahaan') }" />
                  <small v-if="fieldError('nama_perusahaan')" class="field-error">{{ fieldError('nama_perusahaan') }}</small>
                </div>
                <div class="form-group">
                  <label>NIB</label>
                  <input type="text" v-model="formData.nib" placeholder="Nomor induk berusaha" maxlength="50" />
                </div>
                <div class="form-group">
                  <label>Kode Pendaftaran</label>
                  <input type="text" v-model="formData.kode_pendaftaran" placeholder="Kode pendaftaran" maxlength="100" />
                </div>
                <div class="form-group">
                  <label>Tanggal Pendaftaran</label>
                  <input type="date" v-model="formData.tgl_pendaftaran" />
                </div>
                <div class="form-group">
                  <label>Masa Berlaku</label>
                  <input type="date" v-model="formData.masa_berlaku" />
                </div>
                <div class="form-group">
                  <label>Telp</label>
                  <input type="text" v-model="formData.telp" placeholder="No. telepon" maxlength="100" />
                </div>
                <div class="form-group">
                  <label>Email</label>
                  <input type="email" v-model="formData.email" placeholder="email@perusahaan.com" maxlength="150" />
                </div>
                <div class="form-group form-full">
                  <label>Alamat</label>
                  <textarea v-model="formData.alamat" rows="2" placeholder="Alamat lengkap perusahaan"></textarea>
                </div>
                <div class="form-group">
                  <label>No. HP Pengelola</label>
                  <input type="text" v-model="formData.no_hp_pengelola" placeholder="No. HP pengelola" maxlength="50" />
                </div>
              </div>

              <h4 class="detail-section">Wilayah</h4>
              <div class="form-grid">
                <div class="form-group">
                  <label>Kecamatan</label>
                  <select v-model="formData.kecamatan_id" @change="onKecamatanFormChange">
                    <option value="">-- Pilih kecamatan --</option>
                    <option v-for="k in kecamatanOptions" :key="k.id" :value="k.id">{{ k.nama }}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Kelurahan</label>
                  <input type="text" v-model="formData.kelurahan" placeholder="Nama kelurahan" maxlength="100" />
                </div>
                <div class="form-group">
                  <label>Kota</label>
                  <input type="text" v-model="formData.kota" placeholder="Kota" maxlength="100" />
                </div>
                <div class="form-group">
                  <label>Provinsi</label>
                  <input type="text" v-model="formData.provinsi" placeholder="Provinsi" maxlength="100" />
                </div>
              </div>

              <h4 class="detail-section">Pemilik &amp; Pengurus</h4>
              <div class="form-grid">
                <div class="form-group">
                  <label>Nama Pemilik</label>
                  <input type="text" v-model="formData.nama_pemilik" placeholder="Nama pemilik" maxlength="255" />
                </div>
                <div class="form-group">
                  <label>Nama Pengurus</label>
                  <input type="text" v-model="formData.nama_pengurus" placeholder="Nama pengurus" maxlength="255" />
                </div>
                <div class="form-group">
                  <label>Alamat Pemilik</label>
                  <textarea v-model="formData.alamat_pemilik" rows="2" placeholder="Alamat pemilik"></textarea>
                </div>
                <div class="form-group">
                  <label>Alamat Pengurus</label>
                  <textarea v-model="formData.alamat_pengurus" rows="2" placeholder="Alamat pengurus"></textarea>
                </div>
              </div>

              <h4 class="detail-section">Usaha &amp; Klasifikasi</h4>
              <div class="form-grid">
                <div class="form-group">
                  <label>Sektor</label>
                  <input type="text" v-model="formData.sektor" placeholder="Sektor usaha" maxlength="255" />
                </div>
                <div class="form-group">
                  <label>Klasifikasi</label>
                  <select v-model="formData.klasifikasi">
                    <option value="">-- Pilih klasifikasi --</option>
                    <option v-for="k in klasifikasiOptions" :key="k" :value="k">{{ k }}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Status Kepemilikan</label>
                  <input type="text" v-model="formData.status_kepemilikan" placeholder="cth: Persero" maxlength="50" />
                </div>
                <div class="form-group">
                  <label>Permodalan</label>
                  <input type="text" v-model="formData.permodalan" placeholder="cth: PMDN" maxlength="50" />
                </div>
                <div class="form-group">
                  <label>PP (Peraturan Perusahaan)</label>
                  <select v-model="formData.pp">
                    <option value="">-- Pilih --</option>
                    <option value="Ya">Ya</option>
                    <option value="Tidak">Tidak</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>PKB (Perjanjian Kerja Bersama)</label>
                  <select v-model="formData.pkb">
                    <option value="">-- Pilih --</option>
                    <option value="Ya">Ya</option>
                    <option value="Tidak">Tidak</option>
                  </select>
                </div>
              </div>

              <h4 class="detail-section">
                Tenaga Kerja
                <button type="button" class="btn-sync" @click="syncTotals">Hitung otomatis total</button>
              </h4>
              <div class="form-grid form-grid-3">
                <div class="form-group">
                  <label>Pria</label>
                  <input type="number" v-model.number="formData.pria" min="0" />
                </div>
                <div class="form-group">
                  <label>Wanita</label>
                  <input type="number" v-model.number="formData.wanita" min="0" />
                </div>
                <div class="form-group">
                  <label>Total TK</label>
                  <input type="number" v-model.number="formData.total_tk" min="0" />
                </div>
                <div class="form-group">
                  <label>TKA Pria</label>
                  <input type="number" v-model.number="formData.tka_pria" min="0" />
                </div>
                <div class="form-group">
                  <label>TKA Wanita</label>
                  <input type="number" v-model.number="formData.tka_wanita" min="0" />
                </div>
                <div class="form-group">
                  <label>Total TKA</label>
                  <input type="number" v-model.number="formData.total_tka" min="0" />
                </div>
                <div class="form-group">
                  <label>Grand Total</label>
                  <input type="number" v-model.number="formData.grand_total" min="0" />
                </div>
                <div class="form-group">
                  <label>Disabilitas Pria</label>
                  <input type="number" v-model.number="formData.disabilitas_pria" min="0" />
                </div>
                <div class="form-group">
                  <label>Disabilitas Wanita</label>
                  <input type="number" v-model.number="formData.disabilitas_wanita" min="0" />
                </div>
                <div class="form-group">
                  <label>PKWTT Pria</label>
                  <input type="number" v-model.number="formData.pkwtt_pria" min="0" />
                </div>
                <div class="form-group">
                  <label>PKWT Pria</label>
                  <input type="number" v-model.number="formData.pkwt_pria" min="0" />
                </div>
                <div class="form-group">
                  <label>PKWTT Wanita</label>
                  <input type="number" v-model.number="formData.pkwtt_wanita" min="0" />
                </div>
                <div class="form-group">
                  <label>PKWT Wanita</label>
                  <input type="number" v-model.number="formData.pkwt_wanita" min="0" />
                </div>
                <div class="form-group">
                  <label>PKWTT Pria Disabilitas</label>
                  <input type="number" v-model.number="formData.pkwtt_pria_disabilitas" min="0" />
                </div>
                <div class="form-group">
                  <label>PKWT Pria Disabilitas</label>
                  <input type="number" v-model.number="formData.pkwt_pria_disabilitas" min="0" />
                </div>
                <div class="form-group">
                  <label>PKWTT Wanita Disabilitas</label>
                  <input type="number" v-model.number="formData.pkwtt_wanita_disabilitas" min="0" />
                </div>
                <div class="form-group">
                  <label>PKWT Wanita Disabilitas</label>
                  <input type="number" v-model.number="formData.pkwt_wanita_disabilitas" min="0" />
                </div>
              </div>

              <h4 class="detail-section">Lainnya</h4>
              <div class="form-grid">
                <div class="form-group">
                  <label>Tampilkan di Halaman Publik</label>
                  <select v-model="formData.is_publik">
                    <option :value="true">Ya</option>
                    <option :value="false">Tidak</option>
                  </select>
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

    <!-- Modal Konfirmasi Hapus Data -->
    <transition name="modal-fade">
      <div v-if="showDeleteModal" class="modal-overlay" @click.self="closeDeleteModal">
        <div class="modal-container modal-sm">
          <div class="modal-header modal-header-danger">
            <h3>Hapus Data PHIJS</h3>
            <button class="btn-close" @click="closeDeleteModal">&times;</button>
          </div>
          <div class="modal-body">
            <div v-if="formError" class="error-alert">{{ formError }}</div>
            <p class="delete-text">
              Yakin ingin menghapus data <strong>{{ deleteItem?.nama_perusahaan || '-' }}</strong>?
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

    <!-- Modal Konfirmasi Hapus Periode -->
    <transition name="modal-fade">
      <div v-if="showDeletePeriodeModal" class="modal-overlay" @click.self="closeDeletePeriodeModal">
        <div class="modal-container modal-sm">
          <div class="modal-header modal-header-danger">
            <h3>Hapus Periode</h3>
            <button class="btn-close" @click="closeDeletePeriodeModal">&times;</button>
          </div>
          <div class="modal-body">
            <div v-if="periodeError" class="error-alert">{{ periodeError }}</div>
            <p class="delete-text">
              Yakin ingin menghapus periode <strong>{{ deletePeriodeItem?.label || '-' }}</strong>?
              <br />
              <strong>{{ formatNumber(deletePeriodeItem?.total_perusahaan) }} perusahaan</strong> pada periode ini akan ikut terhapus dan tidak dapat dikembalikan.
            </p>
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" @click="closeDeletePeriodeModal" :disabled="deletingPeriode">Batal</button>
            <button class="btn-danger" @click="confirmDeletePeriode" :disabled="deletingPeriode">{{ deletingPeriode ? 'Menghapus...' : 'Ya, Hapus' }}</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal Publikasi Periode -->
    <transition name="modal-fade">
      <div v-if="showPublikasiModal" class="modal-overlay" @click.self="closePublikasiModal">
        <div class="modal-container modal-sm">
          <div class="modal-header">
            <h3>Publikasi Periode</h3>
            <button class="btn-close" @click="closePublikasiModal">&times;</button>
          </div>
          <div class="modal-body">
            <div v-if="publikasiError" class="error-alert">{{ publikasiError }}</div>
            <p class="delete-text">
              Periode <strong>{{ publikasiItem?.label || '-' }}</strong>
              ({{ formatNumber(publikasiItem?.total_perusahaan) }} perusahaan).
            </p>
            <p class="import-hint" style="margin-top: 10px;">
              Terbitkan untuk menampilkan seluruh data periode ini di halaman publik PHIJS, atau sembunyikan agar tidak ikut dihitung pada statistik publik.
            </p>
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" @click="closePublikasiModal" :disabled="publishingPeriode">Batal</button>
            <button class="btn-danger" @click="setPublikasi(false)" :disabled="publishingPeriode">
              {{ publishingPeriode ? 'Memproses...' : 'Sembunyikan' }}
            </button>
            <button class="btn-primary" @click="setPublikasi(true)" :disabled="publishingPeriode">
              {{ publishingPeriode ? 'Memproses...' : 'Terbitkan' }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal Import Excel -->
    <transition name="modal-fade">
      <div v-if="showImportModal" class="modal-overlay" @click.self="closeImportModal">
        <div class="modal-container modal-sm">
          <div class="modal-header">
            <h3>Import Excel PHIJS</h3>
            <button class="btn-close" @click="closeImportModal">&times;</button>
          </div>
          <form @submit.prevent="submitImport">
            <div class="modal-body">
              <div v-if="importError" class="error-alert">{{ importError }}</div>
              <p class="import-hint">
                File Excel <strong>"Detail dan Rekap &lt;Bulan&gt; &lt;Tahun&gt;.xlsx"</strong>.
                Maksimal 50 MB, format .xlsx / .xls.
              </p>
              <div class="form-grid form-grid-1col">
                <div class="form-group">
                  <label>File Excel <span class="req">*</span></label>
                  <input ref="importFile" type="file" accept=".xlsx,.xls" @change="onImportFileChange" />
                  <small v-if="importFileName" class="file-name">{{ importFileName }}</small>
                </div>
                <div class="form-group">
                  <label>Tahun <span class="req">*</span></label>
                  <input type="number" v-model.number="importTahun" placeholder="cth: 2026" min="2000" max="2100" />
                </div>
                <div class="form-group">
                  <label>Bulan <span class="req">*</span></label>
                  <select v-model.number="importBulan">
                    <option :value="null">-- Pilih bulan --</option>
                    <option v-for="b in bulanOptions" :key="b.value" :value="b.value">{{ b.label }}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Label Periode (opsional)</label>
                  <input type="text" v-model="importLabel" placeholder="cth: Awal Okt 2026" maxlength="100" />
                </div>
                <div class="form-group">
                  <label>Tanggal Snapshot (opsional)</label>
                  <input type="date" v-model="importTanggalSnapshot" />
                </div>
              </div>
              <div v-if="importResult" class="import-result">
                <p class="import-result-title">{{ importResult.message }}</p>
                <p v-if="importResult.label">Periode: <strong>{{ importResult.label }}</strong></p>
                <p v-if="importResult.total_perusahaan !== null">Perusahaan: <strong>{{ formatNumber(importResult.total_perusahaan) }}</strong></p>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn-secondary" @click="closeImportModal" :disabled="importing">Batal</button>
              <button type="submit" class="btn-primary" :disabled="importing || !importFile || !importTahun || !importBulan">
                {{ importing ? 'Mengunggah...' : 'Upload' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </AdminLayout>
</template>

<script>
import AdminLayout from './AdminLayout.vue'

const BASE = 'https://harvest-protegee-symptom.ngrok-free.dev/api'
const API_BASE = `${BASE}/admin/data-phi-js`
const API_PERIODE = `${BASE}/admin/data-phi-js-periode`
const API_STATISTIK = `${BASE}/statistik/data-phi-js`

const PREVIEW_LIMIT = 15 // backend memakai 15 baris per halaman (param per_page diabaikan)

export default {
  name: 'PhijsAdminView',
  components: { AdminLayout },
  data() {
    return {
      phijsList: [],
      loading: false,
      errorMessage: '',
      infoMessage: '',
      searchQuery: '',
      searchTimer: null,

      filterPeriodeId: '',
      filterTahun: '',
      filterBulan: '',
      filterKecamatanId: '',
      filterKlasifikasi: '',
      filterPp: '',
      filterPkb: '',

      exportingExcel: false,
      perPage: PREVIEW_LIMIT,
      pagination: {
        current_page: 1,
        last_page: 1,
        total: 0
      },

      tahunOptions: [],
      kecamatanOptions: [],
      klasifikasiOptions: ['Mikro', 'Kecil', 'Menengah', 'Besar', 'Belum Input Data'],
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

      periodeList: [],
      periodeLoading: false,

      showDetailModal: false,
      detailItem: null,
      detailLoading: false,
      detailError: '',

      showFormModal: false,
      isEditMode: false,
      editingId: null,
      saving: false,
      formError: '',
      validationErrors: {},
      formData: this.blankForm(),

      showDeleteModal: false,
      deleting: false,
      deleteItem: null,

      showDeletePeriodeModal: false,
      deletingPeriode: false,
      deletePeriodeItem: null,
      periodeError: '',

      showPublikasiModal: false,
      publishingPeriode: false,
      publikasiItem: null,
      publikasiError: '',

      showImportModal: false,
      importing: false,
      importFile: null,
      importFileName: '',
      importTahun: null,
      importBulan: null,
      importLabel: '',
      importTanggalSnapshot: '',
      importError: '',
      importResult: null
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
    this.fetchPeriode()
    this.fetchMasterOptions()
    this.fetchPhijs(1)
  },
  methods: {
    blankForm() {
      return {
        periode_id: '',
        tgl_pendaftaran: '',
        kode_pendaftaran: '',
        nama_perusahaan: '',
        nib: '',
        telp: '',
        email: '',
        alamat: '',
        no_hp_pengelola: '',
        nama_pemilik: '',
        alamat_pemilik: '',
        nama_pengurus: '',
        alamat_pengurus: '',
        kelurahan: '',
        kecamatan: '',
        kecamatan_id: '',
        kelurahan_id: '',
        kota: '',
        provinsi: '',
        sektor: '',
        klasifikasi: '',
        status_kepemilikan: '',
        permodalan: '',
        pria: 0,
        wanita: 0,
        total_tk: 0,
        tka_pria: 0,
        tka_wanita: 0,
        total_tka: 0,
        grand_total: 0,
        disabilitas_pria: 0,
        disabilitas_wanita: 0,
        pkwtt_pria: 0,
        pkwt_pria: 0,
        pkwtt_wanita: 0,
        pkwt_wanita: 0,
        pkwtt_wanita_disabilitas: 0,
        pkwt_wanita_disabilitas: 0,
        pkwtt_pria_disabilitas: 0,
        pkwt_pria_disabilitas: 0,
        masa_berlaku: '',
        pp: '',
        pkb: '',
        is_publik: true
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
    handleUnauthorized(status) {
      if (status === 401) {
        this.$router.push('/login')
        return true
      }
      return false
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
    toDateInput(val) {
      if (!val) return ''
      const d = new Date(val)
      if (isNaN(d.getTime())) return ''
      const pad = (n) => String(n).padStart(2, '0')
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
    },
    bulanLabel(bulan) {
      const found = this.bulanOptions.find((b) => Number(b.value) === Number(bulan))
      return found ? found.label : '-'
    },
    resolveKecamatan(item) {
      if (!item) return '-'
      return item.kecamatan_master?.nama || item.kecamatan || '-'
    },
    resolveTotalTk(item) {
      if (!item) return 0
      if (item.total_tk !== null && item.total_tk !== undefined) return Number(item.total_tk) || 0
      return (Number(item.pria) || 0) + (Number(item.wanita) || 0)
    },
    fieldError(field) {
      const errs = this.validationErrors?.[field]
      if (!errs) return ''
      return Array.isArray(errs) ? errs[0] : String(errs)
    },

    /* ================== Master options ================== */
    async fetchMasterOptions() {
      try {
        const res = await fetch(API_STATISTIK, { headers: this.buildHeaders() })
        const json = await res.json().catch(() => ({}))
        const d = json.data || {}
        if (Array.isArray(d.by_kecamatan)) {
          this.kecamatanOptions = d.by_kecamatan
            .filter((k) => k.kecamatan_id !== null && k.kecamatan_id !== undefined)
            .map((k) => ({ id: k.kecamatan_id, nama: k.kecamatan }))
        }
        if (Array.isArray(d.by_klasifikasi)) {
          const names = d.by_klasifikasi.map((k) => k.klasifikasi).filter(Boolean)
          if (names.length) this.klasifikasiOptions = names
        }
        if (Array.isArray(d.by_tahun)) {
          this.tahunOptions = d.by_tahun.map((i) => Number(i.tahun)).filter(Boolean).sort((a, b) => b - a)
        }
      } catch (e) {
        console.error('[PhijsAdmin] gagal ambil master options:', e)
      }
    },

    /* ================== Periode ================== */
    async fetchPeriode() {
      this.periodeLoading = true
      try {
        const res = await fetch(API_PERIODE, { headers: this.buildHeaders() })
        if (this.handleUnauthorized(res.status)) return
        const json = await res.json().catch(() => ({}))
        this.periodeList = Array.isArray(json.data) ? json.data : []
        const years = [...new Set(this.periodeList.map((p) => Number(p.tahun)).filter(Boolean))]
          .sort((a, b) => b - a)
        if (years.length) this.tahunOptions = years
      } catch (e) {
        console.error('[PhijsAdmin] gagal ambil periode:', e)
      } finally {
        this.periodeLoading = false
      }
    },
    applyPeriodeFilter(p) {
      this.filterPeriodeId = String(p.id)
      this.filterTahun = p.tahun ? String(p.tahun) : ''
      this.filterBulan = p.bulan ? String(p.bulan) : ''
      this.fetchPhijs(1)
    },
    openPublikasiModal(p) {
      this.publikasiItem = p
      this.publikasiError = ''
      this.showPublikasiModal = true
    },
    closePublikasiModal() {
      if (this.publishingPeriode) return
      this.showPublikasiModal = false
      this.publikasiItem = null
    },
    async setPublikasi(isPublik) {
      if (!this.publikasiItem?.id || this.publishingPeriode) return
      this.publishingPeriode = true
      this.publikasiError = ''
      try {
        const res = await fetch(`${API_PERIODE}/${this.publikasiItem.id}/publikasi`, {
          method: 'PUT',
          headers: this.buildHeaders(true),
          body: JSON.stringify({ is_publik: isPublik })
        })
        if (this.handleUnauthorized(res.status)) return
        const result = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(result.message || `Gagal memproses publikasi (status ${res.status}).`)
        this.showPublikasiModal = false
        this.infoMessage = result.message || (isPublik ? 'Periode berhasil diterbitkan.' : 'Periode berhasil disembunyikan dari publik.')
        setTimeout(() => { this.infoMessage = '' }, 4000)
        this.fetchPeriode()
        this.fetchPhijs(this.pagination.current_page)
      } catch (e) {
        this.publikasiError = e.message || 'Gagal terhubung ke API.'
      } finally {
        this.publishingPeriode = false
      }
    },
    openDeletePeriodeModal(p) {
      this.deletePeriodeItem = p
      this.periodeError = ''
      this.showDeletePeriodeModal = true
    },
    closeDeletePeriodeModal() {
      if (this.deletingPeriode) return
      this.showDeletePeriodeModal = false
      this.deletePeriodeItem = null
    },
    async confirmDeletePeriode() {
      if (!this.deletePeriodeItem?.id || this.deletingPeriode) return
      this.deletingPeriode = true
      this.periodeError = ''
      try {
        const res = await fetch(`${API_PERIODE}/${this.deletePeriodeItem.id}`, {
          method: 'DELETE',
          headers: this.buildHeaders()
        })
        if (this.handleUnauthorized(res.status)) return
        const result = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(result.message || `Gagal menghapus periode (status ${res.status}).`)
        this.showDeletePeriodeModal = false
        this.deletePeriodeItem = null
        this.infoMessage = result.message || 'Periode berhasil dihapus.'
        setTimeout(() => { this.infoMessage = '' }, 4000)
        if (String(this.filterPeriodeId) === String(this.deletePeriodeItem?.id)) this.filterPeriodeId = ''
        this.fetchPeriode()
        this.fetchPhijs(1)
      } catch (e) {
        this.periodeError = e.message || 'Gagal terhubung ke API.'
      } finally {
        this.deletingPeriode = false
      }
    },

    /* ================== List ================== */
    buildListParams() {
      const params = new URLSearchParams()
      if (this.filterPeriodeId) params.append('periode_id', this.filterPeriodeId)
      if (this.filterTahun) params.append('tahun', this.filterTahun)
      if (this.filterBulan) params.append('bulan', this.filterBulan)
      if (this.filterKecamatanId) params.append('kecamatan_id', this.filterKecamatanId)
      if (this.filterKlasifikasi) params.append('klasifikasi', this.filterKlasifikasi)
      if (this.filterPp) params.append('pp', this.filterPp)
      if (this.filterPkb) params.append('pkb', this.filterPkb)
      const q = (this.searchQuery || '').trim()
      if (q) params.append('search', q)
      return params
    },
    async fetchPhijs(page = 1) {
      this.loading = true
      this.errorMessage = ''
      try {
        const params = this.buildListParams()
        params.append('page', page)
        const res = await fetch(`${API_BASE}?${params.toString()}`, {
          method: 'GET',
          headers: this.buildHeaders()
        })
        if (this.handleUnauthorized(res.status)) return
        if (!res.ok) throw new Error(`Gagal mengambil data PHIJS. Status: ${res.status}`)
        const result = await res.json()
        const pageData = result.data || {}
        if (Array.isArray(pageData.data)) {
          this.phijsList = pageData.data
          this.pagination = {
            current_page: Number(pageData.current_page) || page,
            last_page: Number(pageData.last_page) || 1,
            total: Number(pageData.total) || 0
          }
          this.perPage = Number(pageData.per_page) || PREVIEW_LIMIT
        } else if (Array.isArray(result.data)) {
          this.phijsList = result.data
          this.pagination = { current_page: 1, last_page: 1, total: result.data.length }
        } else {
          this.phijsList = []
          this.pagination = { current_page: 1, last_page: 1, total: 0 }
        }
      } catch (e) {
        this.errorMessage = `Error: ${e.message || 'Gagal terhubung ke API.'}`
        this.phijsList = []
      } finally {
        this.loading = false
      }
    },
    handleSearch() {
      clearTimeout(this.searchTimer)
      this.searchTimer = setTimeout(() => this.fetchPhijs(1), 500)
    },
    onFilterChange() {
      this.fetchPhijs(1)
    },
    changePage(page) {
      if (page < 1 || page > this.pagination.last_page) return
      this.fetchPhijs(page)
    },

    /* ================== Detail ================== */
    async handleDetail(item) {
      this.detailItem = item
      this.detailError = ''
      this.showDetailModal = true
      if (!item?.id) return
      this.detailLoading = true
      try {
        const res = await fetch(`${API_BASE}/${item.id}`, { headers: this.buildHeaders() })
        if (this.handleUnauthorized(res.status)) return
        const result = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(result.message || `Gagal mengambil detail (status ${res.status}).`)
        this.detailItem = result.data || item
      } catch (e) {
        this.detailError = e.message || 'Gagal memuat detail.'
      } finally {
        this.detailLoading = false
      }
    },
    closeDetailModal() {
      this.showDetailModal = false
      this.detailItem = null
      this.detailError = ''
    },

    /* ================== Form ================== */
    openAddModal() {
      this.isEditMode = false
      this.editingId = null
      this.formData = this.blankForm()
      if (this.filterPeriodeId) this.formData.periode_id = Number(this.filterPeriodeId)
      else if (this.periodeList.length === 1) this.formData.periode_id = this.periodeList[0].id
      this.formData.kecamatan_id = this.filterKecamatanId ? Number(this.filterKecamatanId) : ''
      this.onKecamatanFormChange()
      this.validationErrors = {}
      this.formError = ''
      this.showFormModal = true
    },
    openEditModal(item) {
      this.isEditMode = true
      this.editingId = item.id
      this.formData = {
        periode_id: item.periode_id ?? '',
        tgl_pendaftaran: this.toDateInput(item.tgl_pendaftaran),
        kode_pendaftaran: item.kode_pendaftaran || '',
        nama_perusahaan: item.nama_perusahaan || '',
        nib: item.nib || '',
        telp: item.telp || '',
        email: item.email || '',
        alamat: item.alamat || '',
        no_hp_pengelola: item.no_hp_pengelola || '',
        nama_pemilik: item.nama_pemilik || '',
        alamat_pemilik: item.alamat_pemilik || '',
        nama_pengurus: item.nama_pengurus || '',
        alamat_pengurus: item.alamat_pengurus || '',
        kelurahan: item.kelurahan || '',
        kecamatan: item.kecamatan || '',
        kecamatan_id: item.kecamatan_id ?? '',
        kelurahan_id: item.kelurahan_id ?? '',
        kota: item.kota || '',
        provinsi: item.provinsi || '',
        sektor: item.sektor || '',
        klasifikasi: item.klasifikasi || '',
        status_kepemilikan: item.status_kepemilikan || '',
        permodalan: item.permodalan || '',
        pria: item.pria ?? 0,
        wanita: item.wanita ?? 0,
        total_tk: item.total_tk ?? 0,
        tka_pria: item.tka_pria ?? 0,
        tka_wanita: item.tka_wanita ?? 0,
        total_tka: item.total_tka ?? 0,
        grand_total: item.grand_total ?? 0,
        disabilitas_pria: item.disabilitas_pria ?? 0,
        disabilitas_wanita: item.disabilitas_wanita ?? 0,
        pkwtt_pria: item.pkwtt_pria ?? 0,
        pkwt_pria: item.pkwt_pria ?? 0,
        pkwtt_wanita: item.pkwtt_wanita ?? 0,
        pkwt_wanita: item.pkwt_wanita ?? 0,
        pkwtt_wanita_disabilitas: item.pkwtt_wanita_disabilitas ?? 0,
        pkwt_wanita_disabilitas: item.pkwt_wanita_disabilitas ?? 0,
        pkwtt_pria_disabilitas: item.pkwtt_pria_disabilitas ?? 0,
        pkwt_pria_disabilitas: item.pkwt_pria_disabilitas ?? 0,
        masa_berlaku: this.toDateInput(item.masa_berlaku),
        pp: item.pp || '',
        pkb: item.pkb || '',
        is_publik: item.is_publik !== false
      }
      this.validationErrors = {}
      this.formError = ''
      this.showFormModal = true
    },
    closeFormModal() {
      if (this.saving) return
      this.showFormModal = false
    },
    onKecamatanFormChange() {
      const found = this.kecamatanOptions.find((k) => Number(k.id) === Number(this.formData.kecamatan_id))
      this.formData.kecamatan = found ? found.nama : ''
    },
    syncTotals() {
      const n = (v) => Number(v) || 0
      const f = this.formData
      f.total_tk = n(f.pria) + n(f.wanita)
      f.total_tka = n(f.tka_pria) + n(f.tka_wanita)
      f.grand_total = n(f.total_tk) + n(f.total_tka)
    },
    async submitForm() {
      this.saving = true
      this.formError = ''
      this.validationErrors = {}
      try {
        const f = this.formData
        const numOrNull = (v) => (v === '' || v === null || v === undefined ? null : Number(v))
        const num = (v) => Number(v) || 0
        const strOrNull = (v) => {
          const s = (v ?? '').toString().trim()
          return s ? s : null
        }

        const payload = {
          periode_id: numOrNull(f.periode_id),
          tgl_pendaftaran: f.tgl_pendaftaran || null,
          kode_pendaftaran: strOrNull(f.kode_pendaftaran),
          nama_perusahaan: (f.nama_perusahaan || '').trim(),
          nib: strOrNull(f.nib),
          telp: strOrNull(f.telp),
          email: strOrNull(f.email),
          alamat: strOrNull(f.alamat),
          no_hp_pengelola: strOrNull(f.no_hp_pengelola),
          nama_pemilik: strOrNull(f.nama_pemilik),
          alamat_pemilik: strOrNull(f.alamat_pemilik),
          nama_pengurus: strOrNull(f.nama_pengurus),
          alamat_pengurus: strOrNull(f.alamat_pengurus),
          kelurahan: strOrNull(f.kelurahan),
          kecamatan: strOrNull(f.kecamatan),
          kecamatan_id: numOrNull(f.kecamatan_id),
          kelurahan_id: numOrNull(f.kelurahan_id),
          kota: strOrNull(f.kota),
          provinsi: strOrNull(f.provinsi),
          sektor: strOrNull(f.sektor),
          klasifikasi: strOrNull(f.klasifikasi),
          status_kepemilikan: strOrNull(f.status_kepemilikan),
          permodalan: strOrNull(f.permodalan),
          pria: num(f.pria),
          wanita: num(f.wanita),
          total_tk: num(f.total_tk),
          tka_pria: num(f.tka_pria),
          tka_wanita: num(f.tka_wanita),
          total_tka: num(f.total_tka),
          grand_total: num(f.grand_total),
          disabilitas_pria: num(f.disabilitas_pria),
          disabilitas_wanita: num(f.disabilitas_wanita),
          pkwtt_pria: num(f.pkwtt_pria),
          pkwt_pria: num(f.pkwt_pria),
          pkwtt_wanita: num(f.pkwtt_wanita),
          pkwt_wanita: num(f.pkwt_wanita),
          pkwtt_wanita_disabilitas: num(f.pkwtt_wanita_disabilitas),
          pkwt_wanita_disabilitas: num(f.pkwt_wanita_disabilitas),
          pkwtt_pria_disabilitas: num(f.pkwtt_pria_disabilitas),
          pkwt_pria_disabilitas: num(f.pkwt_pria_disabilitas),
          masa_berlaku: f.masa_berlaku || null,
          pp: strOrNull(f.pp),
          pkb: strOrNull(f.pkb),
          is_publik: !!f.is_publik
        }

        const url = this.isEditMode ? `${API_BASE}/${this.editingId}` : API_BASE
        const res = await fetch(url, {
          method: this.isEditMode ? 'PUT' : 'POST',
          headers: this.buildHeaders(true),
          body: JSON.stringify(payload)
        })

        if (this.handleUnauthorized(res.status)) return

        const result = await res.json().catch(() => ({}))
        if (res.status === 422) {
          this.validationErrors = result.errors || {}
          this.formError = result.message || 'Periksa kembali isian form (validasi gagal).'
          return
        }
        if (!res.ok) throw new Error(result.message || `Gagal menyimpan data. Status: ${res.status}`)

        this.showFormModal = false
        this.infoMessage = result.message || (this.isEditMode ? 'Data PHIJS berhasil diperbarui.' : 'Data PHIJS berhasil ditambahkan.')
        setTimeout(() => { this.infoMessage = '' }, 4000)
        this.fetchPeriode()
        this.fetchPhijs(this.pagination.current_page)
      } catch (e) {
        this.formError = e.message || 'Gagal terhubung ke API.'
      } finally {
        this.saving = false
      }
    },

    /* ================== Hapus ================== */
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
      if (!this.deleteItem?.id || this.deleting) return
      this.deleting = true
      this.formError = ''
      try {
        const res = await fetch(`${API_BASE}/${this.deleteItem.id}`, {
          method: 'DELETE',
          headers: this.buildHeaders()
        })
        if (this.handleUnauthorized(res.status)) return
        const result = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(result.message || `Gagal menghapus data. Status: ${res.status}`)

        this.showDeleteModal = false
        this.deleteItem = null
        this.infoMessage = result.message || 'Data PHIJS berhasil dihapus.'
        setTimeout(() => { this.infoMessage = '' }, 4000)

        if (this.phijsList.length <= 1 && this.pagination.current_page > 1) {
          this.fetchPhijs(this.pagination.current_page - 1)
        } else {
          this.fetchPhijs(this.pagination.current_page)
        }
        this.fetchPeriode()
      } catch (e) {
        this.formError = e.message || 'Gagal terhubung ke API.'
      } finally {
        this.deleting = false
      }
    },

    /* ================== Import ================== */
    openImportModal() {
      this.importFile = null
      this.importFileName = ''
      this.importTahun = this.filterTahun ? Number(this.filterTahun) : new Date().getFullYear()
      this.importBulan = this.filterBulan ? Number(this.filterBulan) : null
      this.importLabel = ''
      this.importTanggalSnapshot = ''
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
      const maxBytes = 51200 * 1024 // 50 MB sesuai validasi backend
      if (file.size > maxBytes) {
        this.importError = `Ukuran file ${(file.size / 1024 / 1024).toFixed(1)} MB melebihi batas 50 MB.`
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
        if (this.importBulan) form.append('bulan', this.importBulan)
        if (this.importLabel.trim()) form.append('label', this.importLabel.trim())
        if (this.importTanggalSnapshot) form.append('tanggal_snapshot', this.importTanggalSnapshot)

        const res = await fetch(`${API_BASE}/import`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'ngrok-skip-browser-warning': '69420',
            Authorization: `Bearer ${token}`
          },
          body: form
        })

        if (this.handleUnauthorized(res.status)) return

        const result = await res.json().catch(() => ({}))
        if (res.status === 422) {
          const errs = result.errors || {}
          const first = Object.values(errs).flat()[0]
          this.importError = first || result.message || 'Validasi file gagal. Periksa format dan ukuran file.'
          return
        }
        if (!res.ok) throw new Error(result.message || `Import gagal (status ${res.status}).`)

        const data = result.data || {}
        this.importResult = {
          message: result.message || 'Import berhasil.',
          label: data.label || null,
          total_perusahaan: data.total_perusahaan !== undefined ? Number(data.total_perusahaan) : null
        }
        this.infoMessage = result.message || 'Import Excel PHIJS berhasil.'
        setTimeout(() => { this.infoMessage = '' }, 5000)
        this.fetchPeriode()
        this.fetchMasterOptions()
        this.fetchPhijs(1)
      } catch (e) {
        this.importError = e.message || 'Gagal terhubung ke API.'
      } finally {
        this.importing = false
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
          throw new Error(j.message || `Export gagal (status ${res.status}). Periksa filter yang aktif.`)
        }
        if (!res.ok) throw new Error(`Export gagal (status ${res.status}).`)

        const blob = await res.blob()
        if (!blob || blob.size === 0) throw new Error('File kosong dari server.')

        const dateStr = new Date().toISOString().slice(0, 10)
        const parts = ['Data_PHIJS', dateStr]
        if (this.filterTahun) parts.push(this.filterTahun)
        if (this.filterBulan) parts.push(`bln${this.filterBulan}`)
        this.downloadBlob(blob, `${parts.join('_')}.xlsx`, res.headers.get('content-disposition'))

        this.infoMessage = 'File Excel berhasil diunduh.'
        setTimeout(() => { this.infoMessage = '' }, 4000)
      } catch (e) {
        this.errorMessage = `Error export: ${e.message || 'Gagal terhubung ke API.'}`
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

/* Periode card */
.periode-card {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
  margin-bottom: 20px;
  overflow: hidden;
}

.periode-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 18px;
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.periode-head h3 { margin: 0; font-size: 0.95rem; font-weight: 700; color: #1e385c; }

.periode-count {
  font-size: 0.78rem;
  font-weight: 700;
  color: #64748b;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  padding: 2px 10px;
  border-radius: 20px;
}

.periode-body { overflow-x: auto; }
.periode-empty { padding: 18px; font-size: 0.85rem; color: #94a3b8; text-align: center; }

.periode-table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }

.periode-table thead th {
  background-color: #ffffff;
  color: #64748b;
  font-weight: 700;
  text-align: left;
  padding: 10px 14px;
  border-bottom: 1px solid #e2e8f0;
  white-space: nowrap;
  font-size: 0.76rem;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.periode-table tbody td {
  padding: 9px 14px;
  border-bottom: 1px solid #f1f5f9;
  color: #334155;
  white-space: nowrap;
}

.periode-table tbody tr:last-child td { border-bottom: none; }
.periode-table tbody tr:hover { background-color: #f8fafc; }
.periode-table tbody tr.periode-active { background-color: #eff6ff; }

.btn-chip {
  padding: 6px 12px;
  border-radius: 6px;
  font-family: 'Poppins', sans-serif;
  font-size: 0.76rem;
  font-weight: 700;
  cursor: pointer;
  border: 1px solid transparent;
  white-space: nowrap;
  transition: all 0.15s ease;
}

.btn-chip-blue {
  background-color: #eff6ff;
  color: #1d4ed8;
  border-color: #bfdbfe;
}
.btn-chip-blue:hover { background-color: #1d4ed8; color: #ffffff; border-color: #1d4ed8; }

.btn-chip-outline {
  background-color: #ffffff;
  color: #475569;
  border-color: #cbd5e1;
}
.btn-chip-outline:hover { background-color: #1e385c; color: #ffffff; border-color: #1e385c; }

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
.text-right { text-align: right; }
.py-5 { padding-top: 28px; padding-bottom: 28px; }
.font-bold { font-weight: 700; }

.td-perusahaan { max-width: 260px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.td-nib { max-width: 170px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.td-sektor { max-width: 220px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.badge {
  display: inline-block;
  padding: 2px 9px;
  border-radius: 20px;
  font-size: 0.72rem;
  font-weight: 700;
  white-space: nowrap;
}

.badge-yes { background-color: #dcfce7; color: #166534; }
.badge-no { background-color: #f1f5f9; color: #64748b; }
.badge-neutral { background-color: #e2e8f0; color: #475569; }

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

.per-page-selector { display: flex; align-items: center; gap: 12px; }
.total-info { font-size: 0.85rem; font-weight: 600; color: #475569; }

.per-page-fixed {
  padding: 7px 10px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background-color: #ffffff;
  font-size: 0.82rem;
  font-weight: 600;
  color: #64748b;
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

.modal-container.modal-lg { max-width: 860px; }
.modal-container.modal-sm { max-width: 460px; }

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

.modal-container > form {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

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
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
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

/* Form */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px 16px;
}

.form-grid.form-grid-3 { grid-template-columns: 1fr 1fr 1fr; }
.form-grid-1col { grid-template-columns: 1fr; }

.form-group { display: flex; flex-direction: column; min-width: 0; }
.form-group.form-full { grid-column: 1 / -1; }

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

.btn-sync {
  padding: 4px 12px;
  border-radius: 6px;
  border: 1px solid #bfdbfe;
  background-color: #eff6ff;
  color: #1d4ed8;
  font-family: 'Poppins', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  text-transform: none;
  letter-spacing: 0;
}
.btn-sync:hover { background-color: #1d4ed8; color: #ffffff; border-color: #1d4ed8; }

.field-error { color: #dc2626; font-size: 0.75rem; margin-top: 4px; }

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

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.18s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

@media (max-width: 768px) {
  .admin-content { padding: 16px 14px 36px 14px; }
  .page-title h2 { font-size: 1.15rem; }
  .action-buttons-group { flex-wrap: wrap; margin-left: 0; }
  .detail-row { grid-template-columns: 1fr; gap: 2px; }
  .form-grid,
  .form-grid.form-grid-3 { grid-template-columns: 1fr; }
  .card-footer-pagination { flex-direction: column; align-items: stretch; }
  .pagination-controls { justify-content: center; }
}
</style>