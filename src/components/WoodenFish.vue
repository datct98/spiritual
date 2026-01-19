<template>
  <div 
    class="wooden-fish-container"
    @click="handleClick"
    @touchstart.prevent="handleClick"
    :class="{ 'tapping': isTapping }"
  >
    <img 
      src="/wooden-fish-illustrated.png" 
      alt="Wooden Fish"
      class="wooden-fish-image"
      draggable="false"
    />
    <div class="soft-glow"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['click'])
const isTapping = ref(false)

const handleClick = (e) => {
  // Trigger tap animation
  isTapping.value = true
  setTimeout(() => {
    isTapping.value = false
  }, 200)
  
  // Emit click event to parent
  emit('click', e)
}
</script>

<style scoped>
.wooden-fish-container {
  position: relative;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: breathe 4s ease-in-out infinite;
}

.wooden-fish-container:active {
  transform: scale(0.97);
}

.wooden-fish-image {
  width: 350px;
  height: 350px;
  object-fit: contain;
  position: relative;
  z-index: 2;
  filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.1));
  transition: all 0.3s ease;
}

.wooden-fish-container:hover .wooden-fish-image {
  filter: drop-shadow(0 15px 40px rgba(255, 215, 0, 0.3));
  transform: translateY(-5px);
}

.soft-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.2), transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  z-index: 1;
  opacity: 0.6;
  transition: all 0.3s ease;
}

.wooden-fish-container:hover .soft-glow {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1.15);
}

.tapping .wooden-fish-image {
  animation: tapBounce 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes tapBounce {
  0% { transform: scale(1) translateY(0); }
  50% { transform: scale(0.95) translateY(5px); }
  100% { transform: scale(1) translateY(0); }
}

@media (max-width: 768px) {
  .wooden-fish-image {
    width: 280px;
    height: 280px;
  }
  
  .soft-glow {
    width: 200px;
    height: 200px;
  }
}
</style>
