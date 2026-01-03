<template>
  <div class="prayer-page">
    <!-- Sky Background -->
    <div class="sky-background">
      <div class="moon"></div>
      <div class="stars"></div>
    </div>
    
    <!-- Water Background -->
    <div class="water-background"></div>

    <!-- Header -->
    <header class="page-header">
      <button @click="$router.push('/home')" class="back-btn">← Trang chủ</button>
      <h1 class="page-title">🏮 Phóng Đăng Cầu Nguyện</h1>
      <div class="connection-status" :class="{ connected: isConnected }">
        <span class="status-dot"></span>
        {{ isConnected ? 'Kết nối' : 'Đang kết nối...' }}
      </div>
    </header>

    <!-- Main Content -->
    <div class="page-content">
      <!-- Prayer Form -->
      <div class="prayer-form-wrapper">
        <div class="prayer-form">
          <h3 class="form-title">✍️ Viết Lời Cầu Nguyện</h3>
          <textarea
            v-model="prayerText"
            :maxlength="500"
            placeholder="Gửi lời cầu nguyện chân thành từ trái tim bạn..."
            class="prayer-input"
            :disabled="isLoading"
          ></textarea>
          <div class="form-footer">
            <span class="char-count">{{ prayerText.length }}/500</span>
            <button 
              @click="submitPrayer" 
              :disabled="!canSubmit"
              class="submit-btn"
            >
              <span v-if="!isLoading">Thả Đăng 🏮</span>
              <span v-else>Đang gửi...</span>
            </button>
          </div>
          <p v-if="error" class="error-msg">⚠️ {{ error }}</p>
        </div>
      </div>

      <!-- Lanterns -->
      <div class="lanterns-layer">
        <transition-group name="lantern">
          <div
            v-for="prayer in prayers"
            :key="prayer.id"
            :class="['lantern', prayer.type === 'SKY_LANTERN' ? 'sky' : 'lotus']"
            :style="getLanternStyle(prayer)"
            @click="viewPrayer(prayer)"
          >
            <div class="lantern-glow"></div>
            <div class="lantern-body"></div>
          </div>
        </transition-group>
      </div>
    </div>

    <!-- Modal -->
    <transition name="modal">
      <div v-if="selectedPrayer" class="modal-overlay" @click="closeModal">
        <div class="modal-box" @click.stop>
          <button @click="closeModal" class="close-btn">✕</button>
          
          <div class="modal-content">
            <div class="prayer-icon">
              {{ selectedPrayer.type === 'SKY_LANTERN' ? '🏮' : '🪷' }}
            </div>
            
            <div class="prayer-text-box">
              <p class="prayer-text">{{ selectedPrayer.content }}</p>
            </div>
            
            <div class="prayer-meta">
              <span class="author">{{ selectedPrayer.displayName }}</span>
              <span class="time">{{ formatTime(selectedPrayer.createdAt) }}</span>
            </div>
            
            <button 
              @click="sendBlessing"
              :disabled="selectedPrayer.heartedByMe"
              class="heart-btn"
              :class="{ hearted: selectedPrayer.heartedByMe }"
            >
              <span class="heart-icon">{{ selectedPrayer.heartedByMe ? '💛' : '🤍' }}</span>
              Gửi Lời Chúc ({{ selectedPrayer.hearts }})
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePrayer } from '../composables/usePrayer'

const router = useRouter()
const { prayers, isConnected, isLoading, error, createPrayer, sendHeart } = usePrayer()

const prayerText = ref('')
const selectedPrayer = ref(null)

const canSubmit = computed(() => {
  return prayerText.value.trim().length >= 10 && 
         prayerText.value.length <= 500 && 
         !isLoading.value
})

const submitPrayer = async () => {
  if (!canSubmit.value) return
  
  try {
    await createPrayer(prayerText.value.trim(), 'SKY_LANTERN')
    prayerText.value = ''
  } catch (err) {
    console.error('Failed:', err)
  }
}

const viewPrayer = (prayer) => {
  selectedPrayer.value = prayer
}

const closeModal = () => {
  selectedPrayer.value = null
}

const sendBlessing = async () => {
  if (!selectedPrayer.value) return
  
  try {
    await sendHeart(selectedPrayer.value.id)
    closeModal()
  } catch (err) {
    console.error('Failed:', err)
  }
}

const getLanternStyle = (prayer) => {
  return {
    left: `${prayer.positionX}%`,
    animationDuration: `${prayer.animationDuration}s`
  }
}

const formatTime = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMins = Math.floor((now - date) / 60000)
  
  if (diffMins < 1) return 'Vừa xong'
  if (diffMins < 60) return `${diffMins} phút trước`
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)} giờ trước`
  return `${Math.floor(diffMins / 1440)} ngày trước`
}
</script>

<style scoped>
.prayer-page {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
}

/* Sky Background */
.sky-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60%;
  background: linear-gradient(180deg, #0a0e27 0%, #16213e 100%);
  z-index: 0;
}

.moon {
  position: absolute;
  top: 10%;
  right: 15%;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #fff9e6, #f4c430);
  box-shadow: 0 0 80px rgba(244, 196, 48, 0.6);
  animation: moonPulse 4s ease-in-out infinite;
}

@keyframes moonPulse {
  0%, 100% { transform: scale(1); opacity: 0.9; }
  50% { transform: scale(1.05); opacity: 1; }
}

.stars {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(2px 2px at 20% 30%, white, transparent),
    radial-gradient(2px 2px at 60% 70%, white, transparent),
    radial-gradient(1px 1px at 50% 50%, white, transparent),
    radial-gradient(1px 1px at 80% 10%, white, transparent);
  background-size: 200% 200%;
  animation: starTwinkle 20s linear infinite;
  opacity: 0.8;
}

@keyframes starTwinkle {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}

/* Water Background */
.water-background {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40%;
  background: linear-gradient(180deg, #0f3460 0%, #0a1929 100%);
  z-index: 0;
}

/* Header */
.page-header {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  background: rgba(10, 14, 39, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(244, 196, 48, 0.2);
}

.back-btn {
  padding: 0.6rem 1.2rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(-5px);
}

.page-title {
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(135deg, #f4c430, #ff9966);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.connection-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 107, 107, 0.2);
  border-radius: 20px;
  color: #ff6b6b;
  font-size: 0.9rem;
}

.connection-status.connected {
  background: rgba(76, 175, 80, 0.2);
  color: #4CAF50;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Content */
.page-content {
  position: relative;
  z-index: 1;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

/* Prayer Form */
.prayer-form-wrapper {
  max-width: 600px;
  margin: 0 auto 3rem;
}

.prayer-form {
  background: rgba(26, 26, 46, 0.9);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(244, 196, 48, 0.3);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.form-title {
  text-align: center;
  color: #f4c430;
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
}

.prayer-input {
  width: 100%;
  min-height: 150px;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  line-height: 1.6;
  resize: vertical;
  transition: all 0.3s;
}

.prayer-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.prayer-input:focus {
  outline: none;
  border-color: rgba(244, 196, 48, 0.5);
  box-shadow: 0 0 20px rgba(244, 196, 48, 0.2);
}

.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.char-count {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
}

.submit-btn {
  padding: 0.8rem 2rem;
  background: linear-gradient(135deg, #f4c430, #ff9966);
  border: none;
  border-radius: 25px;
  color: white;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 20px rgba(244, 196, 48, 0.4);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 6px 30px rgba(244, 196, 48, 0.6);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-msg {
  margin-top: 1rem;
  padding: 0.8rem;
  background: rgba(255, 107, 107, 0.2);
  border: 1px solid #ff6b6b;
  border-radius: 8px;
  color: #ff6b6b;
  text-align: center;
}

/* Lanterns */
.lanterns-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 5;
}

.lantern {
  position: absolute;
  cursor: pointer;
  pointer-events: all;
  transition: transform 0.3s;
}

.lantern:hover {
  transform: scale(1.3);
  z-index: 100;
}

/* Sky Lantern */
.lantern.sky {
  width: 60px;
  height: 80px;
  bottom: -100px;
  animation: floatUp 30s linear infinite;
}

.lantern.sky .lantern-body {
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse, #fff9e6 0%, #ffcc66 50%, #ff9966 100%);
  border-radius: 40% 40% 50% 50%;
  position: relative;
  box-shadow: 0 0 30px rgba(255, 204, 102, 0.8);
}

.lantern.sky .lantern-glow {
  position: absolute;
  inset: -10px;
  background: radial-gradient(circle, rgba(255, 204, 102, 0.6), transparent 70%);
  border-radius: 50%;
  animation: glow 2s ease-in-out infinite;
}

@keyframes floatUp {
  0% {
    bottom: -100px;
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    bottom: 110vh;
    opacity: 0;
  }
}

@keyframes glow {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

/* Lotus Lantern */
.lantern.lotus {
  width: 70px;
  height: 50px;
  top: 65%;
  left: -80px;
  animation: drift 40s linear infinite;
}

.lantern.lotus .lantern-body {
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, #ffccff 0%, #ff66cc 50%, #cc3399 100%);
  border-radius: 50%;
  position: relative;
  box-shadow: 0 0 25px rgba(255, 102, 204, 0.7);
}

.lantern.lotus .lantern-glow {
  position: absolute;
  inset: -8px;
  background: radial-gradient(circle, rgba(255, 102, 204, 0.5), transparent 70%);
  border-radius: 50%;
  animation: glow 2.5s ease-in-out infinite;
}

@keyframes drift {
  0% {
    left: -80px;
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    left: 110%;
    opacity: 0;
  }
}

/* Transitions */
.lantern-enter-active {
  transition: opacity 1s;
}

.lantern-enter-from {
  opacity: 0;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-box {
  position: relative;
  max-width: 500px;
  width: 90%;
  background: rgba(26, 26, 46, 0.95);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(244, 196, 48, 0.4);
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6);
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 36px;
  height: 36px;
  border: none;
  background: rgba(255, 107, 107, 0.2);
  color: #ff6b6b;
  border-radius: 50%;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s;
}

.close-btn:hover {
  background: rgba(255, 107, 107, 0.4);
  transform: rotate(90deg);
}

.modal-content {
  text-align: center;
}

.prayer-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
}

.prayer-text-box {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  margin-bottom: 1.5rem;
}

.prayer-text {
  color: white;
  font-size: 1.1rem;
  line-height: 1.8;
}

.prayer-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding: 0 1rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
}

.author {
  color: #f4c430;
  font-weight: 600;
}

.heart-btn {
  width: 100%;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #ff6b6b, #ff9966);
  border: none;
  border-radius: 25px;
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 20px rgba(255, 107, 107, 0.4);
}

.heart-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 6px 30px rgba(255, 107, 107, 0.6);
}

.heart-btn.hearted {
  background: rgba(255, 255, 255, 0.2);
  cursor: not-allowed;
}

.heart-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.heart-icon {
  font-size: 1.3rem;
  margin-right: 0.5rem;
}

.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
  
  .page-title {
    font-size: 1.3rem;
  }
  
  .page-content {
    padding: 1rem;
  }
  
  .prayer-form {
    padding: 1.5rem;
  }
  
  .moon {
    width: 70px;
    height: 70px;
  }
}
</style>
