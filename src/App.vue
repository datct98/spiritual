<template>
  <!-- Show AuthPage if not authenticated -->
  <AuthPage v-if="!isAuthenticated" />

  <!-- Show main app if authenticated -->
  <div v-else>
    <div class="app-background"></div>
    
    <div class="app-container" :class="{ shake: isShaking }">
      <header class="header">
        <h1 class="title">🪷 GÕ MÕ TÂM LINH 🪷</h1>
        <p class="subtitle">Tu tâm dưỡng tính - Tích công lũy đức</p>
        
        <!-- User info and logout -->
        <div class="user-bar">
          <span class="user-email">{{ getUserEmail() }}</span>
          <button @click="handleLogout" class="logout-btn">
            Đăng xuất 🚪
          </button>
        </div>
      </header>

      <ComboStreak 
        :combo="comboCount" 
        :level="comboLevel" 
        :color="comboColor"
      />

      <main class="main-content">
        <WoodenFish @click="handleWoodenFishClick" />
        
        <StatsDisplay :stats="stats" :level="level" />
        
        <!-- Rate limit message -->
        <div v-if="rateLimitMessage" class="rate-limit-toast">
          {{ rateLimitMessage }}
        </div>
      </main>

      <footer class="footer">
        <p>Made with 💖 for Gen Z spiritual seekers</p>
      </footer>

      <!-- Floating texts container -->
      <div class="floating-texts-container">
        <FloatingText
          v-for="text in floatingTexts"
          :key="text.id"
          :text="text.text"
          :x="text.x"
          :y="text.y"
          :is-meme="text.isMeme"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AuthPage from './components/AuthPage.vue'
import WoodenFish from './components/WoodenFish.vue'
import FloatingText from './components/FloatingText.vue'
import ComboStreak from './components/ComboStreak.vue'
import StatsDisplay from './components/StatsDisplay.vue'
import { useGameStats } from './composables/useGameStats'
import { useCombo } from './composables/useCombo'
import { useSoundManager } from './composables/useSoundManager'
import { useAuth } from './composables/useAuth'

// Composables
const { isAuthenticated, getUserEmail, logout } = useAuth()
const { stats, incrementMerit, incrementPeace, incrementKarma, level, rateLimitMessage } = useGameStats()
const { comboCount, comboLevel, comboColor, increment: incrementCombo } = useCombo()
const { playWoodenFish, playGong } = useSoundManager()

// State
const floatingTexts = ref([])
const isShaking = ref(false)
let floatingTextId = 0

// Gen Z meme texts (5% chance)
const memeTexts = [
  'Quá keo 🔥',
  'Slay queen 💅',
  'Tịnh tâm nhưng vẫn cháy 🔥',
  'Nam mô a di đà... lạt 😌',
  'Công đức max! 🚀',
  'Spiritual vibes ✨',
  'Chaotic good 😇'
]

const regularTexts = [
  '+1 Công đức',
  'Tâm tịnh +1',
  'Nghiệp -1'
]

// Handle logout with confirmation
const handleLogout = () => {
  if (confirm('Bạn chắc chắn muốn đăng xuất?')) {
    logout()
  }
}

const handleWoodenFishClick = async () => {
  // Play sound immediately
  playWoodenFish()
  
  // Create floating text immediately for instant feedback
  createFloatingText()
  
  // Increment combo immediately
  const comboResult = incrementCombo()
  
  // Try to increment stats via API
  try {
    await incrementMerit()
    incrementPeace()
    incrementKarma()
    
    // Check for milestone (every 1000 points)
    if (stats.value.merit % 1000 === 0 && stats.value.merit > 0) {
      playGong()
    }
    
    // Check for combo milestone (screen shake at 100, 200, etc.)
    if (comboResult.isMilestone) {
      triggerScreenShake()
    }
  } catch (error) {
    // API error - rate limit or network issue
    // Error message is shown via rateLimitMessage
    // But still show visual feedback (floating text, combo, sound already played)
    console.error('Merit API error:', error)
  }
}

const createFloatingText = () => {
  // 5% chance for meme text
  const isMeme = Math.random() < 0.05
  const textArray = isMeme ? memeTexts : regularTexts
  const text = textArray[Math.floor(Math.random() * textArray.length)]
  
  // Get position (center of screen approximately where wooden fish is)
  const x = window.innerWidth / 2
  const y = window.innerHeight / 2
  
  const newText = {
    id: floatingTextId++,
    text,
    x,
    y,
    isMeme
  }
  
  floatingTexts.value.push(newText)
  
  // Remove after animation (1.5s)
  setTimeout(() => {
    const index = floatingTexts.value.findIndex(t => t.id === newText.id)
    if (index > -1) {
      floatingTexts.value.splice(index, 1)
    }
  }, 1600)
}

const triggerScreenShake = () => {
  isShaking.value = true
  setTimeout(() => {
    isShaking.value = false
  }, 500)
}
</script>

<style>
@import './assets/style.css';
</style>

<style scoped>
.app-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 2rem 1rem;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.title {
  font-size: 2.5rem;
  font-weight: 900;
  color: var(--gold-dark);
  text-shadow: 
    0 2px 10px rgba(255, 255, 255, 0.8),
    0 4px 20px rgba(244, 196, 48, 0.4);
  margin-bottom: 0.5rem;
  font-family: 'Noto Serif', serif;
}

.subtitle {
  font-size: 1.1rem;
  color: var(--purple-dark);
  font-weight: 600;
  font-style: italic;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  width: 100%;
  max-width: 800px;
}

.footer {
  margin-top: 2rem;
  text-align: center;
  font-size: 0.9rem;
  color: var(--purple-dark);
  opacity: 0.8;
}

.floating-texts-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
}

/* User bar */
.user-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
  padding: 0.8rem 1.2rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.user-email {
  color: var(--gold-dark);
  font-weight: 600;
  font-size: 0.9rem;
}

.logout-btn {
  padding: 0.5rem 1rem;
  background: rgba(255, 59, 48, 0.2);
  border: 1px solid rgba(255, 59, 48, 0.4);
  border-radius: 12px;
  color: #ff6b6b;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.logout-btn:hover {
  background: rgba(255, 59, 48, 0.3);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 59, 48, 0.3);
}

.logout-btn:active {
  transform: translateY(0);
}

/* Rate limit toast */
.rate-limit-toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 1rem 1.5rem;
  background: rgba(255, 152, 0, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 8px 24px rgba(255, 152, 0, 0.4);
  animation: slideDown 0.3s ease, pulse 0.5s ease 0.3s infinite alternate;
  z-index: 10000;
  text-align: center;
  max-width: 90%;
}

@keyframes slideDown {
  from {
    transform: translateX(-50%) translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
}


@media (max-width: 768px) {
  .title {
    font-size: 1.8rem;
  }
  
  .subtitle {
    font-size: 0.9rem;
  }
  
  .app-container {
    padding: 1rem 0.5rem;
  }
}
</style>
