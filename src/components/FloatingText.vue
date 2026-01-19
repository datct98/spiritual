<template>
  <Transition name="float-up">
    <div 
      v-if="visible"
      class="floating-text"
      :style="textStyle"
      :class="[typeClass, { 'meme-text': isMeme }]"
    >
      {{ text }}
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const props = defineProps({
  text: String,
  x: Number,
  y: Number,
  isMeme: Boolean,
  statType: {
    type: String,
    default: 'merit' // 'merit', 'peace', 'karma'
  }
})

const visible = ref(false)
const offsetX = ref((Math.random() - 0.5) * 50)

const textStyle = computed(() => ({
  left: `${props.x}px`,
  top: `${props.y}px`,
  '--float-x': `${offsetX.value}px`
}))

const typeClass = computed(() => {
  if (props.isMeme) return 'meme'
  return `type-${props.statType}`
})

onMounted(() => {
  visible.value = true
  setTimeout(() => visible.value = false, 2500)
})
</script>

<style scoped>
.floating-text {
  position: fixed;
  font-family: var(--font-heading);
  font-size: 2rem;
  font-weight: 700;
  pointer-events: none;
  z-index: 150;
  letter-spacing: 0.05em;
  white-space: nowrap;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* Stat Type Colors */
.type-merit {
  background: linear-gradient(to bottom, #FFD700, #FFA500);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.type-peace {
  background: linear-gradient(to bottom, #A8DAFF, #6BB6FF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.type-karma {
  background: linear-gradient(to bottom, #E8D5F2, #C4A6E0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.meme-text {
  font-family: var(--font-body);
  font-style: italic;
  font-weight: 600;
  background: linear-gradient(to bottom, #FFB5C2, #FF8FA3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 15px rgba(255, 181, 194, 0.5));
}

.float-up-enter-active {
  animation: floatUpGentle 2.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

@media (max-width: 768px) {
  .floating-text {
    font-size: 1.5rem;
  }
}
</style>
