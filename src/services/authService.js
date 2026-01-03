import axios from 'axios';

const authApi = axios.create({
    baseURL: import.meta.env.VITE_IDENTITY_API_URL,
    timeout: 10000
});

export const authService = {
    /**
     * Login user
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise<string>} JWT token
     */
    async login(email, password) {
        const { data } = await authApi.post('/auth/login', { email, password });
        return data.token;
    },

    /**
     * Register new user
     * @param {string} fullName 
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise<string>} JWT token
     */
    async register(fullName, email, password) {
        const { data } = await authApi.post('/auth/register', {
            fullName,
            email,
            password,
            role: 'CUSTOMER'
        });
        return data.token;
    },

    /**
     * Logout (stateless - just clears client token)
     */
    async logout() {
        try {
            await authApi.post('/auth/logout');
        } catch (error) {
            // Ignore errors on logout
            console.warn('Logout request failed:', error.message);
        }
    }
};
