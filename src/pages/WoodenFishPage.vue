<template>
  <div>
    <!-- Back button to home -->
    <div class="back-nav">
      <button @click="$router.push('/home')" class="back-btn">← Quay lại trang chủ</button>
    </div>
    
    <!-- Original App.vue content -->
    <component :is="WoodenFishApp" />
  </div>
</template>

<script setup>
import { defineComponent } from 'vue'
import WoodenFishApp from '../App.vue'
</script>

<style scoped>
.back-nav {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 10000;
}

.back-btn {
  padding: 0.8rem 1.5rem;
  background: rgba(244, 196, 48, 0.2);
  border: 1px solid rgba(244, 196, 48, 0.4);
  border-radius: 12px;
  color: #f4c430;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  backdrop-filter: blur(10px);
}

.back-btn:hover {
  background: rgba(244, 196, 48, 0.3);
  transform: translateX(-5px);
  box-shadow: 0 4px 15px rgba(244, 196, 48, 0.3);
}
</style>
