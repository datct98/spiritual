<template>
  <div class="home-page" :style="{ backgroundImage: `url(${backgroundImg})` }">
    <!-- HEADER -->
    <header class="app-header">
      <button class="menu-btn" @click="toggleMenu">
        <span class="menu-line"></span>
        <span class="menu-line"></span>
        <span class="menu-line"></span>
      </button>
      
      <div class="branding">
        <h1 class="app-title">DIGITAL SPIRITUAL</h1>
        <p class="app-subtitle">Journey Within. Connect with the Cosmos.</p>
      </div>
      
      <button class="user-btn" @click="showUserMenu">
        <img src="../assets/cosmic_user_avatar.png" class="user-avatar-img" alt="User Profile">
      </button>
    </header>

    <!-- FEATURE CARDS - Positioned exactly as reference -->
    <div class="feature-cards-container">
      <!-- Top-Left: Gõ Mõ -->
      <div 
        class="feature-card card-top-left" 
        @click="navigateTo('/wooden-fish')"
      >
        <div class="icon-wrapper">
          <img src="../assets/gomo_icon.png" class="card-icon-img" alt="Gõ Mõ">
        </div>
        <div class="card-title">Gõ Mõ</div>
      </div>

      <!-- Mid-Left: Hũ Tâm Sự -->
      <div 
        class="feature-card card-mid-left" 
        @click="navigateTo('/worry-jar')"
      >
        <div class="icon-wrapper">
          <img src="../assets/hotamsu_icon.png" class="card-icon-img" alt="Hồ Tâm Sự">
        </div>
        <div class="card-title">Hồ Tâm Sự</div>
      </div>

      <!-- Top-Right: Phóng Đăng -->
      <div 
        class="feature-card card-top-right" 
        @click="navigateTo('/altar')"
      >
        <div class="icon-wrapper">
          <img src="../assets/phongdang_icon.png" class="card-icon-img" alt="Phóng Đăng">
        </div>
        <div class="card-title">Phóng Đăng</div>
      </div>

      <!-- Mid-Right: Thắp Nhang -->
      <div 
        class="feature-card card-mid-right" 
        @click="navigateTo('/altar')"
      >
        <div class="icon-wrapper">
          <img src="../assets/thapnhang_icon.png" class="card-icon-img" alt="Thắp Nhang">
        </div>
        <div class="card-title">Thắp Nhang</div>
      </div>

      <!-- Bottom-Center-Left: Huyền Học -->
      <div 
        class="feature-card card-bottom-left" 
        @click="navigateTo('/divination')"
      >
        <div class="icon-wrapper">
          <img src="../assets/huyenhoc_icon.png" class="card-icon-img" alt="Huyền Học">
        </div>
        <div class="card-title">Huyền Học</div>
      </div>

      <!-- Bottom-Center-Right: Linh Vật -->
      <div 
        class="feature-card card-bottom-right" 
        @click="navigateTo('/shop')"
      >
        <div class="icon-wrapper">
          <img src="../assets/linhvat_icon.png" class="card-icon-img" alt="Linh Vật">
        </div>
        <div class="card-title">Linh Vật</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import backgroundImg from '../assets/cosmic_homepage_background.png'

const router = useRouter()
const { getUserEmail } = useAuth()

const navigateTo = (path) => {
  if (path === '/altar' || path === '/divination' || path === '/shop') {
    alert('Tính năng đang phát triển 🙏')
  } else {
    router.push(path)
  }
}

const toggleMenu = () => {
  console.log('Menu toggled')
}

const showUserMenu = () => {
  console.log('User menu')
}

const getUserInitial = () => {
  const email = getUserEmail()
  return email ? email.charAt(0).toUpperCase() : 'U'
}
</script>

<style scoped>
/* ========================================
   HOME PAGE - STATIC BACKGROUND
======================================== */
.home-page {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

/* ========================================
   HEADER
======================================== */
.app-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  z-index: 10;
}

.menu-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.menu-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.user-btn {
  background: transparent;  /* Removed background */
  border: none;             /* Removed border */
  border-radius: 50%;       /* Keep circular */
  padding: 0;               /* Removed padding */
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: none;    /* Removed blur effect */
  width: 85px;              /* Increased from 70px */
  height: 85px;             /* Increased from 70px */
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-btn:hover {
  transform: scale(1.1);
  filter: brightness(1.2);
}

.menu-line {
  display: block;
  width: 20px;
  height: 2px;
  background: white;
  margin: 4px 0;
  border-radius: 2px;
}

.branding {
  text-align: center;
  flex: 1;
}

.app-title {
  font-family: 'Trajan Pro', 'Cinzel', 'Times New Roman', serif;
  font-size: 2rem;
  font-weight: 600;
  color: #D4AF37;
  margin: 0;
  letter-spacing: 4px;
  text-shadow: 
    0 0 10px rgba(212, 175, 55, 0.4),
    0 2px 4px rgba(0, 0, 0, 0.6);
  text-transform: uppercase;
}

.app-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0.25rem 0 0 0;
  letter-spacing: 1px;
}

/* New cosmic user avatar image */
.user-avatar-img {
  width: 85px;              /* Increased from 70px */
  height: 85px;             /* Increased from 70px */
  border-radius: 50%;
  object-fit: cover;        /* Crop to fill circle */
  transition: all 0.3s ease;
  
  /* Subtle glow effect */
  filter: drop-shadow(0 2px 8px rgba(139, 92, 246, 0.4));
}

.user-btn:hover .user-avatar-img {
  transform: scale(1.1);
  filter: 
    drop-shadow(0 4px 12px rgba(139, 92, 246, 0.6))
    brightness(1.1);
}

/* ========================================
   FEATURE CARDS - EXACT POSITIONING
======================================== */
.feature-cards-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.feature-card {
  position: absolute;
  width: 95px;   /* Increased for larger icons */
  height: 95px;  /* Increased for larger icons */
  background: rgba(255, 255, 255, 0.05);
  
  /* Enhanced glowing golden border */
  border: 2px solid rgba(255, 215, 0, 0.4);
  border-radius: 20px;
  backdrop-filter: blur(12px);
  
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: auto;
  
  /* Glowing box shadow */
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.3),
    0 0 25px rgba(255, 215, 0, 0.2),
    inset 0 0 20px rgba(255, 255, 255, 0.05);
}

.feature-card:hover {
  transform: translateY(-10px) scale(1.05);
  background: rgba(255, 255, 255, 0.1);
  
  /* Enhanced glowing border on hover */
  border-color: rgba(255, 215, 0, 0.8);
  
  box-shadow: 
    0 12px 32px rgba(139, 92, 246, 0.4),
    0 0 40px rgba(255, 215, 0, 0.5),
    0 0 80px rgba(255, 215, 0, 0.2),
    inset 0 0 30px rgba(255, 255, 255, 0.1);
}

/* Icon wrapper - circular container */
.icon-wrapper {
  width: 70px;  /* Increased from 50px */
  height: 70px; /* Increased from 50px */
  border-radius: 50%;
  overflow: visible;  /* Changed to visible for glow effects */
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  position: relative;
}

.icon-svg {
  width: 80px;
  height: 80px;
}

.card-icon-img {
  width: 70px;  /* Increased from 50px */
  height: 70px; /* Increased from 50px */
  object-fit: contain;
  
  /* Enhanced filters for original icons */
  filter: 
    brightness(1.2)
    contrast(1.1)
    saturate(1.3)
    drop-shadow(0 0 15px rgba(255, 255, 255, 0.6));
  
  transition: transform 0.3s ease, filter 0.3s ease;
  /* Removed floating animation as per user request */
}

.feature-card:hover .card-icon-img {
  transform: scale(1.15);
  filter: 
    brightness(1.4)
    contrast(1.2)
    saturate(1.5)
    drop-shadow(0 0 25px rgba(255, 255, 255, 0.9));
}

.card-title {
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;  /* Reduced from 0.9rem */
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  text-align: center;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

/* Specific Card Positions - Matching Reference Image (No Scrolling) */

/* Top-Left: Gõ Mõ - Moved down and inward */
.card-top-left {
  top: 26%;
  left: 12%;
}

/* Mid-Left: Hũ Tâm Sự - Moved down and inward */
.card-mid-left {
  top: 48%;
  left: 12%;
}

/* Top-Right: Phóng Đăng - Moved down and inward */
.card-top-right {
  top: 26%;
  right: 12%;
}

/* Mid-Right: Thắp Nhang - Moved down and inward */
.card-mid-right {
  top: 48%;
  right: 12%;
}

/* Bottom-Center-Left: Huyền Học - Moved down further */
.card-bottom-left {
  bottom: 14%;
  left: 35%;
}

/* Bottom-Center-Right: Linh Vật - Moved down further */
.card-bottom-right {
  bottom: 14%;
  right: 35%;
}

/* ========================================
   RESPONSIVE ADJUSTMENTS
======================================== */
@media (max-width: 768px) {
  .app-title {
    font-size: 1.5rem;
  }
  
  .app-subtitle {
    font-size: 0.75rem;
  }
  
  .feature-card {
    width: 80px;
    height: 80px;
  }
  
  .card-icon-img {
    width: 45px;
    height: 45px;
  }
  
  .card-title {
    font-size: 0.8rem;
  }
}
</style>
