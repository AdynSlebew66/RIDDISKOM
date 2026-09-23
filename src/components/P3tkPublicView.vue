<template>
  <div class="page-container" :style="themeVars">
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

      <ul class="nav-links" :class="{ 'nav-active': isMenuOpen }">
        <li class="nav-item" @click="navTo('/')">Beranda</li>
        <li class="nav-item" @click="handleScrollGrafik">Grafik</li>
        <li class="nav-item" @click="navTo('/layanan')">Layanan P3TK</li>
        <li class="nav-item" @click="navTo('')">Galeri</li>
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
        <p class="breadcrumb">Layanan DISKOPUMKER \ <strong>P3TK</strong></p>
      </div>

      <!-- Title -->
      <div class="title-section">
        <h1 class="main-heading">
          P3TK <span class="sub-heading">Bidang Pembinaan, Pelatihan Dan Penempatan Tenaga Kerja</span>
        </h1>
        <h2 ref="grafikSection" class="section-heading">Grafik Data P3TK</h2>
        <p class="section-desc">
          Visualisasi statistik pencari kerja (pencaker) berdasarkan pendidikan, rentang usia, dan jenis kelamin.
          <span v-if="!loading && totalPencaker > 0" class="total-inline">
            Total: <strong>{{ totalPencaker.toLocaleString('id-ID') }}</strong> pencaker{{ filterLabel }}.
          </span>
        </p>
      </div>

      <!-- Main Data Card -->
      <div class="data-card">
        <!-- Filter Tahun & Bulan -->
        <div class="filter-row">
          <select v-model="selectedTahun" class="dropdown-select" @change="fetchStatistik">
            <option :value="''">Semua Tahun</option>
            <option v-for="t in tahunList" :key="t" :value="t">{{ t }}</option>
          </select>
          <select v-model="selectedBulan" class="dropdown-select" @change="fetchStatistik">
            <option :value="''">Semua Bulan</option>
            <option v-for="b in bulanList" :key="b.value" :value="b.value">{{ b.label }}</option>
          </select>
        </div>

        <!-- Tabs -->
        <div class="tabs-header">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="tab-item"
            :class="{ active: activeTab === tab.id }"
            @click="switchTab(tab.id)"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Loading / Error -->
        <div v-if="loading" class="state-info">Memuat data statistik pencaker...</div>
        <div v-else-if="error" class="state-info error">
          {{ error }}
          <br />
          <button class="btn-retry" @click="fetchStatistik">Coba Lagi</button>
        </div>
        <div v-else-if="!currentItems.length" class="state-info">Belum ada data untuk filter ini.</div>

        <!-- Chart + Cards -->
        <div v-else class="chart-content-grid">
          <!-- PIE CHART khusus Jenis Kelamin -->
          <div v-if="activeTab === 'jenis_kelamin'" class="chart-left pie-chart-left">
            <div class="pie-chart-card">
              <div class="donut-wrapper">
                <svg viewBox="0 0 300 300" class="donut-svg">
                  <g v-for="(slice, index) in pieSlices" :key="index">
                    <path :d="slice.pathData" :fill="slice.color" stroke="#ffffff" stroke-width="3" />
                  </g>
                  <circle cx="150" cy="150" r="58" fill="#ffffff" />
                  <text x="150" y="148" text-anchor="middle" fill="#1a1a1a" font-size="22" font-weight="800">
                    {{ pieTotal.toLocaleString('id-ID') }}
                  </text>
                  <text x="150" y="168" text-anchor="middle" fill="#888888" font-size="11" font-weight="600">
                    Total Pencaker
                  </text>
                </svg>
              </div>
              <div class="pie-legend">
                <div v-for="(item, idx) in pieSlices" :key="idx" class="pie-legend-item">
                  <span class="dot" :style="{ backgroundColor: item.color }"></span>
                  <span class="legend-text">{{ item.label }} — <strong>{{ item.value.toLocaleString('id-ID') }}</strong> ({{ item.percent }}%)</span>
                </div>
              </div>
            </div>
          </div>
          <!-- Bar Chart (Pendidikan & Rentang Usia) -->
          <div v-else class="chart-left bar-chart-left">
            <div class="bar-chart-card">
              <div class="chart-grid-wrapper">
                <div class="y-axis">
                  <span v-for="(tick, tIdx) in yTicks" :key="tIdx">{{ tick }}</span>
                </div>

                <div class="chart-area-scrollable">
                  <div class="chart-area-inner" :style="{ minWidth: chartInnerWidth }">
                    <div class="grid-lines">
                      <div class="grid-line" v-for="n in yTicks.length" :key="n"></div>
                    </div>

                    <div class="bars-container">
                      <div v-for="(item, idx) in currentItems" :key="idx" class="bar-col">
                        <div class="bar-track">
                          <div class="bar-fill" :style="{ height: barHeight(item.value) + '%' }">
                            <span class="bar-val-badge">{{ item.value.toLocaleString('id-ID') }}</span>
                          </div>
                        </div>
                        <div class="bar-x-label-wrapper">
                          <span class="bar-x-label" :title="item.label">{{ item.label }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="bar-legend">
                <span class="legend-square"></span>
                <span class="legend-text">{{ legendLabel }}</span>
              </div>
            </div>
          </div>

          <!-- Right stat cards : grid 2x2 per halaman, tanpa kartu kepotong -->
          <div class="cards-scroll-section">
            <div class="cards-scroll-header">
              <span class="scroll-hint">{{ pageLabel }}</span>
              <div class="scroll-nav">
                <button class="scroll-btn" :disabled="cardPage === 0" @click="prevCards" aria-label="Halaman sebelumnya">&#8592;</button>
                <button class="scroll-btn" :disabled="cardPage >= pageCount - 1" @click="nextCards" aria-label="Halaman berikutnya">&#8594;</button>
              </div>
            </div>
            <div class="chart-right cards-paged">
              <div v-for="(card, i) in visibleCards" :key="`${activeTab}-${cardPage}-${i}`" class="stat-card-framed">
                <span class="year-badge">{{ yearBadge }}</span>
                <h3 class="stat-title">{{ card.label }}</h3>
                <div class="card-inner-grid">
                  <div class="inner-col">
                    <span class="col-label">Jumlah</span>
                    <span class="col-value">{{ card.value.toLocaleString('id-ID') }}</span>
                  </div>
                  <div class="inner-col highlight-col">
                    <span class="col-label">Persentase</span>
                    <span class="col-value percent-text">{{ card.percent }}%</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="pageCount > 1" class="page-dots">
              <span
                v-for="p in pageCount"
                :key="p"
                class="page-dot"
                :class="{ active: cardPage === p - 1 }"
                @click="cardPage = p - 1"
              ></span>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
// ============================================================
// TEMA WARNA PER-BIDANG — ubah cukup di objek THEME ini.
// Halaman bidang lain (Koperasi, UMPEG, HI, BLK, dsb.) bisa
// menyalin file ini lalu mengganti nilai THEME agar selaras
// namun tetap punya identitas warna sendiri.
// ============================================================
const THEME = {
  chartBar: '#8070FF', // warna batang bar chart (Pendidikan & Rentang Usia)
  tabActive: '#2e7d32', // warna tab aktif (disamakan dgn halaman publik lain)
  badgeText: '#ff6f00', // warna teks badge tahun
  badgeBg: '#fff8f0', // latar badge tahun
  // Warna pie dipetakan dari LABEL agar konsisten walau urutan API berubah
  pieByLabel: {
    'laki-laki': '#4A89DC', // biru
    'perempuan': '#EC5F8A' // pink
  },
  pieFallback: ['#8070FF', '#FF7E72', '#38CDF2', '#FFA726'] // cadangan kategori lain
}

const API_BASE = 'https://harvest-protegee-symptom.ngrok-free.dev/api/statistik/pencaker'

export default {
  name: 'P3tkPublicView',
  data() {
    return {
      isMenuOpen: false,
      activeTab: 'pendidikan',
      tabs: [
        { id: 'pendidikan', label: 'Pendidikan' },
        { id: 'rentang_usia', label: 'Rentan Usia' },
        { id: 'jenis_kelamin', label: 'Jenis Kelamin' }
      ],
      selectedTahun: '',
      selectedBulan: '',
      tahunList: [],
      bulanList: [
        { value: 1, label: 'Januari' },
        { value: 2, label: 'Februari' },
        { value: 3, label: 'Maret' },
        { value: 4, label: 'April' },
        { value: 5, label: 'Mei' },
        { value: 6, label: 'Juni' },
        { value: 7, label: 'Juli' },
        { value: 8, label: 'Agustus' },
        { value: 9, label: 'September' },
        { value: 10, label: 'Oktober' },
        { value: 11, label: 'November' },
        { value: 12, label: 'Desember' }
      ],
      statistik: {
        tahun: null,
        bulan: null,
        total: 0,
        by_jenis_kelamin: [],
        by_pendidikan: [],
        by_rentang_usia: []
      },
      loading: false,
      error: null,
      theme: THEME,
      cardPage: 0, // halaman aktif grid kartu (4 kartu per halaman = 2x2)
      cardPageSize: 4
    }
  },
  computed: {
    themeVars() {
      return {
        '--bidang-chart': this.theme.chartBar,
        '--bidang-accent': this.theme.tabActive,
        '--bidang-badge-text': this.theme.badgeText,
        '--bidang-badge-bg': this.theme.badgeBg
      }
    },
    totalPencaker() {
      return Number(this.statistik.total) || 0
    },
    filterLabel() {
      const parts = []
      if (this.selectedTahun) parts.push(`tahun ${this.selectedTahun}`)
      if (this.selectedBulan) {
        const b = this.bulanList.find((x) => Number(x.value) === Number(this.selectedBulan))
        parts.push(`bulan ${b ? b.label : this.selectedBulan}`)
      }
      return parts.length ? ` (${parts.join(' • ')})` : ''
    },
    yearBadge() {
      return this.statistik.tahun || this.selectedTahun || new Date().getFullYear()
    },
    legendLabel() {
      if (this.activeTab === 'pendidikan') return 'Pendidikan'
      if (this.activeTab === 'rentang_usia') return 'Rentang Usia'
      return 'Jenis Kelamin'
    },
    currentItems() {
      if (this.activeTab === 'pendidikan') {
        return (this.statistik.by_pendidikan || []).map((item) => ({
          label: item.nama || '-',
          value: Number(item.total) || 0
        }))
      }
      if (this.activeTab === 'rentang_usia') {
        return (this.statistik.by_rentang_usia || []).map((item) => ({
          label: item.rentang || '-',
          value: Number(item.total) || 0
        }))
      }
      // jenis_kelamin: API -> { kode, label, total } (toleran ke bentuk lain)
      return (this.statistik.by_jenis_kelamin || []).map((item) => ({
        label: item.label || item.nama || item.jenis_kelamin || item.kode || '-',
        value: Number(item.total) || 0
      }))
    },
    rightCards() {
      const total = this.totalPencaker
      return this.currentItems.map((item) => ({
        ...item,
        percent: total > 0 ? ((item.value / total) * 100).toFixed(0) : '0'
      }))
    },
    pageCount() {
      return Math.max(1, Math.ceil(this.rightCards.length / this.cardPageSize))
    },
    visibleCards() {
      const start = this.cardPage * this.cardPageSize
      return this.rightCards.slice(start, start + this.cardPageSize)
    },
    pageLabel() {
      if (this.rightCards.length <= this.cardPageSize) {
        return `${this.rightCards.length} kategori`
      }
      const start = this.cardPage * this.cardPageSize + 1
      const end = Math.min(start + this.cardPageSize - 1, this.rightCards.length)
      return `${start}–${end} dari ${this.rightCards.length} kategori`
    },
    yMax() {
      const maxVal = Math.max(0, ...this.currentItems.map((i) => i.value))
      if (maxVal <= 10) return 10
      if (maxVal <= 50) return Math.ceil(maxVal / 10) * 10
      if (maxVal <= 100) return Math.ceil(maxVal / 20) * 20
      if (maxVal <= 500) return Math.ceil(maxVal / 100) * 100
      return Math.ceil(maxVal / 200) * 200
    },
    yTicks() {
      const max = this.yMax
      const steps = 5
      const ticks = []
      for (let i = 0; i <= steps; i++) {
        ticks.push(Math.round(max - (max / steps) * i))
      }
      return ticks
    },
    chartInnerWidth() {
      const n = this.currentItems.length
      if (n <= 4) return '100%'
      return `${n * 52}px`
    },
    pieTotal() {
      return this.currentItems.reduce((acc, cur) => acc + (Number(cur.value) || 0), 0)
    },
    pieSlices() {
      const data = this.currentItems
      const total = this.pieTotal
      if (!data.length || total === 0) return []
      const cx = 150
      const cy = 150
      const R = 125
      const r = 60
      let currentAngle = -Math.PI / 2
      return data.map((item, index) => {
        const value = Number(item.value) || 0
        const percent = total > 0 ? (value / total) * 100 : 0
        const angleSize = Math.min(total > 0 ? (value / total) * 2 * Math.PI : 0, 2 * Math.PI - 0.0001)
        const startAngle = currentAngle
        const endAngle = startAngle + angleSize
        currentAngle = endAngle
        const largeArc = angleSize > Math.PI ? 1 : 0
        const x1o = cx + R * Math.cos(startAngle)
        const y1o = cy + R * Math.sin(startAngle)
        const x2o = cx + R * Math.cos(endAngle)
        const y2o = cy + R * Math.sin(endAngle)
        const x2i = cx + r * Math.cos(endAngle)
        const y2i = cy + r * Math.sin(endAngle)
        const x1i = cx + r * Math.cos(startAngle)
        const y1i = cy + r * Math.sin(startAngle)
        const pathData = `M ${x1o.toFixed(2)} ${y1o.toFixed(2)} A ${R} ${R} 0 ${largeArc} 1 ${x2o.toFixed(2)} ${y2o.toFixed(2)} L ${x2i.toFixed(2)} ${y2i.toFixed(2)} A ${r} ${r} 0 ${largeArc} 0 ${x1i.toFixed(2)} ${y1i.toFixed(2)} Z`
        return {
          label: item.label,
          value,
          percent: percent.toFixed(1),
          color: this.colorForPie(item.label, index),
          pathData
        }
      })
    }
  },
  mounted() {
    this.fetchTahunList()
    this.fetchStatistik()
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
    handleScrollGrafik() {
      this.closeMenu()
      if (this.$refs.grafikSection) {
        this.$refs.grafikSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    },
    async fetchTahunList() {
      try {
        const res = await fetch(`${API_BASE}/tahun`, {
          method: 'GET',
          headers: { 'ngrok-skip-browser-warning': 'true', Accept: 'application/json' }
        })
        const json = await res.json()
        if (res.ok && Array.isArray(json.data)) {
          this.tahunList = json.data
        }
      } catch (e) {
        // fallback: biarkan dropdown hanya "Semua Tahun"
        console.error('[P3TK] gagal ambil daftar tahun:', e)
      }
    },
    async fetchStatistik() {
      this.loading = true
      this.error = null
      this.cardPage = 0
      try {
        const params = new URLSearchParams()
        if (this.selectedTahun) params.append('tahun', this.selectedTahun)
        if (this.selectedBulan) params.append('bulan', this.selectedBulan)
        const query = params.toString() ? `?${params.toString()}` : ''
        const res = await fetch(`${API_BASE}${query}`, {
          method: 'GET',
          headers: { 'ngrok-skip-browser-warning': 'true', Accept: 'application/json' }
        })
        const json = await res.json()
        if (!res.ok) throw new Error(json.message || 'Gagal mengambil data statistik pencaker.')
        const d = json.data || {}
        this.statistik = {
          tahun: d.tahun ?? this.selectedTahun ?? null,
          bulan: d.bulan ?? null,
          total: Number(d.total) || 0,
          by_jenis_kelamin: Array.isArray(d.by_jenis_kelamin) ? d.by_jenis_kelamin : [],
          by_pendidikan: Array.isArray(d.by_pendidikan) ? d.by_pendidikan : [],
          by_rentang_usia: Array.isArray(d.by_rentang_usia) ? d.by_rentang_usia : []
        }
      } catch (err) {
        console.error('[P3TK] gagal ambil statistik:', err)
        this.error = err.message || 'Terjadi kesalahan koneksi ke server.'
      } finally {
        this.loading = false
      }
    },
    barHeight(val) {
      if (!val || !this.yMax) return 0
      return Math.min(Math.max((val / this.yMax) * 100, val > 0 ? 4 : 0), 100)
    },
    colorForPie(label, index) {
      const key = String(label || '').trim().toLowerCase()
      if (this.theme.pieByLabel[key]) return this.theme.pieByLabel[key]
      return this.theme.pieFallback[index % this.theme.pieFallback.length]
    },
    switchTab(tabId) {
      this.activeTab = tabId
      this.cardPage = 0
    },
    prevCards() {
      if (this.cardPage > 0) this.cardPage -= 1
    },
    nextCards() {
      if (this.cardPage < this.pageCount - 1) this.cardPage += 1
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

.page-container {
  min-height: 100vh;
  background-color: #f7f7f5;
  font-family: 'Poppins', sans-serif;
  color: #1a1a1a;
  display: flex;
  overflow-x: hidden;
  flex-direction: column;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 60px;
  background-color: transparent;
  position: relative;
  z-index: 50;
}

.logo { height: 52px; cursor: pointer; }

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
  transition: opacity 0.2s;
}
.nav-item:hover { opacity: 0.7; }

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
.login-btn:hover { background-color: #1a1a1a; color: #ffffff; }
.icon-login { width: 18px; height: 18px; }

.content-wrapper {
  max-width: 1180px;
  width: 100%;
  margin: 0 auto;
  padding: 10px 40px 60px 40px;
  box-sizing: border-box;
}

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
.btn-back:hover { background-color: #1a1a1a; color: #ffffff; border-color: #1a1a1a; }

.breadcrumb { font-size: 0.85rem; color: #666666; margin: 0; font-weight: 500; }

.title-section { margin-bottom: 28px; }

.main-heading {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 8px 0;
  line-height: 1.25;
  text-align: left;
}
.sub-heading { font-size: 1.15rem; font-weight: 600; color: #1a1a1a; }

.section-heading {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 8px 0;
  color: #1a1a1a;
  scroll-margin-top: 20px;
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
.total-inline { color: #1a1a1a; }

.data-card {
  background-color: #f2f2ed;
  border-radius: 20px;
  padding: 36px 40px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.02);
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.filter-row { display: flex; gap: 12px; margin-bottom: 18px; flex-wrap: wrap; }

.dropdown-select {
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background-color: #ffffff;
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 0.85rem;
  outline: none;
  cursor: pointer;
}

.tabs-header {
  display: flex;
  gap: 32px;
  border-bottom: 2px solid #e2e2dc;
  padding-bottom: 12px;
  margin-bottom: 28px;
}

.tab-item {
  background: none;
  border: none;
  font-family: 'Poppins', sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  color: #333333;
  cursor: pointer;
  padding: 0 0 6px 0;
  position: relative;
}
.tab-item.active { color: var(--bidang-accent, #2e7d32); }
.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: -14px;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: var(--bidang-accent, #2e7d32);
  border-radius: 2px;
}

.state-info {
  font-size: 0.95rem;
  font-weight: 600;
  color: #666;
  text-align: center;
  padding: 40px 0;
}
.state-info.error { color: #d32f2f; }

.btn-retry {
  margin-top: 16px;
  padding: 10px 24px;
  background-color: var(--bidang-accent, #2e7d32);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
}
.btn-retry:hover { background-color: #1b5e20; }

.chart-content-grid {
  display: grid;
  grid-template-columns: 1.05fr 1.35fr;
  gap: 32px;
  align-items: flex-start;
  width: 100%;
}
.chart-content-grid > * { min-width: 0; }
.chart-left { display: flex; flex-direction: column; width: 100%; min-width: 0; }

.bar-chart-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 25px 20px 15px 15px;
  box-shadow: inset 0 0 0 1px #e5e5e0;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.chart-grid-wrapper { display: flex; gap: 10px; height: 320px; width: 100%; min-width: 0; }

.y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 0.75rem;
  font-weight: 600;
  color: #666666;
  padding-bottom: 75px;
  text-align: right;
  min-width: 40px;
  flex-shrink: 0;
}

.chart-area-scrollable {
  position: relative;
  flex: 1;
  min-width: 0;
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 5px;
}
.chart-area-scrollable::-webkit-scrollbar { height: 5px; }
.chart-area-scrollable::-webkit-scrollbar-thumb { background: #ccc; border-radius: 4px; }

.chart-area-inner { position: relative; height: 100%; transition: min-width 0.3s ease; }

.grid-lines {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 75px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  pointer-events: none;
}
.grid-line { border-bottom: 1px dashed #e2e2e2; width: 100%; }

.bars-container {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
}

.bar-col { display: flex; flex-direction: column; align-items: center; height: 100%; flex: 1; min-width: 42px; }
.bar-track { height: calc(100% - 75px); width: 100%; display: flex; align-items: flex-end; justify-content: center; }
.bar-fill {
  width: 65%;
  max-width: 32px;
  background-color: var(--bidang-chart, #8070ff);
  border-radius: 4px 4px 0 0;
  position: relative;
  display: flex;
  justify-content: center;
  transition: height 0.3s ease;
}
.bar-val-badge {
  position: absolute;
  top: -22px;
  font-size: 0.7rem;
  font-weight: 800;
  color: #1a1a1a;
  white-space: nowrap;
}
.bar-x-label-wrapper {
  height: 75px;
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 8px;
}
.bar-x-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: #444444;
  white-space: nowrap;
  transform: rotate(-35deg);
  transform-origin: top left;
  display: inline-block;
  line-height: 1.4;
}

.bar-legend { display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 15px; }
.legend-square { width: 12px; height: 12px; background-color: var(--bidang-chart, #8070ff); }
.legend-text { font-size: 0.85rem; font-weight: 600; color: #555555; }

.chart-right.cards-paged {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 22px;
  width: 100%;
  min-width: 0;
  align-content: start;
}

.cards-scroll-section { width: 100%; min-width: 0; }
.cards-scroll-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}
.scroll-hint { font-size: 0.8rem; font-weight: 600; color: #77776f; }
.scroll-nav { display: flex; gap: 8px; }
.scroll-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid #d5d5cd;
  background: #ffffff;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  line-height: 1;
  transition: all 0.2s ease;
}
.scroll-btn:hover:not(:disabled) { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }
.scroll-btn:disabled { opacity: 0.35; cursor: not-allowed; }

.page-dots { display: flex; justify-content: center; gap: 8px; margin-top: 14px; }
.page-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #d5d5cd;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
}
.page-dot.active { background: var(--bidang-accent, #2e7d32); transform: scale(1.25); }

.stat-card-framed {
  background-color: #ffffff;
  border: 1px solid #e1e1db;
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.stat-card-framed:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.06); }

/* Pie chart (Jenis Kelamin) */
.pie-chart-left { width: 100%; min-width: 0; }
.pie-chart-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 28px 24px 22px 24px;
  box-shadow: inset 0 0 0 1px #e5e5e0;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.donut-wrapper { width: 280px; height: 280px; margin-bottom: 20px; }
.donut-svg { width: 100%; height: 100%; overflow: visible; }
.pie-legend { display: flex; flex-direction: column; gap: 10px; width: 100%; align-items: flex-start; }
.pie-legend-item { display: flex; align-items: center; gap: 10px; }
.pie-legend-item .dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
.pie-legend-item .legend-text { font-size: 0.88rem; font-weight: 500; color: #444444; }

.year-badge {
  display: inline-block;
  align-self: flex-start;
  background-color: var(--bidang-badge-bg, #fff8f0);
  color: var(--bidang-badge-text, #ff6f00);
  font-size: 0.7rem;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 6px;
  margin-bottom: 6px;
}

.stat-title { font-size: 0.95rem; font-weight: 700; color: #1a1a1a; margin: 0 0 10px 0; line-height: 1.4; text-align: left; }

.card-inner-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  background: #f8f8f5;
  border-radius: 8px;
  padding: 8px 10px;
  border: 1px solid #eaeae3;
}
.inner-col { display: flex; flex-direction: column; justify-content: center; }
.inner-col.highlight-col { border-left: 1px dashed #d5d5cd; padding-left: 10px; }
.col-label { font-size: 0.72rem; font-weight: 600; color: #666666; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.3px; }
.col-value { font-size: 1rem; font-weight: 800; color: #1a1a1a; line-height: 1.3; }
.col-value.percent-text { color: #1a1a1a; }

@media (max-width: 992px) {
  .navbar { padding: 20px 30px; }
  .content-wrapper { padding: 10px 20px 40px 20px; }
  .chart-content-grid { grid-template-columns: 1fr; gap: 24px; }
  .donut-wrapper { width: 250px; height: 250px; }
}

@media (max-width: 768px) {
  .navbar { padding: 16px 20px; }
  .logo { height: 40px; }
  .menu-toggle { display: block; }
  .nav-links {
    display: none;
    flex-direction: column;
    position: absolute;
    top: 100%; left: 0; right: 0;
    background-color: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(8px);
    padding: 20px;
    gap: 16px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
    border-bottom: 1px solid #e2e2dc;
  }
  .nav-links.nav-active { display: flex; }
  .login-btn { margin-left: 0; width: 100%; justify-content: center; box-sizing: border-box; }
  .top-nav-bar { flex-wrap: wrap; gap: 12px; }
  .main-heading { font-size: 1.8rem; }
  .sub-heading { font-size: 0.95rem; }
  .data-card { padding: 20px 16px; border-radius: 16px; }
  .tabs-header { overflow-x: auto; white-space: nowrap; padding-bottom: 8px; margin-bottom: 20px; gap: 20px; }
  .tabs-header::-webkit-scrollbar { display: none; }
  .tab-item { flex-shrink: 0; font-size: 0.88rem; }
  .tab-item.active::after { bottom: -10px; }
  .chart-right.cards-paged { gap: 16px; }
}

@media (max-width: 480px) {
  .main-heading { font-size: 1.4rem; }
  .chart-right.cards-paged { gap: 12px; }
  .stat-card-framed { padding: 12px; }
  .col-value { font-size: 0.9rem; }
  .scroll-hint { font-size: 0.75rem; }
  .donut-wrapper { width: 230px; height: 230px; }
}
</style>
