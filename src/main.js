import { createApp } from 'vue'
import router from './router'
import RouterApp from './RouterApp.vue'

const app = createApp(RouterApp)
app.use(router)
app.mount('#app')
