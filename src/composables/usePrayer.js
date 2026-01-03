import { ref, onMounted, onUnmounted } from 'vue'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { prayerService } from '../services/prayerService'

export function usePrayer() {
    const prayers = ref([])
    const isConnected = ref(false)
    const isLoading = ref(false)
    const error = ref(null)

    let stompClient = null

    // Connect to WebSocket
    const connect = () => {
        console.log('🔌 Connecting to Prayer WebSocket...')

        const socket = new SockJS('http://localhost:8083/ws')
        stompClient = new Client({
            webSocketFactory: () => socket,
            debug: (str) => console.log('STOMP:', str),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        })

        stompClient.onConnect = () => {
            console.log('✅ Connected to Prayer WebSocket')
            isConnected.value = true

            // Subscribe to new prayers
            stompClient.subscribe('/topic/prayers', (message) => {
                const newPrayer = JSON.parse(message.body)
                console.log('🏮 New prayer received via WebSocket:', newPrayer)

                // Add to beginning of prayers array (most recent first)
                prayers.value.unshift(newPrayer)

                // Keep only last 100 prayers in memory
                if (prayers.value.length > 100) {
                    prayers.value.pop()
                }
            })
        }

        stompClient.onDisconnect = () => {
            console.log('❌ Disconnected from Prayer WebSocket')
            isConnected.value = false
        }

        stompClient.onStompError = (frame) => {
            console.error('❌ STOMP error:', frame)
            error.value = 'WebSocket connection error'
        }

        stompClient.activate()
    }

    // Disconnect from WebSocket
    const disconnect = () => {
        if (stompClient) {
            stompClient.deactivate()
            console.log('🔌 Disconnected from WebSocket')
        }
    }

    // Load initial prayers from REST API
    const loadPrayers = async () => {
        try {
            isLoading.value = true
            error.value = null

            console.log('📖 Loading recent prayers...')
            const recentPrayers = await prayerService.getRecentPrayers(100)
            prayers.value = recentPrayers

            console.log(`✅ Loaded ${recentPrayers.length} prayers`)
        } catch (err) {
            console.error('❌ Failed to load prayers:', err)
            error.value = 'Không thể tải lời cầu nguyện'
        } finally {
            isLoading.value = false
        }
    }

    // Create a new prayer
    const createPrayer = async (content, type = 'SKY_LANTERN') => {
        try {
            isLoading.value = true
            error.value = null

            console.log('🙏 Creating prayer...')
            const prayer = await prayerService.createPrayer({ content, type })

            console.log('✅ Prayer created successfully')
            return prayer
        } catch (err) {
            console.error('❌ Failed to create prayer:', err)

            const errorMsg = typeof err.response?.data === 'string' ? err.response.data : err.response?.data?.message || '';
            if (err.response?.status === 429 || errorMsg.includes('quá nhiều')) {
                error.value = 'Bạn đã thả quá nhiều đăng trong 1 giờ. Hãy thư thái và chờ một chút 🙏'
            } else {
                error.value = errorMsg || 'Không thể tạo lời cầu nguyện'
            }
            throw err
        } finally {
            isLoading.value = false
        }
    }

    // Send heart/blessing to a prayer
    const sendHeart = async (prayerId) => {
        try {
            console.log(`❤️ Sending heart to prayer ${prayerId}`)
            const updatedPrayer = await prayerService.sendHeart(prayerId)

            // Update prayer in local array
            const index = prayers.value.findIndex(p => p.id === prayerId)
            if (index !== -1) {
                prayers.value[index] = updatedPrayer
            }

            console.log('✅ Heart sent successfully')
            return updatedPrayer
        } catch (err) {
            console.error('❌ Failed to send heart:', err)

            const errorMsg = typeof err.response?.data === 'string' ? err.response.data : err.response?.data?.message || '';
            if (errorMsg.includes('đã gửi')) {
                error.value = 'Bạn đã gửi lời chúc phúc cho lời cầu nguyện này rồi 🙏'
            } else {
                error.value = errorMsg || 'Không thể gửi lời chúc phúc'
            }
            throw err
        }
    }

    // Initialize on mount
    onMounted(() => {
        loadPrayers()
        connect()
    })

    // Cleanup on unmount
    onUnmounted(() => {
        disconnect()
    })

    return {
        prayers,
        isConnected,
        isLoading,
        error,
        createPrayer,
        sendHeart,
        loadPrayers
    }
}
