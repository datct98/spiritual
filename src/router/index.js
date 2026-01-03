import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import PrayerPage from '../pages/PrayerPage.vue'
import WoodenFishPage from '../pages/WoodenFishPage.vue'

const routes = [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/home',
        name: 'Home',
        component: HomePage
    },
    {
        path: '/prayer',
        name: 'Prayer',
        component: PrayerPage
    },
    {
        path: '/wooden-fish',
        name: 'WoodenFish',
        component: WoodenFishPage
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
