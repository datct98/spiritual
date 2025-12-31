<template>
  <div class="app-background"></div>
  
  <div class="app-container" :class="{ shake: isShaking }">
    <header class="header">
      <h1 class="title">🪷 GÕ MÕ TÂM LINH 🪷</h1>
      <p class="subtitle">Tu tâm dưỡng tính - Tích công lũy đức</p>
    </header>

    <ComboStreak 
      :combo="comboCount" 
      :level="comboLevel" 
      :color="comboColor"
    />

    <main class="main-content">
      <WoodenFish @click="handleWoodenFishClick" />
      
      <StatsDisplay :stats="stats" :level="level" />
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
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import WoodenFish from './components/WoodenFish.vue'
import FloatingText from './components/FloatingText.vue'
import ComboStreak from './components/ComboStreak.vue'
import StatsDisplay from './components/StatsDisplay.vue'
import { useGameStats } from './composables/useGameStats'
import { useCombo } from './composables/useCombo'
import { useSoundManager } from './composables/useSoundManager'

// Composables
const { stats, incrementMerit, incrementPeace, incrementKarma, level } = useGameStats()
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

const handleWoodenFishClick = async () => {
  // Play sound
  playWoodenFish()
  
  // Increment stats
  incrementMerit()
  incrementPeace()
  incrementKarma()
  
  // Increment combo
  const comboResult = incrementCombo()
  
  // Check for milestone (every 1000 points)
  if (stats.value.merit % 1000 === 0 && stats.value.merit > 0) {
    playGong()
  }
  
  // Check for combo milestone (screen shake at 100, 200, etc.)
  if (comboResult.isMilestone) {
    triggerScreenShake()
  }
  
  // Create floating text
  createFloatingText()
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
