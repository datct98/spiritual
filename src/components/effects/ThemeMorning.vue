<template>
  <div class="theme-morning">
    <!-- Background Gradient - Trời sáng trong xanh -->
    <div class="morning-background"></div>
    
    <!-- Dandelion Flower - Fades out during animation -->
    <div class="dandelion-container" :class="{ 'fading': isAnimating }">
      <img src="/images/dandelion.png" alt="Dandelion" class="dandelion-image" />
    </div>
    
    <!-- Input Area - nằm đè lên bông hoa -->
    <div v-if="!isAnimating" class="input-container">
      <textarea
        v-model="userText"
        class="worry-input"
        :placeholder="placeholder"
        rows="6"
        maxlength="500"
      ></textarea>
      
      <button 
        @click="handleSubmit" 
        class="submit-btn"
        :disabled="!canSubmit"
      >
        Gửi đi
      </button>
    </div>
    
    <!-- Particle Container - Seed images flying -->
    <div v-if="isAnimating" class="particles-container">
      <img 
        v-for="particle in particles" 
        :key="particle.id"
        src="/images/dandelion-seed.png"
        alt="seed"
        class="particle"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import { gsap } from 'gsap'

// Props & Emits
const emit = defineEmits(['finished'])

// State
const userText = ref('')
const isAnimating = ref(false)
const particles = ref([])

// Computed
const canSubmit = computed(() => {
  return userText.value.trim().length >= 5 // Giảm xuống 5 ký tự để dễ test
})

const placeholder = computed(() => {
  return `Hãy viết ra những điều bạn muốn gửi đi...\n\nNhững nỗi lo sẽ bay đi như hạt bồ công anh trong gió.`
})

/**
 * Handle submit - trigger animation
 */
const handleSubmit = () => {
  console.log('Submit clicked, userText:', userText.value)
  console.log('canSubmit:', canSubmit.value)
  
  if (!canSubmit.value) {
    console.warn('Text too short, need at least 5 characters')
    return
  }
  
  // Start animation
  startAnimation()
}

/**
 * Main animation sequence
 */
const startAnimation = () => {
  console.log('Starting animation...')
  isAnimating.value = true
  
  // Create particles
  createParticles()
  
  // Wait for Vue to render particles in DOM
  setTimeout(() => {
    console.log('About to animate particles...')
    animateParticles()
  }, 100)
}

/**
 * Create particle data
 */
const createParticles = () => {
  const particleCount = 150 // Hàng trăm particles
  const newParticles = []
  
  console.log(`Creating ${particleCount} particles...`)
  
  for (let i = 0; i < particleCount; i++) {
    newParticles.push({
      id: `particle-${i}-${Date.now()}`
    })
  }
  
  particles.value = newParticles
  console.log('Particles array:', particles.value.length)
}

/**
 * Animate all particles with GSAP
 */
const animateParticles = () => {
  // Query DOM for particle elements
  const particleElements = document.querySelectorAll('.particle')
  
  console.log('Found particle elements:', particleElements.length)
  
  if (particleElements.length === 0) {
    console.error('No particle elements found in DOM!')
    finishAnimation()
    return
  }
  
  // Create GSAP timeline
  const tl = gsap.timeline({
    onComplete: () => {
      console.log('Animation complete')
      finishAnimation()
    }
  })
  
  // Animate each particle
  particleElements.forEach((element, index) => {
    // Random destination - Bay lên phía trên bên phải (mô phỏng gió)
    const xDestination = gsap.utils.random(200, 800) // Xa hơn sang phải
    const yDestination = gsap.utils.random(-500, -900) // Cao hơn lên trên
    
    // Random rotation (nhiều vòng hơn)
    const rotation = gsap.utils.random(-720, 720)
    
    // Random size variation
    const scale = gsap.utils.random(0.8, 1.5)
    
    // Longer duration 5-7s
    const duration = gsap.utils.random(5, 7)
    
    // Stagger to create wave effect
    const delay = (index / particleElements.length) * 1.5 // Max 1.5s stagger
    
    // Animate this particle
    tl.to(element, {
      x: xDestination,
      y: yDestination,
      rotation: rotation,
      scale: scale,
      opacity: 0, // Fade out
      duration: duration,
      ease: 'power1.out' // Smoother easing
    }, delay) // Start at different times based on index
  })
  
  console.log('GSAP timeline created with', particleElements.length, 'animations')
}

/**
 * Finish animation and emit event
 */
const finishAnimation = () => {
  console.log('Finishing animation, cleaning up...')
  
  // Wait a bit before cleanup to ensure animation is visible
  setTimeout(() => {
    // Clear particles
    particles.value = []
    
    // Reset state
    isAnimating.value = false
    userText.value = ''
    
    // Emit finished event
    emit('finished')
    
    console.log('Animation finished and cleaned up')
  }, 500)
}

// Cleanup on unmount
onBeforeUnmount(() => {
  gsap.killTweensOf('.particle')
})
</script>

<style scoped>
/* Container */
.theme-morning {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

/* Background - Gradient trời sáng NHẠT để dandelion watercolor nổi bật */
.morning-background {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    #D4E7F5 0%,      /* Very Light Blue */
    #E8F4F8 50%,     /* Almost White */
    #F5FAFC 100%     /* Nearly White with hint of blue */
  );
  z-index: 0;
}

/* Dandelion Container - LỚN HƠN để ấn tượng */
.dandelion-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 700px;  /* Increased from 500px */
  height: 700px; /* Increased from 500px */
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dandelion-image {
  max-width: 100%;
  max-height: 100%;
  opacity: 1;
  filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.08));
  animation: gentle-sway 6s ease-in-out infinite;
  transition: opacity 1s ease-out;
}

/* Fade out flower when animation starts */
.dandelion-container.fading .dandelion-image {
  opacity: 0.2; /* Mờ dần khi hạt bay */
}

@keyframes gentle-sway {
  0%, 100% {
    transform: rotate(-2deg) scale(1);
    transform-origin: center bottom; /* Anchor tại đáy cuống hoa */
  }
  50% {
    transform: rotate(2deg) scale(1.01);
    transform-origin: center bottom;
  }
}

/* Input Container - Đè lên bông hoa */
.input-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  width: 80%;
  max-width: 500px;
}

/* Textarea - INVISIBLE (Không nền, không viền) */
.worry-input {
  width: 100%;
  background: none; /* HOÀN TOÀN TRONG SUỐT */
  border: none;     /* BỎ VIỀN */
  padding: 1.5rem;
  
  /* Chữ trắng với text-shadow để dễ đọc */
  color: rgba(255, 255, 255, 0.98);
  font-family: 'Patrick Hand', 'Caveat', cursive;
  font-size: 1.4rem;
  line-height: 1.9;
  text-align: center;
  
  resize: none;
  outline: none;
  transition: all 0.3s ease;
  
  /* Text shadow để chữ dễ đọc trên background */
  text-shadow: 
    0 2px 12px rgba(0, 0, 0, 0.3),
    0 1px 3px rgba(0, 0, 0, 0.4);
}

.worry-input::placeholder {
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.worry-input:focus {
  /* Không thay đổi background khi focus - giữ invisible */
  transform: scale(1.02);
}

/* Submit Button */
.submit-btn {
  padding: 1rem 3rem;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 30px;
  
  color: #4A90E2;
  font-family: 'Patrick Hand', cursive;
  font-size: 1.2rem;
  font-weight: 600;
  
  cursor: pointer;
  transition: all 0.3s ease;
  
  box-shadow: 0 4px 16px rgba(255, 255, 255, 0.3);
}

.submit-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 1);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255, 255, 255, 0.4);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Particles Container */
.particles-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  z-index: 3;
  pointer-events: none;
}

/* Individual Particle - Hạt giống thật (PNG image) */
.particle {
  position: absolute;
  top: 50%;
  left: 50%;
  
  /* Size của hạt giống */
  width: 32px;  /* Lớn hơn để nhìn rõ detail */
  height: 32px;
  
  /* Image sẽ tự căn trong khung này */
  object-fit: contain;
  
  /* Shadow nhẹ để nổi bật */
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15));
  
  opacity: 0.95;
  will-change: transform, opacity;
  
  /* Animation ban đầu - fade in */
  animation: particle-appear 0.5s ease-out;
}

@keyframes particle-appear {
  from {
    opacity: 0;
    transform: scale(0);
  }
  to {
    opacity: 0.95;
    transform: scale(1);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .dandelion-container {
    width: 500px;  /* Smaller on mobile */
    height: 500px;
  }
  
  .input-container {
    width: 90%;
  }
  
  .worry-input {
    font-size: 1.2rem;
    padding: 1rem;
  }
  
  .submit-btn {
    font-size: 1.1rem;
    padding: 0.9rem 2.5rem;
  }
}
</style>
