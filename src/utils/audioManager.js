import { Howl } from 'howler'

/**
 * Centralized Audio Manager for Worry Jar Effects
 * Handles ambient sounds and effect sounds with smooth transitions
 */
class AudioManager {
    constructor() {
        this.sounds = {}
        this.currentAmbient = null
    }

    /**
     * Load a sound into the manager
     * @param {string} key - Unique identifier for the sound
     * @param {string} src - Path to audio file
     * @param {object} options - Howler options (loop, volume, etc.)
     */
    load(key, src, options = {}) {
        if (this.sounds[key]) {
            this.sounds[key].unload()
        }

        this.sounds[key] = new Howl({
            src: [src],
            loop: options.loop || false,
            volume: options.volume !== undefined ? options.volume : 1.0,
            html5: true, // Better for streaming longer audio
            ...options
        })
    }

    /**
     * Play ambient sound with fade in/out
     * @param {string} key - Sound key to play
     * @param {number} fadeDuration - Fade duration in ms
     */
    playAmbient(key, fadeDuration = 2000) {
        const newSound = this.sounds[key]
        if (!newSound) {
            console.warn(`Sound ${key} not loaded`)
            return
        }

        // Fade out current ambient
        if (this.currentAmbient && this.currentAmbient.playing()) {
            const oldSound = this.currentAmbient
            const currentVolume = oldSound.volume()
            oldSound.fade(currentVolume, 0, fadeDuration)
            setTimeout(() => {
                oldSound.stop()
            }, fadeDuration)
        }

        // Fade in new ambient
        newSound.volume(0)
        newSound.play()
        newSound.fade(0, 0.25, fadeDuration) // Max volume 0.25 for ambient
        this.currentAmbient = newSound
    }

    /**
     * Play one-shot effect sound
     * @param {string} key - Sound key to play
     */
    playEffect(key) {
        const sound = this.sounds[key]
        if (!sound) {
            console.warn(`Sound ${key} not loaded`)
            return
        }
        sound.play()
    }

    /**
     * Stop all sounds
     */
    stopAll() {
        Object.values(this.sounds).forEach(sound => {
            if (sound.playing()) {
                sound.stop()
            }
        })
        this.currentAmbient = null
    }

    /**
     * Cleanup - unload all sounds from memory
     */
    cleanup() {
        Object.values(this.sounds).forEach(sound => {
            sound.unload()
        })
        this.sounds = {}
        this.currentAmbient = null
    }

    /**
     * Check if a sound is loaded
     */
    isLoaded(key) {
        return !!this.sounds[key]
    }
}

// Export singleton instance
export default new AudioManager()
