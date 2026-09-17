<template>
  <div class="page-container">
    <!-- Header / Navbar Public -->
    <header class="navbar">
      <div class="brand" @click="navTo('/')">
        <img src="../assets/logo2.png" alt="Logo DISKOPUMKER" class="logo" />
      </div>

      <ul class="nav-links">
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

    <!-- Content Area -->
    <main class="content-wrapper">
      <!-- Top Action & Breadcrumb Section -->
      <div class="top-nav-bar">
        <button class="btn-back" @click="goBack">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>Kembali</span>
        </button>
        <p class="breadcrumb">Layanan DISKOPUMKER \ <strong>Pegawai</strong></p>
      </div>

      <!-- Title Section -->
      <div class="title-section">
        <h1 class="main-heading">
          Pegawai <span class="highlight-green">DISKOPUMKER</span>
        </h1>
        <p class="section-desc">Susunan seluruh pegawai aktif Dinas Koperasi, Usaha Mikro dan Tenaga Kerja Kota Banjarmasin per unit kerja.</p>
      </div>

      <!-- State Loading -->
      <div v-if="loading" class="state-container">
        <div class="spinner"></div>
        <p>Memuat data pegawai...</p>
      </div>

      <!-- State Error -->
      <div v-else-if="error" class="state-container">
        <p>{{ error }}</p>
        <button @click="fetchPegawai" class="btn-retry">Coba Lagi</button>
      </div>

      <!-- State Kosong -->
      <div v-else-if="groups.length === 0" class="state-container">
        <p>Belum ada data pegawai saat ini.</p>
      </div>

      <!-- Daftar Pegawai per Unit Kerja -->
      <div v-else class="groups-wrapper">
      <div v-for="group in groups" :key="group.name" class="data-card">
        <div class="card-header-title">
          <h2 class="section-heading">{{ group.name }}</h2>
          <span class="count-badge">{{ group.members.length }} Pegawai</span>
        </div>

        <div class="pegawai-grid">
          <article v-for="p in group.members" :key="p.id" class="pegawai-card" :title="tooltipOf(p)">
            <div class="avatar-wrapper">
              <img
                v-if="photoVisible(p)"
                :src="resolvedPhoto(p)"
                :alt="p.nama_pegawai"
                class="avatar-img"
                loading="lazy"
                @error="onPhotoError(p)"
              />
              <div v-else class="avatar-initials">{{ initialsOf(p.nama_pegawai) }}</div>
            </div>

            <h3 class="pegawai-name">{{ p.nama_pegawai || '-' }}</h3>
            <span class="jabatan-badge">{{ p.jabatan || '-' }}</span>

            <div class="pegawai-details">
              <p class="detail-row">
                <span class="detail-label">NIP</span>
                <span class="detail-value">{{ p.nip || '-' }}</span>
              </p>
              <p class="detail-row">
                <span class="detail-label">Golongan</span>
                <span class="detail-value">{{ p.golongan || '-' }}</span>
              </p>
              <p class="detail-row">
                <span class="detail-label">Unit Kerja</span>
                <span class="detail-value">{{ p.unit_kerja || '-' }}</span>
              </p>
            </div>

            <span class="status-pill" :class="{ active: (p.status_aktif || '').toLowerCase() === 'aktif' }">
              {{ p.status_aktif || '-' }}
            </span>
          </article>
        </div>
      </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'SekretariatView',
  data() {
    return {
      isMenuOpen: false,
      groups: [],
      loading: true,
      error: null,
      brokenPhotos: {}
    }
  },
  mounted() {
    this.fetchPegawai()
  },
  methods: {
    closeMenu() {
      this.isMenuOpen = false
    },
    navTo(path) {
      this.closeMenu()
      this.$router.push(path)
    },
    goBack() {
      if (window.history.length > 1) {
        this.$router.back()
      } else {
        this.$router.push('/')
      }
    },
    async fetchPegawai() {
      this.loading = true
      this.error = null
      this.brokenPhotos = {}
      try {
        const response = await fetch('https://harvest-protegee-symptom.ngrok-free.dev/api/pegawai', {
          method: 'GET',
          headers: {
            'ngrok-skip-browser-warning': 'true',
            Accept: 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error('Gagal mengambil data dari server.')
        }

        const resData = await response.json()
        this.groups = this.normalizeGroups(resData.data)
      } catch (err) {
        console.error('Error fetching pegawai:', err)
        this.error = 'Gagal memuat data pegawai. Silakan coba lagi.'
      } finally {
        this.loading = false
      }
    },
    // API bisa mengembalikan object { "Unit": [...] } atau array [...],
    // kelompokkan per unit kerja dan urutkan berdasar `urutan`.
    normalizeGroups(data) {
      let grouped = {}
      if (Array.isArray(data)) {
        data.forEach((p) => {
          const key = p.unit_kerja || 'Lainnya'
          if (!grouped[key]) grouped[key] = []
          grouped[key].push(p)
        })
      } else if (data && typeof data === 'object') {
        grouped = data
      }

      return Object.entries(grouped)
        .map(([name, members]) => ({
          name,
          members: [...(members || [])].sort(
            (a, b) => (Number(a.urutan) || 0) - (Number(b.urutan) || 0)
          )
        }))
        .filter((g) => g.members.length > 0)
        .sort((a, b) => {
          const minA = Math.min(...a.members.map((m) => Number(m.urutan) || 9999))
          const minB = Math.min(...b.members.map((m) => Number(m.urutan) || 9999))
          return minA - minB
        })
    },
    photoOf(p) {
      return p.foto_direct_url || p.foto_url || ''
    },
    // Link sharing Google Drive (…/file/d/ID/view) bukan direct image
    // sehingga tidak bisa dirender <img>. Ubah ke endpoint thumbnail langsung.
    // Syarat: file di Drive harus di-share "Anyone with the link – Viewer".
    toDirectImageUrl(url) {
      if (!url) return ''
      const s = String(url).trim()
      const m = s.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/)
        || s.match(/drive\.google\.com\/open\?[^#]*[?&]id=([a-zA-Z0-9_-]+)/)
        || s.match(/drive\.google\.com\/uc\?[^#]*[?&]id=([a-zA-Z0-9_-]+)/)
      if (m && m[1]) return `https://drive.google.com/thumbnail?id=${m[1]}&sz=w500`
      return s
    },
    resolvedPhoto(p) {
      return this.toDirectImageUrl(this.photoOf(p))
    },
    photoKey(p) {
      return p.id ?? this.photoOf(p)
    },
    isPhotoBroken(p) {
      return !!this.brokenPhotos[this.photoKey(p)]
    },
    photoVisible(p) {
      return !!this.photoOf(p) && !this.isPhotoBroken(p)
    },
    onPhotoError(p) {
      const key = this.photoKey(p)
      if (key !== '' && key !== undefined) {
        this.brokenPhotos = { ...this.brokenPhotos, [key]: true }
      }
    },
    tooltipOf(p) {
      const rows = [
        p.nama_pegawai,
        p.jabatan,
        p.nip ? `NIP. ${p.nip}` : '',
        p.golongan ? `Gol. ${p.golongan}` : '',
        p.unit_kerja ? `Unit: ${p.unit_kerja}` : ''
      ].filter(Boolean)
      return rows.join('\n')
    },
    initialsOf(name) {
      if (!name) return '-'
      const parts = String(name).split(' ').filter(Boolean).slice(0, 2)
      return parts.map((w) => w.charAt(0).toUpperCase()).join('') || '-'
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

/* Page Layout (standar halaman publik) */
.page-container {
  min-height: 100vh;
  background-color: #f7f7f5;
  font-family: 'Poppins', sans-serif;
  color: #1a1a1a;
  display: flex;
  overflow-x: hidden;
  flex-direction: column;
}

/* Header & Navbar (standar halaman publik) */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 60px;
  background-color: transparent;
  position: relative;
  z-index: 50;
}

.logo {
  height: 52px;
  cursor: pointer;
}

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
  transition: opacity 0.2s, color 0.2s;
}

.nav-item:hover {
  color: #2e7d32;
}

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

.login-btn:hover {
  background-color: #1a1a1a;
  color: #ffffff;
}

.icon-login {
  width: 18px;
  height: 18px;
}

/* Main Content Area (standar halaman publik) */
.content-wrapper {
  max-width: 1180px;
  width: 100%;
  margin: 0 auto;
  padding: 10px 40px 60px 40px;
  box-sizing: border-box;
}

/* Top Nav & Back Button (standar halaman publik) */
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
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
  white-space: nowrap;
}

.btn-back:hover {
  background-color: #1a1a1a;
  color: #ffffff;
  border-color: #1a1a1a;
}

.breadcrumb {
  font-size: 0.85rem;
  color: #666666;
  margin: 0;
  font-weight: 500;
}

/* Title Section (standar halaman publik) */
.title-section {
  margin-bottom: 28px;
  text-align: left;
}

.main-heading {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 8px 0;
  line-height: 1.25;
  text-align: left;
}

.highlight-green { color: #2e7d32; }

.section-desc {
  font-size: 0.95rem;
  color: #555555;
  margin: 0;
  max-width: 820px;
  line-height: 1.6;
  text-align: left;
}

/* Daftar Unit Kerja */
.groups-wrapper {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* Data Card Frame (standar halaman publik) */
.data-card {
  background-color: #f2f2ed;
  border-radius: 20px;
  padding: 36px 40px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.02);
  width: 100%;
  box-sizing: border-box;
}

.card-header-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.section-heading {
  font-size: 1.25rem;
  font-weight: 800;
  margin: 0;
  color: #1a1a1a;
  text-align: left;
  line-height: 1.4;
}

.count-badge {
  font-size: 0.75rem;
  font-weight: 700;
  color: #2e7d32;
  background-color: #e8f5e9;
  border: 1px solid #c8e6c9;
  padding: 4px 10px;
  border-radius: 6px;
  white-space: nowrap;
}

/* States (standar halaman publik) */
.state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background: #ffffff;
  border-radius: 16px;
  color: #666666;
  text-align: center;
  font-size: 0.95rem;
  font-weight: 500;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #2e7d32;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.btn-retry {
  margin-top: 16px;
  padding: 10px 24px;
  background-color: #2e7d32;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-retry:hover {
  background-color: #1b5e20;
}

/* Pegawai Grid */
.pegawai-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.pegawai-card {
  background-color: #ffffff;
  border: 1px solid #e1e1db;
  border-radius: 14px;
  padding: 22px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.pegawai-card:hover {
  transform: translateY(-4px);
  border-color: #2e7d32;
  box-shadow: 0 8px 20px rgba(46, 125, 50, 0.08);
}

.avatar-wrapper {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 14px;
  background-color: #e8f5e9;
  flex-shrink: 0;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.avatar-initials {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 800;
  color: #2e7d32;
}

.pegawai-name {
  font-size: 1rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.jabatan-badge {
  font-size: 0.75rem;
  font-weight: 700;
  color: #ff6f00;
  background-color: #fff3e0;
  border: 1px solid #ffe0b2;
  padding: 4px 10px;
  border-radius: 6px;
  margin-bottom: 16px;
  line-height: 1.4;
}

.pegawai-details {
  width: 100%;
  background: #f8f8f5;
  border: 1px solid #eaeae3;
  border-radius: 8px;
  padding: 10px 12px;
  margin-bottom: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-sizing: border-box;
}

.detail-row {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-align: left;
}

.detail-label {
  font-size: 0.72rem;
  font-weight: 600;
  color: #666666;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.detail-value {
  font-size: 0.85rem;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.5;
  word-break: break-word;
}

.status-pill {
  font-size: 0.75rem;
  font-weight: 700;
  color: #666666;
  background-color: #f1f1ec;
  border: 1px solid #e1e1db;
  padding: 4px 12px;
  border-radius: 20px;
}

.status-pill.active {
  color: #2e7d32;
  background-color: #e8f5e9;
  border-color: #c8e6c9;
}

/* Responsive Styles */
@media (max-width: 992px) {
  .navbar {
    padding: 20px 30px;
  }

  .content-wrapper {
    padding: 10px 20px 40px 20px;
  }

  .pegawai-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .navbar {
    padding: 16px 20px;
  }

  .logo {
    height: 40px;
  }

  .nav-links {
    display: flex;
    flex-direction: row;
    position: static;
    background: transparent;
    backdrop-filter: none;
    padding: 0;
    gap: 0;
    box-shadow: none;
    border-bottom: none;
  }

  .login-btn {
    margin-left: 0;
    width: auto;
    justify-content: center;
    box-sizing: border-box;
  }

  .top-nav-bar {
    flex-wrap: wrap;
    gap: 12px;
  }

  .main-heading {
    font-size: 1.8rem;
  }

  .section-desc {
    font-size: 0.88rem;
  }

  .data-card {
    padding: 24px 18px;
    border-radius: 16px;
  }

  .pegawai-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .main-heading { font-size: 1.4rem; }
  .section-desc { font-size: 0.82rem; }
  .data-card { padding: 20px 14px; }
  .breadcrumb { font-size: 0.78rem; }
  .btn-back { font-size: 0.78rem; padding: 6px 12px; }
  .section-heading { font-size: 1.05rem; }
}
</style>
