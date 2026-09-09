<template>
  <div class="pc-viewport">
    <!-- 1. HERO SECTION -->
    <div class="hero-wrapper">
      <div class="overlay">
        
        <!-- Header / Navbar -->
        <header class="navbar">
          <!-- Logo -->
          <div class="brand">
            <img src="../assets/logo.png" alt="Logo DISKOPUMKER" class="logo" />
          </div>
          
          <!-- Menu Navigasi (Panah Chevron Sudah Dihapus) -->
          <ul class="nav-links">
            <li class="nav-item" @click="scrollToSection('hero')">
              Beranda
            </li>
            <li class="nav-item">
              Profile
            </li>
            <li class="nav-item" @click="scrollToSection('informasi')">
              Informasi
            </li>
            <li class="nav-item" @click="scrollToSection('layanan')">
              Layanan
            </li>
            
            <!-- Tombol Login -->
            <li class="nav-item login-btn" @click="goToLogin">
              Login
              <svg xmlns="http://www.w3.org/2000/svg" class="icon-login" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                <polyline points="10 17 15 12 10 7"></polyline>
                <line x1="15" y1="12" x2="3" y2="12"></line>
              </svg>
            </li>
          </ul>
        </header>

        <!-- Center Content (Judul) -->
        <main class="hero-content">
          <h1 class="main-title animate-slide-up">DINAS KOPERASI USAHA MIKRO<br>dan TENAGA KERJA</h1>
          <h2 class="sub-title animate-slide-up delay-100">~ KOTA BANJARMASIN ~</h2>
        </main>

        <!-- Wave / Paper Divider -->
        <div class="wave-divider">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 60C240 100 480 20 720 60C960 100 1200 20 1440 60V120H0V60Z" fill="#f7f7f8"/>
          </svg>
        </div>

      </div>
    </div>

    <!-- 2. INFORMASI TERKINI & PROFIL KEPALA DINAS -->
    <section ref="informasiSection" class="section-container info-section">
      <div class="info-grid">
        <!-- Sisi Kiri: Informasi Terkini (Grid 2 Kolom) -->
        <div class="info-left">
          <h3 class="section-title">Informasi Terkini</h3>
          <div class="news-grid">
            <div v-for="n in 10" :key="n" class="news-card">
              <div class="news-thumb-placeholder"></div>
              <div class="news-text">
                <h4>Job Fair 2026</h4>
                <p>Ajang mencari pekerjaan</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Sisi Kanan: Profil Kepala Dinas -->
        <div class="info-right">
          <div class="kadis-card">
            <div class="kadis-photo-wrapper">
              <div class="kadis-photo-placeholder">
                <span>Foto Kadis</span>
              </div>
            </div>
            <div class="kadis-info">
              <h4>Dr. Machli Riyadi, S.H., M.H.</h4>
              <p>Kepala DISKOPUMKER</p>
              <div class="carousel-dots">
                <span class="dot active"></span>
                <span class="dot"></span>
                <span class="dot"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. LAYANAN DISKOPUMKER -->
    <section ref="layananSection" class="section-container services-section">
      <h3 class="section-title">Informasi Dan Layanan DISKOPUMKER</h3>
      <div class="services-grid">
        <!-- Card 1: HI (Red) -->
        <div class="service-card card-red" @click="goToService('/hi')">
          <div class="service-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
          <span class="service-name">Hubungan Industri (HI)</span>
        </div>

        <!-- Card 2: Koperasi (Light) -->
        <div class="service-card card-light" @click="goToService('/koperasi')">
          <div class="service-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"></path><path d="M3 10h18"></path><path d="M5 6l7-3 7 3"></path><path d="M4 10v11"></path><path d="M20 10v11"></path><path d="M8 14v3"></path><path d="M12 14v3"></path><path d="M16 14v3"></path></svg>
          </div>
          <span class="service-name">Koperasi</span>
        </div>

        <!-- Card 3: Sekretariat (Red) -->
        <div class="service-card card-red" @click="goToService('/sekretariat')">
          <div class="service-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
          </div>
          <span class="service-name">Sekretariat</span>
        </div>

        <!-- Card 4: BLK (Light) -->
        <div class="service-card card-light" @click="goToService('/blk')">
          <div class="service-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
          </div>
          <span class="service-name">Balai Latih Kerja (BLK)</span>
        </div>

        <!-- Card 5: UMKM (Red) -->
        <div class="service-card card-red" @click="goToService('/umkm')">
          <div class="service-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          </div>
          <span class="service-name">Usaha Mikro, Kecil, dan Menengah (UMKM)</span>
        </div>

        <!-- Card 6: UMPEG (Light) -->
        <div class="service-card card-light" @click="goToService('/umpeg')">
          <div class="service-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
          </div>
          <span class="service-name">Umum dan Kepegawaian (UMPEG)</span>
        </div>
      </div>
    </section>

    <!-- 4. LOKASI DISKOPUMKER & KRITIK SARAN -->
    <section class="section-container location-section">
      <h3 class="section-title">Lokasi DISKOPUMKER</h3>
      <div class="location-grid">
        <!-- Map Area -->
        <div class="map-box">
          <div class="map-placeholder">
            <div class="map-overlay-info">
              <strong>Dinas Koperasi Usaha Mikro dan Tenaga Kerja Kota Banjarmasin</strong>
              <p>Jl. Pangeran Samudra, Sungai Lulut, Kec. Banjarmasin Tim., Kota Banjarmasin, Kalimantan Selatan 70238</p>
            </div>
          </div>
        </div>

        <!-- Info Alamat & Form Kritik Saran -->
        <div class="feedback-box">
          <div class="address-block">
            <h4>Alamat DISKOPUMKER</h4>
            <p>Jl. Komp. Sejahtera, Sungai Lulut, Kec. Banjarmasin Tim., Kota Banjarmasin, Kalimantan Selatan 70238</p>
          </div>

          <div class="saran-block">
            <h4>Kotak Saran & Kritik</h4>
            <textarea placeholder="Silahkan isi saran atau kritik..."></textarea>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. FOOTER -->
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-left">
          <img src="../assets/logo2.png" alt="Logo Footer" class="footer-logo" />
        </div>
        <div class="footer-center">
          <p>🌐 diskopumker.banjarmasinkota.go.id</p>
          <p>📷 diskopumkerbanjarmasin</p>
          <p>📞 085287564751</p>
        </div>
        <div class="footer-right">
          <p>All Rights Reserved. Dinas Koperasi Usaha Mikro dan Tenaga Kerja Kota Banjarmasin</p>
        </div>
      </div>
    </footer>

  </div>
</template>

<script>
export default {
  name: 'PublicDashboard',
  methods: {
    goToLogin() {
      this.$router.push('/login')
    },
    goToService(path) {
      this.$router.push(path)
    },
    scrollToSection(section) {
      if (section === 'hero') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }

      let targetRef = null
      if (section === 'informasi') targetRef = this.$refs.informasiSection
      if (section === 'layanan') targetRef = this.$refs.layananSection

      if (targetRef) {
        targetRef.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

/* Viewport Full Page Scroll */
.pc-viewport {
  position: relative;
  width: 100vw;
  min-height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: #f7f7f8;
  display: flex;
  flex-direction: column;
  font-family: 'Poppins', sans-serif;
  box-sizing: border-box;
}

/* 1. Hero Section */
.hero-wrapper {
  height: 85vh;
  min-height: 550px;
  background-image: url('../assets/background.jpg');
  background-size: cover;
  background-position: center;
  position: relative;
}

.overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.65);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px 50px;
  width: 100%;
  box-sizing: border-box;
}

.logo {
  height: 60px;
  width: auto;
  cursor: pointer;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 30px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  color: #ffffff;
  font-size: 1.05rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-item:hover {
  opacity: 0.8;
}

.login-btn {
  margin-left: 15px;
  padding: 8px 20px;
  border: 2px solid #ffffff;
  border-radius: 8px;
  background-color: transparent;
}

.login-btn:hover {
  background-color: #ffffff;
  color: #1a1a1a;
  opacity: 1;
}

.icon-login {
  width: 18px;
  height: 18px;
  margin-left: 4px;
}

.hero-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #ffffff;
  padding-bottom: 20px;
}

.main-title {
  font-size: 2.8rem;
  font-weight: 800;
  line-height: 1.3;
  margin: 0 0 15px 0;
  letter-spacing: 0.5px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

.sub-title {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: 1px;
  text-shadow: 1px 1px 3px rgba(0,0,0,0.5);
}

.wave-divider {
  width: 100%;
  line-height: 0;
}

.wave-divider svg {
  width: 100%;
  height: 60px;
}

/* Base Container untuk Section */
.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 30px;
  width: 100%;
  box-sizing: border-box;
}

.section-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 22px;
}

/* 2. Informasi Terkini & Kadis */
.info-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
  align-items: start;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.news-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #ffffff;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.news-thumb-placeholder {
  width: 55px;
  height: 55px;
  background-color: #dcdde1;
  border-radius: 6px;
  flex-shrink: 0;
}

.news-text h4 {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: #1a1a1a;
}

.news-text p {
  margin: 2px 0 0 0;
  font-size: 0.8rem;
  color: #666666;
}

.kadis-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.kadis-photo-wrapper {
  width: 100%;
  height: 280px;
  background-color: #c0392b;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.kadis-photo-placeholder {
  color: #ffffff;
  font-weight: 700;
}

.kadis-info h4 {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 800;
  color: #1a1a1a;
}

.kadis-info p {
  margin: 4px 0 12px 0;
  font-size: 0.85rem;
  color: #666666;
  font-weight: 600;
}

.carousel-dots {
  display: flex;
  gap: 6px;
  justify-content: center;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ccc;
}

.dot.active {
  background-color: #c0392b;
}

/* 3. Layanan DISKOPUMKER */
.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.service-card {
  padding: 25px 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  min-height: 100px;
  box-sizing: border-box;
}

.service-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.12);
}

.card-red {
  background-color: #c0392b;
  color: #fffdfd;
}

.card-light {
  background-color: #c0392b;
  color: #fffdfd;
  border: 1px solid #e1e2e6;
}

.service-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.service-name {
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.3;
}

/* 4. Lokasi & Kritik Saran */
.location-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.map-box {
  background-color: #e2e8f0;
  border-radius: 12px;
  height: 320px;
  position: relative;
  overflow: hidden;
  background-image: radial-gradient(#cbd5e1 2px, transparent 2px);
  background-size: 16px 16px;
}

.map-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  padding: 15px;
  box-sizing: border-box;
}

.map-overlay-info {
  background: rgba(255, 255, 255, 0.95);
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  max-width: 80%;
}

.map-overlay-info strong {
  display: block;
  font-size: 0.85rem;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.map-overlay-info p {
  margin: 0;
  font-size: 0.75rem;
  color: #666666;
}

.feedback-box {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.address-block h4, .saran-block h4 {
  margin: 0 0 8px 0;
  font-size: 0.95rem;
  font-weight: 800;
  color: #1a1a1a;
}

.address-block p {
  margin: 0;
  font-size: 0.85rem;
  color: #555555;
  line-height: 1.5;
}

.saran-block textarea {
  width: 100%;
  height: 140px;
  padding: 12px 14px;
  border: 1px solid #cccccc;
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  font-size: 0.85rem;
  outline: none;
  resize: none;
  box-sizing: border-box;
  background-color: #ffffff;
}

.saran-block textarea:focus {
  border-color: #1a1a1a;
}

/* 5. Footer */
.footer {
  background-color: #ffffff;
  border-top: 1px solid #e5e5e5;
  padding: 25px 0;
  margin-top: 50px;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: #666666;
}

.footer-logo {
  height: 45px;
  width: auto;
}

.footer-center p, .footer-right p {
  margin: 3px 0;
}

/* Animasi */
.animate-slide-up {
  opacity: 0;
  transform: translateY(40px);
  animation: slideUp 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards;
}

.delay-100 {
  animation-delay: 0.2s;
}

@keyframes slideUp {
  0% {
    opacity: 0;
    transform: translateY(40px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>