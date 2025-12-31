<template>
  <Transition name="fade">
    <div 
      v-if="combo > 0" 
      class="combo-streak"
      :class="levelClass"
      :style="{ color: color }"
    >
      <div class="combo-label">COMBO</div>
      <div class="combo-count">{{ combo }}x</div>
      <div class="combo-bar">
        <div 
          class="combo-bar-fill" 
          :style="{ width: barWidth + '%', backgroundColor: color }"
        ></div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  combo: {
    type: Number,
    default: 0
  },
  level: {
    type: String,
    default: 'normal'
  },
  color: {
    type: String,
    default: '#ffffff'
  }
})

const levelClass = computed(() => `combo-${props.level}`)

const barWidth = computed(() => {
  // Progress to next milestone (every 50)
  const nextMilestone = Math.ceil(props.combo / 50) * 50
  const prevMilestone = nextMilestone - 50
  const progress = ((props.combo - prevMilestone) / 50) * 100
  return Math.min(progress, 100)
})
</script>

<style scoped>
.combo-streak {
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 1rem 1.5rem;
  min-width: 150px;
  text-align: center;
  z-index: 100;
  border: 2px solid currentColor;
  box-shadow: 0 0 20px currentColor;
}

.combo-label {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 2px;
  opacity: 0.9;
  margin-bottom: 0.3rem;
}

.combo-count {
  font-size: 2.5rem;
  font-weight: 900;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.combo-bar {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  overflow: hidden;
  margin-top: 0.5rem;
}

.combo-bar-fill {
  height: 100%;
  transition: width 0.3s ease, background-color 0.5s ease;
  border-radius: 3px;
}

.combo-normal {
  animation: pulse 1s ease-in-out infinite;
}

.combo-rare {
  animation: glow 1s ease-in-out infinite;
}

.combo-epic {
  animation: glow 0.7s ease-in-out infinite, pulse 1s ease-in-out infinite;
}

.combo-legendary {
  animation: fire 0.5s ease-in-out infinite, pulse 0.7s ease-in-out infinite;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.8);
}

@media (max-width: 768px) {
  .combo-streak {
    top: 10px;
    right: 10px;
    padding: 0.7rem 1rem;
    min-width: 120px;
  }
  
  .combo-count {
    font-size: 2rem;
  }
}
</style>
