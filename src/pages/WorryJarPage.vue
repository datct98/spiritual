<template>
  <div class="worry-jar-page" :class="`theme-${currentTheme}`">
    <!-- Dynamic Background theo theme -->
    <div class="theme-background" :style="backgroundStyle"></div>

    <!-- Header -->
    <header class="page-header">
      <button @click="$router.push('/home')" class="back-btn">
        <span class="back-icon">←</span>
        <span>Trang chủ</span>
      </button>
      <h1 class="page-title">🏺 Hũ Trút Bầu Tâm Sự</h1>
      
      <!-- Theme Testing Controls -->
      <div class="controls">
        <button @click="toggleSound" class="control-btn" :title="soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'">
          {{ soundEnabled ? '🔊' : '🔇' }}
        </button>
        
        <div class="theme-tester">
          <button @click="showThemeTester = !showThemeTester" class="control-btn" title="Test Themes">
            🎨
          </button>
          <div v-if="showThemeTester" class="theme-dropdown">
            <button @click="forceTheme('morning')" :class="{ active: currentTheme === 'morning' }">
              🌅 Buổi Sáng (5-11h)
            </button>
            <button @click="forceTheme('noon')" :class="{ active: currentTheme === 'noon' }">
              ☀️ Buổi Trưa (11-16h)
            </button>
            <button @click="forceTheme('evening')" :class="{ active: currentTheme === 'evening' }">
              🌊 Buổi Chiều (16-20h)
            </button>
            <button @click="forceTheme('night')" :class="{ active: currentTheme === 'night' }">
              🌙 Buổi Tối (20-5h)
            </button>
            <button @click="forceTheme(null)" class="reset-theme">
              🔄 Auto (theo giờ hệ thống)
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content Area -->
    <div class="content-area">
      <!-- Theme Component - Full Screen -->
      <component 
        :is="currentThemeComponent"
        @finished="onThemeFinished"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, markRaw } from 'vue'
import { useRouter } from 'vue-router'

// Import theme components
import ThemeMorning from '../components/effects/ThemeMorning.vue'

const router = useRouter()

// ============================================
// STATE
// ============================================

const soundEnabled = ref(true)
const showThemeTester = ref(false)

// Theme system
const currentTheme = ref('morning') // Default to morning for testing
const manualThemeOverride = ref(null)

// Theme configurations
const themes = {
  morning: {
    key: 'morning',
    name: 'Bồ Công Anh',
    icon: '🌅',
    description: 'Những nỗi lo bay đi như hạt bồ công anh trong gió',
    component: markRaw(ThemeMorning),
    background: 'linear-gradient(180deg, #87CEEB 0%, #B0D4F1 30%, #D4E7F5 60%, #E8F4F8 100%)'
  },
  noon: {
    key: 'noon',
    name: 'Hóa Tro Tàn',
    icon: '🔥',
    description: 'Đốt cháy nỗi lo, hóa thành tro tàn và gió cuốn đi',
    component: null, // Will be implemented later
    background: 'linear-gradient(180deg, #F4EDE4 0%, #E8DCC8 50%, #D4B896 100%)'
  },
  evening: {
    key: 'evening',
    name: 'Sóng Xóa Cát',  
    icon: '🌊',
    description: 'Như chữ viết trên cát, sóng biển xóa tan nỗi lo',
    component: null, // Will be implemented later
    background: 'linear-gradient(180deg, #E8D7C3 0%, #D4C2A8 50%, #C0A882 100%)'
  },
  night: {
    key: 'night',
    name: 'Trăng Đáy Nước',
    icon: '🌙',
    description: 'Phản chiếu dưới đáy nước, tan biến theo gợn sóng',
    component: null, // Will be implemented later
    background: 'linear-gradient(180deg, #1A2332 0%, #0F1419 50%, #000000 100%)'
  }
}

// ============================================
// COMPUTED
// ============================================

const themeConfig = computed(() => {
  return themes[currentTheme.value] || themes.morning
})

const currentThemeComponent = computed(() => {
  return themeConfig.value.component
})

const backgroundStyle = computed(() => {
  return {
    background: themeConfig.value.background
  }
})

// ============================================
// METHODS
// ============================================

/**
 * Detect theme based on current hour
 */
const detectTheme = () => {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 11) return 'morning'
  if (hour >= 11 && hour < 16) return 'noon'
  if (hour >= 16 && hour < 20) return 'evening'
  return 'night'
}

/**
 * Force a specific theme (for testing)
 */
const forceTheme = (theme) => {
  if (theme === null) {
    // Reset to auto-detect
    manualThemeOverride.value = null
    currentTheme.value = detectTheme()
  } else {
    manualThemeOverride.value = theme
    currentTheme.value = theme
  }
  
  showThemeTester.value = false
}

/**
 * Toggle sound on/off
 */
const toggleSound = () => {
  soundEnabled.value = !soundEnabled.value
  if (soundEnabled.value) {
    playSound('toggle')
  }
}

/**
 * Play sound effect
 */
const playSound = (type) => {
  if (!soundEnabled.value) return
  
  try {
    let audio
    switch (type) {
      case 'toggle':
        audio = new Audio('/sounds/click.mp3')
        break
      default:
        return
    }
    audio.volume = 0.25
    audio.play().catch(err => console.log('Sound play failed:', err))
  } catch (err) {
    console.log('Sound error:', err)
  }
}

/**
 * Handle theme animation finished
 */
const onThemeFinished = () => {
  console.log('Theme animation finished')
  // Could show a success message or return to home
  // For now, just log
}

// ============================================
// LIFECYCLE
// ============================================

onMounted(() => {
  // Detect theme based on current time (unless manually overridden)
  if (!manualThemeOverride.value) {
    currentTheme.value = detectTheme()
  }
})
</script>

<style scoped>
/* ========================================
   BASE LAYOUT
======================================== */
.worry-jar-page {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  font-family: 'Noto Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  transition: background 0.8s ease;
}

/* Dynamic Background */
.theme-background {
  position: fixed;
  inset: 0;
  z-index: 0;
  transition: background 0.8s ease;
}

/* ========================================
   HEADER
======================================== */
.page-header {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2.5rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  color: rgba(0, 0, 0, 0.8);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateX(-3px);
}

.back-icon {
  font-size: 1.2rem;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.8);
  margin: 0;
  text-shadow: 0 2px 8px rgba(255, 255, 255, 0.5);
}

.controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.control-btn {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

/* Theme Tester Panel */
.theme-tester {
  position: relative;
}

.theme-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 0.5rem;
  min-width: 220px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  z-index: 100;
}

.theme-dropdown button {
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  color: rgba(0, 0, 0, 0.8);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 0.5rem;
  text-align: left;
}

.theme-dropdown button:last-child {
  margin-bottom: 0;
}

.theme-dropdown button:hover {
  background: rgba(0, 0, 0, 0.1);
  border-color: rgba(0, 0, 0, 0.2);
}

.theme-dropdown button.active {
  background: rgba(74, 144, 226, 0.2);
  border-color: rgba(74, 144, 226, 0.4);
  font-weight: 600;
}

.theme-dropdown button.reset-theme {
  background: rgba(244, 196, 48, 0.1);
  border-color: rgba(244, 196, 48, 0.3);
}

.theme-dropdown button.reset-theme:hover {
  background: rgba(244, 196, 48, 0.2);
}

/* ========================================
   CONTENT AREA
======================================== */
.content-area {
  position: relative;
  z-index: 1;
  width: 100%;
  height: calc(100vh - 88px); /* Subtract header height */
}

/* ========================================
   THEME TRANSITIONS
======================================== */
.theme-morning .page-header {
  background: rgba(255, 255, 255, 0.15);
  border-bottom-color: rgba(255, 255, 255, 0.3);
}

.theme-noon .page-header {
  background: rgba(244, 237, 228, 0.8);
  border-bottom-color: rgba(180, 140, 100, 0.3);
}

.theme-noon .page-title,
.theme-noon .back-btn {
  color: rgba(60, 40, 20, 0.9);
}

.theme-evening .page-header {
  background: rgba(232, 215, 195, 0.8);
  border-bottom-color: rgba(180, 160, 130, 0.3);
}

.theme-evening .page-title,
.theme-evening .back-btn {
  color: rgba(80, 60, 40, 0.9);
}

.theme-night .page-header {
  background: rgba(26, 35, 50, 0.8);
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

.theme-night .page-title,
.theme-night .back-btn {
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

/* Responsive */
@media (max-width: 768px) {
  .page-header {
    padding: 1rem 1.5rem;
  }

  .page-title {
    font-size: 1.25rem;
  }

  .theme-dropdown {
    right: auto;
    left: 0;
  }
  
  .content-area {
    height: calc(100vh - 72px);
  }
}
</style>
