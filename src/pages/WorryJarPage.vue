<template>
  <div class="worry-jar-page">
    <!-- MAIN CONTENT - Water Reflection Theme -->
    <div class="content-area">
      <component 
        :is="currentThemeComponent"
        @finished="onThemeFinished"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, markRaw, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// Import new Water Reflection theme
import ThemeWaterReflection from '../components/effects/ThemeWaterReflection.vue'

const router = useRouter()

// ============================================
// STATE
// ============================================

const soundEnabled = ref(true)

// Use Water Reflection theme directly
const currentThemeComponent = markRaw(ThemeWaterReflection)

// ============================================
// METHODS
// ============================================

/**
 * Handle theme animation finished
 */
const onThemeFinished = () => {
  console.log('Worry release animation finished')
  // User can choose to go back or release another worry
  setTimeout(() => {
    router.push('/home')
  }, 2000)
}

// ============================================
// LIFECYCLE
// ============================================

onMounted(() => {
  console.log('Worry Jar page loaded with Water Reflection theme')
})
</script>

<style scoped>
/* ========================================
   BASE LAYOUT
======================================== */
.worry-jar-page {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  font-family: 'Noto Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  background: #0a1628;
}

/* ========================================
   CONTENT AREA
======================================== */
.content-area {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100vh; /* Full viewport height - no header */
}
</style>
