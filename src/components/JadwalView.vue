<template>
  <div class="public-container">
    <!-- Navbar -->
    <header class="navbar">
      <div class="nav-brand" @click="$router.push('/')">
        <img src="../assets/logo2.png" alt="Logo DISKOPUMKER" class="logo" />
      </div>

      <!-- Menu & Login Digabung ke Kanan -->
      <div class="nav-right">
        <ul class="nav-menu">
          <li><router-link to="/">Beranda</router-link></li>
          <li><router-link to="/umkm">Grafik</router-link></li>
          <li><router-link to="/layanan">Layanan UMKM</router-link></li>
          <li><router-link to="/jadwal" class="active">Jadwal</router-link></li>
          <li><router-link to="/galeri">Galeri</router-link></li>
        </ul>
        <button class="btn-login" @click="$router.push('/login')">
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
      <!-- Header Page -->
      <div class="page-header">
        <p class="breadcrumb">Layanan DISKOPUMKER \ <span>Jadwal</span></p>
        <h1 class="page-title">
          Jadwal Kegiatan <span class="text-blue">UMKM</span>
        </h1>
      </div>

      <!-- State Loading -->
      <div v-if="loading" class="state-container">
        <div class="spinner"></div>
        <p>Memuat jadwal kegiatan...</p>
      </div>

      <!-- State Error -->
      <div v-else-if="error" class="state-container error-state">
        <p>{{ error }}</p>
        <button @click="fetchJadwal" class="btn-retry">Coba Lagi</button>
      </div>

      <!-- State Kosong -->
      <div v-else-if="daftarJadwal.length === 0" class="state-container">
        <p>Belum ada jadwal kegiatan saat ini.</p>
      </div>

      <!-- Daftar Jadwal dalam bentuk tabel, dikelompokkan per bulan -->
      <div v-else class="schedule-wrapper">
        <div
          v-for="group in groupedJadwal"
          :key="group.key"
          class="month-group"
        >
          <h2 class="month-title">{{ group.label }}</h2>

          <div class="table-container">
            <table class="schedule-table">
              <thead>
                <tr>
                  <th class="text-center" style="width: 50px;">No</th>
                  <th>Nama Kegiatan</th>
                  <th>Tanggal</th>
                  <th class="text-center">Jam</th>
                  <th class="text-center">Jumlah Peserta</th>
                  <th>Keterangan</th>
                  <th class="text-center" style="width: 150px;">Pendaftaran</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, idx) in group.items" :key="item.id">
                  <td class="text-center">{{ idx + 1 }}</td>
                  <td class="font-bold">{{ item.nama_kegiatan }}</td>
                  <td>{{ formatTanggal(item.tanggal) }}</td>
                  <td class="text-center">{{ formatJam(item.jam) }}</td>
                  <td class="text-center">{{ formatPeserta(item.jumlah_peserta) }}</td>
                  <td>{{ item.keterangan || '-' }}</td>
                  <td class="text-center">
                    <a
                      v-if="item.link_pendaftaran"
                      :href="item.link_pendaftaran"
                      target="_blank"
                      rel="noopener"
                      class="btn-daftar"
                    >
                      Daftar
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="7" y1="17" x2="17" y2="7"></line>
                        <polyline points="7 7 17 7 17 17"></polyline>
                      </svg>
                    </a>
                    <span v-else class="text-muted">-</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'JadwalView',
  data() {
    return {
      daftarJadwal: [],
      loading: true,
      error: null
    }
  },
  computed: {
    groupedJadwal() {
      const groups = {}
      this.daftarJadwal.forEach((item) => {
        const key = this.monthKeyOf(item.tanggal)
        if (!groups[key]) {
          groups[key] = { key, label: this.monthLabelOf(item.tanggal), items: [] }
        }
        groups[key].items.push(item)
      })
      return Object.values(groups).sort((a, b) => (a.key < b.key ? -1 : 1))
    }
  },
  mounted() {
    this.fetchJadwal()
  },
  methods: {
    async fetchJadwal() {
      this.loading = true
      this.error = null
      try {
        const response = await fetch('https://harvest-protegee-symptom.ngrok-free.dev/api/jadwal', {
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        })

        if (!response.ok) {
          throw new Error('Gagal mengambil data dari server')
        }

        const resData = await response.json()
        const list = Array.isArray(resData?.data) ? resData.data : []
        // Urutkan dari tanggal terdekat
        this.daftarJadwal = list.sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal))
      } catch (err) {
        console.error('Error fetching jadwal:', err)
        this.error = 'Gagal memuat jadwal kegiatan. Silakan coba lagi.'
      } finally {
        this.loading = false
      }
    },
    // MANIPULASI JAM: jika 00:00:00 / "-" / kosong -> tampilkan "-"
    formatJam(jam) {
      if (!jam || jam === '-') return '-'
      const s = String(jam).trim()
      if (s === '-' || s.startsWith('00:00')) return '-'
      const match = s.match(/^(\d{2}):(\d{2})/)
      if (match) return `${match[1]}:${match[2]} WIB`
      return s
    },
    // MANIPULASI PESERTA: jika 0 / kosong -> tampilkan "-"
    formatPeserta(jumlah) {
      if (jumlah === null || jumlah === undefined || Number(jumlah) === 0) return '-'
      return `${Number(jumlah).toLocaleString('id-ID')} Peserta`
    },
    formatTanggal(dateString) {
      if (!dateString) return '-'
      const d = new Date(dateString)
      if (isNaN(d.getTime())) return dateString
      return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    },
    monthKeyOf(dateString) {
      const d = new Date(dateString)
      if (isNaN(d.getTime())) return 'zz'
      const pad = (n) => String(n).padStart(2, '0')
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`
    },
    monthLabelOf(dateString) {
      const d = new Date(dateString)
      if (isNaN(d.getTime())) return 'Lainnya'
      return d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
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

/* Navbar Layout Baru */
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

.nav-right {
  display: flex;
  align-items: center;
  gap: 36px;
}

.nav-menu {
  display: flex;
  gap: 28px;
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

/* Schedule Tables */
.schedule-wrapper {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.month-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: #111827;
  margin: 0 0 14px 0;
  padding-left: 12px;
  border-left: 4px solid #3b82f6;
}

.month-group {
  display: flex;
  flex-direction: column;
}

.table-container {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.03);
  overflow-x: auto;
}

.schedule-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.88rem;
}

.schedule-table th {
  background-color: #f8fafc;
  color: #1e293b;
  font-weight: 700;
  padding: 14px 16px;
  border-bottom: 2px solid #eef2f7;
  text-align: left;
  white-space: nowrap;
}

.schedule-table td {
  padding: 14px 16px;
  border-bottom: 1px solid #f1f5f9;
  color: #334155;
  vertical-align: middle;
}

.schedule-table tbody tr:hover {
  background-color: #f8fafc;
}

.schedule-table tbody tr:last-child td {
  border-bottom: none;
}

.text-center { text-align: center; }
.font-bold { font-weight: 700; color: #111827; }
.text-muted { color: #9ca3af; }

.btn-daftar {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  background-color: #2563eb;
  color: #ffffff;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.85rem;
  text-decoration: none;
  transition: background-color 0.2s;
}

.btn-daftar:hover {
  background-color: #1d4ed8;
}

@media (max-width: 768px) {
  .navbar {
    padding: 15px 20px;
  }
  .nav-right {
    gap: 16px;
  }
  .nav-menu {
    display: none;
  }
  .schedule-table {
    min-width: 760px;
  }
}
</style>
