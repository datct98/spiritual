<template>
  <div class="water-night-scene">
    <!-- Static Background Image (shown when not playing video) -->
    <img 
      v-show="!isPlayingVideo" 
      :src="staticBackground" 
      alt="Night Lake Scene" 
      class="background-media"
      :class="{ 'fade-out': isFadingOut }"
    />
    
    <!-- Video Animation (shown when playing) -->
    <video
      v-show="isPlayingVideo"
      ref="videoRef"
      :src="videoAnimation"
      class="background-media"
      playsinline
      @ended="onVideoEnded"
    ></video>
    
    <!-- Dreamy Overlay (after video ends) -->
    <transition name="dreamy-fade">
      <div v-if="showDreamyOverlay" class="dreamy-overlay">
        <div class="dreamy-blur"></div>
        <div class="dreamy-content">
          <p class="dreamy-text">{{ dreamyQuote }}</p>
        </div>
      </div>
    </transition>
    
    <!-- UI Panel (Glassmorphism) -->
    <transition name="panel-fade">
      <div v-if="!boatReleased" class="glass-panel">
        <!-- Textarea -->
        <textarea 
          v-model="worryText" 
          placeholder="Giữ nỗi lo theo dòng nước..."
          class="worry-input"
          maxlength="200"
          :disabled="isSubmitting"
        ></textarea>
        
        <!-- Release Button -->
        <button 
          @click="releaseBoat" 
          class="action-btn"
          :disabled="!worryText.trim() || isSubmitting"
        >
          Thả Thuyền Giấy
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Assets
import staticBackground from '../../assets/water_night_clean.png'
import videoAnimation from '../../assets/water_night_mp4.mp4'

const emit = defineEmits(['finished'])

// ===== STATE =====
const worryText = ref('')
const isSubmitting = ref(false)
const boatReleased = ref(false)
const isPlayingVideo = ref(false)
const isFadingOut = ref(false)
const showDreamyOverlay = ref(false)
const dreamyQuote = ref('')

// Video reference
const videoRef = ref(null)

// Meaningful quotes
const dreamyQuotes = [
  'Như nước cuốn trôi, nỗi buồn đã tan...',
  'Ánh trăng vẫn sáng, lòng bạn nhẹ nhàng.',
  'Hoa sen nở từ bùn, bạn mạnh mẽ hơn mỗi ngày.',
  'Nước sâu tĩnh lặng, tâm hồn thanh thản.',
  'Thả đi lo lắng, đón nhận bình yên.',
  'Mỗi con sóng qua đi, mang theo muộn phiền.',
  'Đêm tĩnh lặng, tâm hồn được chữa lành.',
  'Trăng soi đường, ánh sáng trong tim bạn.',
  'Buông bỏ để tự do, tha thứ để bình an.',
  'Giữa muôn vàn sao, bạn là ánh sáng đẹp nhất.'
]

/**
 * Release boat - starts video animation
 */
const releaseBoat = async () => {
  if (!worryText.value.trim() || isSubmitting.value) return
  
  isSubmitting.value = true
  boatReleased.value = true
  
  // Small delay for panel fade out
  await sleep(300)
  
  // Fade out static image, then play video
  isFadingOut.value = true
  await sleep(400)
  
  // Switch to video and play
  isPlayingVideo.value = true
  isFadingOut.value = false
  
  // Play video from start
  if (videoRef.value) {
    videoRef.value.currentTime = 0
    videoRef.value.play()
  }
}

/**
 * When video ends - show dreamy overlay then reset to initial state
 */
const onVideoEnded = async () => {
  // Select random quote
  dreamyQuote.value = dreamyQuotes[Math.floor(Math.random() * dreamyQuotes.length)]
  
  // Show dreamy overlay
  showDreamyOverlay.value = true
  
  // Wait 3 seconds for user to read the message
  await sleep(3000)
  
  // Fade out dreamy overlay
  showDreamyOverlay.value = false
  await sleep(800)
  
  // Switch back to static background
  isPlayingVideo.value = false
  
  await sleep(400)
  
  // Reset state to show worry-jar panel again
  resetToInitialState()
}

/**
 * Reset everything to initial state
 */
const resetToInitialState = () => {
  worryText.value = ''
  isSubmitting.value = false
  boatReleased.value = false
  isFadingOut.value = false
}

/**
 * Sleep utility
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
</script>

<style scoped>
/* ========================================
   SCENE CONTAINER
======================================== */
.water-night-scene {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #0a0a1a;
}

/* Background Media (Image & Video) */
.background-media {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
  transition: opacity 0.4s ease;
}

.background-media.fade-out {
  opacity: 0;
}

/* ========================================
   DREAMY OVERLAY (Message after animation)
======================================== */
.dreamy-overlay {
  position: absolute;
  inset: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dreamy-blur {
  position: absolute;
  inset: 0;
  background: rgba(5, 15, 35, 0.75);
  backdrop-filter: blur(12px) saturate(120%);
  -webkit-backdrop-filter: blur(12px) saturate(120%);
}

.dreamy-content {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 85%;
  padding: 3rem;
  animation: content-appear 1.5s ease-out;
}

.dreamy-text {
  font-family: 'Noto Serif', 'Playfair Display', Georgia, serif;
  font-size: 2.2rem;
  font-style: italic;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.7;
  letter-spacing: 0.02em;
  
  /* Ethereal glow effect */
  text-shadow: 
    0 0 30px rgba(200, 220, 255, 0.5),
    0 0 60px rgba(150, 180, 255, 0.3),
    0 4px 15px rgba(0, 0, 0, 0.4);
  
  animation: text-float 3s ease-in-out infinite;
}

@keyframes content-appear {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes text-float {
  0%, 100% {
    transform: translateY(0);
    text-shadow: 
      0 0 30px rgba(200, 220, 255, 0.5),
      0 0 60px rgba(150, 180, 255, 0.3),
      0 4px 15px rgba(0, 0, 0, 0.4);
  }
  50% {
    transform: translateY(-5px);
    text-shadow: 
      0 0 40px rgba(200, 220, 255, 0.7),
      0 0 80px rgba(150, 180, 255, 0.4),
      0 6px 20px rgba(0, 0, 0, 0.35);
  }
}

/* Dreamy transition */
.dreamy-fade-enter-active {
  transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.dreamy-fade-leave-active {
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.dreamy-fade-enter-from,
.dreamy-fade-leave-to {
  opacity: 0;
}

.dreamy-fade-enter-from .dreamy-blur,
.dreamy-fade-leave-to .dreamy-blur {
  backdrop-filter: blur(0);
  -webkit-backdrop-filter: blur(0);
}

/* ========================================
   UI PANEL (DUAL LAYER GLASSMORPHISM)
======================================== */
.glass-panel {
  position: absolute;
  /* RIGHT side of screen */
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  
  /* Wider and taller */
  width: 320px;
  min-height: 280px;
  padding: 0;
  
  /* Outer white border - 25% opacity with noise texture */
  background: 
    linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.2) 100%);
  
  /* Noise texture using CSS */
  background-image: 
    url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E"),
    linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.2) 100%);
  
  backdrop-filter: blur(20px) saturate(120%);
  -webkit-backdrop-filter: blur(20px) saturate(120%);
  
  /* White stroke border with rounded corners */
  border: 2px solid rgba(255, 255, 255, 0.25);
  border-radius: 24px;
  
  /* Soft shadow */
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 1px rgba(255, 255, 255, 0.3);
  
  /* Flex layout for button positioning */
  display: flex;
  flex-direction: column;
}

/* Inner border - 40% opacity (content area for textarea) */
.glass-panel::before {
  content: '';
  position: absolute;
  top: 12px;
  left: 12px;
  right: 12px;
  /* Stop before button area - leave space at bottom */
  bottom: 70px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.4) 0%,
    rgba(255, 255, 255, 0.35) 100%
  );
  border: 1.5px solid rgba(255, 255, 255, 0.4);
  border-radius: 16px;
  pointer-events: none;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.5);
}

.worry-input {
  /* Positioned inside inner border */
  position: relative;
  z-index: 2;
  flex: 1;
  
  /* Blend seamlessly into panel */
  background: transparent;
  border: none;
  width: calc(100% - 3rem);
  padding: 1.8rem 1.5rem 1rem;
  margin: 0 auto;
  color: #FFF;
  
  /* Handwriting font */
  font-family: 'Dancing Script', 'Brush Script MT', cursive;
  font-size: 1.7rem;
  line-height: 1.4;
  text-align: center;
  font-style: italic;
  font-weight: 400;
  
  resize: none;
  min-height: 140px;
  transition: all 0.3s ease;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.worry-input::placeholder {
  color: rgba(255, 255, 255, 0.9);
  font-style: italic;
  font-size: 1.7rem;
}

.worry-input:focus {
  outline: none;
}

.action-btn {
  /* Positioned OUTSIDE inner border, but INSIDE outer border */
  position: relative;
  z-index: 2;
  flex-shrink: 0;
  
  /* Gold radial gradient */
  background: radial-gradient(
    ellipse at center,
    #FFE87C 0%,
    #FFD94D 30%,
    #FFC738 60%,
    #F0B428 100%
  );
  
  border: none;
  border-radius: 50px;
  padding: 1rem 2.5rem;
  margin: auto 16px 16px 16px;
  width: calc(100% - 32px);
  
  color: rgba(60, 45, 30, 0.95);
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  /* Bevel/Emboss effect */
  box-shadow: 
    0 8px 24px rgba(255, 200, 80, 0.5),
    0 4px 12px rgba(255, 180, 50, 0.3),
    inset 0 2px 4px rgba(255, 255, 255, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.8),
    inset 0 -2px 4px rgba(200, 150, 0, 0.3),
    inset 0 -1px 0 rgba(200, 150, 0, 0.4);
  
  letter-spacing: 0.3px;
  text-align: center;
  text-shadow: 
    0 1px 0 rgba(255, 255, 255, 0.4),
    0 -1px 0 rgba(150, 100, 0, 0.3);
}

.action-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 
    0 10px 28px rgba(255, 200, 80, 0.6),
    0 5px 15px rgba(255, 180, 50, 0.4),
    inset 0 2px 4px rgba(255, 255, 255, 0.7),
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    inset 0 -2px 4px rgba(200, 150, 0, 0.25),
    inset 0 -1px 0 rgba(200, 150, 0, 0.35);
  
  background: radial-gradient(
    ellipse at center,
    #FFF29C 0%,
    #FFE066 30%,
    #FFD24D 60%,
    #F5C030 100%
  );
}

.action-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* ========================================
   TRANSITIONS
======================================== */
.panel-fade-enter-active {
  transition: all 0.8s ease;
}

.panel-fade-leave-active {
  transition: all 0.6s ease;
}

.panel-fade-enter-from {
  opacity: 0;
  transform: translateY(-50%) scale(0.9);
}

.panel-fade-leave-to {
  opacity: 0;
  transform: translateY(-40%);
}

/* ========================================
   RESPONSIVE
======================================== */
@media (max-width: 768px) {
  .glass-panel {
    right: 20px;
    width: calc(100% - 40px);
    max-width: 320px;
    min-height: 260px;
  }
  
  .worry-input {
    font-size: 1.4rem;
    padding: 1.5rem 1.2rem 0.5rem;
    min-height: 120px;
  }
  
  .worry-input::placeholder {
    font-size: 1.4rem;
  }
  
  .action-btn {
    font-size: 0.95rem;
    padding: 0.9rem 2rem;
  }
  
  .dreamy-text {
    font-size: 1.6rem;
    padding: 1.5rem;
  }
  
  .dreamy-content {
    padding: 2rem;
  }
}

@media (max-width: 480px) {
  .dreamy-text {
    font-size: 1.4rem;
  }
}
</style>
