<template>
  <div class="auth-page">
    <!-- Animated background matching wooden fish aesthetic -->
    <div class="auth-background"></div>
    
    <!-- Floating particles -->
    <div class="particles">
      <div class="particle" v-for="i in 20" :key="i"></div>
    </div>

    <!-- Main auth card -->
    <div class="auth-card">
      <div class="lotus-header">
        <div class="lotus-icon">🪷</div>
        <h1>Gõ Mõ Tâm Linh</h1>
        <p class="subtitle">Tích công đức - Giảm nghiệp chướng</p>
      </div>

      <!-- Tab switcher -->
      <div class="tabs">
        <button 
          :class="{ active: isLogin }" 
          @click="switchToLogin"
          class="tab-btn"
        >
          Đăng nhập
        </button>
        <button 
          :class="{ active: !isLogin }" 
          @click="switchToRegister"
          class="tab-btn"
        >
          Đăng ký
        </button>
        <div class="tab-indicator" :style="tabIndicatorStyle"></div>
      </div>

      <!-- Login Form -->
      <form v-if="isLogin" @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label>Email</label>
          <input 
            v-model="loginForm.email" 
            type="email" 
            placeholder="email@example.com"
            required
            autocomplete="email"
          />
        </div>

        <div class="form-group">
          <label>Mật khẩu</label>
          <input 
            v-model="loginForm.password" 
            type="password" 
            placeholder="••••••••"
            required
            autocomplete="current-password"
          />
        </div>

        <button type="submit" :disabled="isLoading" class="submit-btn">
          <span v-if="!isLoading">Đăng nhập 🙏</span>
          <span v-else class="loading-spinner">⏳ Đang xử lý...</span>
        </button>
      </form>

      <!-- Register Form -->
      <form v-else @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <label>Họ và tên</label>
          <input 
            v-model="registerForm.fullName" 
            type="text" 
            placeholder="Nguyễn Văn A"
            required
            autocomplete="name"
          />
        </div>

        <div class="form-group">
          <label>Email</label>
          <input 
            v-model="registerForm.email" 
            type="email" 
            placeholder="email@example.com"
            required
            autocomplete="email"
          />
        </div>

        <div class="form-group">
          <label>Mật khẩu</label>
          <input 
            v-model="registerForm.password" 
            type="password" 
            placeholder="••••••••"
            required
            autocomplete="new-password"
            minlength="6"
          />
        </div>

        <button type="submit" :disabled="isLoading" class="submit-btn">
          <span v-if="!isLoading">Đăng ký 🪷</span>
          <span v-else class="loading-spinner">⏳ Đang xử lý...</span>
        </button>
      </form>

      <!-- Error message -->
      <div v-if="authError" class="error-message">
        {{ authError }}
      </div>
    </div>

    <!-- Footer -->
    <div class="auth-footer">
      <p>✨ Hành trình tu tâm của bạn bắt đầu từ đây ✨</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuth } from '../composables/useAuth'

const { login, register, isLoading, authError } = useAuth()

const isLogin = ref(true)

const loginForm = ref({
  email: '',
  password: ''
})

const registerForm = ref({
  fullName: '',
  email: '',
  password: ''
})

const switchToLogin = () => {
  isLogin.value = true
}

const switchToRegister = () => {
  isLogin.value = false
}

const tabIndicatorStyle = computed(() => ({
  transform: isLogin.value ? 'translateX(0)' : 'translateX(100%)'
}))

const handleLogin = async () => {
  try {
    await login(loginForm.value.email, loginForm.value.password)
    // Success - App.vue will handle redirect
  } catch (error) {
    // Error is handled by useAuth
  }
}

const handleRegister = async () => {
  try {
    await register(
      registerForm.value.fullName,
      registerForm.value.email,
      registerForm.value.password
    )
    // Success - App.vue will handle redirect
  } catch (error) {
    // Error is handled by useAuth
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 20px;
}

/* Background - matching wooden fish gradient */
.auth-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    ellipse at top,
    var(--purple-light) 0%,
    var(--purple-medium) 40%,
    var(--purple-dark) 70%,
    var(--navy) 100%
  );
  z-index: -2;
}

/* Floating particles */
.particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 215, 0, 0.3);
  border-radius: 50%;
  animation: float 20s infinite;
}

.particle:nth-child(odd) {
  animation-duration: 25s;
  background: rgba(255, 255, 255, 0.2);
}

.particle:nth-child(1) { top: 10%; left: 10%; animation-delay: 0s; }
.particle:nth-child(2) { top: 20%; left: 80%; animation-delay: 2s; }
.particle:nth-child(3) { top: 60%; left: 20%; animation-delay: 4s; }
.particle:nth-child(4) { top: 80%; left: 70%; animation-delay: 1s; }
.particle:nth-child(5) { top: 30%; left: 50%; animation-delay: 3s; }
.particle:nth-child(6) { top: 50%; left: 90%; animation-delay: 5s; }
.particle:nth-child(7) { top: 70%; left: 30%; animation-delay: 2.5s; }
.particle:nth-child(8) { top: 15%; left: 60%; animation-delay: 4.5s; }
.particle:nth-child(9) { top: 85%; left: 15%; animation-delay: 1.5s; }
.particle:nth-child(10) { top: 40%; left: 75%; animation-delay: 3.5s; }

@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  50% {
    transform: translateY(-100vh) translateX(50px);
  }
}

/* Auth card - glassmorphism */
.auth-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 40px;
  width: 100%;
  max-width: 450px;
  box-shadow: 
    0 8px 32px 0 rgba(0, 0, 0, 0.37),
    0 0 60px rgba(244, 196, 48, 0.1);
  position: relative;
  z-index: 1;
}

.lotus-header {
  text-align: center;
  margin-bottom: 30px;
}

.lotus-icon {
  font-size: 60px;
  margin-bottom: 10px;
  animation: pulse 3s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.3));
  }
  50% {
    transform: scale(1.1);
    filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.5));
  }
}

.lotus-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.subtitle {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  margin: 0;
}

/* Tabs */
.tabs {
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 30px;
  position: relative;
}

.tab-btn {
  flex: 1;
  padding: 12px;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.3s;
  z-index: 1;
}

.tab-btn.active {
  color: white;
}

.tab-indicator {
  position: absolute;
  top: 4px;
  left: 4px;
  width: calc(50% - 4px);
  height: calc(100% - 8px);
  background: linear-gradient(135deg, var(--gold), var(--gold-light));
  border-radius: 8px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(244, 196, 48, 0.3);
}

/* Form */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  font-weight: 500;
}

.form-group input {
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  transition: all 0.3s;
}

.form-group input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.form-group input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.12);
  border-color: var(--gold);
  box-shadow: 0 0 0 3px rgba(244, 196, 48, 0.1);
}

/* Submit button */
.submit-btn {
  padding: 16px;
  background: linear-gradient(135deg, var(--gold), var(--gold-light));
  border: none;
  border-radius: 12px;
  color: var(--purple-dark);
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(244, 196, 48, 0.3);
  margin-top: 10px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(244, 196, 48, 0.4);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  display: inline-block;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Error message */
.error-message {
  margin-top: 16px;
  padding: 12px 16px;
  background: rgba(255, 59, 48, 0.15);
  border: 1px solid rgba(255, 59, 48, 0.3);
  border-radius: 12px;
  color: #ff6b6b;
  font-size: 0.9rem;
  text-align: center;
}

/* Footer */
.auth-footer {
  position: absolute;
  bottom: 30px;
  left: 0;
  right: 0;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .auth-card {
    padding: 30px 24px;
  }

  .lotus-header h1 {
    font-size: 1.6rem;
  }

  .lotus-icon {
    font-size: 50px;
  }
}
</style>
