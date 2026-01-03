import { ref, computed } from 'vue';
import { authService } from '../services/authService';

// Shared state across all components
const token = ref(localStorage.getItem('jwt_token'));
const authError = ref(null);
const isLoading = ref(false);

export function useAuth() {
    const isAuthenticated = computed(() => !!token.value);

    /**
     * Decode JWT token to get user email
     */
    const getUserEmail = () => {
        if (!token.value) return null;
        try {
            const payload = JSON.parse(atob(token.value.split('.')[1]));
            return payload.sub; // Email is in the 'sub' claim
        } catch (error) {
            console.error('Failed to decode JWT:', error);
            return null;
        }
    };

    /**
     * Get user full name from token if available
     */
    const getUserName = () => {
        if (!token.value) return null;
        try {
            const payload = JSON.parse(atob(token.value.split('.')[1]));
            return payload.fullName || payload.name || null;
        } catch (error) {
            return null;
        }
    };

    /**
     * Login with email and password
     */
    const login = async (email, password) => {
        try {
            isLoading.value = true;
            authError.value = null;

            const jwt = await authService.login(email, password);
            token.value = jwt;
            localStorage.setItem('jwt_token', jwt);

            return true;
        } catch (error) {
            authError.value = error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra email và mật khẩu.';
            throw error;
        } finally {
            isLoading.value = false;
        }
    };

    /**
     * Register new user
     */
    const register = async (fullName, email, password) => {
        try {
            isLoading.value = true;
            authError.value = null;

            const jwt = await authService.register(fullName, email, password);
            token.value = jwt;
            localStorage.setItem('jwt_token', jwt);

            return true;
        } catch (error) {
            authError.value = error.response?.data?.message || 'Đăng ký thất bại. Email có thể đã được sử dụng.';
            throw error;
        } finally {
            isLoading.value = false;
        }
    };

    /**
     * Logout current user
     */
    const logout = () => {
        token.value = null;
        localStorage.removeItem('jwt_token');
        authService.logout(); // Fire and forget
    };

    /**
     * Clear authentication error
     */
    const clearError = () => {
        authError.value = null;
    };

    return {
        // State
        isAuthenticated,
        isLoading,
        authError,

        // Getters
        getUserEmail,
        getUserName,

        // Actions
        login,
        register,
        logout,
        clearError
    };
}
