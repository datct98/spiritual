<template>
  <div class="home-page">
    <div class="app-background"></div>
    
    <div class="container">
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content">
          <div class="logo-wrapper">
            <div class="logo-circle">🪷</div>
          </div>
          <h1 class="main-title">GÓC AN NHIÊN</h1>
          <p class="tagline">Nơi tâm linh gặp gỡ công nghệ</p>
          <p class="description">Tu tâm dưỡng tính - Tích công lũy đức</p>
        </div>
        
        <!-- User Info -->
        <div class="user-section">
          <span class="user-email">{{ getUserEmail() }}</span>
          <button @click="handleLogout" class="logout-btn">Đăng xuất</button>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features-section">
        <h2 class="section-title">Tính Năng Tâm Linh</h2>
        
        <div class="features-grid">
          <!-- Gõ Mõ - Primary Feature -->
          <div class="feature-card primary" @click="navigateTo('/wooden-fish')">
            <div class="card-glow"></div>
            <div class="feature-content">
              <div class="feature-icon big">🪷</div>
              <h3 class="feature-title">Gõ Mõ Giải Nghiệp</h3>
              <p class="feature-desc">Tích công đức, giải nghiệp chướng</p>
              <div class="feature-badge">Phổ biến</div>
            </div>
          </div>

          <!-- Phóng Đăng - New Feature -->
          <div class="feature-card highlight" @click="navigateTo('/prayer')">
            <div class="card-glow"></div>
            <div class="feature-content">
              <div class="feature-icon big">🏮</div>
              <h3 class="feature-title">Phóng Đăng Cầu Nguyện</h3>
              <p class="feature-desc">Thả đèn trời, gửi lời cầu nguyện</p>
              <div class="feature-badge new">Mới</div>
            </div>
          </div>

          <!-- Other Features -->
          <div class="feature-card" @click="navigateTo('/altar')">
            <div class="feature-icon">🕯️</div>
            <h3 class="feature-title">Thắp Nhang Kính Tổ</h3>
            <p class="feature-desc">Tưởng nhớ tổ tiên</p>
          </div>

          <div class="feature-card" @click="navigateTo('/divination')">
            <div class="feature-icon">🔮</div>
            <h3 class="feature-title">Huyền Học Tâm Linh</h3>
            <p class="feature-desc">Tử vi, thần số, tarot</p>
          </div>

          <div class="feature-card" @click="navigateTo('/shop')">
            <div class="feature-icon">🛍️</div>
            <h3 class="feature-title">Tịnh Thất Linh Vật</h3>
            <p class="feature-desc">Đồ vật tâm linh</p>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="footer">
        <p>Made with 💖 by Spiritual Tech Team</p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { getUserEmail, logout } = useAuth()

const navigateTo = (path) => {
  if (path === '/altar' || path === '/divination' || path === '/shop') {
    alert('Tính năng đang phát triển 🙏')
  } else {
    router.push(path)
  }
}

const handleLogout = () => {
  if (confirm('Bạn chắc chắn muốn đăng xuất?')) {
    logout()
    window.location.reload()
  }
}
</script>

<style scoped>
.home-page {
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
}

.container {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
}

/* Hero Section */
.hero {
  text-align: center;
  padding: 3rem 0 4rem;
  margin-bottom: 3rem;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto 2rem;
}

.logo-wrapper {
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
}

.logo-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(244, 196, 48, 0.2), rgba(186, 85, 211, 0.2));
  border: 3px solid rgba(244, 196, 48, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  box-shadow: 
    0 0 40px rgba(244, 196, 48, 0.3),
    0 20px 60px rgba(0, 0, 0, 0.3);
  animation: pulse-glow 3s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 40px rgba(244, 196, 48, 0.3), 0 20px 60px rgba(0, 0, 0, 0.3);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 60px rgba(244, 196, 48, 0.5), 0 20px 80px rgba(0, 0, 0, 0.4);
  }
}

.main-title {
  font-size: 4rem;
  font-weight: 900;
  background: linear-gradient(135deg, #f4c430 0%, #ff9966 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  letter-spacing: 0.05em;
  text-shadow: 0 4px 30px rgba(244, 196, 48, 0.3);
}

.tagline {
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.description {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 300;
}

.user-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 400px;
  margin: 0 auto;
}

.user-email {
  color: #f4c430;
  font-weight: 600;
  font-size: 1rem;
}

.logout-btn {
  padding: 0.6rem 1.5rem;
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.3), rgba(255, 153, 102, 0.3));
  border: 1px solid rgba(255, 107, 107, 0.5);
  border-radius: 25px;
  color: #ff9966;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.logout-btn:hover {
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.4), rgba(255, 153, 102, 0.4));
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
}

/* Features Section */
.features-section {
  flex: 1;
  margin-bottom: 3rem;
}

.section-title {
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 3rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

/* Feature Cards */
.feature-card {
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.feature-card.primary,
.feature-card.highlight {
  grid-column: span 2;
  padding: 3rem;
  border: 2px solid rgba(244, 196, 48, 0.4);
  background: linear-gradient(135deg, rgba(244, 196, 48, 0.1), rgba(186, 85, 211, 0.1));
}

.card-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(244, 196, 48, 0.15) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.4s;
}

.feature-card:hover .card-glow {
  opacity: 1;
}

.feature-card:hover {
  transform: translateY(-15px) scale(1.02);
  border-color: rgba(244, 196, 48, 0.5);
  box-shadow: 
    0 30px 80px rgba(244, 196, 48, 0.3),
    0 0 50px rgba(186, 85, 211, 0.2);
}

.feature-content {
  position: relative;
  z-index: 1;
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: inline-block;
  filter: drop-shadow(0 4px 10px rgba(244, 196, 48, 0.4));
}

.feature-icon.big {
  font-size: 5rem;
  margin-bottom: 1.5rem;
  animation: float-icon 3s ease-in-out infinite;
}

@keyframes float-icon {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

.feature-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #f4c430;
  margin-bottom: 0.8rem;
}

.feature-card.primary .feature-title,
.feature-card.highlight .feature-title {
  font-size: 2.2rem;
}

.feature-desc {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
  line-height: 1.6;
}

.feature-badge {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.5rem 1.2rem;
  background: rgba(244, 196, 48, 0.2);
  border: 1px solid rgba(244, 196, 48, 0.4);
  border-radius: 20px;
  color: #f4c430;
  font-size: 0.9rem;
  font-weight: 600;
}

.feature-badge.new {
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.3), rgba(255, 153, 102, 0.3));
  border-color: rgba(255, 107, 107, 0.5);
  color: #ff9966;
  box-shadow: 0 0 20px rgba(255, 107, 107, 0.3);
}

/* Footer */
.footer {
  text-align: center;
  padding: 2rem 0;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.95rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 3rem;
}

/* Responsive */
@media (max-width: 1024px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .feature-card.primary,
  .feature-card.highlight {
    grid-column: span 1;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  .logo-circle {
    width: 90px;
    height: 90px;
    font-size: 3rem;
  }
  
  .main-title {
    font-size: 2.5rem;
  }
  
  .tagline {
    font-size: 1.2rem;
  }
  
  .description {
    font-size: 1rem;
  }
  
  .user-section {
    flex-direction: column;
    gap: 0.8rem;
    padding: 1rem;
  }
  
  .section-title {
    font-size: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .feature-card {
    padding: 1.5rem;
  }
  
  .feature-card.primary,
  .feature-card.highlight {
    padding: 2rem;
  }
  
  .feature-icon.big {
    font-size: 4rem;
  }
  
  .feature-title {
    font-size: 1.5rem;
  }
  
  .feature-card.primary .feature-title,
  .feature-card.highlight .feature-title {
    font-size: 1.8rem;
  }
}

@media (hover: none) {
  .feature-card:active {
    transform: scale(0.98);
  }
}
</style>
