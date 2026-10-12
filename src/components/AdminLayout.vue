<template>
  <div class="admin-shell" @click="closeDropdownOnClickOutside">
    <!-- Sidebar -->
    <aside class="admin-sidebar" :class="{ closed: !sidebarOpen }">
      <div class="sidebar-brand">
        <img src="../assets/logo.png" alt="Logo DISKOPUMKER" class="brand-logo" />
      </div>
      <nav class="sidebar-nav">
        <router-link
          v-for="item in menu"
          :key="item.to"
          :to="item.to"
          class="sidebar-link"
          active-class="active"
        >
          <span class="sidebar-icon" v-html="item.icon"></span>
          <span class="sidebar-label">{{ item.label }}</span>
        </router-link>
      </nav>
    </aside>

    <!-- Backdrop (mobile saat sidebar terbuka) -->
    <div v-if="sidebarOpen" class="sidebar-backdrop" @click="closeSidebar"></div>

    <!-- Kolom utama -->
    <div class="admin-main">
      <header class="admin-topbar">
        <div class="topbar-left">
          <button class="hamburger-btn" @click="toggleSidebar" aria-label="Buka/tutup menu">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
          <span class="topbar-title">{{ title }}</span>
        </div>
        <div class="topbar-right">
          <div class="profile-container">
            <div class="user-profile" @click.stop="toggleDropdown">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <span>{{ profileName }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="{ 'rotate-icon': showDropdown }"><path d="M6 9l6 6 6-6"/></svg>
            </div>
            <transition name="dropdown-fade">
              <div v-if="showDropdown" class="profile-dropdown">
                <button @click="handleLogout" class="dropdown-item logout-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2 2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                  Keluar / Logout
                </button>
              </div>
            </transition>
          </div>
        </div>
      </header>

      <div class="admin-body">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
const ICON_HOME = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>'
const ICON_USER = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>'
const ICON_GLOBE = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>'
const ICON_BRIEFCASE = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>'
const ICON_DATABASE = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>'
const ICON_CHART = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>'
const ICON_IMAGE = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>'
const ICON_CALENDAR = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>'

const MENUS = {
  umkm: [
    { to: '/admin/umkm', label: 'Dashboard', icon: ICON_HOME },
    { to: '/admin/data', label: 'Data UMKM', icon: ICON_DATABASE },
    { to: '/admin/rasio', label: 'Rasio Kewirausahaan', icon: ICON_CHART },
    { to: '/admin/kegiatan', label: 'Galeri', icon: ICON_IMAGE },
    { to: '/admin/jadwal', label: 'Jadwal', icon: ICON_CALENDAR }
  ],
  p3tk: [
    { to: '/admin/p3tk', label: 'Dashboard', icon: ICON_HOME },
    { to: '/admin/pencaker', label: 'Pencari Kerja', icon: ICON_USER },
    { to: '/admin/pmi', label: 'Pekerja Migran Indonesia', icon: ICON_GLOBE },
    { to: '/admin/bkk', label: 'Bursa Kerja Khusus', icon: ICON_BRIEFCASE }
  ],
  pegawai: [
    { to: '/admin/pegawai', label: 'Dashboard', icon: ICON_HOME }
  ]
}

const PROFILE_NAMES = {
  umkm: 'AdminUMKM',
  p3tk: 'AdminP3TK',
  pegawai: 'AdminSekretariat'
}

const STORAGE_KEY = 'admin-sidebar-open'

export default {
  name: 'AdminLayout',
  props: {
    group: {
      type: String,
      default: 'umkm',
      validator: (v) => ['umkm', 'p3tk', 'pegawai'].includes(v)
    },
    title: {
      type: String,
      default: 'Dashboard'
    }
  },
  data() {
    return {
      sidebarOpen: true,
      showDropdown: false
    }
  },
  computed: {
    menu() {
      return MENUS[this.group] || MENUS.umkm
    },
    profileName() {
      return PROFILE_NAMES[this.group] || PROFILE_NAMES.umkm
    }
  },
  created() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved !== null) {
        this.sidebarOpen = saved === '1'
      } else {
        this.sidebarOpen = typeof window === 'undefined' || window.innerWidth > 768
      }
    } catch (e) {
      this.sidebarOpen = true
    }
  },
  methods: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
      try {
        localStorage.setItem(STORAGE_KEY, this.sidebarOpen ? '1' : '0')
      } catch (e) {
        // abaikan jika localStorage tidak tersedia
      }
    },
    closeSidebar() {
      this.sidebarOpen = false
      try {
        localStorage.setItem(STORAGE_KEY, '0')
      } catch (e) {
        // abaikan jika localStorage tidak tersedia
      }
    },
    toggleDropdown() {
      this.showDropdown = !this.showDropdown
    },
    closeDropdownOnClickOutside() {
      this.showDropdown = false
    },
    handleLogout() {
      localStorage.removeItem('access_token')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

.admin-shell {
  min-height: 100vh;
  background-color: #f4f5f7;
  font-family: 'Poppins', sans-serif;
  color: #1e293b;
  display: flex;
  align-items: stretch;
}

/* ===== Sidebar ===== */
.admin-sidebar {
  width: 248px;
  flex-shrink: 0;
  background-color: #0f2440;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  margin-left: 0;
  transition: margin-left 0.25s ease;
  z-index: 60;
}

.admin-sidebar.closed {
  margin-left: -248px;
}

.sidebar-brand {
  padding: 18px 20px 14px 20px;
  display: flex;
  align-items: center;
}

.brand-logo {
  height: 40px;
  max-width: 100%;
  object-fit: contain;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 6px 12px 20px 12px;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #cbd5e1;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.88rem;
  padding: 10px 12px;
  border-radius: 8px;
  transition: background-color 0.15s ease, color 0.15s ease;
  line-height: 1.35;
}

.sidebar-link:hover {
  background-color: rgba(255, 255, 255, 0.08);
  color: #ffffff;
}

.sidebar-link.active {
  background-color: rgba(255, 255, 255, 0.16);
  color: #ffffff;
}

.sidebar-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* ===== Kolom utama ===== */
.admin-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.admin-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  background-color: #1e385c;
  color: #ffffff;
  position: sticky;
  top: 0;
  z-index: 50;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.hamburger-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: #ffffff;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  transition: background-color 0.15s ease;
}

.hamburger-btn:hover {
  background-color: rgba(255, 255, 255, 0.12);
}

.topbar-title {
  font-weight: 700;
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.topbar-right {
  position: relative;
}

.profile-container {
  position: relative;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #ffffff;
  padding: 6px 12px;
  border-radius: 6px;
  user-select: none;
  font-weight: 600;
  font-size: 0.9rem;
}

.user-profile:hover {
  background-color: #27272a;
}

.rotate-icon {
  transform: rotate(180deg);
  transition: transform 0.2s ease;
}

.profile-dropdown {
  position: absolute;
  top: 110%;
  right: 0;
  min-width: 200px;
  background-color: #27272a;
  border: 1px solid #3f3f46;
  border-radius: 8px;
  padding: 6px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
  z-index: 70;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  background: transparent;
  border: none;
  color: #f87171;
  padding: 10px 12px;
  font-family: 'Poppins', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #ef4444;
  color: #ffffff;
}

.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: opacity 0.15s ease;
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
}

.admin-body {
  flex: 1;
  min-width: 0;
}

.sidebar-backdrop {
  display: none;
}

@media (max-width: 768px) {
  .admin-sidebar {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    margin-left: 0;
    transform: translateX(0);
    transition: transform 0.25s ease;
    box-shadow: 10px 0 30px rgba(0, 0, 0, 0.25);
  }

  .admin-sidebar.closed {
    margin-left: 0;
    transform: translateX(-100%);
  }

  .sidebar-backdrop {
    display: block;
    position: fixed;
    inset: 0;
    background-color: rgba(15, 23, 42, 0.5);
    z-index: 55;
  }

  .admin-topbar {
    padding: 10px 14px;
  }

  .topbar-title {
    font-size: 0.85rem;
  }
}
</style>
