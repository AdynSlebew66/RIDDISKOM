<template>
  <div class="public-container">
    <!-- Navbar -->
    <header class="navbar">
      <div class="nav-brand" @click="$router.push('/')">
        <img src="../assets/logo2.png" alt="Logo DISKOPUMKER" class="logo" />
      </div>
      <ul class="nav-menu">
        <li><router-link to="/">Beranda</router-link></li>
        <li><router-link to="/umkm">Grafik</router-link></li>
        <li><router-link to="/layanan">Layanan UMKM</router-link></li>
        <li><router-link to="/galeri" class="active">Galeri</router-link></li>
      </ul>
      <button class="btn-login" @click="$router.push('/login')">
        Login
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
          <polyline points="10 17 15 12 10 7"></polyline>
          <line x1="15" y1="12" x2="3" y2="12"></line>
        </svg>
      </button>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Header Page -->
      <div class="page-header">
        <p class="breadcrumb">Layanan DISKOPUMKER \ <span>Galeri</span></p>
        <h1 class="page-title">
          Galeri Kegiatan <span class="text-blue">UMKM</span>
        </h1>
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
          v-for="kegiatan in daftarKegiatan" 
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

          <!-- Loop Kedua (Nested v-for): Grid Foto dari galeris -->
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
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'GaleriView',
  data() {
    return {
      daftarKegiatan: [],
      loading: true,
      error: null
    }
  },
  mounted() {
    this.fetchGaleri()
  },
  methods: {
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
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

.public-container {
  min-height: 100vh;
  background-color: #f7f7f8;
  font-family: 'Poppins', sans-serif;
  color: #1a1a1a;
}

/* Navbar */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 80px;
  background-color: #f7f7f8;
}

.logo {
  height: 48px;
  cursor: pointer;
}

.nav-menu {
  display: flex;
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
  transition: color 0.2s;
}

.nav-menu a:hover,
.nav-menu a.active {
  color: #2563eb;
}

.btn-login {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 22px;
  border: 1.5px solid #1a1a1a;
  border-radius: 8px;
  background: transparent;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-login:hover {
  background-color: #1a1a1a;
  color: #ffffff;
}

/* Main Content */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 30px 60px;
}

.breadcrumb {
  font-size: 0.85rem;
  color: #666666;
  margin-bottom: 8px;
  font-weight: 600;
}

.breadcrumb span {
  color: #1a1a1a;
}

.page-title {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 30px;
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
  margin-top: 15px;
  padding: 8px 20px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
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
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #111827;
}

.kegiatan-date {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: #6b7280;
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

@media (max-width: 768px) {
  .navbar {
    padding: 15px 20px;
  }
  .nav-menu {
    display: none;
  }
  .galeri-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}
</style>