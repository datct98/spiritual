import { ref, onMounted } from 'vue'
import { worryService } from '../services/worryService'

export function useWorryJar() {
    const isReleasing = ref(false)
    const affirmation = ref('')
    const remainingQuota = ref(5)
    const error = ref(null)
    const history = ref([])

    // Load quota on mount
    onMounted(async () => {
        try {
            const quota = await worryService.getQuota()
            remainingQuota.value = quota.remaining
        } catch (err) {
            console.error('Failed to load quota:', err)
        }
    })

    /**
     * Release worry
     * @param {string} text - Worry text (sẽ BỊ XÓA ngay sau khi lấy length)
     * @param {string} effectType - "BURN" hoặc "DISSOLVE"
     * @param {string} visualType - "JAR" hoặc "VOID"
     */
    const release = async (text, effectType, visualType) => {
        if (isReleasing.value) return false

        isReleasing.value = true
        error.value = null
        affirmation.value = ''

        try {
            // Lấy character count
            const charCount = text.length

            // XÓA text khỏi memory NGAY LẬP TỨC
            text = null

            console.log('🌌 Releasing worry to the void...')

            // Gửi chỉ metadata đến API
            const response = await worryService.release(charCount, effectType, visualType)

            // Cập nhật state
            affirmation.value = response.affirmation
            remainingQuota.value = response.remainingToday

            console.log('✅ Release successful:', response.message)
            return true

        } catch (err) {
            console.error('❌ Release failed:', err)

            if (err.response?.data?.message) {
                error.value = err.response.data.message
            } else {
                error.value = 'Không thể gửi vào hư không. Vui lòng thử lại.'
            }

            return false

        } finally {
            isReleasing.value = false
        }
    }

    /**
     * Load lịch sử releases
     */
    const loadHistory = async () => {
        try {
            history.value = await worryService.getHistory()
        } catch (err) {
            console.error('Failed to load history:', err)
        }
    }

    /**
     * Refresh quota
     */
    const refreshQuota = async () => {
        try {
            const quota = await worryService.getQuota()
            remainingQuota.value = quota.remaining
        } catch (err) {
            console.error('Failed to refresh quota:', err)
        }
    }

    return {
        // State
        isReleasing,
        affirmation,
        remainingQuota,
        error,
        history,

        // Actions
        release,
        loadHistory,
        refreshQuota
    }
}
