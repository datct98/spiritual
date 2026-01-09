<template>
  <div class="home-page">
    <!-- Spiritual Background -->
    <div class="spiritual-background">
      <div class="sky-gradient"></div>
      <div class="temple-silhouette"></div>
      <div class="mist-layer"></div>
      <div class="floating-petals">
        <div v-for="i in 15" :key="i" class="petal" :style="getPetalStyle(i)">🌸</div>
      </div>
      <div class="incense-smoke"></div>
    </div>

    <div class="container">
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content">
          <!-- Animated Lotus -->
          <div class="lotus-container">
            <div class="lotus-glow"></div>
            <div class="lotus-symbol">
              <div class="lotus-petals">
                <span class="petal-layer">🪷</span>
              </div>
            </div>
          </div>
          
          <h1 class="main-title">
            <span class="title-word">GÓC</span>
            <span class="title-word">AN</span>
            <span class="title-word">NHIÊN</span>
          </h1>
          
          <div class="tagline-container">
            <div class="tagline-decoration left">✦</div>
            <p class="tagline">Nơi tâm linh gặp gỡ công nghệ</p>
            <div class="tagline-decoration right">✦</div>
          </div>
          
          <p class="description">Tu tâm dưỡng tính · Tích công lũy đức · Buông xả phiền não</p>
        </div>
        
        <!-- User Info -->
        <div class="user-section">
          <div class="user-avatar">🙏</div>
          <span class="user-email">{{ getUserEmail() }}</span>
          <button @click="handleLogout" class="logout-btn">
            <span class="logout-icon">⎋</span>
            <span>Đăng xuất</span>
          </button>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features-section">
        <div class="section-header">
          <div class="section-decoration">◈</div>
          <h2 class="section-title">Tính Năng Tâm Linh</h2>
          <div class="section-decoration">◈</div>
        </div>
        
        <div class="features-grid">
          <!-- Wooden Fish - Primary Feature -->
          <div class="feature-card primary wooden-fish" @click="navigateTo('/wooden-fish')">
            <div class="card-aura"></div>
            <div class="card-shine"></div>
            <div class="feature-content">
              <div class="feature-icon-wrapper">
                <div class="icon-glow"></div>
                <div class="feature-icon">🪷</div>
              </div>
              <h3 class="feature-title">Gõ Mõ Giải Nghiệp</h3>
              <p class="feature-desc">Tích công đức, giải nghiệp chướng<br/>Con đường tu tâm dưỡng tính</p>
              <div class="feature-badge popular">⭐ Phổ biến</div>
              <div class="card-pattern"></div>
            </div>
          </div>

          <!-- Prayer Lantern -->
          <div class="feature-card highlight lantern" @click="navigateTo('/prayer')">
            <div class="card-aura"></div>
            <div class="card-shine"></div>
            <div class="feature-content">
              <div class="feature-icon-wrapper">
                <div class="icon-glow"></div>
                <div class="feature-icon">🏮</div>
              </div>
              <h3 class="feature-title">Phóng Đăng Cầu Nguyện</h3>
              <p class="feature-desc">Thả đèn trời, gửi lời cầu nguyện<br/>Ước mơ bay cao trên trời</p>
              <div class="feature-badge new">✨ Mới</div>
              <div class="card-pattern"></div>
            </div>
          </div>

          <!-- Worry Jar -->
          <div class="feature-card highlight worry" @click="navigateTo('/worry-jar')">
            <div class="card-aura"></div>
            <div class="card-shine"></div>
            <div class="feature-content">
              <div class="feature-icon-wrapper">
                <div class="icon-glow"></div>
                <div class="feature-icon">🏺</div>
              </div>
              <h3 class="feature-title">Hũ Trút Bầu Tâm Sự</h3>
              <p class="feature-desc">Gửi nỗi lo vào hư không<br/>Tìm lại bình yên tâm hồn</p>
              <div class="feature-badge privacy">🔒 Riêng tư</div>
              <div class="card-pattern"></div>
            </div>
          </div>

          <!-- Other Features -->
          <div class="feature-card" @click="navigateTo('/altar')">
            <div class="card-shine"></div>
            <div class="feature-icon">🕯️</div>
            <h3 class="feature-title">Thắp Nhang Kính Tổ</h3>
            <p class="feature-desc">Tưởng nhớ tổ tiên</p>
          </div>

          <div class="feature-card" @click="navigateTo('/divination')">
            <div class="card-shine"></div>
            <div class="feature-icon">🔮</div>
            <h3 class="feature-title">Huyền Học Tâm Linh</h3>
            <p class="feature-desc">Tử vi, thần số, tarot</p>
          </div>

          <div class="feature-card" @click="navigateTo('/shop')">
            <div class="card-shine"></div>
            <div class="feature-icon">🛍️</div>
            <h3 class="feature-title">Tịnh Thất Linh Vật</h3>
            <p class="feature-desc">Đồ vật tâm linh</p>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="footer">
        <div class="footer-decoration">✦ ◈ ✦</div>
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

const getPetalStyle = (index) => {
  const x = Math.random() * 100
  const y = Math.random() * 100
  const delay = Math.random() * 15
  const duration = 10 + Math.random() * 10
  
  return {
    left: `${x}%`,
    top: `${y}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    opacity: 0.4 + Math.random() * 0.4
  }
}
</script>

<style scoped>
/* ========================================
   BASE LAYOUT
======================================== */
.home-page {
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
}

/* ========================================
   SPIRITUAL BACKGROUND
======================================== */
.spiritual-background {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
}

.sky-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    #0a0e27 0%,
    #16213e 30%,
    #1a1445 60%,
    #2d1b4e 100%
  );
}

.temple-silhouette {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 300px;
  background: 
    radial-gradient(ellipse at 50% 100%, rgba(10, 10, 20, 0.9) 0%, transparent 70%),
    linear-gradient(to top, rgba(10, 10, 20, 0.8) 0%, transparent 100%);
  opacity: 0.7;
}

.mist-layer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 400px;
  background: 
    radial-gradient(ellipse at 30% 100%, rgba(167, 139, 250, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 100%, rgba(244, 196, 48, 0.06) 0%, transparent 50%);
  animation: mist-flow 20s ease-in-out infinite;
}

@keyframes mist-flow {
  0%, 100% { opacity: 0.5; transform: translateY(0); }
  50% { opacity: 0.8; transform: translateY(-20px); }
}

.floating-petals {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.petal {
  position: absolute;
  font-size: 1.2rem;
  animation: petal-fall 15s linear infinite;
  filter: drop-shadow(0 2px 8px rgba(244, 196, 48, 0.3));
}

@keyframes petal-fall {
  0% {
    transform: translateY(-20px) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(360deg);
    opacity: 0;
  }
}

.incense-smoke {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 400px;
  background: radial-gradient(
    ellipse at bottom,
    rgba(167, 139, 250, 0.15) 0%,
    rgba(244, 196, 48, 0.1) 30%,
    transparent 60%
  );
  filter: blur(30px);
  animation: smoke-rise 15s ease-in-out infinite;
}

@keyframes smoke-rise {
  0%, 100% {
    opacity: 0.3;
    transform: translateX(-50%) translateY(0);
  }
  50% {
    opacity: 0.6;
    transform: translateX(-50%) translateY(-50px);
  }
}

/* ========================================
   CONTAINER
======================================== */
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

/* ========================================
   HERO SECTION
======================================== */
.hero {
  text-align: center;
  padding: 3rem 0 4rem;
  margin-bottom: 3rem;
}

.hero-content {
  max-width: 900px;
  margin: 0 auto 2.5rem;
}

/* Lotus Symbol */
.lotus-container {
  position: relative;
  display: inline-block;
  margin-bottom: 2rem;
}

.lotus-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(244, 196, 48, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  animation: lotus-pulse 4s ease-in-out infinite;
}

@keyframes lotus-pulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.5;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.8;
  }
}

.lotus-symbol {
  position: relative;
  width: 140px;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(244, 196, 48, 0.15), rgba(186, 85, 211, 0.15));
  border-radius: 50%;
  border: 3px solid rgba(244, 196, 48, 0.4);
  box-shadow: 
    0 0 50px rgba(244, 196, 48, 0.4),
    0 20px 60px rgba(0, 0, 0, 0.3),
    inset 0 2px 20px rgba(255, 255, 255, 0.1);
}

.lotus-petals {
  position: relative;
  animation: lotus-bloom 6s ease-in-out infinite;
}

.petal-layer {
  font-size: 6rem;
  filter: drop-shadow(0 8px 30px rgba(244, 196, 48, 0.5));
}

@keyframes lotus-bloom {
  0%, 100% {
    transform: scale(1) rotate(0deg);
  }
  50% {
    transform: scale(1.1) rotate(10deg);
  }
}

/* Title */
.main-title {
  font-size: 4.5rem;
  font-weight: 900;
  margin-bottom: 1.5rem;
  letter-spacing: 0.2em;
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.title-word {
  background: linear-gradient(135deg, #f4c430 0%, #ffd700 50%, #ff9966 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 4px 40px rgba(244, 196, 48, 0.5);
  animation: title-glow 3s ease-in-out infinite;
  animation-delay: calc(var(--index, 0) * 0.2s);
}

.title-word:nth-child(1) { --index: 0; }
.title-word:nth-child(2) { --index: 1; }
.title-word:nth-child(3) { --index: 2; }

@keyframes title-glow {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.3); }
}

/* Tagline */
.tagline-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.tagline-decoration {
  color: rgba(244, 196, 48, 0.6);
  font-size: 1.2rem;
  animation: decoration-twinkle 2s ease-in-out infinite;
}

.tagline-decoration.right {
  animation-delay: 1s;
}

@keyframes decoration-twinkle {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

.tagline {
  font-size: 1.6rem;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 600;
  font-style: italic;
  letter-spacing: 0.05em;
}

.description {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 400;
  letter-spacing: 0.05em;
}

/* User Section */
.user-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1rem 2rem;
  background: rgba(26, 26, 46, 0.6);
  backdrop-filter: blur(20px);
  border-radius: 50px;
  border: 2px solid rgba(244, 196, 48, 0.3);
  max-width: 450px;
  margin: 0 auto;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.user-avatar {
  font-size: 1.5rem;
  filter: drop-shadow(0 2px 8px rgba(244, 196, 48, 0.4));
}

.user-email {
  color: #f4c430;
  font-weight: 600;
  font-size: 1.05rem;
  flex: 1;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.5rem;
  background: rgba(255, 107, 107, 0.2);
  border: 1.5px solid rgba(255, 107, 107, 0.4);
  border-radius: 25px;
  color: #ff9999;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.logout-btn:hover {
  background: rgba(255, 107, 107, 0.3);
  border-color: rgba(255, 107, 107, 0.6);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
}

.logout-icon {
  font-size: 1.2rem;
}

/* ========================================
   FEATURES SECTION
======================================== */
.features-section {
  flex: 1;
  margin-bottom: 3rem;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.section-decoration {
  color: rgba(244, 196, 48, 0.6);
  font-size: 1.5rem;
  animation: decoration-twinkle 2s ease-in-out infinite;
}

.section-title {
  font-size: 2.2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #f4c430, #ffd700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.1em;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.8rem;
}

/* ========================================
   FEATURE CARDS
======================================== */
.feature-card {
  position: relative;
  background: rgba(26, 26, 46, 0.5);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

/* Large Cards */
.feature-card.primary,
.feature-card.highlight {
  grid-column: span 1;
  grid-row: span 2;
  padding: 2.5rem;
  min-height: 360px;
  display: flex;
  flex-direction: column;
}

/* Card Effects */
.card-aura {
  position: absolute;
  inset: -50%;
  background: radial-gradient(circle, rgba(244, 196, 48, 0.2) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.5s;
}

.card-shine {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent 30%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 70%
  );
  transform: translateX(-100%);
  transition: transform 0.8s;
}

.feature-card:hover .card-shine {
  transform: translateX(100%);
}

.feature-card:hover .card-aura {
  opacity: 1;
}

.feature-card:hover {
  transform: translateY(-12px) scale(1.02);
  border-color: rgba(244, 196, 48, 0.5);
  box-shadow: 
    0 25px 70px rgba(244, 196, 48, 0.3),
    0 0 50px rgba(244, 196, 48, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

/* Wooden Fish Theme */
.feature-card.wooden-fish {
  border-color: rgba(244, 196, 48, 0.4);
  background: linear-gradient(135deg, rgba(244, 196, 48, 0.1), rgba(186, 85, 211, 0.08));
}

.feature-card.wooden-fish:hover {
  box-shadow: 
    0 25px 70px rgba(244, 196, 48, 0.4),
    0 0 60px rgba(244, 196, 48, 0.25);
}

/* Lantern Theme */
.feature-card.lantern {
  border-color: rgba(255, 153, 102, 0.4);
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(255, 153, 102, 0.08));
}

.feature-card.lantern:hover {
  border-color: rgba(255, 153, 102, 0.5);
  box-shadow: 
    0 25px 70px rgba(255, 153, 102, 0.4),
    0 0 60px rgba(255, 107, 107, 0.25);
}

.feature-card.lantern .card-aura {
  background: radial-gradient(circle, rgba(255, 153, 102, 0.2) 0%, transparent 70%);
}

/* Worry Jar Theme */
.feature-card.worry {
  border-color: rgba(167, 139, 250, 0.4);
  background: linear-gradient(135deg, rgba(167, 139, 250, 0.1), rgba(139, 92, 246, 0.08));
}

.feature-card.worry:hover {
  border-color: rgba(167, 139, 250, 0.5);
  box-shadow: 
    0 25px 70px rgba(167, 139, 250, 0.4),
    0 0 60px rgba(139, 92, 246, 0.25);
}

.feature-card.worry .card-aura {
  background: radial-gradient(circle, rgba(167, 139, 250, 0.2) 0%, transparent 70%);
}

/* Card Content */
.feature-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.feature-icon-wrapper {
  position: relative;
  margin-bottom: 1.5rem;
}

.icon-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, rgba(244, 196, 48, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  animation: icon-pulse 3s ease-in-out infinite;
}

@keyframes icon-pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
  50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.8; }
}

.feature-icon {
  position: relative;
  font-size: 5rem;
  filter: drop-shadow(0 8px 20px rgba(244, 196, 48, 0.5));
  animation: icon-float 3s ease-in-out infinite;
}

.feature-card:not(.primary):not(.highlight) .feature-icon {
  font-size: 3.5rem;
  margin-bottom: 1rem;
}

@keyframes icon-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.feature-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #f4c430;
  margin-bottom: 1rem;
  letter-spacing: 0.05em;
}

.feature-card:not(.primary):not(.highlight) .feature-title {
  font-size: 1.4rem;
}

.feature-desc {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.05rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.feature-badge {
  display: inline-block;
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-top: auto;
}

.feature-badge.popular {
  background: linear-gradient(135deg, rgba(244, 196, 48, 0.3), rgba(255, 215, 0, 0.25));
  border: 1.5px solid rgba(244, 196, 48, 0.5);
  color: #ffd700;
  box-shadow: 0 4px 15px rgba(244, 196, 48, 0.3);
}

.feature-badge.new {
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.3), rgba(255, 153, 102, 0.25));
  border: 1.5px solid rgba(255, 107, 107, 0.5);
  color: #ff9966;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
}

.feature-badge.privacy {
  background: linear-gradient(135deg, rgba(167, 139, 250, 0.3), rgba(139, 92, 246, 0.25));
  border: 1.5px solid rgba(167, 139, 250, 0.5);
  color: #c4b5fd;
  box-shadow: 0 4px 15px rgba(167, 139, 250, 0.3);
}

.card-pattern {
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.03) 0%, transparent 50%);
  pointer-events: none;
}

/* ========================================
   FOOTER
======================================== */
.footer {
  text-align: center;
  padding: 2.5rem 0;
  border-top: 1px solid rgba(244, 196, 48, 0.2);
  margin-top: 3rem;
}

.footer-decoration {
  color: rgba(244, 196, 48, 0.5);
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.footer p {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.95rem;
  margin: 0;
}

/* ========================================
   RESPONSIVE
======================================== */
@media (max-width: 1024px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .feature-card.primary {
    grid-column: span 2;
    grid-row: span 1;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  .lotus-symbol {
    width: 100px;
    height: 100px;
  }
  
  .petal-layer {
    font-size: 4rem;
  }
  
  .main-title {
    font-size: 2.5rem;
    gap: 0.8rem;
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
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .feature-card.primary,
  .feature-card.highlight {
    grid-column: span 1;
  }
  
  .section-title {
    font-size: 1.6rem;
  }
  
  .feature-icon {
    font-size: 4rem;
  }
  
  .feature-title {
    font-size: 1.5rem;
  }
}

@media (hover: none) {
  .feature-card:active {
    transform: scale(0.98);
  }
}
</style>
