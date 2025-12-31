import { ref, computed, watch } from 'vue'

export function useCombo() {
    const comboCount = ref(0)
    let comboTimer = null

    // Combo levels based on count
    const comboLevel = computed(() => {
        if (comboCount.value >= 200) return 'legendary'
        if (comboCount.value >= 100) return 'epic'
        if (comboCount.value >= 50) return 'rare'
        return 'normal'
    })

    const comboColor = computed(() => {
        const colors = {
            normal: '#ffffff',
            rare: '#4fc3f7',
            epic: '#ba68c8',
            legendary: '#ffd700'
        }
        return colors[comboLevel.value]
    })

    const isMilestone = computed(() => {
        return comboCount.value > 0 && comboCount.value % 100 === 0
    })

    const increment = () => {
        comboCount.value++

        // Reset timer
        if (comboTimer) {
            clearTimeout(comboTimer)
        }

        // Start new timer - combo breaks after 2 seconds
        comboTimer = setTimeout(() => {
            comboCount.value = 0
        }, 2000)

        return {
            count: comboCount.value,
            level: comboLevel.value,
            color: comboColor.value,
            isMilestone: isMilestone.value
        }
    }

    const reset = () => {
        comboCount.value = 0
        if (comboTimer) {
            clearTimeout(comboTimer)
        }
    }

    return {
        comboCount,
        comboLevel,
        comboColor,
        isMilestone,
        increment,
        reset
    }
}
