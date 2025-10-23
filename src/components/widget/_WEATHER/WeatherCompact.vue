<template>
  <AppWidget variant="compact" size="lg" :width="1" :height="1">
    <div class="weather-compact-wrapper">
      <!-- Icône météo animée -->
      <div class="weather-icon-large" :class="weatherIconClass">
        {{ weatherIcon }}
      </div>
      
      <!-- Température -->
      <div class="temp-display">
        <span class="temp-value">{{ currentTemp }}°</span>
      </div>
      
      <!-- Condition -->
      <div class="condition-text">{{ weatherConditionShort }}</div>
    </div>
  </AppWidget>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import AppWidget from '@/components/ui/AppWidget.vue'

const props = defineProps({
  updateInterval: { type: Number, default: 300000 },
  simulation: { type: Boolean, default: true }
})

const currentTemp = ref(22)
const weatherType = ref('sunny')

const weatherConditions = {
  sunny: 'Clear',
  cloudy: 'Cloudy',
  rainy: 'Rain',
  stormy: 'Storm',
  snowy: 'Snow',
  foggy: 'Fog'
}

let intervalId = null

const weatherIcon = computed(() => ({ sunny: '☀️', cloudy: '☁️', rainy: '🌧️', stormy: '⛈️', snowy: '❄️', foggy: '🌫️' }[weatherType.value] || '☀️'))
const weatherIconClass = computed(() => `icon-${weatherType.value}`)
const weatherConditionShort = computed(() => weatherConditions[weatherType.value] || 'Clear')

function simulateWeather() {
  const tempChange = (Math.random() - 0.5) * 2
  currentTemp.value = Math.round(Math.max(-10, Math.min(40, currentTemp.value + tempChange)))
  if (Math.random() < 0.1) {
    const types = ['sunny', 'cloudy', 'rainy', 'stormy', 'snowy', 'foggy']
    weatherType.value = types[Math.floor(Math.random() * types.length)]
  }
}

function start() {
  if (intervalId) return
  currentTemp.value = Math.round(Math.random() * 25 + 10)
  const types = ['sunny', 'cloudy', 'rainy']
  weatherType.value = types[Math.floor(Math.random() * types.length)]
  if (props.simulation) intervalId = setInterval(simulateWeather, props.updateInterval)
}

function stop() { if (intervalId) { clearInterval(intervalId); intervalId = null } }

onMounted(() => start())
onBeforeUnmount(() => stop())

defineExpose({ refresh: simulateWeather })
</script>

<style scoped>
.weather-compact-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
}

.weather-icon-large {
  font-size: 3.5rem;
  filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.3));
  animation: float 3s ease-in-out infinite;
}

.icon-sunny { animation: float 3s ease-in-out infinite, rotate 20s linear infinite; }
.icon-rainy { animation: float 3s ease-in-out infinite, shake 0.5s ease-in-out infinite; }
.icon-stormy { animation: float 3s ease-in-out infinite, shake 0.3s ease-in-out infinite; }

@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
@keyframes rotate { from { filter: drop-shadow(0 0 15px rgba(255, 200, 0, 0.4)) hue-rotate(0deg); } to { filter: drop-shadow(0 0 15px rgba(255, 200, 0, 0.4)) hue-rotate(360deg); } }
@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-2px); } 75% { transform: translateX(2px); } }

.temp-display {
  display: flex;
  align-items: baseline;
}

.temp-value {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1;
  color: rgba(229, 231, 235, 1);
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif;
  letter-spacing: -0.02em;
}

.condition-text {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(156, 163, 175, 1);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

@media (max-width: 640px) {
  .weather-icon-large { font-size: 3rem; }
  .temp-value { font-size: 2rem; }
}
</style>

