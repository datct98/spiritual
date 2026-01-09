<template>
  <div class="water-reflection-effect">
    <!-- Background -->
    <div class="night-background" :style="{ background: theme.bgColor }"></div>
    
    <!-- Moon reflection -->
    <div class="moon-reflection"></div>
    
    <!-- Water surface shimmer -->
    <div class="water-shimmer"></div>
    
    <!-- SVG Filters -->
    <svg class="svg-filters">
      <defs>
        <filter id="ripple-distortion">
          <feTurbulence 
            type="turbulence" 
            baseFrequency="0.01" 
            numOctaves="2" 
            result="turbulence"
          >
            <animate 
              attributeName="baseFrequency"
              from="0.01"
              to="0.03"
              dur="2s"
              fill="freeze"
            />
          </feTurbulence>
          <feDisplacementMap 
            in="SourceGraphic" 
            in2="turbulence" 
            scale="0" 
            xChannelSelector="R" 
            yChannelSelector="G"
          >
            <animate 
              attributeName="scale"
              from="0"
              to="40"
              dur="2.5s"
              fill="freeze"
            />
          </feDisplacementMap>
        </filter>
      </defs>
    </svg>
    
    <!-- Text as reflection in water -->
    <div 
      v-if="showText" 
      ref="textElement"
      class="water-text"
      :class="{ rippling: isRippling, dissolving: isDissolving }"
      :style="textStyle"
    >
      {{ text }}
    </div>
    
    <!-- Water droplet -->
    <div v-if="showDroplet" class="water-droplet"></div>
    
    <!-- Ripple circles -->
    <div v-if="showRipples" class="ripples-container">
      <div 
        v-for="i in 5" 
        :key="`ripple-${i}`" 
        class="ripple-circle"
        :style="getRippleStyle(i)"
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
import { ref, computed, onMounted } from 'vue'
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
const showDroplet = ref(false)
const showRipples = ref(false)
const isRippling = ref(false)
const isDissolving = ref(false)
const blurAmount = ref(0.5)
const textOpacity = ref(0.8)
const showQuote = ref(false)
const currentQuote = ref('')

// Quotes
const quotes = [
  'Như trăng nhạt dưới đáy nước, nỗi lo đã tan biến.',
  'Gợn sóng cuốn đi mọi lo âu, để lại tĩnh lặng.',
  'Nước sâu tĩnh lặng, tâm hồn bình yên.',
  'Phản chiếu trôi qua, chỉ còn lại ánh trăng.',
  'Hãy để nước mang đi những gì bạn không cần.'
]

// Computed
const textStyle = computed(() => ({
  fontFamily: props.theme.font,
  color: props.theme.textColor,
  filter: `blur(${blurAmount.value}px)`,
  opacity: textOpacity.value
}))

/**
 * Main animation sequence
 */
const playAnimation = async () => {
  await sleep(1000)
  
  // Text appears with reflection effect
  await fadeInText()
  
  // Play water drop sound
  audioManager.playEffect(`${props.theme.key}-effect`)
  
  // Droplet falls
  await dropletFalls()
  
  // Ripples expand
  await expandRipples()
  
  // Text distorts and dissolves
  await dissolveText()
  
  // Show quote
  await showCompletionQuote()
  
  // Complete
  emit('complete')
}

/**
 * Fade in text
 */
const fadeInText = () => {
  return new Promise((resolve) => {
    gsap.to({ opacity: 0 }, {
      opacity: 0.8,
      duration: 1,
      onUpdate: function() {
        textOpacity.value = this.targets()[0].opacity
      },
      onComplete: resolve
    })
  })
}

/**
 * Droplet falls animation
 */
const dropletFalls = async () => {
  showDroplet.value = true
  await sleep(600) // Droplet falls for 0.6s
  showDroplet.value = false
}

/**
 * Ripples expand from center
 */
const expandRipples = async () => {
  showRipples.value = true
  isRippling.value = true
  await sleep(2000)
}

/**
 * Text dissolves with distortion
 */
const dissolveText = () => {
  return new Promise((resolve) => {
    isDissolving.value = true
    
    // Animate blur and opacity
    const tl = gsap.timeline({
      onComplete: () => {
        showText.value = false
        showRipples.value = false
        resolve()
      }
    })
    
    tl.to({ blur: blurAmount.value, opacity: textOpacity.value }, {
      blur: 10,
      opacity: 0,
      duration: 2,
      ease: 'power2.in',
      onUpdate: function() {
        blurAmount.value = this.targets()[0].blur
        textOpacity.value = this.targets()[0].opacity
      }
    })
  })
}

/**
 * Get ripple circle style
 */
const getRippleStyle = (index) => {
  const delay = (index - 1) * 0.3
  const duration = 2 + index * 0.2
  
  return {
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
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
.water-reflection-effect {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* Background */
.night-background {
  position: absolute;
  inset: 0;
}

/* Moon reflection */
.moon-reflection {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  width: 150px;
  height: 150px;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.15) 0%,
    rgba(200, 220, 240, 0.08) 40%,
    transparent 70%
  );
  border-radius: 50%;
  filter: blur(8px);
  animation: moon-shimmer 4s ease-in-out infinite;
}

@keyframes moon-shimmer {
  0%, 100% {
    opacity: 0.6;
    transform: translateX(-50%) scale(1);
  }
  50% {
    opacity: 0.9;
    transform: translateX(-50%) scale(1.05);
  }
}

/* Water shimmer */
.water-shimmer {
  position: absolute;
  inset: 0;
  background: 
    linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.02) 50%,
      transparent 100%
    );
  animation: water-shimmer 3s ease-in-out infinite;
  pointer-events: none;
}

@keyframes water-shimmer {
  0%, 100% {
    transform: translateX(-10%);
  }
  50% {
    transform: translateX(10%);
  }
}

/* SVG Filters (hidden) */
.svg-filters {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
}

/* Text as reflection */
.water-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.6rem;
  text-align: center;
  max-width: 80%;
  padding: 2rem;
  line-height: 1.9;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
  animation: text-appear 1s ease-out;
  will-change: filter, opacity;
}

@keyframes text-appear {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.95);
    filter: blur(5px);
  }
  to {
    opacity: 0.8;
    transform: translate(-50%, -50%) scale(1);
    filter: blur(0.5px);
  }
}

.water-text.rippling {
  filter: url(#ripple-distortion);
}

.water-text.dissolving {
  animation: text-distort 2s ease-in forwards;
}

@keyframes text-distort {
  0% {
    transform: translate(-50%, -50%) scale(1);
  }
  100% {
    transform: translate(-50%, -50%) scale(1.1) rotateZ(2deg);
  }
}

/* Water droplet */
.water-droplet {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  width: 12px;
  height: 12px;
  background: radial-gradient(
    circle,
    rgba(200, 220, 240, 0.8) 0%,
    rgba(150, 180, 210, 0.6) 100%
  );
  border-radius: 50%;
  box-shadow: 
    0 0 10px rgba(200, 220, 240, 0.5),
    inset 0 -2px 3px rgba(255, 255, 255, 0.4);
  animation: droplet-fall 0.6s cubic-bezier(0.4, 0, 0.6, 1) forwards;
}

@keyframes droplet-fall {
  0% {
    top: 20%;
    opacity: 1;
    transform: translateX(-50%) scale(1);
  }
  80% {
    top: 50%;
    transform: translateX(-50%) scale(1.2);
  }
  100% {
    top: 50%;
    opacity: 0;
    transform: translateX(-50%) scale(0.5);
  }
}

/* Ripple circles */
.ripples-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.ripple-circle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border: 2px solid rgba(200, 220, 240, 0.4);
  border-radius: 50%;
  animation: ripple-expand ease-out forwards;
}

@keyframes ripple-expand {
  0% {
    width: 20px;
    height: 20px;
    opacity: 1;
  }
  100% {
    width: 400px;
    height: 400px;
    opacity: 0;
    border-width: 1px;
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
    rgba(200, 220, 240, 0.15) 0%,
    transparent 70%
  );
  pointer-events: none;
}

.quote-text {
  position: relative;
  font-size: 1.75rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 500;
  text-shadow: 
    0 0 20px rgba(200, 220, 240, 0.5),
    0 2px 8px rgba(0, 0, 0, 0.3);
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
  .water-text {
    font-size: 1.3rem;
    padding: 1.5rem;
  }
  
  .quote-text {
    font-size: 1.4rem;
  }
  
  .moon-reflection {
    width: 100px;
    height: 100px;
  }
}
</style>
