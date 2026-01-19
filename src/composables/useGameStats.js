import { ref, computed, onMounted } from 'vue'
import { meritService } from '../services/meritService'

export function useGameStats() {
    const stats = ref({
        merit: 0,
        peace: 0,
        karma: 0,
        totalPoints: 0
    })

    const isLoading = ref(false)
    const error = ref(null)
    const rateLimitMessage = ref(null)

    // Khóa để tránh sync đồng thời
    let isSyncing = false

    // Load stats from localStorage first (for instant display)
    const loadLocalStats = () => {
        const saved = localStorage.getItem('spiritual-stats')
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                stats.value = { ...stats.value, ...parsed }
                console.log('📦 Loaded from localStorage:', parsed)
            } catch (err) {
                console.error('Failed to parse localStorage:', err)
            }
        }
    }

    // Load all stats from API (source of truth)
    const loadMeritPoints = async () => {
        if (isSyncing) return

        try {
            isSyncing = true
            isLoading.value = true

            console.log('🔄 Fetching merit points from API...')
            const data = await meritService.getPoints()

            console.log('✅ API response:', data)

            // Update all stats from backend
            stats.value.merit = data.merit || 0
            stats.value.peace = data.peace || 0
            stats.value.karma = data.karma || 0
            stats.value.totalPoints = data.totalPoints || 0

            // Save to localStorage as backup
            saveLocalStats()
        } catch (err) {
            console.error('❌ Failed to load merit points from API:', err)
            // Keep using localStorage data if API fails
        } finally {
            isLoading.value = false
            isSyncing = false
        }
    }

    // Save to localStorage as backup
    const saveLocalStats = () => {
        localStorage.setItem('spiritual-stats', JSON.stringify(stats.value))
        console.log('💾 Saved to localStorage:', stats.value)
    }

    // Increment merit via API with optimistic update
    const incrementMerit = async () => {
        try {
            error.value = null
            rateLimitMessage.value = null

            console.log('🔔 Tapping wooden fish...')

            // Gọi API - backend sẽ random 1 trong 3 loại điểm
            const result = await meritService.tap()

            console.log('✅ Tap API response:', result)

            // Update stats from API response
            // result.allStats contains: { merit, peace, karma, totalPoints, level }
            if (result.allStats) {
                stats.value.merit = result.allStats.merit || 0
                stats.value.peace = result.allStats.peace || 0
                stats.value.karma = result.allStats.karma || 0
                stats.value.totalPoints = result.allStats.totalPoints || 0
            }

            saveLocalStats()

            // Return result bao gồm: type, displayText, icon, newValue, allStats
            return result
        } catch (err) {
            // Handle rate limiting
            if (err.response?.status === 429) {
                rateLimitMessage.value = err.response.data?.error || 'Bạn gõ quá nhanh, tâm chưa tịnh! 🙏'
                console.warn('⚠️ Rate limited')

                // Clear message after 3 seconds
                setTimeout(() => {
                    rateLimitMessage.value = null
                }, 3000)
            } else {
                error.value = 'Không thể kết nối đến server. Vui lòng thử lại.'
                console.error('❌ Tap failed:', err)
            }
            throw err
        }
    }

    // Reset stats
    const resetStats = () => {
        stats.value = {
            merit: 0,
            peace: 0,
            karma: 0,
            totalPoints: 0
        }
        saveLocalStats()
    }

    // Computed values
    const level = computed(() => {
        // Mỗi 100 điểm (totalPoints) = 1 cấp
        return Math.floor(stats.value.totalPoints / 100) + 1
    })

    // Initialize on mount
    onMounted(() => {
        // Load localStorage first for instant display
        loadLocalStats()

        // Then fetch from API to sync with backend
        loadMeritPoints()
    })

    return {
        stats,
        isLoading,
        error,
        rateLimitMessage,
        incrementMerit,
        resetStats,
        loadMeritPoints,
        level
    }
}
