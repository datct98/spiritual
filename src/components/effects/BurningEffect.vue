<template>
  <div class="burning-effect">
    <!-- Background -->
    <div class="noon-background" :style="{ background: theme.bgColor }"></div>
    
    <!-- Old paper texture -->
    <div class="paper-texture"></div>
    
    <!-- Paper with text -->
    <div 
      v-if="showPaper" 
      ref="paperElement"
      class="burning-paper"
      :class="{ scorching: isScorching, burning: isBurning }"
    >
      <div class="paper-content" :style="{ fontFamily: theme.font, color: theme.textColor }">
        {{ text }}
      </div>
      
      <!-- Scorch overlay -->
      <div v-if="isScorching" class="scorch-overlay" :style="scorchStyle"></div>
    </div>
    
    <!-- Sparkle particles -->
    <div v-if="showSparkles" class="sparkles-container">
      <div 
        v-for="i in 60" 
        :key="`sparkle-${i}`" 
        class="sparkle-particle"
        :style="getSparkleStyle(i)"
      ></div>
    </div>
    
    <!-- Ash particles -->
    <div v-if="showAsh" class="ash-container">
      <div 
        v-for="i in 40" 
        :key="`ash-${i}`" 
        class="ash-particle"
        :style="getAshStyle(i)"
      ></div>
    </div>
    
    <!-- Completion quote -->
    <transition name="quote-fade">
      <div v-if="showQuote" class="completion-quote">
        <div class="quote-glow"></div>
        <p class="quote-text">{{ currentQuote }}</p>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'
import audioManager from '../../utils/audioManager'

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  theme: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['complete'])

// Refs
const paperElement = ref(null)

// State
const showPaper = ref(true)
const isScorching = ref(false)
const isBurning = ref(false)
const showSparkles = ref(false)
const showAsh = ref(false)
const scorchStyle = ref({})
const scorchProgress = ref(0)
const showQuote = ref(false)
const currentQuote = ref('')

// Quotes
const quotes = [
  'Lửa đã thanh lọc, để lại sự nhẹ nhõm.',
  'Từ tro tàn, bạn sẽ tìm lại sức mạnh.',
  'Đốt cháy quá khứ, hướng tới tương lai.',
  'Ngọn lửa đã mang đi những gì nặng nề.',
  'Bạn đã buông bỏ. Bạn đã tự do.'
]

/**
 * Main animation sequence
 */
const playAnimation = async () => {
  await sleep(500)
  
  // Play fire sound
  audioManager.playEffect(`${props.theme.key}-effect`)
  
  // Phase 1: Paper edges start scorching
  await startScorching()
  
  // Phase 2: Scorch spreads upward
  await spreadScorch()
  
  // Phase 3: Paper burns with sparkles
  await burnWithSparkles()
  
  // Phase 4: Ash floats away
  await showAshParticles()
  
  // Show quote
  await showCompletionQuote()
  
  // Complete
  emit('complete')
}

/**
 * Start scorching animation
 */
const startScorching = async () => {
  isScorching.value = true
  await sleep(800)
}

/**
 * Scorch spreads from bottom to top
 */
const spreadScorch = async () => {
  const duration = 3000
  const steps = 60
  const stepTime = duration / steps
  
  for (let i = 0; i <= steps; i++) {
    scorchProgress.value = (i / steps) * 100
    
    // Create gradient that moves upward
    scorchStyle.value = {
      background: `linear-gradient(
        to top,
        rgba(30, 20, 10, 1) 0%,
        rgba(60, 40, 20, 0.95) ${Math.max(0, scorchProgress.value - 10)}%,
        rgba(100, 60, 30, 0.8) ${Math.max(0, scorchProgress.value - 5)}%,
        rgba(140, 80, 40, 0.5) ${scorchProgress.value}%,
        transparent ${Math.min(100, scorchProgress.value + 8)}%
      )`,
      maskImage: `linear-gradient(
        to top,
        black ${scorchProgress.value}%,
        transparent ${Math.min(100, scorchProgress.value + 10)}%
      )`
    }
    
    await sleep(stepTime)
  }
}

/**
 * Burn with sparkles
 */
const burnWithSparkles = async () => {
  isBurning.value = true
  showSparkles.value = true
  
  // Fade out paper
  if (paperElement.value) {
    gsap.to(paperElement.value, {
      opacity: 0,
      filter: 'brightness(0.3)',
      duration: 2,
      ease: 'power2.in'
    })
  }
  
  await sleep(2000)
  showSparkles.value = false
  showPaper.value = false
}

/**
 * Show ash particles
 */
const showAshParticles = async () => {
  showAsh.value = true
  await sleep(2500)
  showAsh.value = false
}

/**
 * Get sparkle particle style
 */
const getSparkleStyle = (index) => {
  const spreadX = (Math.random() - 0.5) * 200
  const spreadY = -100 - Math.random() * 150
  const duration = 1.5 + Math.random() * 1
  const delay = Math.random() * 0.8
  const size = 3 + Math.random() * 5
  
  return {
    '--spread-x': `${spreadX}px`,
    '--spread-y': `${spreadY}px`,
    width: `${size}px`,
    height: `${size}px`,
    left: `${50 + (Math.random() - 0.5) * 50}%`,
    bottom: `${scorchProgress.value - 10 + Math.random() * 20}%`,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`
  }
}

/**
 * Get ash particle style
 */
const getAshStyle = (index) => {
  const spreadX = (Math.random() - 0.5) * 250
  const spreadY = -150 - Math.random() * 200
  const duration = 2 + Math.random() * 1.5
  const delay = Math.random() * 1
  const rotation = Math.random() * 720
  const size = 4 + Math.random() * 6
  
  return {
    '--spread-x': `${spreadX}px`,
    '--spread-y': `${spreadY}px`,
    '--rotation': `${rotation}deg`,
    width: `${size}px`,
    height: `${size}px`,
    left: `${50 + (Math.random() - 0.5) * 40}%`,
    top: `${50 + (Math.random() - 0.5) * 20}%`,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`
  }
}

/**
 * Show completion quote
 */
const showCompletionQuote = async () => {
  currentQuote.value = quotes[Math.floor(Math.random() * quotes.length)]
  showQuote.value = true
  await sleep(3000)
  showQuote.value = false
  await sleep(500)
}

/**
 * Sleep utility
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Start animation on mount
onMounted(() => {
  playAnimation()
})
</script>

<style scoped>
.burning-effect {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* Background */
.noon-background {
  position: absolute;
  inset: 0;
}

/* Paper texture overlay */
.paper-texture {
  position: absolute;
  inset: 0;
  background-image: 
    repeating-linear-gradient(0deg, rgba(0,0,0,0.03) 0px, transparent 1px, transparent 2px, rgba(0,0,0,0.03) 3px),
    repeating-linear-gradient(90deg, rgba(0,0,0,0.03) 0px, transparent 1px, transparent 2px, rgba(0,0,0,0.03) 3px);
  opacity: 0.3;
  pointer-events: none;
}

/* Burning paper */
.burning-paper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  max-width: 500px;
  min-height: 300px;
  padding: 3rem 2.5rem;
  background: linear-gradient(135deg, 
    #F4EDE4 0%, 
    #EDE5D8 50%,
    #E8DCC8 100%
  );
  border-radius: 4px;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    inset 0 0 20px rgba(0, 0, 0, 0.05);
  animation: paper-appear 0.8s ease-out;
}

@keyframes paper-appear {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9) rotateX(20deg);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1) rotateX(0deg);
  }
}

.paper-content {
  position: relative;
  z-index: 1;
  font-size: 1.4rem;
  line-height: 1.8;
  text-align: center;
}

/* Scorch effect */
.scorch-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: 4px;
  mix-blend-mode: multiply;
}

.burning-paper.scorching {
  animation: paper-tremble 0.15s infinite;
}

@keyframes paper-tremble {
  0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
  25% { transform: translate(-50%, -50%) rotate(0.3deg); }
  75% { transform: translate(-50%, -50%) rotate(-0.3deg); }
}

.burning-paper.burning {
  filter: brightness(0.7) contrast(1.2);
}

/* Sparkle particles */
.sparkles-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.sparkle-particle {
  position: absolute;
  background: radial-gradient(
    circle,
    rgba(255, 140, 0, 1) 0%,
    rgba(255, 69, 0, 0.8) 50%,
    rgba(255, 0, 0, 0) 100%
  );
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(255, 100, 0, 0.8);
  animation: sparkle-rise linear forwards;
}

@keyframes sparkle-rise {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(var(--spread-x), var(--spread-y)) scale(0);
    opacity: 0;
  }
}

/* Ash particles */
.ash-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.ash-particle {
  position: absolute;
  background: radial-gradient(
    circle,
    rgba(60, 60, 60, 0.9) 0%,
    rgba(40, 40, 40, 0.6) 100%
  );
  border-radius: 50%;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
  animation: ash-float linear forwards;
}

@keyframes ash-float {
  0% {
    transform: translate(0, 0) rotate(0deg) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(var(--spread-x), var(--spread-y)) rotate(var(--rotation)) scale(0.3);
    opacity: 0;
  }
}

/* Completion quote */
.completion-quote {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 80%;
  text-align: center;
  z-index: 10;
}

.quote-glow {
  position: absolute;
  inset: -50px;
  background: radial-gradient(
    ellipse at center,
    rgba(255, 140, 0, 0.15) 0%,
    transparent 70%
  );
  pointer-events: none;
}

.quote-text {
  position: relative;
  font-size: 1.75rem;
  line-height: 1.8;
  color: #3A2F1F;
  font-weight: 600;
  text-shadow: 
    0 2px 8px rgba(244, 196, 48, 0.4),
    0 0 20px rgba(255, 140, 0, 0.3);
  font-style: italic;
}

/* Quote transition */
.quote-fade-enter-active,
.quote-fade-leave-active {
  transition: all 0.8s ease;
}

.quote-fade-enter-from,
.quote-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.9);
}

/* Responsive */
@media (max-width: 768px) {
  .burning-paper {
    width: 90%;
    padding: 2rem 1.5rem;
    min-height: 250px;
  }
  
  .paper-content {
    font-size: 1.2rem;
  }
  
  .quote-text {
    font-size: 1.4rem;
  }
}
</style>
