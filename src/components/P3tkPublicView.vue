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
          <!-- PIE CHART (Pendidikan, Rentang Usia, Jenis Kelamin) -->
          <div class="chart-left pie-chart-left">
            <div class="pie-chart-card">
              <div class="donut-wrapper">
                <svg viewBox="0 0 300 300" class="donut-svg">
                  <g v-for="(slice, index) in pieSlices" :key="index">
                    <path :d="slice.pathData" :fill="slice.color" stroke="#ffffff" stroke-width="2" />
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
              <div class="pie-summary">
                <div class="highlight-box" :style="{ borderLeftColor: colorForPie(topCategory.label, originalIndexOf(topCategory.label)) }">
                  <span class="highlight-cap">Kategori Terbanyak</span>
                  <span class="highlight-value">{{ topCategory.label }} — {{ topCategory.value.toLocaleString('id-ID') }} ({{ topCategory.percent }}%)</span>
                </div>
                <div class="mini-stats">
                  <div class="mini-stat">
                    <span class="mini-num">{{ currentItems.length }}</span>
                    <span class="mini-cap">Total Kategori</span>
                  </div>
                  <div class="mini-stat">
                    <span class="mini-num">{{ periodeLabel }}</span>
                    <span class="mini-cap">Periode</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tabel rincian kanan : No | Kategori | Jumlah | Persentase -->
          <div class="table-side">
            <div class="table-card">
              <div class="table-card-header">
                <h3 class="table-title">Rincian {{ legendLabel }}</h3>
                <span class="year-badge">{{ yearBadge }}</span>
              </div>
              <div class="table-scroll">
                <table class="stat-table">
                  <thead>
                    <tr>
                      <th class="text-center" style="width: 44px;">No</th>
                      <th>Kategori</th>
                      <th class="text-right">Jumlah</th>
                      <th class="text-right" style="width: 96px;">Persentase</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, i) in rightCards" :key="`${activeTab}-${i}`">
                      <td class="text-center">{{ i + 1 }}</td>
                      <td>
                        <span class="dot" :style="{ backgroundColor: colorForPie(row.label, originalIndexOf(row.label)) }"></span>
                        {{ row.label }}
                      </td>
                      <td class="text-right font-bold">{{ row.value.toLocaleString('id-ID') }}</td>
                      <td class="text-right">{{ row.percent }}%</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colspan="2" class="font-bold">Total</td>
                      <td class="text-right font-bold">{{ totalPencaker.toLocaleString('id-ID') }}</td>
                      <td class="text-right font-bold">100%</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
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
  pieFallback: ['#8070FF', '#FF7E72', '#38CDF2', '#FFA726', '#4A89DC', '#AB47BC', '#00ACC1', '#EC407A', '#9CCC65', '#FFA000', '#8D6E63', '#78909C'], // cadangan kategori lain (pendidikan, usia)
  pieTopN: 7, // pie hanya tampilkan N kategori terbesar + "Lainnya" agar terbaca
  pieOtherLabel: 'Lainnya',
  pieOtherColor: '#B0BEC5' // abu-abu untuk irisan gabungan
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
      theme: THEME
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
      return this.currentItems
        .map((item) => ({
          ...item,
          percent: total > 0 ? ((item.value / total) * 100).toFixed(1) : '0.0'
        }))
        .sort((a, b) => b.value - a.value)
    },
    // Sorotan untuk ringkasan di bawah pie (kategori dengan jumlah terbesar)
    topCategory() {
      if (!this.rightCards.length) return { label: '-', value: 0, percent: '0.0' }
      return this.rightCards[0]
    },
    periodeLabel() {
      const tahun = this.selectedTahun ? String(this.selectedTahun) : 'Semua'
      if (!this.selectedBulan) return tahun
      const b = this.bulanList.find((x) => Number(x.value) === Number(this.selectedBulan))
      return `${b ? b.label.slice(0, 3) : this.selectedBulan} ${tahun}`
    },
    // Item untuk pie: N terbesar + gabungan "Lainnya" agar pie tetap terbaca
    pieDisplayItems() {
      const sorted = [...this.currentItems].sort((a, b) => b.value - a.value)
      const topN = this.theme.pieTopN || 7
      if (sorted.length <= topN) return sorted
      const top = sorted.slice(0, topN)
      const rest = sorted.slice(topN)
      const restTotal = rest.reduce((acc, cur) => acc + (Number(cur.value) || 0), 0)
      if (restTotal > 0) {
        top.push({ label: this.theme.pieOtherLabel, value: restTotal, isOther: true })
      }
      return top
    },
    pieTotal() {
      return this.currentItems.reduce((acc, cur) => acc + (Number(cur.value) || 0), 0)
    },
    pieSlices() {
      const data = this.pieDisplayItems
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
          color: item.isOther ? this.theme.pieOtherColor : this.colorForPie(item.label, this.originalIndexOf(item.label)),
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
    colorForPie(label, index) {
      const key = String(label || '').trim().toLowerCase()
      if (key === this.theme.pieOtherLabel.toLowerCase()) return this.theme.pieOtherColor
      if (this.theme.pieByLabel[key]) return this.theme.pieByLabel[key]
      return this.theme.pieFallback[index % this.theme.pieFallback.length]
    },
    // Index label di currentItems agar warna pie & tabel selalu sama
    originalIndexOf(label) {
      const idx = this.currentItems.findIndex((i) => i.label === label)
      return idx === -1 ? 0 : idx
    },
    switchTab(tabId) {
      this.activeTab = tabId
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

.legend-text { font-size: 0.85rem; font-weight: 600; color: #555555; }

/* Tabel rincian kanan */
.table-side { width: 100%; min-width: 0; }
.table-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: inset 0 0 0 1px #e5e5e0;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.table-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 14px 18px;
  border-bottom: 1px solid #eeeee8;
}
.table-title { font-size: 0.95rem; font-weight: 700; color: #1a1a1a; margin: 0; }
.table-scroll { overflow-y: auto; max-height: 460px; }
.table-scroll::-webkit-scrollbar { width: 6px; }
.table-scroll::-webkit-scrollbar-thumb { background: #ccc; border-radius: 4px; }
.stat-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
.stat-table thead th {
  position: sticky;
  top: 0;
  background: #f8f8f5;
  color: #666666;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  text-align: left;
  padding: 10px 14px;
  border-bottom: 1px solid #e5e5e0;
  z-index: 1;
}
.stat-table tbody td {
  padding: 10px 14px;
  border-bottom: 1px solid #f1f1ec;
  color: #333333;
}
.stat-table tbody tr:hover { background: #fafaf7; }
.stat-table tfoot td {
  padding: 12px 14px;
  background: #f8f8f5;
  border-top: 2px solid #e5e5e0;
  color: #1a1a1a;
}
.stat-table .text-center { text-align: center; }
.stat-table .text-right { text-align: right; }
.stat-table .font-bold { font-weight: 700; }
.stat-table .dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 8px;
  vertical-align: baseline;
}

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
.pie-summary { display: flex; flex-direction: column; gap: 12px; width: 100%; }
.highlight-box {
  display: flex;
  flex-direction: column;
  gap: 2px;
  background: #f8f8f5;
  border: 1px solid #eaeae3;
  border-left: 5px solid #8070ff;
  border-radius: 10px;
  padding: 12px 16px;
  text-align: left;
}
.highlight-cap { font-size: 0.72rem; font-weight: 600; color: #888888; text-transform: uppercase; letter-spacing: 0.4px; }
.highlight-value { font-size: 1.05rem; font-weight: 800; color: #1a1a1a; }
.mini-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.mini-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  background: #f8f8f5;
  border: 1px solid #eaeae3;
  border-radius: 10px;
  padding: 10px 8px;
}
.mini-num { font-size: 1.1rem; font-weight: 800; color: #1a1a1a; }
.mini-cap { font-size: 0.72rem; font-weight: 600; color: #888888; text-transform: uppercase; letter-spacing: 0.4px; }

.year-badge {
  display: inline-block;
  background-color: var(--bidang-badge-bg, #fff8f0);
  color: var(--bidang-badge-text, #ff6f00);
  font-size: 0.7rem;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 6px;
}

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
  .table-scroll { max-height: 380px; }
  .stat-table { font-size: 0.8rem; }
}

@media (max-width: 480px) {
  .main-heading { font-size: 1.4rem; }
  .donut-wrapper { width: 230px; height: 230px; }
}
</style>
