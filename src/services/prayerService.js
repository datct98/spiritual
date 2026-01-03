import axios from 'axios';

const prayerApi = axios.create({
    baseURL: import.meta.env.VITE_PRAYER_API_URL || 'http://localhost:8083/api/v1',
    timeout: 10000
});

// Automatically attach JWT token to all requests
prayerApi.interceptors.request.use(
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
prayerApi.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('jwt_token');
            window.location.reload();
        }
        return Promise.reject(error);
    }
);

export const prayerService = {
    /**
     * Create a new prayer
     * @param {Object} prayerData - { content, type }
     * @returns {Promise<Object>} Created prayer
     */
    async createPrayer(prayerData) {
        console.log('📡 Calling API: POST /prayers', prayerData);
        const { data } = await prayerApi.post('/prayers', prayerData);
        console.log('✅ Prayer created:', data);
        return data;
    },

    /**
     * Send heart/blessing to a prayer
     * @param {string} prayerId
     * @returns {Promise<Object>} Updated prayer
     */
    async sendHeart(prayerId) {
        console.log(`📡 Calling API: POST /prayers/${prayerId}/heart`);
        const { data } = await prayerApi.post(`/prayers/${prayerId}/heart`);
        console.log('✅ Heart sent:', data);
        return data;
    },

    /**
     * Get recent floating prayers
     * @param {number} limit
     * @returns {Promise<Array>} List of prayers
     */
    async getRecentPrayers(limit = 100) {
        console.log(`📡 Calling API: GET /prayers/recent?limit=${limit}`);
        const { data } = await prayerApi.get('/prayers/recent', { params: { limit } });
        console.log(`✅ Fetched ${data.length} prayers`);
        return data;
    },

    /**
     * Get current user's prayers
     * @returns {Promise<Array>} User's prayers
     */
    async getMyPrayers() {
        console.log('📡 Calling API: GET /prayers/my');
        const { data } = await prayerApi.get('/prayers/my');
        console.log(`✅ Fetched ${data.length} of my prayers`);
        return data;
    },

    /**
     * Get top blessed prayers
     * @param {number} limit
     * @returns {Promise<Array>} Top blessed prayers
     */
    async getTopBlessed(limit = 50) {
        console.log(`📡 Calling API: GET /prayers/top-blessed?limit=${limit}`);
        const { data } = await prayerApi.get('/prayers/top-blessed', { params: { limit } });
        console.log(`✅ Fetched ${data.length} top blessed prayers`);
        return data;
    }
};
