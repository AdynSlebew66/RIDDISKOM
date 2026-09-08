<template>
  <div class="umkm-viewport">
    <div class="hero-wrapper">
      <div class="overlay">
        
        <!-- Header / Navbar -->
        <header class="navbar">
          <div class="brand" @click="$router.push('/')">
            <img src="../assets/logo.png" alt="Logo DISKOPUMKER" class="logo" />
            <span class="badge-bidang">BIDANG UMKM</span>
          </div>
          
          <!-- Info User & Logout -->
          <div class="user-menu">
            <div class="user-info">
              <span class="user-name">{{ user?.name || 'Admin UMKM' }}</span>
              <span class="user-email">{{ user?.email || 'admin@gmail.com' }}</span>
            </div>
            
            <button class="logout-btn" @click="handleLogout">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Keluar
            </button>
          </div>
        </header>

        <!-- Main Content (Dashboard UMKM) -->
        <main class="content-container">
          <!-- Welcome Banner Card -->
          <div class="welcome-card animate-slide-up">
            <h2>Selamat Datang, {{ user?.name || 'User' }}! 👋</h2>
            <p>Anda berhasil login ke <strong>Portal Layanan Terpadu Bidang UMKM Kota Banjarmasin</strong>.</p>
          </div>

          <!-- Cards Stat Contoh Testing -->
          <div class="stats-grid animate-slide-up delay-100">
            <div class="stat-card">
              <div class="stat-icon">🏪</div>
              <div class="stat-info">
                <h3>1.240</h3>
                <p>Total UMKM Terdaftar</p>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">📄</div>
              <div class="stat-info">
                <h3>18</h3>
                <p>Pengajuan Layanan Baru</p>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">✅</div>
              <div class="stat-info">
                <h3>156</h3>
                <p>Berkas Disetujui</p>
              </div>
            </div>
          </div>
        </main>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UmkmView',
  data() {
    return {
      user: null
    }
  },
  mounted() {
    // Ambil data user yang tersimpan di localStorage saat login
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        this.user = JSON.parse(savedUser)
      } catch (e) {
        console.error('Gagal parsing data user', e)
      }
    }
  },
  methods: {
    handleLogout() {
      // Hapus token & session
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      
      // Redirect kembali ke login
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

/* Viewport Full Screen */
.umkm-viewport {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #1a1a1a;
  display: flex;
  flex-direction: column;
  font-family: 'Poppins', sans-serif;
  box-sizing: border-box;
}

.hero-wrapper {
  flex: 1;
  background-image: url('../assets/background.jpg');
  background-size: cover;
  background-position: center;
  position: relative;
}

.overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.70);
  display: flex;
  flex-direction: column;
}

/* Navbar */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 50px;
  width: 100%;
  box-sizing: border-box;
}

.brand {
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: pointer;
}

.logo {
  height: 55px;
  width: auto;
}

.badge-bidang {
  background-color: #e67e22;
  color: #ffffff;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

/* User Menu Header */
.user-menu {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-info {
  display: flex;
  flex-direction: column;
  text-align: right;
}

.user-name {
  color: #ffffff;
  font-weight: 700;
  font-size: 0.95rem;
}

.user-email {
  color: #bbbbbb;
  font-size: 0.8rem;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(220, 53, 69, 0.2);
  border: 1px solid #dc3545;
  color: #ff6b6b;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.85rem;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background-color: #dc3545;
  color: #ffffff;
}

/* Content Container */
.content-container {
  flex: 1;
  padding: 30px 50px;
  display: flex;
  flex-direction: column;
  gap: 25px;
  box-sizing: border-box;
}

/* Welcome Card */
.welcome-card {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  padding: 25px 30px;
  border-radius: 12px;
  color: #1a1a1a;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.welcome-card h2 {
  margin: 0 0 8px 0;
  font-weight: 800;
  font-size: 1.6rem;
}

.welcome-card p {
  margin: 0;
  color: #444444;
  font-size: 0.95rem;
}

/* Grid Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.stat-card {
  background: rgba(245, 245, 242, 0.90);
  backdrop-filter: blur(6px);
  padding: 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.2);
}

.stat-icon {
  font-size: 2rem;
  background: #ffffff;
  padding: 10px 14px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.stat-info h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 800;
  color: #1a1a1a;
}

.stat-info p {
  margin: 2px 0 0 0;
  font-size: 0.85rem;
  color: #666666;
  font-weight: 600;
}

/* Animasi */
.animate-slide-up {
  opacity: 0;
  transform: translateY(30px);
  animation: slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.delay-100 {
  animation-delay: 0.15s;
}

@keyframes slideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>