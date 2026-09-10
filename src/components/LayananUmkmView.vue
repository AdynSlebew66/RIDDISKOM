<template>
  <div class="page-container">
    <!-- Header / Navbar Public -->
    <header class="navbar">
      <div class="brand" @click="navTo('/')">
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

      <!-- Nav Links -->
      <ul class="nav-links" :class="{ 'nav-active': isMenuOpen }">
        <li class="nav-item" @click="navTo('/')">Beranda</li>
        <li class="nav-item" @click="navTo('/umkm')">Grafik</li>
        <li class="nav-item active" @click="navTo('/layanan')">Layanan UMKM</li>
        <li class="nav-item" @click="navTo('/galeri')">Galeri</li>
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

    <!-- Main Content Wrapper -->
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
        <p class="breadcrumb">Layanan DISKOPUMKER \ <strong>Portal Layanan UMKM</strong></p>
      </div>

      <!-- Main Title -->
      <div class="title-section">
        <h1 class="main-heading">
          Pemberdayaan & <span class="sub-heading">Layanan <span class="highlight-blue">Digital</span> <span class="highlight-green">UMKM</span></span>
        </h1>
        <p class="section-desc">
          Ajukan permohonan sertifikasi, pendataan, hingga fasilitas bantuan usaha Anda secara praktis dan terintegrasi melalui satu pintu layanan.
        </p>
      </div>

      <!-- Data Card Container -->
      <div class="data-card">
        <div class="card-header-title">
          <h2 class="section-heading">Daftar Permohonan Layanan</h2>
          <p class="sub-heading-text">Pilih jenis layanan yang ingin Anda ajukan di bawah ini:</p>
        </div>

        <!-- Services Grid -->
        <div class="services-grid">
          <div 
            v-for="item in layananList" 
            :key="item.id" 
            class="service-card-framed"
            @click="openUrl(item.url)"
          >
            <div class="card-top">
              <div class="icon-box">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <span class="step-badge">Layanan 0{{ item.id }}</span>
            </div>

            <div class="card-content">
              <h3 class="service-title">{{ item.title }}</h3>
              <p class="service-desc">{{ item.desc }}</p>
            </div>

            <div class="card-action">
              <button class="btn-fill-form">
                <span>Isi Formulir</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Guide / Alur Section Card -->
      <div class="data-card guide-card">
        <h2 class="section-heading text-center">Alur Pengajuan Layanan</h2>
        <div class="steps-wrapper">
          <div class="step-item">
            <div class="step-number">1</div>
            <h4>Pilih Layanan</h4>
            <p>Pilih jenis formulir permohonan yang sesuai dengan kebutuhan usaha Anda.</p>
          </div>
          <div class="step-item">
            <div class="step-number">2</div>
            <h4>Lengkapi Data</h4>
            <p>Isi data diri dan berkas persyaratan yang diminta pada form permohonan.</p>
          </div>
          <div class="step-item">
            <div class="step-number">3</div>
            <h4>Verifikasi Tim</h4>
            <p>Petugas DISKOPUMKER akan melakukan verifikasi berkas permohonan Anda.</p>
          </div>
        </div>
      </div>

      <!-- Contact & Map Section -->
      <div class="data-card contact-card">
        <div class="contact-grid">
          <!-- Information Details -->
          <div class="info-section">
            <h2 class="section-heading">Alamat</h2>
            <p class="address-text">
              Jl. Pramuka Komp. Semanda (MAN 2)<br />
              Banjarmasin, Kalimantan Selatan
            </p>

            <div class="contact-list">
              <p class="contact-item">
                <span class="label">Email:</span>
                <a href="mailto:info@rumahurban.id" class="link-contact">info@rumahurban.id</a>
              </p>
              <p class="contact-item">
                <span class="label">WhatsApp (WA):</span>
                <a href="https://wa.me/6281253910688" target="_blank" class="link-contact">+6281253910688</a>
                <span class="pic-name">(Nasrullah)</span>
              </p>
            </div>
          </div>

          <!-- Map Location -->
          <div class="map-section">
            <h2 class="section-heading">Peta Lokasi</h2>
            <div class="map-wrapper">
              <iframe
                title="Peta Lokasi Komp Semanda"
                src="https://maps.google.com/maps?q=Jl.+Pramuka+Komp.+Semanda+Banjarmasin&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="220"
                style="border:0;"
                allowfullscreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'LayananUmkmView',
  data() {
    return {
      isMenuOpen: false,
      layananList: [
        {
          id: 1,
          title: 'Permohonan Tenant URBAN Inkubator',
          desc: 'Pengajuan pendaftaran resmi dan pembaruan data pelaku usaha mikro daerah.',
          url: 'https://www.rumara.id/urban.html'
        },
        {
          id: 2,
          title: 'Permohonan Pembuatan NIB',
          desc: 'Fasilitasi serta bimbingan pendampingan pendaftaran Nomor Induk Berusaha (NIB).',
          url: 'https://www.rumara.id/nib.html'
        },
        {
          id: 3,
          title: 'Permohonan UMARA',
          desc: 'Pengajuan pendaftaran perlindungan merk dan Hak Kekayaan Intelektual.',
          url: 'https://www.rumara.id/umara.html'
        },
        {
          id: 4,
          title: 'Permohonan Sertifikasi Halal',
          desc: 'Pendaftaran program bimbingan teknis dan pendaftaran sertifikasi produk halal.',
          url: 'https://www.rumara.id/halal.html'
        },
        {
          id: 5,
          title: 'Permohonan Sertifikat P-IRT',
          desc: 'Fasilitasi bantuan perizinan Pangan Industri Rumah Tangga (P-IRT).',
          url: 'https://www.rumara.id/pirt.html'
        },
        {
          id: 6,
          title: 'Permohonan HKI',
          desc: 'Konsultasi dan bantuan pengajuan Hak Kekayaan Intelektual produk usaha.',
          url: 'https://www.rumara.id/hki.html'
        }
      ]
    }
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
    openUrl(url) {
      if (!url) return
      if (url.startsWith('http://') || url.startsWith('https://')) {
        window.open(url, '_blank')
      } else {
        this.$router.push(url)
      }
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

/* Page Layout */
.page-container {
  min-height: 100vh;
  background-color: #f7f7f5;
  font-family: 'Poppins', sans-serif;
  color: #1a1a1a;
  display: flex;
  flex-direction: column;
}

/* Header & Navbar */
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

.nav-item:hover,
.nav-item.active {
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
  color: #1a1a1a;
}

.login-btn:hover {
  background-color: #1a1a1a;
  color: #ffffff;
}

.icon-login {
  width: 18px;
  height: 18px;
}

/* Main Content Area */
.content-wrapper {
  max-width: 1180px;
  width: 100%;
  margin: 0 auto;
  padding: 10px 40px 60px 40px;
  box-sizing: border-box;
}

/* Top Nav & Back Button */
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
}

.btn-back:hover {
  background-color: #1a1a1a;
  color: #ffffff;
  border-color: #1a1a1a;
}

.breadcrumb {
  font-size: 0.9rem;
  color: #555555;
  margin: 0;
  font-weight: 500;
}

/* Title Section */
.title-section {
  margin-bottom: 28px;
}

.main-heading {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 8px 0;
  line-height: 1.25;
}

.sub-heading {
  font-weight: 700;
  color: #1a1a1a;
}

.highlight-blue { color: #536dfe; }
.highlight-green { color: #2e7d32; }

.section-desc {
  font-size: 0.98rem;
  color: #555555;
  margin: 0;
  max-width: 820px;
  line-height: 1.5;
}

/* Data Card Frame */
.data-card {
  background-color: #f2f2ed;
  border-radius: 20px;
  padding: 36px 40px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.02);
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 32px;
}

.card-header-title {
  margin-bottom: 24px;
}

.section-heading {
  font-size: 1.25rem;
  font-weight: 800;
  margin: 0 0 10px 0;
  color: #1a1a1a;
}

.sub-heading-text {
  font-size: 0.88rem;
  color: #666666;
  margin: 0;
}

/* Services Grid */
.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.service-card-framed {
  background-color: #ffffff;
  border: 1px solid #e1e1db;
  border-radius: 14px;
  padding: 22px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.service-card-framed:hover {
  transform: translateY(-4px);
  border-color: #2e7d32;
  box-shadow: 0 8px 20px rgba(46, 125, 50, 0.08);
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.icon-box {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background-color: #e8f5e9;
  color: #2e7d32;
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-badge {
  font-size: 0.72rem;
  font-weight: 700;
  color: #ff6f00;
  background-color: #fff3e0;
  border: 1px solid #ffe0b2;
  padding: 3px 8px;
  border-radius: 6px;
}

.card-content {
  margin-bottom: 20px;
}

.service-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px 0;
  line-height: 1.35;
}

.service-desc {
  font-size: 0.84rem;
  color: #666666;
  margin: 0;
  line-height: 1.45;
}

.card-action {
  margin-top: auto;
}

.btn-fill-form {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 9px 14px;
  background-color: #f8f8f5;
  color: #1a1a1a;
  border: 1px solid #eaeae3;
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.service-card-framed:hover .btn-fill-form {
  background-color: #2e7d32;
  color: #ffffff;
  border-color: #2e7d32;
}

/* Guide / Alur Section */
.guide-card {
  padding-top: 32px;
  padding-bottom: 32px;
}

.text-center {
  text-align: center;
}

.steps-wrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 24px;
}

.step-item {
  background-color: #ffffff;
  border: 1px solid #e1e1db;
  border-radius: 14px;
  padding: 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.step-number {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background-color: #2e7d32;
  color: #ffffff;
  font-weight: 800;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.step-item h4 {
  font-size: 0.98rem;
  font-weight: 700;
  margin: 0 0 6px 0;
  color: #1a1a1a;
}

.step-item p {
  font-size: 0.82rem;
  color: #666666;
  margin: 0;
  line-height: 1.45;
}

/* Contact & Map Section */
.contact-card {
  margin-bottom: 0;
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.address-text {
  font-size: 0.95rem;
  color: #333333;
  line-height: 1.6;
  margin: 0 0 16px 0;
  font-weight: 500;
}

.contact-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.contact-item {
  font-size: 0.92rem;
  color: #333333;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.contact-item .label {
  font-weight: 500;
  color: #333333;
}

.link-contact {
  color: #0066cc;
  text-decoration: underline;
  word-break: break-all;
}

.link-contact:hover {
  color: #2e7d32;
}

.pic-name {
  color: #555555;
}

.map-wrapper {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e1e1db;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  background-color: #ffffff;
}

/* Responsive Styles */
@media (max-width: 992px) {
  .navbar {
    padding: 20px 30px;
  }

  .content-wrapper {
    padding: 10px 20px 40px 20px;
  }

  .services-grid {
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

  .menu-toggle {
    display: block;
  }

  .nav-links {
    display: none;
    flex-direction: column;
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

  .nav-links.nav-active {
    display: flex;
  }

  .login-btn {
    margin-left: 0;
    width: 100%;
    justify-content: center;
    box-sizing: border-box;
  }

  .main-heading {
    font-size: 1.8rem;
  }

  .data-card {
    padding: 24px 18px;
    border-radius: 16px;
  }

  .services-grid,
  .steps-wrapper,
  .contact-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}
</style>