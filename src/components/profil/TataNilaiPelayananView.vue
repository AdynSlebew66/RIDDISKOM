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
        <p class="breadcrumb">Profile \ <strong>Tata Nilai Pelayanan</strong></p>
      </div>

      <!-- Title Section -->
      <div class="title-section">
        <h1 class="main-heading">
          Tata Nilai <span class="highlight-red">Pelayanan</span>
        </h1>
        <p class="section-desc">Tata nilai pelayanan Dinas Koperasi, Usaha Mikro dan Tenaga Kerja Kota Banjarmasin.</p>
      </div>

      <div class="profile-layout">
        <!-- Main Content -->
        <section class="nilai-card">
          <span class="section-badge">Tata Nilai Pelayanan</span>
          <p class="nilai-org">Dinas Koperasi, Usaha Mikro dan Tenaga Kerja<br />Kota Banjarmasin</p>
          <h2 class="ikhlas-title">&ldquo;IKHLAS&rdquo;</h2>
          <div class="nilai-list">
            <article v-for="(item, index) in nilaiList" :key="index" class="nilai-item">
              <span class="nilai-arrow">&gt;</span>
              <div class="nilai-body">
                <h3 class="nilai-kata"><span class="huruf-red">{{ item.huruf }}</span>{{ item.kata }}</h3>
                <p class="nilai-desc">{{ item.desc }}</p>
              </div>
            </article>
          </div>
        </section>

        <!-- Sidebar Kanan -->
        <ProfilSidebar />
      </div>
    </main>
  </div>
</template>

<script>
import ProfilSidebar from './ProfilSidebar.vue'

export default {
  name: 'TataNilaiPelayananView',
  components: { ProfilSidebar },
  data() {
    return {
      isMenuOpen: false,
      nilaiList: [
        { huruf: 'I', kata: 'NTEGRITAS', desc: 'Jujur dapat dipercaya, mengikuti aturan yang berlaku dan menjaga nama baik institusi' },
        { huruf: 'K', kata: 'EBERSAMAAN', desc: 'Saling membantu mencapai tujuan' },
        { huruf: 'H', kata: 'ARMONI', desc: 'Saling peduli dan menghargai perbedaan' },
        { huruf: 'L', kata: 'OYAL', desc: 'Berdedikasi dan mengutamakan kepentingan masyarakat' },
        { huruf: 'A', kata: 'MANAH', desc: 'Memegang teguh kepercayaan yang diberikan' },
        { huruf: 'S', kata: 'ENYUM', desc: 'Ikhlas dan tulus dalam memberikan pelayanan' }
      ]
    }
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
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

/* Page Layout (standar halaman publik, warna Dashboard) */
.page-container {
  min-height: 100vh;
  background-color: #f7f7f8;
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
  color: #c0392b;
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

.highlight-red { color: #c0392b; }

.section-desc {
  font-size: 0.95rem;
  color: #555555;
  margin: 0;
  max-width: 820px;
  line-height: 1.6;
  text-align: left;
}

/* Layout 2 kolom: konten + sidebar kanan */
.profile-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 24px;
  align-items: start;
}

/* Badge (aksen merah Dashboard #c0392b) */
.section-badge {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #c0392b;
  background-color: #fdecea;
  border: 1px solid #f5c6c0;
  padding: 5px 16px;
  border-radius: 20px;
  margin-bottom: 14px;
}

/* Nilai Card */
.nilai-card {
  background: #ffffff;
  border: 1px solid #e1e1db;
  border-top: 6px solid #c0392b;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  box-sizing: border-box;
}

.nilai-org {
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #888888;
  line-height: 1.7;
  margin: 0 0 10px 0;
  text-align: center;
}

.ikhlas-title {
  font-size: 2rem;
  font-weight: 800;
  font-style: italic;
  letter-spacing: 4px;
  color: #c0392b;
  text-align: center;
  margin: 0 0 24px 0;
}

.nilai-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.nilai-item {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  background-color: #f7f7f8;
  border: 1px solid #eeeeeb;
  border-radius: 12px;
  padding: 14px 16px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.nilai-item:hover {
  border-color: #c0392b;
  box-shadow: 0 8px 20px rgba(192, 57, 43, 0.10);
  transform: translateY(-2px);
}

.nilai-arrow {
  font-size: 1.2rem;
  font-weight: 800;
  color: #1e385c;
  line-height: 1.4;
}

.nilai-kata {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: 1px;
  color: #1e385c;
  line-height: 1.4;
}

.huruf-red {
  color: #c0392b;
}

.nilai-desc {
  margin: 4px 0 0 0;
  font-size: 0.88rem;
  color: #555555;
  line-height: 1.6;
}

/* Responsive Styles */
@media (max-width: 992px) {
  .navbar {
    padding: 20px 30px;
  }

  .content-wrapper {
    padding: 10px 20px 40px 20px;
  }

  .profile-layout {
    grid-template-columns: 1fr;
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

  .nilai-card {
    padding: 24px 18px;
  }

  .ikhlas-title {
    font-size: 1.6rem;
  }
}

@media (max-width: 480px) {
  .main-heading { font-size: 1.4rem; }
  .section-desc { font-size: 0.82rem; }
  .breadcrumb { font-size: 0.78rem; }
  .btn-back { font-size: 0.78rem; padding: 6px 12px; }
  .nilai-card { padding: 20px 14px; }
  .ikhlas-title { font-size: 1.3rem; letter-spacing: 2px; }
  .nilai-kata { font-size: 0.92rem; }
  .nilai-desc { font-size: 0.8rem; }
}
</style>
