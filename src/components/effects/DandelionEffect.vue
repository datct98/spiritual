<template>
  <div class="dandelion-effect">
    <!-- Background gradient -->
    <div class="morning-background" :style="{ background: theme.bgColor }"></div>
    
    <!-- Dandelion flower decoration (background) -->
    <div class="dandelion-decoration">
      <img src="/images/dandelion.png" alt="" class="dandelion-image" />
    </div>
    
    <!-- Text display (will be converted to particles) -->
    <div 
      v-if="showText" 
      ref="textElement"
      class="dandelion-text"
      :style="{ fontFamily: theme.font, color: theme.textColor }"
    >
      {{ text }}
    </div>
    
    <!-- Particle container -->
    <div ref="particleContainer" class="particle-container"></div>
    
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
import { ref, onMounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import html2canvas from 'html2canvas'
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
const particleContainer = ref(null)

// State
const showText = ref(true)
const showQuote = ref(false)
const currentQuote = ref('')

// Comforting quotes
const quotes = [
  'Gió sẽ mang đi những nỗi lo, để lại bầu trời trong xanh.',
  'Như hạt bồ công anh bay xa, nỗi buồn cũng sẽ tan biến.',
  'Mỗi hơi gió là một khởi đầu mới.',
  'Hãy để những điều tốt đẹp đến với bạn.',
  'Bình yên đang ở đâu đó phía trước.'
]

/**
 * Main animation sequence
 */
const playAnimation = async () => {
  // Wait for text to render
  await nextTick()
  await sleep(800)
  
  // Play wind sound
  audioManager.playEffect(`${props.theme.key}-effect`)
  
  // Convert text to particles
  await createAndAnimateParticles()
  
  // Show quote
  await showCompletionQuote()
  
  // Complete
  emit('complete')
}

/**
 * Create particles from text using html2canvas
 */
const createAndAnimateParticles = async () => {
  if (!textElement.value) return
  
  try {
    // Capture text as canvas
    const canvas = await html2canvas(textElement.value, {
      backgroundColor: null,
      scale: 2,
      logging: false
    })
    
    // Hide original text
    showText.value = false
    
    // Get pixel data
    const ctx = canvas.getContext('2d')
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const particles = []
    
    // Sample pixels (every 3 pixels for performance)
    for (let y = 0; y < canvas.height; y += 3) {
      for (let x = 0; x < canvas.width; x += 3) {
        const index = (y * canvas.width + x) * 4
        const alpha = imageData.data[index + 3]
        
        // Only create particle for visible pixels
        if (alpha > 128) {
          const r = imageData.data[index]
          const g = imageData.data[index + 1]
          const b = imageData.data[index + 2]
          
          particles.push({
            x: x / 2, // Scale back from 2x resolution
            y: y / 2,
            color: `rgba(${r}, ${g}, ${b}, ${alpha / 255})`
          })
        }
      }
    }
    
    // Limit to 100 particles (performance)
    const sampledParticles = sampleParticles(particles, 100)
    
    // Create DOM elements for particles
    const particleElements = sampledParticles.map(particle => {
      const el = document.createElement('div')
      el.className = 'particle-seed'
      el.style.left = `calc(50% + ${particle.x - canvas.width / 4}px)`
      el.style.top = `calc(50% + ${particle.y - canvas.height / 4}px)`
      el.style.backgroundColor = particle.color
      particleContainer.value.appendChild(el)
      return el
    })
    
    // Animate particles flying away
    await animateParticles(particleElements)
    
    // Cleanup
    particleElements.forEach(el => el.remove())
  } catch (error) {
    console.error('Error creating particles:', error)
    // Fallback: just fade out text
    showText.value = false
    await sleep(2000)
  }
}

/**
 * Sample particles evenly from array
 */
const sampleParticles = (particles, maxCount) => {
  if (particles.length <= maxCount) return particles
  
  const step = Math.floor(particles.length / maxCount)
  const sampled = []
  for (let i = 0; i < particles.length; i += step) {
    sampled.push(particles[i])
    if (sampled.length >= maxCount) break
  }
  return sampled
}

/**
 * Animate particles with GSAP
 */
const animateParticles = (elements) => {
  return new Promise((resolve) => {
    const tl = gsap.timeline({
      onComplete: resolve
    })
    
    elements.forEach((el, i) => {
      // Random spread and lift
      const spreadX = gsap.utils.random(-300, 300)
      const spreadY = gsap.utils.random(-400, -600)
      const rotation = gsap.utils.random(-720, 720)
      const scale = gsap.utils.random(0.3, 1)
      const duration = gsap.utils.random(2.5, 4)
      
      tl.to(el, {
        x: spreadX,
        y: spreadY,
        rotation,
        scale,
        opacity: 0,
        duration,
        ease: 'power2.out'
      }, i * 0.015) // Stagger
    })
  })
}

/**
 * Show completion quote
 */
const showCompletionQuote = async () => {
  // Random quote
  currentQuote.value = quotes[Math.floor(Math.random() * quotes.length)]
  
  // Show
  showQuote.value = true
  await sleep(3000)
  
  // Hide
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
.dandelion-effect {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* Background */
.morning-background {
  position: absolute;
  inset: 0;
  transition: opacity 0.8s ease;
}

/* Dandelion decoration */
.dandelion-decoration {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.3;
  pointer-events: none;
}

.dandelion-image {
  width: 70%;
  max-width: 500px;
  height: auto;
  filter: drop-shadow(0 0 40px rgba(255, 255, 255, 0.4));
  animation: gentle-sway 4s ease-in-out infinite;
}

@keyframes gentle-sway {
  0%, 100% {
    transform: rotate(-2deg) scale(1);
  }
  50% {
    transform: rotate(2deg) scale(1.02);
  }
}

/* Text display */
.dandelion-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.5rem;
  text-align: center;
  max-width: 80%;
  padding: 2rem;
  line-height: 1.8;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  animation: text-appear 0.8s ease-out;
}

@keyframes text-appear {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

/* Particle container */
.particle-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.particle-seed {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
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
  inset: -40px;
  background: radial-gradient(
    ellipse at center,
    rgba(255, 255, 255, 0.2) 0%,
    transparent 70%
  );
  pointer-events: none;
}

.quote-text {
  position: relative;
  font-size: 1.75rem;
  line-height: 1.8;
  color: #2C5F6F;
  font-weight: 500;
  text-shadow: 
    0 2px 4px rgba(255, 255, 255, 0.8),
    0 4px 12px rgba(255, 255, 255, 0.4);
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

.quote-fade-enter-to,
.quote-fade-leave-from {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}

/* Responsive */
@media (max-width: 768px) {
  .dandelion-text {
    font-size: 1.2rem;
    padding: 1.5rem;
  }
  
  .quote-text {
    font-size: 1.3rem;
  }
}
</style>
