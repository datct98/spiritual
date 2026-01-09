<template>
  <div class="sand-wave-effect">
    <!-- Background -->
    <div class="evening-background" :style="{ background: theme.bgColor }"></div>
    
    <!-- Sand texture -->
    <div class="sand-texture"></div>
    
    <!-- Text carved in sand -->
    <div 
      v-if="showText" 
      ref="textElement"
      class="sand-text"
      :style="{ fontFamily: theme.font, color: theme.textColor }"
    >
      {{ text }}
    </div>
    
    <!-- Dust particles (optional, while typing simulation) -->
    <div v-if="showDust" class="dust-container">
      <div 
        v-for="i in 20" 
        :key="`dust-${i}`" 
        class="dust-particle"
        :style="getDustStyle(i)"
      ></div>
    </div>
    
    <!-- Wave foam overlay -->
    <div v-if="showWave" class="wave-foam" :style="waveStyle"></div>
    
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
const textElement = ref(null)

// State
const showText = ref(true)
const showDust = ref(false)
const showWave = ref(false)
const waveStyle = ref({})
const showQuote = ref(false)
const currentQuote = ref('')

// Quotes
const quotes = [
  'Như sóng xóa cát, mọi nỗi lo sẽ qua đi.',
  'Biển cả bao la sẽ mang đi những gì bạn muốn buông.',
  'Chữ trên cát rồi cũng phai, nỗi buồn cũng vậy.',
  'Sóng biển đã xóa tan, để lại bình yên.',
  'Hãy để biển cả chở che bạn.'
]

/**
 * Main animation sequence
 */
const playAnimation = async () => {
  await sleep(800)
  
  // Optional: show dust briefly
  showDust.value = true
  await sleep(600)
  showDust.value = false
  
  // Play wave sound
  audioManager.playEffect(`${props.theme.key}-effect`)
  
  // Wave appears and washes over text
  await playWaveAnimation()
  
  // Show quote
  await showCompletionQuote()
  
  // Complete
  emit('complete')
}

/**
 * Play wave animation
 */
const playWaveAnimation = () => {
  return new Promise((resolve) => {
    showWave.value = true
    
    // Create GSAP timeline
    const tl = gsap.timeline({
      onComplete: () => {
        showWave.value = false
        resolve()
      }
    })
    
    // Wave slides from bottom to top
    const waveElement = { y: 100 }
    
    tl.to(waveElement, {
      y: -20,
      duration: 3,
      ease: 'sine.inOut',
      onUpdate: () => {
        waveStyle.value = {
          transform: `translateY(${waveElement.y}%)`,
          opacity: waveElement.y < 50 ? 0.7 : 0.7 - (Math.abs(waveElement.y + 20) / 100)
        }
      }
    })
    
    // Text fades as wave passes
    if (textElement.value) {
      tl.to(textElement.value, {
        opacity: 0,
        scale: 1.05,
        filter: 'blur(4px)',
        duration: 1.8,
        ease: 'power2.in'
      }, 1) // Start at 1 second (when wave reaches text)
    }
  })
}

/**
 * Get dust particle style
 */
const getDustStyle = (index) => {
  const x = (index / 20) * 100
  const y = 40 + Math.random() * 20
  const spreadY = -20 - Math.random() * 15
  const duration = 0.8 + Math.random() * 0.5
  const delay = Math.random() * 0.4
  const size = 2 + Math.random() * 3
  
  return {
    left: `${x}%`,
    top: `${y}%`,
    '--spread-y': `${spreadY}px`,
    width: `${size}px`,
    height: `${size}px`,
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
.sand-wave-effect {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* Background */
.evening-background {
  position: absolute;
  inset: 0;
}

/* Sand texture */
.sand-texture {
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(circle at 20% 30%, rgba(0,0,0,0.05) 1px, transparent 1px),
    radial-gradient(circle at 60% 70%, rgba(0,0,0,0.05) 1px, transparent 1px),
    radial-gradient(circle at 80% 40%, rgba(0,0,0,0.03) 1px, transparent 1px);
  background-size: 50px 50px, 70px 70px, 90px 90px;
  opacity: 0.6;
  pointer-events: none;
}

/* Text carved in sand */
.sand-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.6rem;
  text-align: center;
  max-width: 80%;
  padding: 2rem;
  line-height: 1.8;
  font-weight: 500;
  text-shadow: 
    inset 0 2px 3px rgba(0, 0, 0, 0.3),
    0 1px 0 rgba(255, 255, 255, 0.4),
    0 2px 4px rgba(0, 0, 0, 0.2);
  letter-spacing: 0.5px;
  animation: text-appear 0.8s ease-out;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
}

@keyframes text-appear {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

/* Dust particles */
.dust-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.dust-particle {
  position: absolute;
  background: radial-gradient(
    circle,
    rgba(139, 119, 101, 0.6) 0%,
    rgba(139, 119, 101, 0) 100%
  );
  border-radius: 50%;
  animation: dust-rise linear forwards;
}

@keyframes dust-rise {
  0% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(var(--spread-y)) scale(0.3);
    opacity: 0;
  }
}

/* Wave foam overlay */
.wave-foam {
  position: absolute;
  inset: 0;
  background: 
    linear-gradient(
      to bottom,
      transparent 0%,
      rgba(255, 255, 255, 0.1) 10%,
      rgba(255, 255, 255, 0.3) 20%,
      rgba(230, 240, 250, 0.4) 25%,
      rgba(220, 235, 245, 0.5) 30%,
      rgba(200, 220, 235, 0.6) 35%,
      rgba(180, 210, 230, 0.5) 45%,
      rgba(160, 200, 225, 0.4) 60%,
      rgba(140, 190, 220, 0.3) 80%,
      transparent 100%
    );
  pointer-events: none;
  will-change: transform, opacity;
}

/* Add foam texture */
.wave-foam::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(circle at 30% 40%, rgba(255, 255, 255, 0.6) 2px, transparent 2px),
    radial-gradient(circle at 70% 50%, rgba(255, 255, 255, 0.5) 3px, transparent 3px),
    radial-gradient(circle at 50% 30%, rgba(255, 255, 255, 0.4) 2px, transparent 2px),
    radial-gradient(circle at 20% 60%, rgba(255, 255, 255, 0.5) 2.5px, transparent 2.5px),
    radial-gradient(circle at 80% 35%, rgba(255, 255, 255, 0.6) 2px, transparent 2px);
  background-size: 80px 60px, 100px 80px, 120px 90px, 90px 70px, 110px 85px;
  opacity: 0.8;
  animation: foam-shimmer 3s ease-in-out infinite;
}

@keyframes foam-shimmer {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 0.9;
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
    rgba(140, 190, 220, 0.2) 0%,
    transparent 70%
  );
  pointer-events: none;
}

.quote-text {
  position: relative;
  font-size: 1.75rem;
  line-height: 1.8;
  color: #5C4A3A;
  font-weight: 600;
  text-shadow: 
    0 2px 8px rgba(255, 255, 255, 0.6),
    0 0 20px rgba(140, 190, 220, 0.3);
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
  .sand-text {
    font-size: 1.3rem;
    padding: 1.5rem;
  }
  
  .quote-text {
    font-size: 1.4rem;
  }
}
</style>
