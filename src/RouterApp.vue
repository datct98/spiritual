<template>
  <!-- Show AuthPage if not authenticated -->
  <AuthPage v-if="!isAuthenticated" />
  
  <!-- Show router-view if authenticated -->
  <router-view v-else />
</template>

<script setup>
import { watch } from 'vue'
import { useAuth } from './composables/useAuth'
import AuthPage from './components/AuthPage.vue'

const { isAuthenticated, logout } = useAuth()

// Watch authentication state - if token becomes invalid, force logout
watch(isAuthenticated, (newVal) => {
  if (!newVal) {
    // Clear any invalid tokens
    localStorage.removeItem('jwt_token')
  }
})
</script>
