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
      
      <ul class="nav-links" :class="{ 'nav-active': isMenuOpen }">
        <li class="nav-item" @click="navTo('/')">Beranda</li>
        <li class="nav-item" @click="handleScrollGrafik">Grafik</li>
        <li class="nav-item" @click="navTo('/layanan')">Layanan</li>
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

    <!-- Content Area -->
    <main class="content-wrapper">
      <!-- Breadcrumb & Title -->
      <div class="title-section">
        <p class="breadcrumb">Layanan DISKOPUMKER \ <strong>UMKM</strong></p>
        <h1 class="main-heading">
          UMKM <span class="sub-heading">Usaha <span class="highlight-blue">Mikro</span>, <span class="highlight-green">Kecil</span>, dan <span class="highlight-orange">Menengah</span></span>
        </h1>
        <h2 ref="grafikSection" class="section-heading">Grafik Data UMKM</h2>
      </div>

      <!-- Main Data Card -->
      <div class="data-card">
        <!-- Sub Nav Tabs -->
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

        <!-- Filter Dropdown Khusus Tab Kelurahan -->
        <div v-if="activeTab === 'kelurahan'" class="filter-container">
          <select v-model="selectedKecamatan" class="dropdown-select">
            <option v-for="item in wilayahRaw" :key="item.kecamatan" :value="item.kecamatan">
              {{ item.kecamatan }}
            </option>
          </select>
        </div>

        <!-- Loading / Error State -->
        <div v-if="loading" class="state-info">Memuat data statistik...</div>
        <div v-else-if="error" class="state-info error">{{ error }}</div>

        <!-- TAB CONTENT -->
        <div v-else class="chart-content-grid">
          
          <!-- TAB DOUGHNUT / PIE CHART -->
          <template v-if="activeTab === 'sektor' || activeTab === 'tenaga-kerja' || activeTab === 'kecamatan'">
            <div class="chart-left">
              <div class="chart-container">
                <div class="donut-wrapper">
                  <svg viewBox="0 0 300 300" class="donut-svg">
                    <g v-for="(slice, index) in donutSlices" :key="index">
                      <path :d="slice.pathData" :fill="slice.color" stroke="#f2f2ed" stroke-width="3" />
                      <text
                        v-if="slice.showText"
                        :x="slice.tx"
                        :y="slice.ty - 4"
                        text-anchor="middle"
                        fill="#ffffff"
                        font-size="10"
                        font-weight="700"
                      >
                        {{ slice.value.toLocaleString('id-ID') }}
                      </text>
                      <text
                        v-if="slice.showText"
                        :x="slice.tx"
                        :y="slice.ty + 8"
                        text-anchor="middle"
                        fill="#ffffff"
                        font-size="9"
                        font-weight="600"
                      >
                        {{ slice.percent }}%
                      </text>
                    </g>
                    <circle cx="150" cy="150" r="55" fill="#f2f2ed" />
                    <text x="150" y="155" text-anchor="middle" fill="#1a1a1a" font-size="16" font-weight="800">
                      {{ doughnutTotal.toLocaleString('id-ID') }}
                    </text>
                  </svg>
                </div>

                <div class="legend-container">
                  <div v-for="(item, index) in doughnutData" :key="index" class="legend-item">
                    <span class="dot" :style="{ backgroundColor: getColor(index) }"></span>
                    <span class="legend-label">{{ item.label }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="chart-right grid-2-col">
              <div v-for="item in doughnutCardData" :key="item.label" class="stat-card-framed">
                <h3 class="stat-title">{{ item.label }}</h3>
                <div class="card-inner-grid">
                  <div class="inner-col">
                    <span class="col-label">Jumlah</span>
                    <span class="col-value">{{ item.value.toLocaleString('id-ID') }}</span>
                  </div>
                  <div class="inner-col highlight-col">
                    <span class="col-label">Persentase</span>
                    <span class="col-value percent-text">{{ item.percent }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- TAB BAR CHART (Kelurahan) -->
          <template v-else-if="activeTab === 'kelurahan'">
            <div class="chart-left bar-chart-left">
              <div class="bar-chart-card">
                <div class="chart-grid-wrapper">
                  <div class="y-axis">
                    <span>3000</span>
                    <span>2500</span>
                    <span>2000</span>
                    <span>1500</span>
                    <span>1000</span>
                    <span>500</span>
                    <span>0</span>
                  </div>

                  <div class="chart-area-scrollable">
                    <div class="chart-area-inner" :style="{ minWidth: chartInnerWidth }">
                      <div class="grid-lines">
                        <div class="grid-line" v-for="n in 7" :key="n"></div>
                      </div>

                      <div class="bars-container">
                        <div v-for="(item, idx) in currentBarData" :key="idx" class="bar-col">
                          <div class="bar-track">
                            <div class="bar-fill" :style="{ height: getBarHeightPercent(item.value, 3000) + '%' }">
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
                  <span class="legend-text">Total UMKM Per Kelurahan</span>
                </div>
              </div>
            </div>

            <div class="chart-right grid-2-col">
              <div v-for="(card, i) in kelurahanRightCards" :key="i" class="stat-card-framed">
                <h3 class="stat-title">{{ card.title }}</h3>
                <div class="card-inner-grid">
                  <div class="inner-col">
                    <span class="col-label">Jumlah</span>
                    <span class="col-value">{{ Number(card.value).toLocaleString('id-ID') }}</span>
                  </div>
                  <div class="inner-col highlight-col">
                    <span class="col-label">Porsi Kel.</span>
                    <span class="col-value percent-text">{{ card.percent }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- TAB LINE CHART (Rasio Kewirausahaan) -->
          <template v-else-if="activeTab === 'rasio-kewirausahaan'">
            <div class="chart-left line-chart-left">
              <div class="line-chart-card">
                <div class="chart-grid-wrapper">
                  <div class="y-axis">
                    <span v-for="(tick, tIdx) in rasioYAxis.ticks" :key="tIdx">{{ tick }}</span>
                  </div>

                  <div class="chart-area line-area">
                    <div class="grid-lines">
                      <div class="grid-line" v-for="n in rasioYAxis.ticks.length" :key="n"></div>
                    </div>

                    <svg class="line-svg" viewBox="0 0 400 200" preserveAspectRatio="none">
                      <polyline
                        fill="none"
                        stroke="#9f8eff"
                        stroke-width="2.5"
                        :points="rasioPolylinePoints"
                      />
                      <g v-for="(pt, idx) in rasioGraphPoints" :key="idx">
                        <circle
                          :cx="pt.x"
                          :cy="pt.y"
                          r="5"
                          fill="#ffffff"
                          stroke="#9f8eff"
                          stroke-width="2.5"
                        />
                        <text
                          :x="pt.x"
                          :y="pt.y - 10"
                          text-anchor="middle"
                          fill="#1a1a1a"
                          font-size="11"
                          font-weight="700"
                        >
                          {{ pt.rasio_format }}
                        </text>
                      </g>
                    </svg>

                    <div class="x-axis-container">
                      <span
                        v-for="(pt, idx) in rasioGraphPoints"
                        :key="idx"
                        class="x-label-item"
                        :style="{ left: pt.xPercent + '%' }"
                      >
                        {{ pt.tahun }}
                      </span>
                    </div>
                  </div>
                </div>

                <div class="line-legend">
                  <span class="legend-line-dot"></span>
                  <span class="legend-text">Rasio_Kewirausahaan</span>
                </div>
              </div>

              <p class="footnote-text">
                *Rasio Kewirausahaan adalah perbandingan antara jumlah penduduk atau populasi yang berwirausaha dengan total jumlah angkatan kerja dalam suatu negara atau wilayah pada tahun yang sama
              </p>
            </div>

            <div class="chart-right grid-2-col">
              <div v-for="item in sortedRasioData" :key="item.tahun" class="stat-card-framed year-card">
                <div class="card-header-year">
                  <span class="year-badge">{{ item.tahun }}</span>
                </div>
                <h3 class="stat-title">Rasio Kewirausahaan</h3>
                <div class="card-inner-grid">
                  <div class="inner-col">
                    <span class="col-label">Rasio</span>
                    <span class="col-value">{{ item.rasio_format || `${item.rasio}%` }}</span>
                  </div>
                  <div class="inner-col highlight-col">
                    <span class="col-label">Pertumbuhan</span>
                    <div v-if="item.growth_percentage !== undefined && item.growth_percentage !== 0" 
                         class="elevation-badge" 
                         :class="item.growth_percentage >= 0 ? 'up' : 'down'">
                      <span class="arrow">{{ item.growth_percentage >= 0 ? '▲' : '▼' }}</span>
                      <span class="percent">{{ Math.abs(item.growth_percentage) }}%</span>
                    </div>
                    <span v-else class="col-value percent-text">-</span>
                  </div>
                </div>
              </div>
            </div>
          </template>

        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'UmkmPublicView',
  data() {
    return {
      isMenuOpen: false,
      activeTab: 'sektor',
      tabs: [
        { id: 'sektor', label: 'Sektor Usaha' },
        { id: 'kelurahan', label: 'Kelurahan' },
        { id: 'kecamatan', label: 'Kecamatan' },
        { id: 'tenaga-kerja', label: 'Penyerapan Tenaga kerja' },
        { id: 'rasio-kewirausahaan', label: 'Rasio Kewirausahaan' }
      ],

      sektorRaw: [],
      wilayahRaw: [],
      tenagaKerjaRaw: {
        total_keseluruhan: 0,
        grafik_kecamatan: []
      },
      rasioRaw: [],

      selectedKecamatan: '',
      loading: false,
      error: null,

      colors: [
        '#8070FF', '#FF7E72', '#38CDF2', '#FFA726', '#4A89DC',
        '#9C27B0', '#FF9800', '#00BCD4', '#E91E63', '#8BC34A'
      ]
    }
  },
  computed: {
    selectedKecamatanData() {
      return this.wilayahRaw.find(item => item.kecamatan === this.selectedKecamatan) || null
    },

    currentBarData() {
      if (this.activeTab === 'kelurahan') {
        if (!this.selectedKecamatanData) return []
        return this.selectedKecamatanData.kelurahanList.map(item => ({
          label: item.nama,
          value: item.total
        }))
      }
      return []
    },

    chartInnerWidth() {
      const itemCount = this.currentBarData.length
      if (itemCount <= 6) return '100%'
      return `${itemCount * 48}px`
    },

    doughnutData() {
      if (this.activeTab === 'sektor') {
        return this.sektorRaw.map(item => ({
          label: `Sektor ${item.nama}`,
          value: Number(item.total) || 0
        }))
      }

      if (this.activeTab === 'kecamatan') {
        return this.wilayahRaw.map(item => ({
          label: (!item.kecamatan || item.kecamatan === '-') ? 'Lainnya' : item.kecamatan,
          value: Number(item.total) || 0
        }))
      }

      if (this.activeTab === 'tenaga-kerja') {
        const list = this.tenagaKerjaRaw?.grafik_kecamatan || []
        return list.map(item => ({
          label: (!item.kecamatan || item.kecamatan === '-') ? 'Lainnya' : item.kecamatan,
          value: Number(item.total_tenaga_kerja) || 0
        }))
      }

      return []
    },

    doughnutTotal() {
      if (this.activeTab === 'tenaga-kerja' && this.tenagaKerjaRaw?.total_keseluruhan) {
        return Number(this.tenagaKerjaRaw.total_keseluruhan)
      }
      return this.doughnutData.reduce((acc, curr) => acc + curr.value, 0)
    },

    doughnutCardData() {
      const total = this.doughnutTotal
      return this.doughnutData.map(item => {
        const pct = total > 0 ? ((item.value / total) * 100).toFixed(2) : '0'
        return {
          ...item,
          percent: pct
        }
      })
    },

    donutSlices() {
      const data = this.doughnutData
      const total = this.doughnutTotal
      if (!data.length || total === 0) return []

      const cx = 150
      const cy = 150
      const R = 125
      const r = 58
      const rText = 94

      let currentAngle = -Math.PI / 2

      return data.map((item, index) => {
        const value = item.value
        const percent = total > 0 ? (value / total) * 100 : 0
        const rawAngleSize = total > 0 ? (value / total) * 2 * Math.PI : 0
        const angleSize = Math.min(rawAngleSize, 2 * Math.PI - 0.0001)

        const startAngle = currentAngle
        const endAngle = startAngle + angleSize
        const midAngle = startAngle + angleSize / 2

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

        const tx = cx + rText * Math.cos(midAngle)
        const ty = cy + rText * Math.sin(midAngle)

        return {
          label: item.label,
          value,
          percent: percent.toFixed(2),
          color: this.getColor(index),
          pathData,
          tx,
          ty,
          showText: percent > 2 
        }
      })
    },

    kelurahanRightCards() {
      if (this.activeTab === 'kelurahan') {
        if (!this.selectedKecamatanData) return []
        const totalKec = this.selectedKecamatanData.total || 1
        
        return this.selectedKecamatanData.kelurahanList
          .slice()
          .sort((a, b) => b.total - a.total)
          .map(k => ({
            title: `Kel. ${k.nama}`,
            value: k.total,
            percent: ((k.total / totalKec) * 100).toFixed(2)
          }))
      }
      return []
    },

    rasioDataList() {
      if (!this.rasioRaw) return []
      return Array.isArray(this.rasioRaw) ? this.rasioRaw : [this.rasioRaw]
    },

    sortedRasioData() {
      return [...this.rasioDataList].sort((a, b) => (b.tahun || 0) - (a.tahun || 0))
    },

    rasioYAxis() {
      const list = [...this.rasioDataList]
      if (!list.length) return { min: 0, max: 10, ticks: ['10%', '8%', '6%', '4%', '2%', '0%'] }

      const vals = list.map(item => Number(item.rasio) || 0)
      let minData = Math.min(...vals)
      let maxData = Math.max(...vals)

      if (minData === maxData) {
        minData = Math.max(0, minData - 0.1)
        maxData = maxData + 0.1
      }

      const diff = maxData - minData
      const margin = Math.max(diff * 0.3, 0.04)
      
      const minVal = Number((minData - margin).toFixed(2))
      const maxVal = Number((maxData + margin).toFixed(2))

      const steps = 5
      const stepVal = (maxVal - minVal) / steps
      const ticks = []

      for (let i = 0; i <= steps; i++) {
        const val = maxVal - (stepVal * i)
        ticks.push(`${val.toFixed(2)}%`)
      }

      return { min: minVal, max: maxVal, ticks }
    },

    rasioGraphPoints() {
      const list = [...this.rasioDataList].sort((a, b) => (a.tahun || 0) - (b.tahun || 0))
      if (!list.length) return []

      const svgWidth = 400
      const svgHeight = 200
      const paddingX = 40
      const paddingTop = 25
      const paddingBottom = 25
      const usableHeight = svgHeight - paddingTop - paddingBottom

      const { min: minVal, max: maxVal } = this.rasioYAxis

      if (list.length === 1) {
        const item = list[0]
        const val = Number(item.rasio) || 0
        return [
          {
            x: 200,
            y: svgHeight / 2,
            xPercent: 50,
            tahun: item.tahun || 2026,
            rasio: val,
            rasio_format: item.rasio_format || `${val}%`
          }
        ]
      }

      const usableWidth = svgWidth - (paddingX * 2)

      return list.map((item, index) => {
        const val = Number(item.rasio) || 0
        const step = usableWidth / (list.length - 1)
        const x = paddingX + (index * step)
        
        const range = (maxVal - minVal) || 1
        const normalized = (val - minVal) / range
        const y = (svgHeight - paddingBottom) - (normalized * usableHeight)

        const xPercent = (x / svgWidth) * 100

        return {
          x,
          y,
          xPercent,
          tahun: item.tahun,
          rasio: val,
          rasio_format: item.rasio_format || `${val}%`
        }
      })
    },

    rasioPolylinePoints() {
      return this.rasioGraphPoints.map(pt => `${pt.x},${pt.y}`).join(' ')
    }
  },
  mounted() {
    this.fetchDataForTab('sektor')
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
    handleScrollGrafik() {
      this.closeMenu()
      this.scrollToGrafik()
    },
    scrollToGrafik() {
      if (this.$refs.grafikSection) {
        this.$refs.grafikSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        })
      }
    },

    async switchTab(tabId) {
      this.activeTab = tabId
      await this.fetchDataForTab(tabId, true)
    },

    async fetchDataForTab(tabId, forceFetch = false) {
      if (tabId === 'sektor' && (forceFetch || !this.sektorRaw.length)) {
        await this.fetchApi('https://harvest-protegee-symptom.ngrok-free.dev/api/statistik/sektor', (data) => {
          this.sektorRaw = data || []
        })
      } else if ((tabId === 'kelurahan' || tabId === 'kecamatan') && (forceFetch || !this.wilayahRaw.length)) {
        await this.fetchApi('https://harvest-protegee-symptom.ngrok-free.dev/api/statistik/wilayah', (data) => {
          const list = data || []

          this.wilayahRaw = list.map(item => {
            let parsedKelurahan = []

            if (typeof item.kelurahan === 'string') {
              try {
                parsedKelurahan = JSON.parse(item.kelurahan)
              } catch (e) {
                parsedKelurahan = []
              }
            } else if (Array.isArray(item.kelurahan)) {
              parsedKelurahan = item.kelurahan
            }

            return {
              kecamatan: item.kecamatan,
              total: Number(item.total) || 0,
              kelurahanList: parsedKelurahan.map(k => ({
                nama: k.nama || k.kelurahan || '',
                total: Number(k.total) || 0
              }))
            }
          })

          if (this.wilayahRaw.length > 0 && !this.selectedKecamatan) {
            this.selectedKecamatan = this.wilayahRaw[0].kecamatan
          }
        })
      } else if (tabId === 'tenaga-kerja' && (forceFetch || !this.tenagaKerjaRaw?.grafik_kecamatan?.length)) {
        await this.fetchApi('https://harvest-protegee-symptom.ngrok-free.dev/api/statistik/tenaga-kerja', (data) => {
          this.tenagaKerjaRaw = data || { total_keseluruhan: 0, grafik_kecamatan: [] }
        })
      } else if (tabId === 'rasio-kewirausahaan' && (forceFetch || !this.rasioRaw.length)) {
        await this.fetchApi('https://harvest-protegee-symptom.ngrok-free.dev/api/statistik/rasio-kewirausahaan', (data) => {
          this.rasioRaw = data || []
        })
      }
    },

    async fetchApi(url, onSuccess) {
      this.loading = true
      this.error = null

      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'ngrok-skip-browser-warning': 'true',
            'Accept': 'application/json'
          }
        })

        const resData = await response.json()

        if (!response.ok) {
          throw new Error(resData.message || 'Gagal mengambil data statistik.')
        }

        onSuccess(resData.data)
      } catch (err) {
        console.error(`[API ERROR] Gagal HIT ${url}:`, err)
        this.error = err.message || 'Terjadi kesalahan koneksi ke server.'
      } finally {
        this.loading = false
      }
    },

    getColor(index) {
      return this.colors[index % this.colors.length]
    },

    getBarHeightPercent(val, maxVal = 3000) {
      if (!val) return 0
      const pct = (val / maxVal) * 100
      return Math.min(Math.max(pct, 4), 100)
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
  transition: opacity 0.2s;
}

.nav-item:hover {
  opacity: 0.7;
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
}

.icon-login {
  width: 18px;
  height: 18px;
}

.content-wrapper {
  max-width: 1180px;
  width: 100%;
  margin: 0 auto;
  padding: 10px 40px 60px 40px;
  box-sizing: border-box;
}

.breadcrumb {
  font-size: 0.9rem;
  color: #555555;
  margin-bottom: 12px;
  font-weight: 500;
}

.main-heading {
  font-size: 2.6rem;
  font-weight: 800;
  margin: 0;
  line-height: 1.25;
}

.sub-heading {
  font-weight: 700;
  color: #1a1a1a;
}

.highlight-blue { color: #536dfe; }
.highlight-green { color: #2e7d32; }
.highlight-orange { color: #ff6f00; }

.section-heading {
  font-size: 1.1rem;
  font-weight: 700;
  margin-top: 24px;
  margin-bottom: 24px;
  color: #222222;
  scroll-margin-top: 20px;
}

.data-card {
  background-color: #f2f2ed;
  border-radius: 20px;
  padding: 36px 40px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.02);
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

.tab-item.active {
  color: #2e7d32;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: -14px;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: #2e7d32;
  border-radius: 2px;
}

.filter-container {
  margin-bottom: 20px;
}

.dropdown-select {
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background-color: #ffffff;
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 0.9rem;
  outline: none;
  cursor: pointer;
}

.chart-content-grid {
  display: grid;
  grid-template-columns: 1.1fr 1.3fr;
  gap: 32px;
  align-items: flex-start;
}

.chart-left {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.state-info {
  font-size: 0.95rem;
  font-weight: 600;
  color: #666;
  text-align: center;
  padding: 40px 0;
}

.state-info.error {
  color: #d32f2f;
}

.chart-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.donut-wrapper {
  width: 290px;
  height: 290px;
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.donut-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.legend-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 20px;
  justify-content: center;
  align-items: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.legend-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #444444;
}

.bar-chart-left, .line-chart-left {
  width: 100%;
}

.bar-chart-card, .line-chart-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 25px 20px 15px 15px;
  box-shadow: inset 0 0 0 1px #e5e5e0;
  width: 100%;
  box-sizing: border-box;
}

.chart-grid-wrapper {
  display: flex;
  gap: 10px;
  height: 320px;
}

.y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 0.72rem;
  font-weight: 600;
  color: #777;
  padding-bottom: 75px;
  text-align: right;
  min-width: 40px;
}

.chart-area-scrollable {
  position: relative;
  flex: 1;
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 5px;
}

.chart-area-scrollable::-webkit-scrollbar {
  height: 5px;
}
.chart-area-scrollable::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}

.chart-area-inner {
  position: relative;
  height: 100%;
  transition: min-width 0.3s ease;
}

.grid-lines {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 75px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  pointer-events: none;
}

.grid-line {
  border-bottom: 1px dashed #e2e2e2;
  width: 100%;
}

.bars-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
}

.bar-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  flex: 1;
  min-width: 42px;
}

.bar-track {
  height: calc(100% - 75px);
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.bar-fill {
  width: 65%;
  max-width: 32px;
  background-color: #9f8eff;
  border-radius: 4px 4px 0 0;
  position: relative;
  display: flex;
  justify-content: center;
  transition: height 0.3s ease;
}

.bar-val-badge {
  position: absolute;
  top: -22px;
  font-size: 0.68rem;
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
  color: #444;
  white-space: nowrap;
  transform: rotate(-35deg);
  transform-origin: top left;
  display: inline-block;
  line-height: 1.2;
}

.bar-legend, .line-legend {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 15px;
}

.legend-square {
  width: 12px;
  height: 12px;
  background-color: #9f8eff;
}

.legend-line-dot {
  width: 18px;
  height: 8px;
  border-radius: 4px;
  background-color: #9f8eff;
  display: inline-block;
}

.legend-text {
  font-size: 0.8rem;
  font-weight: 600;
  color: #555;
}

.line-area {
  position: relative;
  flex: 1;
  height: 100%;
}

.line-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100% - 35px);
  overflow: visible;
}

.x-axis-container {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 35px;
}

.x-label-item {
  position: absolute;
  transform: translateX(-50%);
  bottom: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #555;
}

.footnote-text {
  font-size: 0.76rem;
  font-weight: 500;
  color: #333;
  line-height: 1.45;
  margin-top: 18px;
  margin-bottom: 0;
}

.chart-right.grid-2-col {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  width: 100%;
}

.stat-card-framed {
  background-color: #ffffff;
  border: 1px solid #e1e1db;
  border-radius: 14px;
  padding: 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card-framed:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
}

.stat-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: #222222;
  margin: 0 0 10px 0;
  line-height: 1.3;
}

.card-inner-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  background: #f8f8f5;
  border-radius: 8px;
  padding: 8px 10px;
  border: 1px solid #eaeae3;
}

.inner-col {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.inner-col.highlight-col {
  border-left: 1px dashed #d5d5cd;
  padding-left: 10px;
}

.col-label {
  font-size: 0.68rem;
  font-weight: 600;
  color: #777777;
  margin-bottom: 2px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.col-value {
  font-size: 1.05rem;
  font-weight: 800;
  color: #1a1a1a;
  line-height: 1.2;
}

.col-value.percent-text {
  color: #2e7d32;
}

.year-card {
  position: relative;
}

.card-header-year {
  margin-bottom: 6px;
}

.year-badge {
  display: inline-block;
  background-color: #fff3e0;
  color: #ff6f00;
  font-size: 0.75rem;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 6px;
  border: 1px solid #ffe0b2;
}

.elevation-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.85rem;
  font-weight: 700;
}

.elevation-badge.up { color: #2e7d32; }
.elevation-badge.down { color: #d32f2f; }
.elevation-badge .arrow { font-size: 0.7rem; }

/* ===================================================
   MEDIA QUERIES (MOBILE RESPONSIVE ADAPTATION)
   =================================================== */

/* Tablet (Max 992px) */
@media (max-width: 992px) {
  .navbar {
    padding: 20px 30px;
  }

  .content-wrapper {
    padding: 10px 20px 40px 20px;
  }

  .chart-content-grid {
    grid-template-columns: 1fr;
    gap: 28px;
  }
}

/* Mobile Devices (Max 768px) */
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
    padding: 20px 16px;
    border-radius: 16px;
  }

  .tabs-header {
    overflow-x: auto;
    white-space: nowrap;
    padding-bottom: 8px;
    margin-bottom: 20px;
    gap: 20px;
    -webkit-overflow-scrolling: touch;
  }

  .tabs-header::-webkit-scrollbar {
    display: none;
  }

  .tab-item {
    flex-shrink: 0;
    font-size: 0.88rem;
  }

  .tab-item.active::after {
    bottom: -10px;
  }

  .chart-right.grid-2-col {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}

/* Extra Small Devices (Max 480px) */
@media (max-width: 480px) {
  .main-heading {
    font-size: 1.4rem;
  }

  .section-heading {
    font-size: 1rem;
    margin-top: 16px;
    margin-bottom: 16px;
  }

  .donut-wrapper {
    width: 240px;
    height: 240px;
  }

  .chart-right.grid-2-col {
    grid-template-columns: 1fr;
  }
}
</style>