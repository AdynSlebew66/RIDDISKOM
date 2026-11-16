<template>
  <div class="page-container">
    <!-- Header / Navbar Public -->
    <header class="navbar">
      <div class="brand" @click="navTo('/')">
        <img src="../assets/logo2.png" alt="Logo DISKOPUMKER" class="logo" />
      </div>

      <button class="menu-toggle" @click="toggleMenu" aria-label="Toggle Menu">
        <svg v-if="!isMenuOpen" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <ul class="nav-links" :class="{ 'nav-active': isMenuOpen }">
        <li class="nav-item" @click="navTo('/')">Beranda</li>
        <li class="nav-item" @click="navTo('/p3tk')">Informasi</li>
        <li class="nav-item" @click="navTo('/layanan')">Layanan</li>
        <li class="nav-item" @click="navTo('/profil/visi-misi')">Profil</li>
        <li class="nav-item login-btn" @click="navTo('/login')">
          <span>Login</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="icon-login" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
            <polyline points="10 17 15 12 10 7"></polyline>
            <line x1="15" y1="12" x2="3" y2="12"></line>
          </svg>
        </li>
      </ul>
    </header>

    <main class="content-wrapper">
      <!-- Breadcrumb -->
      <div class="top-nav-bar">
        <button class="btn-back" @click="goBack">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>Kembali</span>
        </button>
        <p class="breadcrumb">Layanan DISKOPUMKER \ <strong>Pengaduan Perselisihan Hubungan Industrial</strong></p>
      </div>

      <!-- Title -->
      <div class="title-section">
        <h1 class="main-heading">
          Pengaduan <span class="sub-heading">Perselisihan <span class="c-blue">Hubungan Industrial</span></span>
        </h1>
        <h2 class="section-heading">Sampaikan pengaduan dan pantau tindak lanjutnya</h2>
      </div>

      <!-- Tab -->
      <div class="tab-switch">
        <button class="tab-btn" :class="{ active: mode === 'kirim' }" @click="mode = 'kirim'">Kirim Pengaduan</button>
        <button class="tab-btn" :class="{ active: mode === 'lacak' }" @click="mode = 'lacak'">Lacak Pengaduan</button>
      </div>

      <!-- ===== Form Kirim ===== -->
      <div v-if="mode === 'kirim'" class="form-card">
        <!-- Hasil sukses -->
        <div v-if="submittedTicket" class="success-panel">
          <div class="success-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <h3>Pengaduan Berhasil Dikirim</h3>
          <p>Simpan nomor tiket berikut untuk melacak status pengaduan Anda.</p>
          <div class="ticket-box">
            <span class="ticket-label">Nomor Tiket</span>
            <strong class="ticket-number">{{ submittedTicket }}</strong>
          </div>
          <div class="success-actions">
            <button class="btn-secondary" @click="goLacak(submittedTicket)">Lacak Sekarang</button>
            <button class="btn-primary" @click="resetForm">Kirim Pengaduan Lain</button>
          </div>
        </div>

        <form v-else @submit.prevent="submitPengaduan" class="form-body">
          <div v-if="formError" class="error-alert">{{ formError }}</div>

          <h3 class="form-section-title">Data Pelapor</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Nama Pelapor <span class="req">*</span></label>
              <input v-model="form.nama_pelapor" type="text" maxlength="255" placeholder="Nama lengkap" />
              <small v-if="fieldError('nama_pelapor')" class="field-error">{{ fieldError('nama_pelapor') }}</small>
            </div>
            <div class="form-group">
              <label>Jenis Kelamin <span class="req">*</span></label>
              <select v-model="form.jenis_kelamin">
                <option value="">-- Pilih --</option>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
              <small v-if="fieldError('jenis_kelamin')" class="field-error">{{ fieldError('jenis_kelamin') }}</small>
            </div>
            <div class="form-group">
              <label>No. Kontak Pekerja <span class="req">*</span></label>
              <input v-model="form.no_kontak_pekerja" type="text" maxlength="30" placeholder="No. HP / WhatsApp" />
              <small class="field-hint">Dipakai untuk melacak status pengaduan.</small>
              <small v-if="fieldError('no_kontak_pekerja')" class="field-error">{{ fieldError('no_kontak_pekerja') }}</small>
            </div>
            <div class="form-group">
              <label>No. Kontak Perusahaan <span class="req">*</span></label>
              <input v-model="form.no_kontak_perusahaan" type="text" maxlength="30" placeholder="No. telepon perusahaan" />
              <small v-if="fieldError('no_kontak_perusahaan')" class="field-error">{{ fieldError('no_kontak_perusahaan') }}</small>
            </div>
          </div>

          <h3 class="form-section-title">Data Perusahaan</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Nama Perusahaan <span class="req">*</span></label>
              <input v-model="form.nama_perusahaan" type="text" maxlength="255" placeholder="Nama perusahaan" />
              <small v-if="fieldError('nama_perusahaan')" class="field-error">{{ fieldError('nama_perusahaan') }}</small>
            </div>
            <div class="form-group">
              <label>Lampiran (opsional)</label>
              <input ref="lampiranInput" type="file" @change="onLampiranChange" />
              <small v-if="lampiranName" class="file-name">{{ lampiranName }}</small>
              <small v-if="fieldError('lampiran')" class="field-error">{{ fieldError('lampiran') }}</small>
            </div>
            <div class="form-group form-full">
              <label>Alamat Perusahaan <span class="req">*</span></label>
              <textarea v-model="form.alamat_perusahaan" rows="2" maxlength="2000" placeholder="Alamat lengkap perusahaan"></textarea>
              <small v-if="fieldError('alamat_perusahaan')" class="field-error">{{ fieldError('alamat_perusahaan') }}</small>
            </div>
          </div>

          <h3 class="form-section-title">Uraian Pengaduan</h3>
          <div class="form-grid">
            <div class="form-group form-full">
              <label>Permasalahan <span class="req">*</span></label>
              <textarea v-model="form.permasalahan" rows="6" maxlength="5000" placeholder="Jelaskan permasalahan yang dialami secara jelas, termasuk kronologi dan hal yang diminta."></textarea>
              <small class="field-hint">{{ (form.permasalahan || '').length }} / 5000 karakter</small>
              <small v-if="fieldError('permasalahan')" class="field-error">{{ fieldError('permasalahan') }}</small>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-primary" :disabled="submitting">
              {{ submitting ? 'Mengirim...' : 'Kirim Pengaduan' }}
            </button>
          </div>
        </form>
      </div>

      <!-- ===== Lacak ===== -->
      <div v-else class="form-card">
        <div v-if="trackError" class="error-alert">{{ trackError }}</div>

        <form @submit.prevent="lacakPengaduan" class="form-body">
          <p class="track-hint">
            Masukkan <strong>nomor tiket</strong> dan <strong>nomor kontak pekerja</strong> yang Anda gunakan saat mengirim pengaduan.
          </p>
          <div class="form-grid">
            <div class="form-group">
              <label>Nomor Tiket</label>
              <input v-model="trackForm.nomor_tiket" type="text" placeholder="cth: PGD-2026-000123" />
            </div>
            <div class="form-group">
              <label>No. Kontak Pekerja</label>
              <input v-model="trackForm.no_kontak_pekerja" type="text" placeholder="No. HP / WhatsApp saat mengadu" />
            </div>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-primary" :disabled="tracking">
              {{ tracking ? 'Mencari...' : 'Lacak Pengaduan' }}
            </button>
          </div>
        </form>

        <div v-if="trackResult" class="track-result">
          <h3 class="track-title">Status Pengaduan</h3>
          <div class="detail-grid">
            <div class="detail-row"><span class="detail-label">Nomor Tiket</span><span class="detail-value">{{ trackResult.nomor_tiket }}</span></div>
            <div class="detail-row"><span class="detail-label">Perusahaan</span><span class="detail-value">{{ trackResult.nama_perusahaan || '-' }}</span></div>
            <div class="detail-row">
              <span class="detail-label">Status</span>
              <span class="detail-value">
                <span class="badge" :class="statusClass(trackResult.status)">{{ statusLabel(trackResult.status) }}</span>
              </span>
            </div>
            <div class="detail-row"><span class="detail-label">Tanggal Pengaduan</span><span class="detail-value">{{ formatDate(trackResult.tanggal_pengaduan) }}</span></div>
            <div class="detail-row"><span class="detail-label">Ditindaklanjuti</span><span class="detail-value">{{ formatDate(trackResult.ditindaklanjuti_pada) }}</span></div>
            <div class="detail-row detail-block">
              <span class="detail-label">Catatan Petugas</span>
              <span class="detail-value">{{ trackResult.catatan_petugas || 'Belum ada catatan dari petugas.' }}</span>
            </div>
          </div>
          <div v-if="statusSteps.length" class="progress-track">
            <div
              v-for="step in statusSteps"
              :key="step.id"
              class="progress-step"
              :class="{ done: step.done, rejected: step.rejected }"
            >
              <span class="dot"></span>
              <span class="step-label">{{ step.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
const API_PENGADUAN = 'https://harvest-protegee-symptom.ngrok-free.dev/api/pengaduan'

const blankForm = () => ({
  nama_pelapor: '',
  jenis_kelamin: '',
  no_kontak_pekerja: '',
  no_kontak_perusahaan: '',
  nama_perusahaan: '',
  alamat_perusahaan: '',
  permasalahan: ''
})

export default {
  name: 'PengaduanPublicView',
  data() {
    return {
      isMenuOpen: false,
      mode: 'kirim',
      form: blankForm(),
      lampiranFile: null,
      lampiranName: '',
      submitting: false,
      submittedTicket: '',
      formError: '',
      validationErrors: {},
      trackForm: { nomor_tiket: '', no_kontak_pekerja: '' },
      tracking: false,
      trackError: '',
      trackResult: null
    }
  },
  computed: {
    statusSteps() {
      const current = String(this.trackResult?.status || '').toLowerCase()
      if (!current) return []
      if (current === 'ditolak') {
        return [
          { id: 'baru', label: 'Diterima', done: true },
          { id: 'ditolak', label: 'Ditolak', done: true, rejected: true }
        ]
      }
      const order = ['baru', 'diproses', 'selesai']
      const idx = order.indexOf(current)
      return order.map((id, i) => ({
        id,
        label: id === 'baru' ? 'Diterima' : id === 'diproses' ? 'Diproses' : 'Selesai',
        done: idx >= 0 && i <= idx
      }))
    }
  },
  methods: {
    navTo(path) {
      this.$router.push(path)
    },
    goBack() {
      if (window.history.length > 1) this.$router.back()
      else this.$router.push('/')
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen
    },
    fieldError(field) {
      const errs = this.validationErrors?.[field]
      if (!errs) return ''
      return Array.isArray(errs) ? errs[0] : String(errs)
    },
    statusLabel(status) {
      const s = String(status || '').toLowerCase()
      if (s === 'baru') return 'Baru'
      if (s === 'diproses') return 'Sedang Diproses'
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
    formatDate(val) {
      if (!val) return '-'
      const d = new Date(val)
      if (isNaN(d.getTime())) return String(val)
      return d.toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    },
    onLampiranChange(event) {
      const file = event.target.files?.[0] || null
      if (!file) {
        this.lampiranFile = null
        this.lampiranName = ''
        return
      }
      this.lampiranFile = file
      this.lampiranName = `${file.name} (${(file.size / 1024).toFixed(0)} KB)`
    },
    resetForm() {
      this.submittedTicket = ''
      this.form = blankForm()
      this.lampiranFile = null
      this.lampiranName = ''
      this.validationErrors = {}
      this.formError = ''
      if (this.$refs.lampiranInput) this.$refs.lampiranInput.value = ''
    },
    goLacak(ticket) {
      this.trackForm.nomor_tiket = ticket
      this.trackForm.no_kontak_pekerja = this.form.no_kontak_pekerja
      this.mode = 'lacak'
      this.lacakPengaduan()
    },
    async submitPengaduan() {
      if (this.submitting) return
      this.submitting = true
      this.formError = ''
      this.validationErrors = {}
      try {
        const body = new FormData()
        body.append('nama_pelapor', this.form.nama_pelapor.trim())
        body.append('jenis_kelamin', this.form.jenis_kelamin)
        body.append('no_kontak_pekerja', this.form.no_kontak_pekerja.trim())
        body.append('no_kontak_perusahaan', this.form.no_kontak_perusahaan.trim())
        body.append('nama_perusahaan', this.form.nama_perusahaan.trim())
        body.append('alamat_perusahaan', this.form.alamat_perusahaan.trim())
        body.append('permasalahan', this.form.permasalahan.trim())
        if (this.lampiranFile) body.append('lampiran', this.lampiranFile)

        const res = await fetch(API_PENGADUAN, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'ngrok-skip-browser-warning': '69420'
          },
          body
        })

        const result = await res.json().catch(() => ({}))

        if (res.status === 422) {
          this.validationErrors = result.errors || {}
          this.formError = result.message || 'Periksa kembali isian form Anda.'
          return
        }
        if (!res.ok) throw new Error(result.message || `Gagal mengirim pengaduan (status ${res.status}).`)

        this.submittedTicket = result.data?.nomor_tiket || ''
      } catch (e) {
        this.formError = e.message || 'Gagal terhubung ke server.'
      } finally {
        this.submitting = false
      }
    },
    async lacakPengaduan() {
      const tiket = (this.trackForm.nomor_tiket || '').trim()
      const kontak = (this.trackForm.no_kontak_pekerja || '').trim()
      if (!tiket || !kontak) {
        this.trackError = 'Nomor tiket dan no. kontak pekerja wajib diisi.'
        this.trackResult = null
        return
      }
      this.tracking = true
      this.trackError = ''
      this.trackResult = null
      try {
        const params = new URLSearchParams({ nomor_tiket: tiket, no_kontak_pekerja: kontak })
        const res = await fetch(`${API_PENGADUAN}/lacak?${params.toString()}`, {
          headers: { Accept: 'application/json', 'ngrok-skip-browser-warning': '69420' }
        })
        const result = await res.json().catch(() => ({}))
        if (res.status === 404) {
          this.trackError = result.message || 'Pengaduan tidak ditemukan. Periksa kembali nomor tiket dan nomor kontak.'
          return
        }
        if (res.status === 422) {
          this.trackError = result.message || 'Data yang dimasukkan tidak valid.'
          return
        }
        if (!res.ok) throw new Error(result.message || `Gagal melacak pengaduan (status ${res.status}).`)
        this.trackResult = result.data || null
      } catch (e) {
        this.trackError = e.message || 'Gagal terhubung ke server.'
      } finally {
        this.tracking = false
      }
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

.page-container {
  min-height: 100vh;
  background-color: #f7f7f5;
  font-family: 'Poppins', sans-serif;
  color: #1a1a1a;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 60px;
  position: relative;
  z-index: 50;
}

.logo { height: 52px; cursor: pointer; }

.menu-toggle {
  display: none;
  background: transparent;
  border: none;
  color: #1a1a1a;
  cursor: pointer;
  padding: 5px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 32px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  color: #1a1a1a;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s;
}
.nav-item:hover { opacity: 0.7; }

.login-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 10px;
  padding: 8px 20px;
  border: 1.8px solid #1a1a1a;
  border-radius: 8px;
  font-weight: 700;
  transition: all 0.2s ease;
}
.login-btn:hover { background-color: #1a1a1a; color: #ffffff; }
.icon-login { width: 18px; height: 18px; }

.content-wrapper {
  max-width: 980px;
  width: 100%;
  margin: 0 auto;
  padding: 10px 40px 60px 40px;
  box-sizing: border-box;
}

.top-nav-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background-color: #ffffff;
  border: 1px solid #d5d5cd;
  padding: 6px 14px;
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  color: #1a1a1a;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  white-space: nowrap;
}
.btn-back:hover { background-color: #1a1a1a; color: #ffffff; border-color: #1a1a1a; }

.breadcrumb { font-size: 0.85rem; color: #666666; margin: 0; font-weight: 500; }

.title-section { margin-bottom: 24px; }

.main-heading {
  font-size: 1.9rem;
  font-weight: 800;
  margin: 0 0 6px 0;
  line-height: 1.35;
  color: #1a1a1a;
}

.sub-heading { font-weight: 600; font-size: 1.2rem; color: #333; display: block; }
.c-blue { color: #1e385c; }
.c-orange { color: #d97706; }

.section-heading {
  font-size: 1rem;
  font-weight: 600;
  color: #555;
  margin: 0;
}

/* Tab switch */
.tab-switch {
  display: flex;
  gap: 10px;
  margin-bottom: 18px;
}

.tab-btn {
  padding: 10px 22px;
  border-radius: 999px;
  border: 1px solid #d5d5cd;
  background-color: #ffffff;
  font-family: 'Poppins', sans-serif;
  font-size: 0.87rem;
  font-weight: 700;
  color: #555;
  cursor: pointer;
  transition: all 0.18s ease;
}
.tab-btn:hover { border-color: #1e385c; color: #1e385c; }
.tab-btn.active { background-color: #1e385c; border-color: #1e385c; color: #ffffff; }

/* Card */
.form-card {
  background-color: #ffffff;
  border-radius: 14px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.06);
  padding: 28px 30px;
}

.form-section-title {
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #1e385c;
  margin: 22px 0 12px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #eef1f6;
}
.form-section-title:first-of-type { margin-top: 0; }

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px 18px;
}

.form-group { display: flex; flex-direction: column; min-width: 0; }
.form-group.form-full { grid-column: 1 / -1; }

.form-group label {
  font-size: 0.82rem;
  font-weight: 600;
  color: #475569;
  margin-bottom: 6px;
}
.req { color: #dc2626; }

.form-group input,
.form-group select,
.form-group textarea {
  padding: 10px 12px;
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

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 22px;
  padding-top: 18px;
  border-top: 1px solid #eef1f6;
}

.btn-primary {
  padding: 11px 30px;
  border-radius: 8px;
  border: none;
  background-color: #1e385c;
  font-family: 'Poppins', sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  color: #ffffff;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.btn-primary:hover:not(:disabled) { background-color: #152a47; }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

.btn-secondary {
  padding: 11px 24px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background-color: #ffffff;
  font-family: 'Poppins', sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  color: #334155;
  cursor: pointer;
}
.btn-secondary:hover { background-color: #f1f5f9; }

.error-alert {
  background-color: #fef2f2;
  border: 1px solid #fca5a5;
  color: #991b1b;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 0.88rem;
  font-weight: 500;
}

.field-error { color: #dc2626; font-size: 0.75rem; margin-top: 5px; }
.field-hint { color: #94a3b8; font-size: 0.72rem; margin-top: 5px; }
.file-name { color: #1e385c; font-size: 0.78rem; margin-top: 6px; font-weight: 600; }

/* Success */
.success-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 30px 10px 10px 10px;
}

.success-icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background-color: #dcfce7;
  color: #16a34a;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.success-panel h3 { margin: 0 0 8px 0; font-size: 1.2rem; font-weight: 800; color: #166534; }
.success-panel p { margin: 0 0 18px 0; font-size: 0.9rem; color: #555; }

.ticket-box {
  display: flex;
  flex-direction: column;
  gap: 4px;
  background-color: #f8fafc;
  border: 1px dashed #94a3b8;
  border-radius: 10px;
  padding: 14px 34px;
  margin-bottom: 22px;
}

.ticket-label { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; }
.ticket-number { font-size: 1.3rem; font-weight: 800; color: #1e385c; letter-spacing: 0.03em; word-break: break-all; }

.success-actions { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }

/* Lacak */
.track-hint { font-size: 0.88rem; color: #555; margin: 0 0 16px 0; line-height: 1.6; }

.track-result {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #eef1f6;
}

.track-title {
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #1e385c;
  margin: 0 0 12px 0;
}

.detail-grid { display: flex; flex-direction: column; }

.detail-row {
  display: grid;
  grid-template-columns: 190px 1fr;
  gap: 12px;
  padding: 9px 0;
  border-bottom: 1px solid #f6f8fa;
  font-size: 0.87rem;
}
.detail-row:last-child { border-bottom: none; }
.detail-label { font-weight: 600; color: #64748b; }
.detail-value { font-weight: 600; color: #1e293b; word-break: break-word; }
.detail-block .detail-value { font-weight: 500; line-height: 1.7; white-space: pre-line; }

.badge {
  display: inline-block;
  padding: 3px 11px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  white-space: nowrap;
}
.badge-new { background-color: #e0e7ff; color: #3730a3; }
.badge-process { background-color: #fef3c7; color: #92400e; }
.badge-done { background-color: #dcfce7; color: #166534; }
.badge-rejected { background-color: #fee2e2; color: #991b1b; }

/* Progress */
.progress-track {
  display: flex;
  align-items: center;
  gap: 0;
  margin-top: 22px;
  flex-wrap: wrap;
}

.progress-step {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-right: 26px;
  position: relative;
  color: #94a3b8;
  font-size: 0.82rem;
  font-weight: 700;
}

.progress-step:not(:last-child)::after {
  content: '';
  position: absolute;
  right: 6px;
  top: 50%;
  width: 12px;
  height: 2px;
  background-color: #e2e8f0;
}

.progress-step .dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #e2e8f0;
  flex-shrink: 0;
}

.progress-step.done { color: #166534; }
.progress-step.done .dot { background-color: #16a34a; }
.progress-step.rejected { color: #991b1b; }
.progress-step.rejected .dot { background-color: #dc2626; }

@media (max-width: 900px) {
  .navbar { padding: 16px 20px; }
  .nav-links { gap: 20px; }

  .menu-toggle { display: block; }

  .nav-links {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
    background-color: #ffffff;
    padding: 10px 20px 18px 20px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
  }
  .nav-links.nav-active { display: flex; }
  .nav-item { padding: 10px 0; width: 100%; }
  .login-btn { margin-left: 0; margin-top: 8px; justify-content: center; width: 100%; box-sizing: border-box; }
}

@media (max-width: 640px) {
  .content-wrapper { padding: 10px 16px 44px 16px; }
  .main-heading { font-size: 1.4rem; }
  .sub-heading { font-size: 1rem; }
  .form-card { padding: 20px 16px; border-radius: 12px; }
  .form-grid { grid-template-columns: 1fr; }
  .detail-row { grid-template-columns: 1fr; gap: 2px; }
  .form-actions { justify-content: stretch; }
  .form-actions .btn-primary { width: 100%; }
  .ticket-box { padding: 12px 18px; width: 100%; box-sizing: border-box; }
}
</style>
