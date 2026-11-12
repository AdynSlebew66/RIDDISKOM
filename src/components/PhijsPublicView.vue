<template>
  <div class="page-container">
    <!-- Header / Navbar Public -->
    <header class="navbar">
      <div class="brand" @click="navTo('/')">
        <img src="../assets/logo2.png" alt="Logo DISKOPUMKER" class="logo" />
      </div>

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
        <li class="nav-item" @click="navTo('/p3tk')">Informasi</li>
        <li class="nav-item" @click="navTo('/layanan')">Layanan</li>
        <li class="nav-item" @click="navTo('/profil/visi-misi')">Profil</li>
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

    <main class="content-wrapper">
      <!-- Breadcrumb -->
      <div class="top-nav-bar">
        <button class="btn-back" @click="goBack">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>Kembali</span>
        </button>
        <p class="breadcrumb">Layanan DISKOPUMKER \ <strong>PHIJS</strong></p>
      </div>

      <!-- Title -->
      <div class="title-section">
        <h1 class="main-heading">
          PHIJS <span class="sub-heading">Pembinaan <span class="c-blue">Hubungan Industrial</span> dan <span class="c-orange">Jaminan Sosial</span> Tenaga Kerja</span>
        </h1>
        <h2 class="section-heading">Grafik Data PHIJS</h2>
      </div>

      <div class="data-card">
        <!-- Filter -->
        <div class="filter-row">
          <select v-model="selectedTahun" class="dropdown-select" @change="onFilterChange">
            <option value="">Semua Tahun</option>
            <option v-for="t in tahunList" :key="t" :value="String(t)">{{ t }}</option>
          </select>
          <select v-model="selectedBulan" class="dropdown-select" @change="onFilterChange">
            <option value="">Semua Bulan</option>
            <option v-for="b in bulanList" :key="b.value" :value="String(b.value)">{{ b.label }}</option>
          </select>
        </div>

        <!-- Tabs -->
        <div class="tabs-header">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="tab-item"
            :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>

        <div v-if="loading" class="state-loading">
          <div class="spinner"></div>
          <p>Memuat data PHIJS...</p>
        </div>

        <div v-else-if="error" class="state-info state-error">{{ error }}</div>

        <div v-else class="content-grid">
          <!-- KIRI: Grafik + Ringkasan dalam satu kartu putih -->
          <div class="chart-column">
            <div class="chart-card">
              <div class="chart-card-head">
                <h3 class="chart-title">{{ activeTabMeta.chartTitle }}</h3>
                <div class="chart-legend">
                  <span v-for="(s, i) in chartSeries" :key="s.key" class="legend-item">
                    <span class="legend-dot" :style="{ backgroundColor: seriesColors[i % seriesColors.length] }"></span>
                    {{ s.label }}
                  </span>
                </div>
              </div>

              <div v-if="!chartGroups.length" class="state-info">Belum ada data untuk filter ini.</div>

              <div v-else class="chart-body">
                <div class="chart-y-axis">
                  <span>{{ formatNumber(chartMax) }}</span>
                  <span>{{ formatNumber(Math.round(chartMax / 2)) }}</span>
                  <span>0</span>
                </div>
                <div class="chart-bars-area">
                  <div class="chart-grid-lines">
                    <span></span><span></span><span></span>
                  </div>
                  <div class="chart-bars">
                    <div v-for="group in chartGroups" :key="group.label" class="bar-group">
                      <div class="bar-stack">
                        <div
                          v-for="(val, i) in group.values"
                          :key="i"
                          class="bar"
                          :style="{
                            height: barHeight(val) + '%',
                            backgroundColor: seriesColors[i % seriesColors.length]
                          }"
                          :title="`${chartSeries[i]?.label || ''}: ${formatNumber(val)}`"
                        ></div>
                      </div>
                      <span class="bar-label" :title="group.label">{{ group.label }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Ringkasan (masih di dalam kartu putih) -->
              <div class="summary-grid">
                <div class="summary-box">
                  <span class="summary-cap">Total Perusahaan</span>
                  <span class="summary-value">{{ formatNumber(totalPerusahaan) }}</span>
                </div>
                <div class="summary-box summary-box-alt">
                  <span class="summary-cap">Total Tenaga Kerja</span>
                  <span class="summary-value">{{ formatNumber(totalTenagaKerja) }}</span>
                  <span class="summary-period">{{ periodeLabel }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- KANAN: Rincian yang bisa di-scroll -->
          <div class="side-column">
            <div class="side-scroll">
              <div class="side-head">
                <h3 class="side-title">Rincian</h3>
                <span v-if="periodBadge" class="year-badge">{{ periodBadge }}</span>
              </div>

              <div v-for="card in sideCards" :key="card.key" class="mini-card">
                <div class="mini-card-head">
                  <h4>
                    Kategori <span class="head-accent">{{ card.accent }}</span>
                  </h4>
                </div>
                <div class="mini-table-wrap">
                  <table class="mini-table">
                    <thead>
                      <tr>
                        <th class="col-no">NO</th>
                        <th>{{ card.head }}</th>
                        <th class="text-right">Jumlah</th>
                        <th class="text-right">Persentase</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(row, i) in card.rows" :key="i">
                        <td class="col-no">{{ i + 1 }}</td>
                        <td :title="row.label">{{ row.label }}</td>
                        <td class="text-right font-bold">{{ formatNumber(row.value) }}</td>
                        <td class="text-right">{{ row.percent }}%</td>
                      </tr>
                      <tr v-if="!card.rows.length">
                        <td colspan="4" class="empty-cell">Belum ada data.</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <td></td>
                        <td class="font-bold">Total</td>
                        <td class="text-right font-bold">{{ formatNumber(card.total) }}</td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
const API_BASE = 'https://harvest-protegee-symptom.ngrok-free.dev/api/statistik/data-phi-js'
const API_PERIODE = `${API_BASE}/periode`
const API_TENAGA_KERJA = `${API_BASE}/tenaga-kerja`
const API_KLASIFIKASI = `${API_BASE}/klasifikasi`
const API_HUBUNGAN = `${API_BASE}/hubungan-industrial`

const HEADERS = {
  'ngrok-skip-browser-warning': 'true',
  Accept: 'application/json'
}

const BULAN_NAMA = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]

export default {
  name: 'PhijsPublicView',
  data() {
    return {
      isMenuOpen: false,
      loading: false,
      error: '',
      activeTab: 'tenaga_kerja',
      tabs: [
        { id: 'tenaga_kerja', label: 'Tenaga Kerja', chartTitle: 'Tenaga Kerja per Kecamatan' },
        { id: 'hubungan_industrial', label: 'Hubungan Industrial', chartTitle: 'PP & PKB per Kecamatan' },
        { id: 'klasifikasi', label: 'Klasifikasi', chartTitle: 'Klasifikasi Usaha per Kecamatan' },
        { id: 'disabilitas', label: 'Disabilitas', chartTitle: 'Tenaga Kerja Disabilitas per Kecamatan' }
      ],
      seriesColors: ['#4E9F6B', '#F08A5D', '#5B8DEF', '#B36FD6', '#F2C14E'],
      sideAccent: {
        jenis_kelamin: 'Jenis Kelamin',
        tka: 'TKA',
        disabilitas: 'Disabilitas',
        pkwtt: 'PKWTT',
        pkwt: 'PKWT'
      },
      periodeList: [],
      selectedTahun: '',
      selectedBulan: '',
      statistik: {},
      tenagaKerja: {},
      klasifikasi: {},
      hubungan: {}
    }
  },
  computed: {
    activeTabMeta() {
      return this.tabs.find((t) => t.id === this.activeTab) || this.tabs[0]
    },
    tahunList() {
      return [...new Set(this.periodeList.map((p) => Number(p.tahun)).filter(Boolean))].sort((a, b) => b - a)
    },
    bulanList() {
      const filtered = this.selectedTahun
        ? this.periodeList.filter((p) => String(p.tahun) === String(this.selectedTahun))
        : this.periodeList
      const seen = new Set()
      return filtered
        .filter((p) => {
          if (seen.has(p.bulan)) return false
          seen.add(p.bulan)
          return true
        })
        .map((p) => ({ value: p.bulan, label: p.nama_bulan || BULAN_NAMA[p.bulan - 1] || `Bulan ${p.bulan}` }))
        .sort((a, b) => a.value - b.value)
    },
    periodeLabel() {
      if (this.selectedTahun && this.selectedBulan) {
        return `${this.bulanList.find((b) => String(b.value) === String(this.selectedBulan))?.label || ''} ${this.selectedTahun}`.trim()
      }
      if (this.selectedTahun) return String(this.selectedTahun)
      return 'Semua Periode'
    },
    totalPerusahaan() {
      return Number(this.statistik.total_perusahaan) || 0
    },
    totalTenagaKerja() {
      return Number(this.statistik.tenaga_kerja?.total_tk) || 0
    },
    periodBadge() {
      if (this.selectedTahun) return String(this.selectedTahun)
      const byTahun = this.statistik.by_tahun
      if (Array.isArray(byTahun) && byTahun.length === 1) return String(byTahun[0].tahun)
      return this.periodeList[0]?.tahun ? String(this.periodeList[0].tahun) : ''
    },
    perKecamatan() {
      return Array.isArray(this.tenagaKerja.per_kecamatan) ? this.tenagaKerja.per_kecamatan : []
    },
    chartSeries() {
      switch (this.activeTab) {
        case 'hubungan_industrial':
          return [{ key: 'pp', label: 'PP' }, { key: 'pkb', label: 'PKB' }]
        case 'klasifikasi':
          return [
            { key: 'Besar', label: 'Besar' },
            { key: 'Menengah', label: 'Menengah' },
            { key: 'Kecil', label: 'Kecil' },
            { key: 'Mikro', label: 'Mikro' }
          ]
        case 'disabilitas':
          return [{ key: 'disabilitas_pria', label: 'Laki-laki' }, { key: 'disabilitas_wanita', label: 'Perempuan' }]
        default:
          return [{ key: 'pria', label: 'Laki-laki' }, { key: 'wanita', label: 'Perempuan' }]
      }
    },
    chartGroups() {
      if (this.activeTab === 'hubungan_industrial') {
        const rows = Array.isArray(this.hubungan.per_kecamatan) ? this.hubungan.per_kecamatan : []
        return rows.map((r) => ({ label: r.kecamatan, values: [Number(r.pp) || 0, Number(r.pkb) || 0] }))
      }
      if (this.activeTab === 'klasifikasi') {
        const rows = Array.isArray(this.klasifikasi.per_kecamatan) ? this.klasifikasi.per_kecamatan : []
        const keys = this.chartSeries.map((s) => s.key)
        return rows.map((r) => {
          const rincian = Array.isArray(r.rincian) ? r.rincian : []
          return {
            label: r.kecamatan,
            values: keys.map((k) => Number(rincian.find((x) => x.klasifikasi === k)?.total) || 0)
          }
        })
      }
      return this.perKecamatan.map((r) => ({
        label: r.kecamatan,
        values: this.chartSeries.map((s) => Number(r[s.key]) || 0)
      }))
    },
    chartMax() {
      const all = this.chartGroups.flatMap((g) => g.values)
      const max = Math.max(1, ...all)
      return max
    },
    sideCards() {
      const tk = this.tenagaKerja.total || this.statistik.tenaga_kerja || {}
      const num = (v) => Number(v) || 0

      const buildPair = (key, priaVal, wanitaVal) => {
        const total = priaVal + wanitaVal
        return {
          key,
          accent: this.sideAccent[key] || 'Jenis Kelamin',
          head: 'Kategori',
          total,
          rows: [
            { label: 'Laki-Laki', value: priaVal, percent: this.pct(priaVal, total) },
            { label: 'Perempuan', value: wanitaVal, percent: this.pct(wanitaVal, total) }
          ]
        }
      }

      const cards = [
        buildPair('jenis_kelamin', num(tk.pria), num(tk.wanita)),
        buildPair('tka', num(tk.tka_pria), num(tk.tka_wanita)),
        buildPair('disabilitas', num(tk.disabilitas_pria), num(tk.disabilitas_wanita)),
        buildPair('pkwtt', num(tk.pkwtt_pria), num(tk.pkwtt_wanita)),
        buildPair('pkwt', num(tk.pkwt_pria), num(tk.pkwt_wanita))
      ]

      // Klasifikasi usaha
      const klasifikasiRows = Array.isArray(this.statistik.by_klasifikasi) ? this.statistik.by_klasifikasi : []
      const klasTotal = klasifikasiRows.reduce((sum, r) => sum + num(r.total), 0)
      cards.push({
        key: 'klasifikasi',
        accent: 'Klasifikasi Usaha',
        head: 'Kategori',
        total: klasTotal,
        rows: klasifikasiRows.map((r) => ({
          label: r.klasifikasi || '-',
          value: num(r.total),
          percent: this.pct(num(r.total), klasTotal)
        }))
      })

      // Hubungan industrial
      const hi = this.hubungan.total || this.statistik.hubungan_industrial || {}
      const hiTotal = num(hi.pp) + num(hi.pkb)
      cards.push({
        key: 'hubungan_industrial',
        accent: 'Hubungan Industrial',
        head: 'Kategori',
        total: hiTotal,
        rows: [
          { label: 'PP', value: num(hi.pp), percent: this.pct(num(hi.pp), hiTotal) },
          { label: 'PKB', value: num(hi.pkb), percent: this.pct(num(hi.pkb), hiTotal) }
        ]
      })

      return cards
    }
  },
  mounted() {
    this.fetchPeriode()
    this.fetchStatistik()
  },
  methods: {
    navTo(path) {
      this.$router.push(path)
    },
    goBack() {
      if (window.history.length > 1) this.$router.back()
      else this.$router.push('/')
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen
    },
    formatNumber(val) {
      return (Number(val) || 0).toLocaleString('id-ID')
    },
    barHeight(val) {
      if (!this.chartMax) return 0
      return Math.max(2, (Number(val) || 0) / this.chartMax * 100)
    },
    pct(value, total) {
      if (!total) return '0.0'
      return (value / total * 100).toFixed(1)
    },
    buildQuery() {
      const params = new URLSearchParams()
      if (this.selectedTahun) params.append('tahun', this.selectedTahun)
      if (this.selectedBulan) params.append('bulan', this.selectedBulan)
      const q = params.toString()
      return q ? `?${q}` : ''
    },
    onFilterChange() {
      // Reset bulan bila tidak tersedia pada tahun terpilih
      if (this.selectedBulan && !this.bulanList.some((b) => String(b.value) === String(this.selectedBulan))) {
        this.selectedBulan = ''
      }
      this.fetchStatistik()
    },
    async fetchPeriode() {
      try {
        const res = await fetch(API_PERIODE, { headers: HEADERS })
        const json = await res.json().catch(() => ({}))
        if (Array.isArray(json.data)) this.periodeList = json.data
      } catch (e) {
        console.error('[PHIJS] gagal ambil periode:', e)
      }
    },
    async fetchStatistik() {
      this.loading = true
      this.error = ''
      const query = this.buildQuery()
      try {
        const [main, tk, klas, hi] = await Promise.all([
          fetch(`${API_BASE}${query}`, { headers: HEADERS }).then((r) => r.json()),
          fetch(`${API_TENAGA_KERJA}${query}`, { headers: HEADERS }).then((r) => r.json()).catch(() => ({})),
          fetch(`${API_KLASIFIKASI}${query}`, { headers: HEADERS }).then((r) => r.json()).catch(() => ({})),
          fetch(`${API_HUBUNGAN}${query}`, { headers: HEADERS }).then((r) => r.json()).catch(() => ({}))
        ])
        this.statistik = main.data || {}
        this.tenagaKerja = tk.data || {}
        this.klasifikasi = klas.data || {}
        this.hubungan = hi.data || {}
      } catch (e) {
        console.error('[PHIJS] gagal ambil statistik:', e)
        this.error = 'Gagal memuat data PHIJS. Silakan coba lagi.'
      } finally {
        this.loading = false
      }
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
  flex-direction: column;
  overflow-x: hidden;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 60px;
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  white-space: nowrap;
}
.btn-back:hover { background-color: #1a1a1a; color: #ffffff; border-color: #1a1a1a; }

.breadcrumb { font-size: 0.85rem; color: #666666; margin: 0; font-weight: 500; }

.title-section { margin-bottom: 24px; }

.main-heading {
  font-size: 2.2rem;
  font-weight: 800;
  margin: 0 0 8px 0;
  line-height: 1.25;
}
.sub-heading { font-size: 1.05rem; font-weight: 600; color: #1a1a1a; }
.sub-heading .c-blue { color: #2563eb; }
.sub-heading .c-orange { color: #f59e0b; }

.section-heading {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 8px 0 0 0;
  color: #1a1a1a;
}

.data-card {
  background-color: #f2f2ed;
  border-radius: 20px;
  padding: 28px 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  width: 100%;
  box-sizing: border-box;
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
  flex-wrap: wrap;
  row-gap: 12px;
  border-bottom: 2px solid #e2e2dc;
  padding-bottom: 12px;
  margin-bottom: 24px;
}

.tab-item {
  background: none;
  border: none;
  font-family: 'Poppins', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  color: #6b6b6b;
  cursor: pointer;
  padding: 0 0 4px 0;
  position: relative;
  white-space: nowrap;
  transition: color 0.2s ease;
}
.tab-item:hover { color: #1a1a1a; }
.tab-item.active { color: #2e7d32; font-weight: 700; }
.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: -14px;
  left: 0;
  width: 100%;
  height: 3px;
  border-radius: 3px;
  background-color: #2e7d32;
}

.content-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr);
  gap: 22px;
  align-items: start;
}

/* ===== Kiri: grafik ===== */
.chart-column { display: flex; flex-direction: column; gap: 18px; min-width: 0; }

.chart-card {
  background-color: #ffffff;
  border-radius: 14px;
  padding: 20px 22px 18px 22px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
}

.chart-card-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 18px;
}

.chart-title {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 700;
  color: #1a1a1a;
}

.chart-legend { display: flex; gap: 14px; flex-wrap: wrap; }

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.7rem;
  font-weight: 700;
  color: #6b6b6b;
}

.legend-dot { width: 9px; height: 9px; border-radius: 2px; }

.chart-body {
  display: flex;
  gap: 10px;
  min-height: 290px;
}

.chart-y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 0.68rem;
  font-weight: 600;
  color: #9a9a9a;
  padding-bottom: 46px;
  min-width: 46px;
  text-align: right;
}

.chart-bars-area { position: relative; flex: 1; min-width: 0; }

.chart-grid-lines {
  position: absolute;
  inset: 0 0 46px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  pointer-events: none;
}
.chart-grid-lines span { border-top: 1px dashed #ececec; }

.chart-bars {
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  gap: 12px;
  height: 290px;
  padding-bottom: 46px;
  box-sizing: border-box;
}

.bar-group {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.bar-stack {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 4px;
}

.bar {
  width: 40%;
  max-width: 22px;
  min-width: 6px;
  border-radius: 4px 4px 0 0;
  transition: height 0.4s ease;
}

.bar-label {
  margin-top: 8px;
  font-size: 0.66rem;
  font-weight: 600;
  color: #7a7a7a;
  text-align: center;
  line-height: 1.25;
  word-break: break-word;
  overflow-wrap: break-word;
}

.summary-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-top: 22px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.summary-box {
  background-color: #eef6ef;
  border-left: 4px solid #2e7d32;
  border-radius: 10px;
  padding: 14px 18px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.summary-box-alt { background-color: #fdf1e7; border-left-color: #f59e0b; }

.summary-cap { font-size: 0.72rem; font-weight: 700; color: #6b6b6b; }
.summary-value { font-size: 1.5rem; font-weight: 800; color: #1a1a1a; }
.summary-period { font-size: 0.7rem; font-weight: 600; color: #9a9a9a; }

/* ===== Kanan: kotak tabel scroll ===== */
.side-column { min-width: 0; }

.side-scroll {
  max-height: 640px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-right: 6px;
}

.side-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 2px 2px 0 2px;
}

.side-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 800;
  color: #1a1a1a;
}

.side-scroll::-webkit-scrollbar { width: 8px; }
.side-scroll::-webkit-scrollbar-track { background: #ececE6; border-radius: 8px; }
.side-scroll::-webkit-scrollbar-thumb { background: #c4c4bb; border-radius: 8px; }
.side-scroll::-webkit-scrollbar-thumb:hover { background: #a8a89f; }

.mini-card {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  overflow: hidden;
  flex-shrink: 0;
}

.mini-card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.mini-card-head h4 {
  margin: 0;
  font-size: 0.8rem;
  font-weight: 700;
  color: #1a1a1a;
}

.head-accent { color: #e07b1f; }

.year-badge {
  background-color: #fff3e6;
  color: #e07b1f;
  font-size: 0.68rem;
  font-weight: 800;
  padding: 2px 9px;
  border-radius: 20px;
  white-space: nowrap;
}

.mini-table-wrap { overflow-x: auto; }

.mini-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.74rem;
}

.mini-table thead th {
  text-align: left;
  padding: 8px 12px;
  font-size: 0.66rem;
  font-weight: 700;
  color: #8a8a8a;
  background-color: #fafafa;
  white-space: nowrap;
}

.mini-table .col-no {
  width: 34px;
  text-align: center;
  color: #8a8a8a;
  font-weight: 600;
}

.mini-table tbody td {
  padding: 7px 12px;
  border-bottom: 1px solid #f5f5f5;
  color: #3a3a3a;
  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mini-table tfoot td {
  padding: 8px 12px;
  background-color: #fafafa;
  font-size: 0.72rem;
  color: #1a1a1a;
}

.text-right { text-align: right; }
.font-bold { font-weight: 700; }
.empty-cell { text-align: center; color: #a0a0a0; padding: 14px 12px !important; }

/* States */
.state-loading {
  text-align: center;
  padding: 60px 20px;
  color: #666666;
  font-size: 0.9rem;
  font-weight: 600;
}

.spinner {
  width: 36px;
  height: 36px;
  margin: 0 auto 12px auto;
  border: 4px solid #e2e2dc;
  border-top: 4px solid #2e7d32;
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.state-info {
  text-align: center;
  padding: 36px 16px;
  color: #8a8a8a;
  font-size: 0.88rem;
  font-weight: 600;
}

.state-error { color: #c0392b; }

@media (max-width: 1024px) {
  .content-grid { grid-template-columns: 1fr; }
  .side-scroll { max-height: 520px; }
}

@media (max-width: 768px) {
  .navbar { padding: 16px 20px; }
  .menu-toggle { display: block; }
  .logo { height: 42px; }

  .nav-links {
    display: none;
    position: absolute;
    top: 70px;
    left: 16px;
    right: 16px;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    background-color: #ffffff;
    border-radius: 12px;
    padding: 8px 0;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    z-index: 100;
  }
  .nav-links.nav-active { display: flex; }
  .nav-item { padding: 12px 20px; }
  .login-btn { margin: 8px 16px; justify-content: center; }

  .content-wrapper { padding: 8px 16px 44px 16px; }
  .main-heading { font-size: 1.6rem; }
  .sub-heading { font-size: 0.9rem; }
  .data-card { padding: 20px 16px; border-radius: 16px; }

  .tabs-header { gap: 18px; overflow-x: auto; flex-wrap: nowrap; }
  .tab-item { flex-shrink: 0; }
  .tab-item.active::after { bottom: -10px; }

  .chart-body { min-height: 220px; }
  .chart-bars { height: 220px; }
  .summary-grid { grid-template-columns: 1fr; }
  .side-scroll { max-height: 460px; }
}
</style>