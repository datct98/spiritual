import { ref, computed } from 'vue'

export function useGameStats() {
    // Load from localStorage or initialize
    const loadStats = () => {
        const saved = localStorage.getItem('spiritual-stats')
        if (saved) {
            return JSON.parse(saved)
        }
        return {
            merit: 0,      // Công đức
            peace: 0,      // Tâm tịnh
            karma: 0,      // Nghiệp (shows as negative reduction)
            totalClicks: 0
        }
    }

    const stats = ref(loadStats())

    // Save to localStorage whenever stats change
    const saveStats = () => {
        localStorage.setItem('spiritual-stats', JSON.stringify(stats.value))
    }

    // Increment functions
    const incrementMerit = () => {
        stats.value.merit++
        stats.value.totalClicks++
        saveStats()
    }

    const incrementPeace = () => {
        stats.value.peace++
        saveStats()
    }

    const incrementKarma = () => {
        stats.value.karma++
        saveStats()
    }

    // Reset function
    const resetStats = () => {
        stats.value = {
            merit: 0,
            peace: 0,
            karma: 0,
            totalClicks: 0
        }
        saveStats()
    }

    // Computed values
    const level = computed(() => {
        return Math.floor(stats.value.merit / 100) + 1
    })

    return {
        stats,
        incrementMerit,
        incrementPeace,
        incrementKarma,
        resetStats,
        level
    }
}
