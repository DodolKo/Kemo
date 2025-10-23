<template>
  <AppWidget variant="compact" size="lg" :width="1" :height="2">
    <!-- Header -->
    <template #header>
      <div class="flex items-center gap-2">
        <h3 class="text-primary font-semibold text-sm">Weather</h3>
        <span class="text-muted text-xs">{{ location }}</span>
      </div>
      
      <div class="flex items-center gap-2">
        <button class="refresh-btn" @click="refreshWeather" title="Refresh">🔄</button>
      </div>
    </template>

    <!-- Weather Display Inline -->
    <div class="weather-display-wrapper">
      <div class="weather-main">
        <div class="weather-icon-container">
          <span class="weather-icon" :class="weatherIconClass">{{ weatherIcon }}</span>
        </div>

        <div class="temperature-display">
          <span class="temp-value">{{ currentTemp }}</span>
          <span class="temp-unit">°C</span>
        </div>

        <div class="weather-condition">{{ weatherCondition }}</div>
      </div>

      <div class="weather-details">
        <div class="detail-item"><span class="detail-icon">💧</span><div class="detail-content"><span class="detail-label">Humidity</span><span class="detail-value">{{ humidity }}%</span></div></div>
        <div class="detail-item"><span class="detail-icon">💨</span><div class="detail-content"><span class="detail-label">Wind</span><span class="detail-value">{{ windSpeed }} km/h</span></div></div>
        <div class="detail-item"><span class="detail-icon">🌡️</span><div class="detail-content"><span class="detail-label">Feels Like</span><span class="detail-value">{{ feelsLike }}°C</span></div></div>
      </div>
    </div>

    <!-- Footer -->
    <template #footer>
      <div class="weather-footer">
        <div class="footer-info">
          <span class="footer-label">Last Update</span>
          <span class="footer-value">{{ lastUpdate }}</span>
        </div>
        <span class="text-muted text-xs ml-auto">Demo</span>
      </div>
    </template>
  </AppWidget>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import AppWidget from '@/components/ui/AppWidget.vue'

const props = defineProps({
  location: { type: String, default: 'Paris, FR' },
  updateInterval: { type: Number, default: 300000 },
  simulation: { type: Boolean, default: true }
})

const lastUpdateTime = ref(new Date())
const currentTemp = ref(22)
const feelsLike = ref(20)
const humidity = ref(65)
const windSpeed = ref(12)
const weatherType = ref('sunny')

const weatherConditions = { sunny: '☀️ Clear Sky', cloudy: '☁️ Cloudy', rainy: '🌧️ Rainy', stormy: '⛈️ Stormy', snowy: '❄️ Snowy', foggy: '🌫️ Foggy' }

let intervalId = null

const lastUpdate = computed(() => lastUpdateTime.value.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }))
const weatherIcon = computed(() => ({ sunny: '☀️', cloudy: '☁️', rainy: '🌧️', stormy: '⛈️', snowy: '❄️', foggy: '🌫️' }[weatherType.value] || '☀️'))
const weatherIconClass = computed(() => `icon-${weatherType.value}`)
const weatherCondition = computed(() => weatherConditions[weatherType.value] || 'Clear Sky')

function simulateWeather() {
  const tempChange = (Math.random() - 0.5) * 2
  currentTemp.value = Math.round(Math.max(-10, Math.min(40, currentTemp.value + tempChange)))
  feelsLike.value = Math.round(currentTemp.value - (windSpeed.value / 10) + (Math.random() - 0.5) * 2)
  humidity.value = Math.round(Math.max(20, Math.min(100, humidity.value + (Math.random() - 0.5) * 10)))
  windSpeed.value = Math.round(Math.max(0, Math.min(80, windSpeed.value + (Math.random() - 0.5) * 5)))
  if (Math.random() < 0.1) { const types = ['sunny','cloudy','rainy','stormy','snowy','foggy']; weatherType.value = types[Math.floor(Math.random()*types.length)] }
  lastUpdateTime.value = new Date()
}

function initializeWeather() {
  currentTemp.value = Math.round(Math.random() * 25 + 10)
  humidity.value = Math.round(Math.random() * 40 + 40)
  windSpeed.value = Math.round(Math.random() * 30 + 5)
  feelsLike.value = Math.round(currentTemp.value - (windSpeed.value / 10))
  const types = ['sunny', 'cloudy', 'rainy']
  weatherType.value = types[Math.floor(Math.random() * types.length)]
}

function refreshWeather() {
  simulateWeather()
}

function start() {
  if (intervalId) return
  initializeWeather()
  if (props.simulation) intervalId = setInterval(simulateWeather, props.updateInterval)
}

function stop() { if (intervalId) { clearInterval(intervalId); intervalId = null } }

onMounted(() => start())
onBeforeUnmount(() => stop())

defineExpose({ refresh: refreshWeather })
</script>

<style scoped>
.refresh-btn { display: flex; align-items: center; justify-content: center; width: 1.75rem; height: 1.75rem; font-size: 0.875rem; border-radius: 0.375rem; background: rgba(75, 85, 99, 0.3); border: 1px solid rgba(75, 85, 99, 0.5); cursor: pointer; transition: all 0.2s ease; }
.refresh-btn:hover { background: rgba(75, 85, 99, 0.5); border-color: rgba(156, 163, 175, 0.5); transform: rotate(180deg); }
.refresh-btn:active { transform: rotate(180deg) scale(0.95); }
.weather-footer { display: flex; align-items: center; justify-content: space-between; }
.footer-info { display: flex; flex-direction: column; gap: 0.125rem; }
.footer-label { font-size: 0.75rem; line-height: 1rem; color: rgb(156, 163, 175); }
.footer-value { font-size: 0.875rem; line-height: 1.25rem; font-weight: 500; color: rgb(229, 231, 235); }
.weather-display-wrapper { position: relative; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: space-between; padding: 1.5rem; box-sizing: border-box; }
.weather-main { display: flex; flex-direction: column; align-items: center; gap: 1rem; flex: 1; justify-content: center; }
.weather-icon-container { display: flex; align-items: center; justify-content: center; }
.weather-icon { font-size: 5rem; filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.3)); animation: float 3s ease-in-out infinite; }
.icon-sunny { animation: float 3s ease-in-out infinite, rotate 20s linear infinite; }
.icon-rainy { animation: float 3s ease-in-out infinite, shake 0.5s ease-in-out infinite; }
.icon-stormy { animation: float 3s ease-in-out infinite, shake 0.3s ease-in-out infinite; }
.icon-snowy { animation: float 3s ease-in-out infinite, sway 4s ease-in-out infinite; }
@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes rotate { from { filter: drop-shadow(0 0 20px rgba(255, 200, 0, 0.4)) hue-rotate(0deg); } to { filter: drop-shadow(0 0 20px rgba(255, 200, 0, 0.4)) hue-rotate(360deg); } }
@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-3px); } 75% { transform: translateX(3px); } }
@keyframes sway { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(10px); } }
.temperature-display { display: flex; align-items: baseline; gap: 0.25rem; }
.temp-value { font-size: 4rem; font-weight: 700; line-height: 1; color: #10b981; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif; letter-spacing: -0.03em; filter: drop-shadow(0 0 15px rgba(16, 185, 129, 0.6)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3)); }
.temp-unit { font-size: 2rem; font-weight: 600; color: rgba(156, 163, 175, 1); margin-left: 0.25rem; }
.weather-condition { font-size: 1.125rem; font-weight: 500; color: rgba(229, 231, 235, 1); text-align: center; }
.weather-details { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; padding-top: 1rem; border-top: 1px solid rgba(75, 85, 99, 0.3); }
.detail-item { display: flex; align-items: center; gap: 0.5rem; }
.detail-icon { font-size: 1.5rem; filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.2)); }
.detail-content { display: flex; flex-direction: column; gap: 0.125rem; }
.detail-label { font-size: 0.65rem; font-weight: 600; color: rgba(156, 163, 175, 1); text-transform: uppercase; letter-spacing: 0.05em; }
.detail-value { font-size: 0.875rem; font-weight: 600; color: rgba(229, 231, 235, 1); }
.flex { display: flex; }
.items-center { align-items: center; }
.gap-2 { gap: 0.5rem; }
.text-primary { color: rgb(229, 231, 235); }
.text-muted { color: rgb(156, 163, 175); }
.font-semibold { font-weight: 600; }
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }
.text-xs { font-size: 0.75rem; line-height: 1rem; }
.ml-auto { margin-left: auto; }
@media (max-width: 640px) { .weather-icon { font-size: 4rem; } .temp-value { font-size: 3rem; } .temp-unit { font-size: 1.5rem; } .weather-details { grid-template-columns: 1fr; gap: 0.75rem; } }
</style>
