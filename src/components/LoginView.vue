<template>
  <div class="login-viewport">
    <!-- Main Background Area -->
    <div class="hero-wrapper">
      <div class="overlay">
        
        <!-- Header / Navbar -->
        <header class="navbar">
          <div class="brand" @click="$router.push('/')">
            <img src="../assets/logo.png" alt="Logo DISKOPUMKER" class="logo" />
          </div>
          
          <!-- Tombol Kembali ke Beranda -->
          <button class="back-btn" @click="$router.push('/')">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Beranda
          </button>
        </header>

        <!-- Main Content: Card Login -->
        <main class="login-container">
          <div class="login-card animate-card-pop">
            
            <!-- Header Card (Logo & Judul) -->
            <div class="card-header">
              <img src="../assets/logo2.png" alt="Logo DISKOPUMKER" class="card-logo" />
              <h1 class="portal-title">PORTAL LAYANAN TERPADU</h1>
            </div>

            <!-- Box Form Login -->
            <div class="form-box">
              <h2 class="form-title">Masuk ke Akun Anda</h2>
              
              <!-- Alert Error Pesan -->
              <div v-if="errorMessage" class="error-alert">
                {{ errorMessage }}
              </div>

              <form @submit.prevent="handleLogin">
                <!-- Input Email -->
                <div class="form-group">
                  <label for="email">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    v-model="email" 
                    placeholder="Salam@gmail.com..." 
                    :disabled="loading"
                    required 
                  />
                </div>

                <!-- Input Password -->
                <div class="form-group">
                  <label for="password">Password</label>
                  <input 
                    type="password" 
                    id="password" 
                    v-model="password" 
                    placeholder="Pasword...." 
                    :disabled="loading"
                    required 
                  />
                </div>

                <!-- Tombol Masuk -->
                <button type="submit" class="btn-submit" :disabled="loading">
                  <span v-if="loading">Memproses...</span>
                  <span v-else>Masuk</span>
                </button>
              </form>
            </div>

          </div>
        </main>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginView',
  data() {
    return {
      email: '',
      password: '',
      loading: false,
      errorMessage: ''
    }
  },
  methods: {
    async handleLogin() {
      this.loading = true
      this.errorMessage = ''

      try {
        const response = await fetch('https://harvest-protegee-symptom.ngrok-free.dev/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password
          })
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Login gagal, periksa email dan password.')
        }

        // Simpan token dan data user di local storage
        localStorage.setItem('access_token', data.access_token)
        localStorage.setItem('user', JSON.stringify(data.user))

        // Redirect ke laman UMKM setelah login berhasil
        this.$router.push('/umkm')
      } catch (err) {
        this.errorMessage = err.message || 'Terjadi kesalahan koneksi ke server.'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

/* Viewport Full Screen */
.login-viewport {
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

/* Area Gambar Latar */
.hero-wrapper {
  flex: 1;
  background-image: url('../assets/background.jpg');
  background-size: cover;
  background-position: center;
  position: relative;
}

/* Overlay Hitam Transparan */
.overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.65);
  display: flex;
  flex-direction: column;
}

/* Navbar */
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

/* Tombol Kembali ke Beranda */
.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: 2px solid #ffffff;
  color: #ffffff;
  padding: 8px 18px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.95rem;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background-color: #ffffff;
  color: #1a1a1a;
}

/* Container Tengah */
.login-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 40px;
}

/* Card Utama Login */
.login-card {
  background-color: rgba(245, 245, 242, 0.92);
  backdrop-filter: blur(8px);
  width: 90%;
  max-width: 480px;
  padding: 35px 30px;
  border-radius: 12px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
}

/* Header Card */
.card-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 25px;
  text-align: center;
}

.card-logo {
  height: 90px;
  width: auto;
  margin-bottom: 12px;
}

.portal-title {
  font-size: 1.45rem;
  font-weight: 800;
  color: #222222;
  letter-spacing: 0.5px;
  margin: 0;
}

/* Box Form White Container */
.form-box {
  background-color: #f7f7f5;
  width: 100%;
  padding: 24px 22px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
}

.form-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1a1a1a;
  text-align: center;
  margin-top: 0;
  margin-bottom: 18px;
}

/* Alert Error */
.error-alert {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  margin-bottom: 14px;
  text-align: center;
  font-weight: 500;
}

/* Styling Input */
.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 14px;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 700;
  color: #2b2b2b;
  margin-bottom: 6px;
}

.form-group input {
  padding: 10px 14px;
  border: 1px solid #cccccc;
  border-radius: 6px;
  font-size: 0.9rem;
  background-color: #ededed;
  outline: none;
  font-family: 'Poppins', sans-serif;
  transition: all 0.2s ease;
}

.form-group input:focus {
  border-color: #333333;
  background-color: #ffffff;
}

.form-group input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-group input::placeholder {
  color: #888888;
}

/* Tombol Masuk */
.btn-submit {
  width: 100%;
  padding: 11px;
  background-color: #24272c;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 700;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  margin-top: 8px;
  transition: background-color 0.2s ease, transform 0.1s ease;
}

.btn-submit:hover:not(:disabled) {
  background-color: #111316;
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-submit:active:not(:disabled) {
  transform: scale(0.98);
}

/* Animasi */
.animate-card-pop {
  opacity: 0;
  animation: cardPop 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes cardPop {
  0% {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>