<template>
  <div 
    class="wooden-fish-container"
    @click="handleClick"
    @touchstart.prevent="handleClick"
    :class="{ 'bouncing': isBouncing }"
  >
    <!-- SVG Filter to remove white background -->
    <svg style="position: absolute; width: 0; height: 0;">
      <defs>
        <filter id="remove-white" color-interpolation-filters="sRGB">
          <feColorMatrix type="matrix"
            values="1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    -1 -1 -1 2 0" />
        </filter>
      </defs>
    </svg>
    
    <img 
      src="/images/wooden-fish.png" 
      alt="Wooden Fish"
      class="wooden-fish-image"
      draggable="false"
    />
    <div class="click-hint">Gõ mõ 🙏</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['click'])
const isBouncing = ref(false)

const handleClick = () => {
  // Trigger bounce animation
  isBouncing.value = true
  setTimeout(() => {
    isBouncing.value = false
  }, 400)
  
  // Emit click event to parent
  emit('click')
}
</script>

<style scoped>
.wooden-fish-container {
  position: relative;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.1s ease;
}

.wooden-fish-container:hover {
  transform: scale(1.05);
}

.wooden-fish-container:active {
  transform: scale(0.95);
}

.wooden-fish-image {
  width: 300px;
  height: 300px;
  object-fit: contain;
  transition: filter 0.3s ease;
  /* Apply SVG filter to remove white background */
  filter: url(#remove-white) drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3));
}

.wooden-fish-container:hover .wooden-fish-image {
  filter: url(#remove-white) drop-shadow(0 15px 40px rgba(244, 196, 48, 0.5));
}

.bouncing .wooden-fish-image {
  animation: bounce 0.4s cubic-bezier(0.36, 0, 0.66, -0.56);
}

.click-hint {
  position: absolute;
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--gold-dark);
  text-shadow: 0 2px 10px rgba(255, 255, 255, 0.8);
  opacity: 0.7;
  pointer-events: none;
}

@media (max-width: 768px) {
  .wooden-fish-image {
    width: 200px;
    height: 200px;
  }
}
</style>
