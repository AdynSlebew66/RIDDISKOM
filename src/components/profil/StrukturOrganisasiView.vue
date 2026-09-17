<template>
  <div class="page-container">
    <!-- Header / Navbar Public -->
    <header class="navbar">
      <div class="brand" @click="navTo('/')">
        <img src="../../assets/logo2.png" alt="Logo DISKOPUMKER" class="logo" />
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
        <p class="breadcrumb">Profile \ <strong>Struktur Organisasi</strong></p>
      </div>

      <!-- Title Section -->
      <div class="title-section">
        <h1 class="main-heading">
          Struktur <span class="highlight-green">Organisasi</span>
        </h1>
        <p class="section-desc">Susunan pejabat dan pegawai aktif Dinas Koperasi, Usaha Mikro dan Tenaga Kerja Kota Banjarmasin.</p>
      </div>

      <!-- State Loading -->
      <div v-if="loading" class="state-container">
        <div class="spinner"></div>
        <p>Memuat data struktur organisasi...</p>
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

      <!-- Bagan Pohon Organisasi (otomatis mengecil mengikuti layar) -->
      <div v-else class="tree-fit" ref="fitBox">
        <div class="tree-zoom" ref="zoomBox">
          <ul class="tree">
            <li>
              <!-- Puncak: Kepala Dinas -->
              <div class="root-nodes">
                <div
                  v-for="p in rootGroup.members"
                  :key="p.id"
                  class="person-node root-node"
                  :title="tooltipOf(p)"
                >
                <div class="person-photo">
                  <img v-if="photoVisible(p)" :src="resolvedPhoto(p)" :alt="p.nama_pegawai" loading="lazy" @error="onPhotoError(p)" />
                  <span v-else>{{ initialsOf(p.nama_pegawai) }}</span>
                </div>
                  <div class="person-text">
                    <p class="person-name">{{ p.nama_pegawai || '-' }}</p>
                    <p class="person-role">{{ p.jabatan || rootGroup.name }}</p>
                    <p v-if="p.nip" class="person-nip">NIP. {{ p.nip }}</p>
                  </div>
                </div>
              </div>

              <!-- Cabang: Unit Kerja -->
              <ul v-if="branchGroups.length" class="units-row">
                <li v-for="group in branchGroups" :key="group.name">
                  <div class="unit-node">
                    <h2 class="unit-name">{{ group.name }}</h2>
                    <span class="count-badge">{{ group.members.length }} Pegawai</span>
                  </div>

                  <!-- Anggota unit tersusun vertikal -->
                  <ul class="members">
                    <li v-for="p in group.members" :key="p.id">
                      <div class="person-node" :title="tooltipOf(p)">
                        <div class="person-photo">
                          <img v-if="photoVisible(p)" :src="resolvedPhoto(p)" :alt="p.nama_pegawai" loading="lazy" @error="onPhotoError(p)" />
                          <span v-else>{{ initialsOf(p.nama_pegawai) }}</span>
                        </div>
                        <div class="person-text">
                          <p class="person-name">{{ p.nama_pegawai || '-' }}</p>
                          <p class="person-role">{{ p.jabatan || '-' }}</p>
                          <p v-if="p.nip" class="person-nip">NIP. {{ p.nip }}</p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'StrukturOrganisasiView',
  data() {
    return {
      isMenuOpen: false,
      groups: [],
      loading: true,
      error: null,
      treeZoom: 1,
      fitTimer: null,
      brokenPhotos: {}
    }
  },
  computed: {
    rootGroup() {
      if (!this.groups.length) return { name: '', members: [] }
      const idx = this.groups.findIndex((g) => /kepala dinas/i.test(g.name))
      return idx >= 0 ? this.groups[idx] : this.groups[0]
    },
    branchGroups() {
      if (!this.groups.length) return []
      const root = this.rootGroup
      return this.groups.filter((g) => g !== root)
    }
  },
  mounted() {
    this.fetchPegawai()
    window.addEventListener('resize', this.onResize)
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => this.fitTree())
    }
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.onResize)
    clearTimeout(this.fitTimer)
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
        this.error = 'Gagal memuat data struktur organisasi. Silakan coba lagi.'
      } finally {
        this.loading = false
        this.$nextTick(() => this.fitTree())
      }
    },
    onResize() {
      clearTimeout(this.fitTimer)
      this.fitTimer = setTimeout(() => this.fitTree(), 150)
    },
    // Kecilkan pohon otomatis agar selalu muat dalam lebar layar
    // (hanya mengecil, tidak pernah diperbesar).
    fitTree() {
      const fit = this.$refs.fitBox
      const inner = this.$refs.zoomBox
      if (!fit || !inner || this.loading || this.error) return
      inner.style.zoom = ''
      const avail = fit.clientWidth
      const need = inner.scrollWidth
      if (!avail || !need) return
      const scale = Math.min(1, avail / need)
      this.treeZoom = Number(scale.toFixed(3))
      inner.style.zoom = this.treeZoom
    },
    // API bisa mengembalikan object { "Unit": [...] } atau array [...]
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
    // URL ada tapi gambar gagal dimuat (link mati / hotlink diblokir)
    // -> anggap rusak agar jatuh ke avatar inisial.
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

/* Bagan Pohon Organisasi (kompak + otomatis mengecil mengikuti layar) */
.tree-fit {
  width: 100%;
  overflow-x: auto;
  padding: 12px 4px 20px 4px;
  box-sizing: border-box;
}

.tree-zoom {
  width: max-content;
  min-width: 100%;
  margin: 0 auto;
}

.tree {
  margin: 0;
  padding: 0;
}

.tree ul {
  display: flex;
  justify-content: center;
  padding: 24px 0 0 0;
  margin: 0;
  position: relative;
}

.tree li {
  list-style: none;
  position: relative;
  text-align: center;
  padding: 24px 6px 0 6px;
}

/* Garis penghubung horizontal + vertikal */
.tree li::before,
.tree li::after {
  content: '';
  position: absolute;
  top: 0;
  right: 50%;
  width: 50%;
  height: 24px;
  border-top: 2px solid #cbd5e1;
}

.tree li::after {
  right: auto;
  left: 50%;
  border-left: 2px solid #cbd5e1;
}

.tree li:only-child::before,
.tree li:only-child::after {
  display: none;
}

.tree li:only-child {
  padding-top: 0;
}

.tree li:first-child::before,
.tree li:last-child::after {
  border: 0 none;
}

.tree li:last-child::before {
  border-right: 2px solid #cbd5e1;
  border-radius: 0 8px 0 0;
}

.tree li:first-child::after {
  border-radius: 8px 0 0 0;
}

/* Stub vertikal dari induk ke anak */
.tree ul ul::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  width: 0;
  height: 24px;
  border-left: 2px solid #cbd5e1;
}

/* Anggota unit tersusun vertikal */
.members {
  flex-direction: column !important;
  align-items: stretch !important;
  gap: 10px !important;
}

.members > li {
  padding-top: 0;
}

.members > li::before,
.members > li::after {
  display: none;
}

/* Node unit kerja */
.unit-node {
  display: inline-block;
  background-color: #1e385c;
  color: #ffffff;
  border-radius: 12px;
  padding: 10px 14px;
  box-shadow: 0 4px 12px rgba(30, 56, 92, 0.25);
  max-width: 200px;
}

.unit-name {
  font-size: 0.82rem;
  font-weight: 800;
  margin: 0 0 6px 0;
  line-height: 1.4;
}

.count-badge {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 700;
  color: #ffffff;
  background-color: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.35);
  padding: 3px 10px;
  border-radius: 20px;
  white-space: nowrap;
}

/* Node pegawai (foto + nama + jabatan) */
.root-nodes {
  display: inline-flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.person-node {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  box-sizing: border-box;
  background-color: #ffffff;
  border: 1px solid #e1e1db;
  border-radius: 12px;
  padding: 8px 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  text-align: left;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.members .person-node {
  max-width: 210px;
  margin: 0 auto;
}

.person-node:hover {
  transform: translateY(-2px);
  border-color: #2e7d32;
  box-shadow: 0 8px 20px rgba(46, 125, 50, 0.10);
}

.root-node {
  padding: 14px 20px;
  border: 2px solid #2e7d32;
  border-radius: 14px;
  box-shadow: 0 6px 18px rgba(46, 125, 50, 0.15);
}

.person-photo {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #e8f5e9;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 0.9rem;
  font-weight: 800;
  color: #2e7d32;
}

.root-node .person-photo {
  width: 60px;
  height: 60px;
  font-size: 1.15rem;
}

.person-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.person-text {
  min-width: 0;
  flex: 1;
}

.person-name {
  margin: 0 0 2px 0;
  font-size: 0.8rem;
  overflow-wrap: break-word;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.4;
}

.root-node .person-name {
  font-size: 0.88rem;
}

.person-role {
  margin: 0 0 2px 0;
  font-size: 0.72rem;
  font-weight: 700;
  color: #2e7d32;
  line-height: 1.4;
}

.person-nip {
  margin: 0;
  font-size: 0.68rem;
  font-weight: 500;
  color: #888888;
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

/* Responsive Styles */
@media (max-width: 992px) {
  .navbar {
    padding: 20px 30px;
  }

  .content-wrapper {
    padding: 10px 20px 40px 20px;
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

  /* Pohon di layar kecil: susun vertikal tanpa garis */
  .tree-fit {
    overflow-x: visible;
    padding: 4px 0 8px 0;
  }

  .tree-zoom {
    width: 100%;
  }

  .tree ul {
    display: block;
    padding-top: 0;
  }

  .tree li {
    padding: 0;
    margin-bottom: 16px;
  }

  .tree li:last-child {
    margin-bottom: 0;
  }

  .tree li::before,
  .tree li::after,
  .tree ul ul::before {
    display: none;
  }

  .root-nodes {
    display: flex;
    width: 100%;
  }

  .root-node {
    width: 100%;
  }

  .unit-node {
    display: block;
    max-width: none;
  }

  .members {
    margin-top: 12px;
  }

  .members .person-node {
    max-width: none;
  }
}

@media (max-width: 480px) {
  .main-heading { font-size: 1.4rem; }
  .section-desc { font-size: 0.82rem; }
  .breadcrumb { font-size: 0.78rem; }
  .btn-back { font-size: 0.78rem; padding: 6px 12px; }
}
</style>
