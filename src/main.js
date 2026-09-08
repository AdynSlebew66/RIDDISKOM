import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js' // Pastikan baris ini ada

const app = createApp(App)

app.use(router) // Wajib ada agar routing berfungsi
app.mount('#app')