<template>
  <Transition name="float">
    <div 
      v-if="visible"
      class="floating-text"
      :style="textStyle"
      :class="textClass"
    >
      {{ text }}
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  x: {
    type: Number,
    default: 0
  },
  y: {
    type: Number,
    default: 0
  },
  isMeme: {
    type: Boolean,
    default: false
  }
})

const visible = ref(false)
const offsetX = ref((Math.random() - 0.5) * 60) // Random horizontal offset

const textStyle = computed(() => ({
  left: `${props.x}px`,
  top: `${props.y}px`,
  '--float-x': `${offsetX.value}px`
}))

const textClass = computed(() => ({
  'meme-text': props.isMeme
}))

onMounted(() => {
  visible.value = true
  
  // Remove after animation completes
  setTimeout(() => {
    visible.value = false
  }, 1500)
})
</script>

<style scoped>
.floating-text {
  position: fixed;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--gold-dark);
  text-shadow: 
    0 2px 10px rgba(255, 255, 255, 0.9),
    0 0 20px rgba(244, 196, 48, 0.5);
  pointer-events: none;
  z-index: 1000;
  transform-origin: center;
}

.meme-text {
  font-size: 2rem;
  color: #ff6b9d;
  text-shadow: 
    0 2px 10px rgba(255, 255, 255, 0.9),
    0 0 30px rgba(255, 107, 157, 0.8);
  font-style: italic;
  font-weight: 900;
}

.float-enter-active {
  animation: floatUp 1.5s ease-out forwards;
}
</style>
