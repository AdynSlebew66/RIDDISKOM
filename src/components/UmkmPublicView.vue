<template>
  <div class="page-container">
    <!-- Header / Navbar Public -->
    <header class="navbar">
      <div class="brand" @click="$router.push('/')">
        <img src="../assets/logo2.png" alt="Logo DISKOPUMKER" class="logo" />
      </div>
      
      <ul class="nav-links">
        <li class="nav-item" @click="$router.push('/')">
          Beranda
          <svg xmlns="http://www.w3.org/2000/svg" class="icon-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
        </li>
        <li class="nav-item">
          Profile
          <svg xmlns="http://www.w3.org/2000/svg" class="icon-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
        </li>
        <li class="nav-item">
          Informasi
          <svg xmlns="http://www.w3.org/2000/svg" class="icon-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
        </li>
        <li class="nav-item">
          Layanan
          <svg xmlns="http://www.w3.org/2000/svg" class="icon-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
        </li>
        <li class="nav-item login-btn" @click="$router.push('/login')">
          Login
          <svg xmlns="http://www.w3.org/2000/svg" class="icon-login" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
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
        <h2 class="section-heading">Grafik Data UMKM</h2>
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
          
          <!-- TAB DOUGHNUT / PIE CHART (Sektor, Kecamatan, & Penyerapan Tenaga Kerja) -->
          <template v-if="activeTab === 'sektor' || activeTab === 'tenaga-kerja' || activeTab === 'kecamatan'">
            <div class="chart-left">
              <div class="chart-container">
                <!-- SVG Doughnut Chart dengan Angka & Persentase di Irisan -->
                <div class="donut-wrapper">
                  <svg viewBox="0 0 300 300" class="donut-svg">
                    <g v-for="(slice, index) in donutSlices" :key="index">
                      <path :d="slice.pathData" :fill="slice.color" stroke="#ffffff" stroke-width="2" />
                      <!-- Text Jumlah Nilai -->
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
                      <!-- Text Persentase -->
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
                    <!-- Center Circle & Total (Dihitung Dinamis) -->
                    <circle cx="150" cy="150" r="55" fill="#f0f0eb" />
                    <text x="150" y="155" text-anchor="middle" fill="#333333" font-size="15" font-weight="800">
                      {{ doughnutTotal.toLocaleString('id-ID') }}
                    </text>
                  </svg>
                </div>

                <!-- Legend -->
                <div class="legend-container">
                  <div v-for="(item, index) in doughnutData" :key="index" class="legend-item">
                    <span class="dot" :style="{ backgroundColor: getColor(index) }"></span>
                    <span class="legend-label">{{ item.label }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Stat Cards Doughnut (Satu sumber data dengan Doughnut) -->
            <div class="chart-right">
              <div v-for="item in doughnutData" :key="item.label" class="stat-card">
                <span v-if="activeTab === 'sektor'" class="stat-year"></span>
                <h3 class="stat-title">{{ item.label }}</h3>
                <p class="stat-value">{{ item.value.toLocaleString('id-ID') }}</p>
              </div>
            </div>
          </template>

          <!-- TAB BAR CHART (Kelurahan) -->
          <template v-else-if="activeTab === 'kelurahan'">
            <div class="chart-left bar-chart-left">
              <div class="bar-chart-card">
                <div class="chart-grid-wrapper">
                  <!-- Y-Axis Labels -->
                  <div class="y-axis">
                    <span>3000</span>
                    <span>2500</span>
                    <span>2000</span>
                    <span>1500</span>
                    <span>1000</span>
                    <span>500</span>
                    <span>0</span>
                  </div>

                  <!-- Chart Area with Grid Lines and Bars -->
                  <div class="chart-area">
                    <div class="grid-lines">
                      <div class="grid-line" v-for="n in 7" :key="n"></div>
                    </div>

                    <div class="bars-container">
                      <div v-for="(item, idx) in currentBarData" :key="idx" class="bar-col">
                        <div class="bar-track">
                          <div class="bar-fill" :style="{ height: getBarHeightPercent(item.value, 3000) + '%' }">
                            <span class="bar-val-text">{{ item.value.toLocaleString('id-ID') }}</span>
                          </div>
                        </div>
                        <span class="bar-x-label">{{ item.label }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Chart Legend -->
                <div class="bar-legend">
                  <span class="legend-square"></span>
                  <span class="legend-text">Total_UMKM_Per_Kelurahan</span>
                </div>
              </div>
            </div>

            <!-- Right Stat Cards Bar Chart (Data Real) -->
            <div class="chart-right">
              <div v-for="(card, i) in currentRightCards" :key="i" class="stat-card">
                <h3 class="stat-title">{{ card.title }}</h3>
                <div class="stat-val-group">
                  <p class="stat-value">{{ Number(card.value).toLocaleString('id-ID') }}</p>
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
      activeTab: 'sektor',
      tabs: [
        { id: 'sektor', label: 'Sektor Usaha' },
        { id: 'kelurahan', label: 'Kelurahan' },
        { id: 'kecamatan', label: 'Kecamatan' },
        { id: 'tenaga-kerja', label: 'Penyerapan Tenaga kerja' }
      ],

      // Raw API Data
      sektorRaw: [],
      wilayahRaw: [],
      tenagaKerjaRaw: {
        total_keseluruhan: 0,
        grafik_kecamatan: []
      },

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
      // Mengambil total langsung dari API agar akurat 100% dengan database
      if (this.activeTab === 'tenaga-kerja' && this.tenagaKerjaRaw?.total_keseluruhan) {
        return Number(this.tenagaKerjaRaw.total_keseluruhan)
      }
      return this.doughnutData.reduce((acc, curr) => acc + curr.value, 0)
    },

    // Kalkulasi Irisan Donut SVG
    donutSlices() {
      const data = this.doughnutData
      const total = this.doughnutTotal
      if (!data.length || total === 0) return []

      const cx = 150
      const cy = 150
      const R = 130
      const r = 60
      const rText = 98

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

    currentRightCards() {
      if (this.activeTab === 'kelurahan') {
        if (!this.selectedKecamatanData) return []
        
        // Menampilkan 5 kelurahan dengan UMKM tertinggi agar list tidak terlalu panjang ke bawah
        return this.selectedKecamatanData.kelurahanList
          .slice()
          .sort((a, b) => b.total - a.total)
          .slice(0, 5)
          .map(k => ({
            title: `Kel. ${k.nama}`,
            value: k.total
          }))
      }
      return []
    }
  },
  mounted() {
    this.fetchDataForTab('sektor')
  },
  methods: {
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
      }
    },

    async fetchApi(url, onSuccess) {
      console.log(`[API HIT] Mengirim request ke: ${url}`)
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
/* Bagian style tidak ada yang diubah secara fundamental, kamu bisa menggunakan style yang sama seperti kodingan aslimu sebelumnya */
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
  padding: 25px 60px;
  background-color: transparent;
}

.logo {
  height: 55px;
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
  color: #1a1a1a;
  font-size: 1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.nav-item:hover {
  opacity: 0.7;
}

.icon-chevron {
  width: 16px;
  height: 16px;
}

.login-btn {
  margin-left: 15px;
  padding: 6px 18px;
  border: 2px solid #1a1a1a;
  border-radius: 8px;
}

.icon-login {
  width: 18px;
  height: 18px;
}

.content-wrapper {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 10px 40px 60px 40px;
  box-sizing: border-box;
}

.breadcrumb {
  font-size: 0.95rem;
  color: #555555;
  margin-bottom: 10px;
}

.main-heading {
  font-size: 2.8rem;
  font-weight: 800;
  margin: 0;
  line-height: 1.2;
}

.sub-heading {
  font-weight: 700;
  color: #1a1a1a;
  font-size: 2.2rem;
}

.highlight-blue { color: #536dfe; }
.highlight-green { color: #2e7d32; }
.highlight-orange { color: #ff6f00; }

.section-heading {
  font-size: 1.15rem;
  font-weight: 700;
  margin-top: 15px;
  margin-bottom: 25px;
  color: #222222;
}

.data-card {
  background-color: #f0f0eb;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.03);
}

.tabs-header {
  display: flex;
  gap: 35px;
  border-bottom: 2px solid #e0e0db;
  padding-bottom: 12px;
  margin-bottom: 20px;
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
  grid-template-columns: 2.2fr 1fr;
  gap: 30px;
  align-items: flex-start;
}

.chart-left {
  display: flex;
  justify-content: center;
  align-items: center;
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
  width: 320px;
  height: 320px;
  margin-bottom: 20px;
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
  color: #555555;
}

.bar-chart-left {
  width: 100%;
}

.bar-chart-card {
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
  height: 260px;
}

.y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 0.75rem;
  font-weight: 600;
  color: #777;
  padding-bottom: 35px;
  text-align: right;
  min-width: 35px;
}

.chart-area {
  position: relative;
  flex: 1;
  height: 100%;
}

.grid-lines {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 35px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  pointer-events: none;
}

.grid-line {
  border-bottom: 1px solid #e2e2e2;
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
}

.bar-track {
  height: calc(100% - 35px);
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.bar-fill {
  width: 70%;
  max-width: 38px;
  background-color: #9f8eff;
  border-radius: 4px 4px 0 0;
  position: relative;
  display: flex;
  justify-content: center;
  transition: height 0.3s ease;
}

.bar-val-text {
  position: absolute;
  top: 6px;
  font-size: 0.7rem;
  font-weight: 700;
  color: #1a1a1a;
}

.bar-x-label {
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 0.68rem;
  font-weight: 600;
  color: #555;
  line-height: 1.1;
  word-break: break-word;
  padding-top: 4px;
}

.bar-legend {
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

.legend-text {
  font-size: 0.8rem;
  font-weight: 600;
  color: #555;
}

.chart-right {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.stat-card {
  display: flex;
  flex-direction: column;
}

.stat-year {
  font-size: 0.85rem;
  font-weight: 700;
  color: #ff6f00;
  margin-bottom: 2px;
}

.stat-title {
  font-size: 1.05rem;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0 0 4px 0;
}

.stat-val-group {
  display: flex;
  align-items: baseline;
  gap: 15px;
}

.stat-value {
  font-size: 1.6rem;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0;
}

.stat-subval {
  font-size: 1.1rem;
  font-weight: 700;
  color: #444;
}

.trend-badge {
  font-size: 0.85rem;
  font-weight: 700;
  margin-top: 4px;
}

.trend-badge.up { color: #2e7d32; }
.trend-badge.down { color: #d32f2f; }
</style>