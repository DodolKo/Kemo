import { createApp } from 'vue'
import { createPinia } from 'pinia'


import './style.css'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')

// Register minimal service worker if supported
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}
