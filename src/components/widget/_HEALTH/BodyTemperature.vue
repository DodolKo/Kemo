<template>
  <div class="temp-wrapper">
    <div class="temp-header">
      <div class="header-icon">🌡️</div>
      <div class="header-label">Body Temp</div>
    </div>
    
    <!-- Thermometer visual -->
    <div class="thermometer-container">
      <div class="thermometer">
        <div class="thermometer-bulb" :style="{ background: getColor(temperature) }">
          <div class="thermometer-mercury" :style="{ height: getMercuryHeight() + '%', background: getColor(temperature) }"></div>
        </div>
        <div class="thermometer-tube">
          <div class="thermometer-fill" :style="{ height: getMercuryHeight() + '%', background: getColor(temperature) }"></div>
        </div>
        
        <!-- Scale marks -->
        <div class="scale-marks">
          <div v-for="temp in scaleTemps" :key="temp" class="scale-mark" :style="{ bottom: getTempPosition(temp) + '%' }">
            <span class="scale-label">{{ temp }}°</span>
          </div>
        </div>
      </div>
      
      <!-- Temperature display -->
      <div class="temp-display">
        <div class="temp-value" :style="{ color: getColor(temperature), textShadow: getTextGlow(temperature) }">
          {{ temperature.toFixed(1) }}
        </div>
        <div class="temp-unit">°C</div>
      </div>
    </div>
    
    <!-- Status bar -->
    <div class="status-bar" :style="{ background: getStatusGradient(temperature) }">
      <span class="status-text">{{ getStatus(temperature) }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  updateInterval: { type: Number, default: 2500 },
  simulation: { type: Boolean, default: true },
  autoStart: { type: Boolean, default: true }
})

const temperature = ref(36.6)
const minTemp = 35
const maxTemp = 40
const scaleTemps = [35, 36, 37, 38, 39, 40]

let intervalId = null

function getMercuryHeight() {
  return ((temperature.value - minTemp) / (maxTemp - minTemp)) * 100
}

function getTempPosition(temp) {
  return ((temp - minTemp) / (maxTemp - minTemp)) * 100
}

function getColor(value) {
  if (value < 36.1) return '#3b82f6' // Hypothermia
  if (value <= 37.2) return '#10b981' // Normal
  if (value <= 38.0) return '#f59e0b' // Low fever
  if (value <= 39.0) return '#fb923c' // Moderate fever
  return '#ef4444' // High fever
}

function getStatus(value) {
  if (value < 36.1) return 'Hypothermia'
  if (value <= 37.2) return 'Normal'
  if (value <= 38.0) return 'Low Fever'
  if (value <= 39.0) return 'Moderate Fever'
  return 'High Fever'
}

function getStatusGradient(value) {
  const color = getColor(value)
  return `linear-gradient(135deg, ${color}40, ${color}20)`
}

function getTextGlow(value) {
  const color = getColor(value)
  return `0 0 8px ${color}, 0 0 12px ${color}60`
}

function simulateData() {
  // Normal body temperature: 36.1-37.2°C
  temperature.value = Math.min(40, Math.max(35, temperature.value + (Math.random() - 0.5) * 0.3))
}

function start() {
  if (intervalId) return
  temperature.value = 36.3 + Math.random() * 0.8
  
  if (props.simulation) {
    intervalId = setInterval(simulateData, props.updateInterval)
  }
}

function stop() {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

onMounted(() => {
  if (props.autoStart) start()
})

onBeforeUnmount(() => stop())

defineExpose({ 
  start, 
  stop, 
  value: computed(() => temperature.value),
  setValue: (val) => temperature.value = Math.min(42, Math.max(34, val))
})
</script>

<style scoped>
.temp-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 1rem;
  gap: 0.75rem;
}

.temp-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.header-icon {
  font-size: 1.5rem;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.3));
}

.header-label {
  font-size: 0.875rem;
  font-weight: 700;
  color: rgba(156, 163, 175, 1);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.thermometer-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  min-height: 0;
}

.thermometer {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 180px;
}

.thermometer-tube {
  position: relative;
  width: 16px;
  height: 140px;
  background: rgba(75, 85, 99, 0.3);
  border-radius: 8px 8px 0 0;
  overflow: hidden;
}

.thermometer-fill {
  position: absolute;
  bottom: 0;
  width: 100%;
  border-radius: 8px 8px 0 0;
  transition: height 0.8s ease, background 0.3s ease;
  filter: drop-shadow(0 0 6px currentColor);
}

.thermometer-bulb {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease;
  filter: drop-shadow(0 0 8px currentColor);
}

.scale-marks {
  position: absolute;
  right: -35px;
  top: 0;
  height: 140px;
}

.scale-mark {
  position: absolute;
  right: 0;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.scale-mark::before {
  content: '';
  width: 8px;
  height: 1px;
  background: rgba(156, 163, 175, 0.5);
}

.scale-label {
  font-size: 0.65rem;
  font-weight: 600;
  color: rgba(156, 163, 175, 1);
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif;
}

.temp-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.temp-value {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif;
  letter-spacing: -0.02em;
  transition: color 0.3s ease, text-shadow 0.3s ease;
}

.temp-unit {
  font-size: 1rem;
  font-weight: 600;
  color: rgba(156, 163, 175, 1);
}

.status-bar {
  padding: 0.5rem;
  border-radius: 0.5rem;
  text-align: center;
  transition: background 0.3s ease;
}

.status-text {
  font-size: 0.75rem;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

@media (max-width: 640px) {
  .temp-wrapper {
    padding: 0.75rem;
  }
  
  .temp-value {
    font-size: 2rem;
  }
  
  .thermometer {
    height: 160px;
  }
  
  .thermometer-tube {
    height: 120px;
  }
  
  .scale-marks {
    height: 120px;
  }
  
  .header-icon {
    font-size: 1.25rem;
  }
}
</style>

