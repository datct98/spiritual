<template>
  <AuthPage v-if="!isAuthenticated" />

  <div v-else class="healing-sanctuary">
    <!-- PASTEL GRADIENT BACKGROUND -->
    <div class="bg-gradient"></div>
    
    <!-- FLOATING ORBS -->
    <div class="floating-orbs">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
    </div>

    <!-- RIPPLE EFFECTS LAYER -->
    <div class="ripple-container" ref="rippleContainer"></div>

    <!-- CONTENT WRAPPER -->
    <div class="content-wrapper">
      <!-- HEADER (Minimal) -->
      <header class="sanctuary-header">
        <button @click="$router.push('/home')" class="back-btn">
          <span>←</span> Quay lại trang chủ
        </button>
        <span class="user-email">{{ getUserEmail() }}</span>
      </header>

      <!-- MAIN STAGE -->
      <main class="main-stage">
        <!-- WOODEN FISH CENTER -->
        <div class="fish-container">
          <WoodenFish @click="handleTap" />
          <p class="tap-hint">Tap for Peace</p>
        </div>
      </main>

      <!-- STATS CARDS (Floating) -->
      <footer class="stats-footer">
        <div class="stat-card">
          <div class="stat-icon">🌟</div>
          <div class="stat-label">Merit</div>
          <div class="stat-value">{{ stats.merit }}</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">☮️</div>
          <div class="stat-label">Peace</div>
          <div class="stat-value">{{ stats.peace }}</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">⚖️</div>
          <div class="stat-label">Karma</div>
          <div class="stat-value">{{ stats.karma }}</div>
        </div>
      </footer>
    </div>

    <!-- LEVEL PROGRESS (Top Line) -->
    <div class="level-progress-bar">
      <div class="level-fill" :style="{ width: levelProgress + '%' }"></div>
    </div>

    <!-- FLOATING TEXT -->
    <div class="float-layer">
      <FloatingText 
        v-for="t in floatingTexts" 
        :key="t.id" 
        :text="t.text" 
        :x="t.x" 
        :y="t.y" 
        :stat-type="t.statType"
        :is-meme="t.isMeme" 
      />
    </div>

    <!-- TOAST -->
    <Transition name="fade">
      <div v-if="rateLimitMessage" class="sanctuary-toast">
        {{ rateLimitMessage }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import AuthPage from './components/AuthPage.vue'
import WoodenFish from './components/WoodenFish.vue'
import FloatingText from './components/FloatingText.vue'
import { useGameStats } from './composables/useGameStats'
import { useSoundManager } from './composables/useSoundManager'
import { useAuth } from './composables/useAuth'

const { isAuthenticated, getUserEmail } = useAuth()
const { stats, incrementMerit, level, rateLimitMessage } = useGameStats()
const { playWoodenFish, playGong } = useSoundManager()

const floatingTexts = ref([])
let textId = 0
const rippleContainer = ref(null)

// Level Calc
const nextLevelPoints = computed(() => level.value * 100)
const levelProgress = computed(() => ((stats.value.totalPoints % 100) / 100) * 100)

const memes = [
  'Divine ✨', 'Serenity 🌸', 'Balance ⚖️', 'Focus 🧘', 'Flow 🌊'
]

const handleTap = async (event) => {
  // Get tap coordinates
  let x = window.innerWidth / 2
  let y = window.innerHeight / 2
  
  if (event && (event.clientX || (event.touches && event.touches[0]))) {
    x = event.clientX || event.touches[0].clientX
    y = event.clientY || event.touches[0].clientY
  }
  
  // Create ripple effect
  createRipple(x, y)
  
  // Create glow pulse
  createGlowPulse(x, y)
  
  // Play sound
  playWoodenFish()

  try {
    const res = await incrementMerit()
    // Determine what type of point was awarded
    const statType = res.type || 'merit' // 'merit', 'peace', 'karma'
    
    // Less spam, more meaning
    const isMeme = Math.random() < 0.1
    const txt = isMeme 
      ? memes[Math.floor(Math.random() * memes.length)]
      : (res.displayText || '+1')
    
    createFloatingText(txt, isMeme, statType)
    
    if (stats.value.totalPoints % 1000 === 0 && stats.value.totalPoints > 0) {
      playGong()
    }
  } catch (e) {
    createFloatingText('+1', false, 'merit')
  }
}

const createRipple = (x, y) => {
  if (!rippleContainer.value) return
  
  // Create 3 ripples with slight delay
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      const ripple = document.createElement('div')
      ripple.className = 'ripple-effect'
      ripple.style.left = `${x}px`
      ripple.style.top = `${y}px`
      rippleContainer.value.appendChild(ripple)
      
      // Remove after animation
      setTimeout(() => ripple.remove(), 1200)
    }, i * 100)
  }
}

const createGlowPulse = (x, y) => {
  if (!rippleContainer.value) return
  
  const glow = document.createElement('div')
  glow.className = 'glow-effect'
  glow.style.left = `${x}px`
  glow.style.top = `${y}px`
  rippleContainer.value.appendChild(glow)
  
  // Remove after animation
  setTimeout(() => glow.remove(), 800)
}

const createFloatingText = (text, isMeme, statType = 'merit') => {
  floatingTexts.value.push({
    id: textId++,
    text,
    x: window.innerWidth / 2,
    y: window.innerHeight / 2 - 80,
    isMeme,
    statType
  })
  setTimeout(() => floatingTexts.value.shift(), 2500)
}
</script>

<style>
@import './assets/style.css';
</style>

<style scoped>
.healing-sanctuary {
  position: relative;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  font-family: var(--font-body);
  color: var(--text-dark);
}

/* BACKGROUND */
.bg-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    var(--pastel-lavender) 0%,
    var(--pastel-peach) 50%,
    var(--pastel-mint) 100%
  );
  background-size: 200% 200%;
  animation: gentleShift 20s ease-in-out infinite;
  z-index: 0;
}

/* FLOATING ORBS */
.floating-orbs {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  overflow: hidden;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.4;
  animation: floatOrb 10s ease-in-out infinite;
}

.orb-1 {
  width: 300px;
  height: 300px;
  background: var(--soft-pink);
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.orb-2 {
  width: 250px;
  height: 250px;
  background: var(--sky-blue);
  top: 60%;
  right: 15%;
  animation-delay: 3s;
}

.orb-3 {
  width: 200px;
  height: 200px;
  background: var(--gold-glow);
  bottom: 20%;
  left: 20%;
  animation-delay: 6s;
}

/* RIPPLE EFFECTS */
.ripple-container {
  position: absolute;
  inset: 0;
  z-index: 10;
  pointer-events: none;
}

.ripple-effect {
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid var(--gold-glow);
  transform: translate(-50%, -50%);
  animation: ripple 1.2s ease-out;
  pointer-events: none;
}

.glow-effect {
  position: absolute;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--gold-glow), var(--soft-pink), transparent);
  transform: translate(-50%, -50%);
  animation: glowPulse 0.8s ease-out;
  pointer-events: none;
}

/* CONTENT */
.content-wrapper {
  position: relative;
  z-index: 5;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2rem;
}

/* HEADER */
.sanctuary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  opacity: 0.9;
}

.back-btn {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  padding: 0.7rem 1.2rem;
  font-family: var(--font-heading);
  font-size: 0.9rem;
  color: var(--text-dark);
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-2px);
}

.user-email {
  font-size: 0.85rem;
  color: var(--text-muted);
  font-family: var(--font-mono);
}

/* MAIN STAGE */
.main-stage {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fish-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.tap-hint {
  font-family: var(--font-heading);
  font-size: 1rem;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  opacity: 0.7;
  transition: all 0.3s;
}

.fish-container:hover .tap-hint {
  opacity: 1;
  color: var(--text-dark);
}

/* STATS FOOTER */
.stats-footer {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.stat-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  padding: 1.5rem 2rem;
  min-width: 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 10px 40px var(--shadow-soft);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 15px 50px var(--shadow-medium);
}

.stat-icon {
  font-size: 2rem;
}

.stat-label {
  font-family: var(--font-heading);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--text-muted);
  font-weight: 600;
}

.stat-value {
  font-family: var(--font-mono);
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--text-dark);
}

/* LEVEL PROGRESS */
.level-progress-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: rgba(255, 255, 255, 0.3);
  z-index: 50;
}

.level-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--gold-glow), var(--soft-pink));
  transition: width 0.5s ease;
}

/* FLOATING TEXT LAYER */
.float-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 100;
}

/* TOAST */
.sanctuary-toast {
  position: fixed;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 181, 194, 0.9);
  border: 1px solid rgba(255, 181, 194, 0.5);
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-family: var(--font-heading);
  backdrop-filter: blur(10px);
  z-index: 200;
  box-shadow: 0 4px 20px var(--shadow-soft);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .content-wrapper {
    padding: 1rem;
  }
  
  .stats-footer {
    gap: 1rem;
  }
  
  .stat-card {
    min-width: 100px;
    padding: 1rem 1.5rem;
  }
  
  .stat-icon {
    font-size: 1.5rem;
  }
  
  .stat-value {
    font-size: 1.4rem;
  }
  
  .sanctuary-header {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
}
</style>
