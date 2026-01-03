import axios from 'axios';

const meritApi = axios.create({
    baseURL: import.meta.env.VITE_MERIT_API_URL,
    timeout: 10000
});

// Automatically attach JWT token to all requests
meritApi.interceptors.request.use(
    config => {
        const token = localStorage.getItem('jwt_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

// Handle authentication errors
meritApi.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            // Token expired or invalid - clear it
            localStorage.removeItem('jwt_token');
            window.location.reload(); // Force re-login
        }
        return Promise.reject(error);
    }
);

export const meritService = {
    /**
     * Tap the wooden fish (+1 merit point)
     * @returns {Promise<{message: string, totalPoints: number}>}
     * @throws {Error} If rate limited (429) or network error
     */
    async tap() {
        console.log('📡 Calling API: POST /merit/tap')
        const { data } = await meritApi.post('/merit/tap');
        console.log('✅ API Response:', data)
        return data;
    },

    /**
     * Get current user's total merit points
     * @returns {Promise<number>}
     */
    async getPoints() {
        console.log('📡 Calling API: GET /merit/me')
        const { data } = await meritApi.get('/merit/me');
        console.log('✅ API Response:', data)
        return data.totalPoints || data;
    }
};

