<template>
  <aside class="profile-sidebar">
    <h3 class="sidebar-title">Info Terbaru</h3>
    <div v-if="infoList.length === 0" class="sidebar-empty">
      <p>Belum ada informasi terbaru saat ini.</p>
    </div>
    <div v-else class="sidebar-list">
      <article
        v-for="item in infoList"
        :key="item.id"
        class="sidebar-item"
        @click="goToHome"
      >
        <div class="sidebar-thumb"></div>
        <div class="sidebar-text">
          <h4>{{ item.title }}</h4>
          <p class="sidebar-desc">{{ item.desc }}</p>
          <p class="sidebar-date">{{ item.date }}</p>
        </div>
      </article>
    </div>
    <button class="btn-more" @click="goToHome">
      <span>Lihat Selengkapnya</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="13 17 18 12 13 7"></polyline>
        <polyline points="6 17 11 12 6 7"></polyline>
      </svg>
    </button>

    <h3 class="sidebar-title sosmed-title">Sosial Media</h3>
    <a
      class="btn-sosmed"
      :href="socialMedia.instagramUrl"
      target="_blank"
      rel="noopener"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e1306c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
      <span class="sosmed-label">{{ socialMedia.instagramLabel }}</span>
    </a>
  </aside>
</template>

<script>
import { infoTerbaru, socialMedia } from '../../data/infoTerbaru.js'

export default {
  name: 'ProfilSidebar',
  data() {
    return {
      infoList: infoTerbaru,
      socialMedia
    }
  },
  methods: {
    goToHome() {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.profile-sidebar {
  background: #ffffff;
  border: 1px solid #e1e1db;
  border-radius: 16px;
  padding: 22px 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  height: fit-content;
  position: sticky;
  top: 20px;
  box-sizing: border-box;
}

.sidebar-title {
  font-size: 1rem;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0 0 16px 0;
}

.sosmed-title {
  margin-top: 22px;
}

.sidebar-empty {
  font-size: 0.85rem;
  color: #888888;
  background: #f7f7f8;
  border: 1px dashed #dcdde1;
  border-radius: 10px;
  padding: 16px;
  text-align: center;
}

.sidebar-empty p {
  margin: 0;
}

.sidebar-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 16px;
}

.sidebar-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  cursor: pointer;
}

.sidebar-thumb {
  width: 56px;
  height: 56px;
  background-color: #dcdde1;
  border-radius: 6px;
  flex-shrink: 0;
}

.sidebar-text h4 {
  margin: 0;
  font-size: 0.92rem;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.4;
}

.sidebar-desc {
  margin: 2px 0 0 0;
  font-size: 0.8rem;
  color: #555555;
  line-height: 1.4;
}

.sidebar-date {
  margin: 2px 0 0 0;
  font-size: 0.75rem;
  color: #888888;
}

.btn-more {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background: transparent;
  border: 1.5px solid #1a1a1a;
  border-radius: 8px;
  padding: 8px 12px;
  font-family: 'Poppins', sans-serif;
  font-size: 0.82rem;
  font-weight: 700;
  color: #1a1a1a;
  cursor: pointer;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.btn-more:hover {
  background-color: #1a1a1a;
  color: #ffffff;
}

.btn-sosmed {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 9px 12px;
  border: 1.5px solid #e1306c;
  border-radius: 8px;
  text-decoration: none;
  box-sizing: border-box;
  transition: background-color 0.2s ease;
}

.btn-sosmed:hover {
  background-color: #fdf0f5;
}

.sosmed-label {
  font-size: 0.85rem;
  font-weight: 700;
  background: linear-gradient(45deg, #f09433, #e1306c, #833ab4);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

@media (max-width: 992px) {
  .profile-sidebar {
    position: static;
  }
}
</style>
