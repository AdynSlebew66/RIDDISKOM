<template>
  <div class="public-container">
    <!-- Navbar -->
    <header class="navbar">
      <div class="nav-brand" @click="$router.push('/')">
        <img src="../assets/logo2.png" alt="Logo DISKOPUMKER" class="logo" />
      </div>

      <!-- Hamburger Toggle (Mobile Only) -->
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

      <!-- Menu & Login Digabung ke Kanan -->
      <div class="nav-right" :class="{ 'nav-active': isMenuOpen }">
        <ul class="nav-menu">
          <li @click="closeMenu"><router-link to="/">Beranda</router-link></li>
          <li @click="closeMenu"><router-link to="/umkm">Grafik</router-link></li>
          <li @click="closeMenu"><router-link to="/layanan">Layanan UMKM</router-link></li>
          <li @click="closeMenu"><router-link to="/jadwal">Jadwal</router-link></li>
          <li @click="closeMenu"><router-link to="/galeri" class="active">Galeri</router-link></li>
        </ul>
        <button class="btn-login" @click="navTo('/login')">
          Login
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
            <polyline points="10 17 15 12 10 7"></polyline>
            <line x1="15" y1="12" x2="3" y2="12"></line>
          </svg>
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Top Action & Breadcrumb Section -->
      <div class="top-nav-bar">
        <button class="btn-back" @click="goBack">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>Kembali</span>
        </button>
        <p class="breadcrumb">Layanan DISKOPUMKER \ <span>Galeri</span></p>
      </div>

      <!-- Header Page -->
      <div class="page-header">
        <h1 class="page-title">
          Galeri Kegiatan <span class="text-blue">UMKM</span>
        </h1>
        <p class="section-desc">Dokumentasi foto kegiatan pemberdayaan dan pembinaan pelaku usaha mikro, kecil, dan menengah.</p>
      </div>

      <!-- State Loading -->
      <div v-if="loading" class="state-container">
        <div class="spinner"></div>
        <p>Memuat data galeri kegiatan...</p>
      </div>

      <!-- State Error -->
      <div v-else-if="error" class="state-container error-state">
        <p>{{ error }}</p>
        <button @click="fetchGaleri" class="btn-retry">Coba Lagi</button>
      </div>

      <!-- State Kosong -->
      <div v-else-if="daftarKegiatan.length === 0" class="state-container">
        <p>Belum ada data kegiatan saat ini.</p>
      </div>

      <!-- Loop Utama: Daftar Kegiatan -->
      <div v-else class="activities-wrapper">
        <div 
          v-for="kegiatan in paginatedKegiatan" 
          :key="kegiatan.id" 
          class="kegiatan-card"
        >
          <div class="kegiatan-header">
            <h2 class="kegiatan-title">{{ kegiatan.judul_kegiatan }}</h2>
            <div class="kegiatan-date">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>{{ formatDate(kegiatan.tanggal_mulai) }} - {{ formatDate(kegiatan.tanggal_selesai) }}</span>
            </div>
          </div>

          <!-- Loop Kedua (Nested v-for): Grid Foto -->
          <div class="galeri-grid">
            <div 
              v-for="foto in kegiatan.galeris" 
              :key="foto.id" 
              class="galeri-item"
            >
              <img 
                :src="foto.foto_direct_url" 
                :alt="kegiatan.judul_kegiatan" 
                class="galeri-img"
              />
            </div>
          </div>
        </div>

        <!-- Pagination Controls -->
        <div v-if="totalPages > 1" class="pagination-container">
          <button 
            class="pagination-btn" 
            :disabled="currentPage === 1"
            @click="prevPage"
          >
            &laquo; Prev
          </button>

          <div class="pagination-numbers">
            <button 
              v-for="page in totalPages" 
              :key="page"
              class="page-number"
              :class="{ active: currentPage === page }"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>
          </div>

          <button 
            class="pagination-btn" 
            :disabled="currentPage === totalPages"
            @click="nextPage"
          >
            Next &raquo;
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'GaleriView',
  data() {
    return {
      isMenuOpen: false,
      daftarKegiatan: [],
      loading: true,
      error: null,
      currentPage: 1,
      itemsPerPage: 3
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.daftarKegiatan.length / this.itemsPerPage) || 1
    },
    paginatedKegiatan() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.daftarKegiatan.slice(start, end)
    }
  },
  mounted() {
    this.fetchGaleri()
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen
    },
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
    async fetchGaleri() {
      this.loading = true
      this.error = null
      try {
        const response = await fetch('https://harvest-protegee-symptom.ngrok-free.dev/api/galeri', {
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        })

        if (!response.ok) {
          throw new Error('Gagal mengambil data dari server')
        }

        const resData = await response.json()
        if (resData && resData.data) {
          this.daftarKegiatan = resData.data
        }
      } catch (err) {
        console.error('Error fetching galeri:', err)
        this.error = 'Gagal memuat galeri kegiatan. Silakan coba lagi.'
      } finally {
        this.loading = false
      }
    },
    formatDate(dateString) {
      if (!dateString) return ''
      const options = { day: 'numeric', month: 'long', year: 'numeric' }
      return new Date(dateString).toLocaleDateString('id-ID', options)
    },
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

.public-container {
  min-height: 100vh;
  background-color: #f7f7f5;
  font-family: 'Poppins', sans-serif;
  color: #1a1a1a;
  display: flex;
  flex-direction: column;
}

/* Navbar (standar halaman publik) */
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

.nav-right {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 32px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-menu a {
  text-decoration: none;
  color: #1a1a1a;
  font-weight: 700;
  font-size: 0.95rem;
  transition: opacity 0.2s, color 0.2s;
  cursor: pointer;
}

.nav-menu a:hover,
.nav-menu a.active {
  color: #2e7d32;
}

.btn-login {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 10px;
  padding: 8px 20px;
  border: 1.8px solid #1a1a1a;
  border-radius: 8px;
  background: transparent;
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 0.95rem;
  color: #1a1a1a;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-login:hover {
  background-color: #1a1a1a;
  color: #ffffff;
}

/* Main Content */
.main-content {
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

.breadcrumb span {
  color: #1a1a1a;
  font-weight: 700;
}

.page-header {
  margin-bottom: 28px;
  text-align: left;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 8px 0;
  line-height: 1.25;
  text-align: left;
}

.section-desc {
  font-size: 0.95rem;
  color: #555555;
  margin: 0;
  max-width: 820px;
  line-height: 1.6;
  text-align: left;
}

.text-blue {
  color: #3b82f6;
}

/* States */
.state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background: #ffffff;
  border-radius: 16px;
  color: #666;
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3b82f6;
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
  background-color: #3b82f6;
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
  background-color: #2563eb;
}

/* Activities List */
.activities-wrapper {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.kegiatan-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.03);
}

.kegiatan-header {
  margin-bottom: 20px;
}

.kegiatan-title {
  font-size: 1.25rem;
  font-weight: 800;
  margin: 0 0 8px 0;
  color: #1a1a1a;
  line-height: 1.4;
  text-align: left;
}

.kegiatan-date {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: #666666;
  font-weight: 500;
}

/* Galeri Grid */
.galeri-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.galeri-item {
  height: 220px;
  border-radius: 12px;
  overflow: hidden;
  background-color: #f3f4f6;
}

.galeri-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Pagination Styling */
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
}

.pagination-numbers {
  display: flex;
  gap: 6px;
}

.pagination-btn,
.page-number {
  padding: 8px 14px;
  border: 1px solid #e5e7eb;
  background-color: #ffffff;
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 0.85rem;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination-btn:hover:not(:disabled),
.page-number:hover {
  background-color: #f3f4f6;
  border-color: #d1d5db;
}

.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-number.active {
  background-color: #2563eb;
  color: #ffffff;
  border-color: #2563eb;
}

@media (max-width: 992px) {
  .navbar {
    padding: 20px 30px;
  }

  .main-content {
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

  .menu-toggle {
    display: block;
  }

  .nav-right {
    display: none;
    flex-direction: column;
    align-items: stretch;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(8px);
    padding: 20px;
    gap: 16px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
    border-bottom: 1px solid #e2e2dc;
  }

  .nav-right.nav-active {
    display: flex;
  }

  .nav-menu {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .btn-login {
    margin-left: 0;
    width: 100%;
    justify-content: center;
    box-sizing: border-box;
  }

  .top-nav-bar {
    flex-wrap: wrap;
    gap: 12px;
  }

  .page-title {
    font-size: 1.8rem;
  }

  .section-desc {
    font-size: 0.88rem;
  }

  .kegiatan-card {
    padding: 20px 16px;
  }

  .galeri-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}
</style>