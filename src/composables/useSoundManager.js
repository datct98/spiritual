export function useSoundManager() {
    // Create AudioContext for better control
    let audioContext = null
    const sounds = {
        woodenFish: [],
        gong: null
    }

    const initAudio = () => {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)()
        }
    }

    // Generate simple wooden fish sounds using Web Audio API
    const generateWoodenFishSound = (frequency) => {
        initAudio()

        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.frequency.value = frequency
        oscillator.type = 'sine'

        // Create envelope for natural sound
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)

        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.1)
    }

    // Generate gong sound
    const generateGongSound = () => {
        initAudio()

        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        const filter = audioContext.createBiquadFilter()

        oscillator.connect(filter)
        filter.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.frequency.value = 150
        oscillator.type = 'sine'

        filter.type = 'lowpass'
        filter.frequency.value = 1000

        // Long sustain for gong
        gainNode.gain.setValueAtTime(0.4, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2)

        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 2)
    }

    // Play random wooden fish sound
    const playWoodenFish = () => {
        const frequencies = [800, 850, 900, 950] // Slightly different pitches
        const randomFreq = frequencies[Math.floor(Math.random() * frequencies.length)]
        generateWoodenFishSound(randomFreq)
    }

    // Play gong sound for milestones
    const playGong = () => {
        generateGongSound()
    }

    return {
        playWoodenFish,
        playGong
    }
}
