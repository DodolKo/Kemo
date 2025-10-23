<template>
  <div class="bp-wrapper">
    <div class="bp-header">
      <div class="header-icon">🩺</div>
      <div class="header-label">Blood Pressure</div>
    </div>
    
    <!-- Dual gauge display -->
    <div class="bp-display">
      <div class="bp-values">
        <div class="bp-value systolic" :style="{ color: getSystolicColor(systolic) }">
          <span class="value-number">{{ systolic }}</span>
          <span class="value-label">SYS</span>
        </div>
        <div class="bp-separator">/</div>
        <div class="bp-value diastolic" :style="{ color: getDiastolicColor(diastolic) }">
          <span class="value-number">{{ diastolic }}</span>
          <span class="value-label">DIA</span>
        </div>
      </div>
      
      <!-- Pulse pressure indicator -->
      <div class="pulse-pressure">
        <div class="pp-label">Pulse Pressure</div>
        <div class="pp-value">{{ pulsePressure }} mmHg</div>
      </div>
    </div>
    
    <!-- Status bar -->
    <div class="status-bar" :style="{ background: getStatusGradient() }">
      <span class="status-text">{{ getStatus() }}</span>
    </div>
    
    <!-- Mini bars -->
    <div class="bars-container">
      <div class="bar-item">
        <div class="bar-label">SYS</div>
        <div class="bar-bg">
          <div class="bar-fill" :style="{ width: (systolic / 200 * 100) + '%', background: getSystolicColor(systolic) }"></div>
        </div>
      </div>
      <div class="bar-item">
        <div class="bar-label">DIA</div>
        <div class="bar-bg">
          <div class="bar-fill" :style="{ width: (diastolic / 130 * 100) + '%', background: getDiastolicColor(diastolic) }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  updateInterval: { type: Number, default: 3000 },
  simulation: { type: Boolean, default: true },
  autoStart: { type: Boolean, default: true }
})

const systolic = ref(120)  // Upper number
const diastolic = ref(80)  // Lower number

let intervalId = null

const pulsePressure = computed(() => systolic.value - diastolic.value)

function getSystolicColor(value) {
  if (value < 120) return '#10b981' // Normal
  if (value < 130) return '#3b82f6' // Elevated
  if (value < 140) return '#f59e0b' // Stage 1 Hypertension
  if (value < 180) return '#ef4444' // Stage 2 Hypertension
  return '#dc2626' // Hypertensive Crisis
}

function getDiastolicColor(value) {
  if (value < 80) return '#10b981' // Normal
  if (value < 85) return '#3b82f6' // Elevated
  if (value < 90) return '#f59e0b' // Stage 1 Hypertension
  if (value < 120) return '#ef4444' // Stage 2 Hypertension
  return '#dc2626' // Hypertensive Crisis
}

function getStatus() {
  if (systolic.value >= 180 || diastolic.value >= 120) return 'Hypertensive Crisis'
  if (systolic.value >= 140 || diastolic.value >= 90) return 'Stage 2 Hypertension'
  if (systolic.value >= 130 || diastolic.value >= 85) return 'Stage 1 Hypertension'
  if (systolic.value >= 120) return 'Elevated'
  return 'Normal'
}

function getStatusGradient() {
  const status = getStatus()
  const colors = {
    'Normal': '#10b981',
    'Elevated': '#3b82f6',
    'Stage 1 Hypertension': '#f59e0b',
    'Stage 2 Hypertension': '#ef4444',
    'Hypertensive Crisis': '#dc2626'
  }
  const color = colors[status]
  return `linear-gradient(135deg, ${color}40, ${color}20)`
}

function simulateData() {
  // Normal range: 90-120/60-80 mmHg
  systolic.value = Math.min(180, Math.max(90, systolic.value + (Math.random() - 0.5) * 6))
  diastolic.value = Math.min(120, Math.max(60, diastolic.value + (Math.random() - 0.5) * 4))
  
  systolic.value = Math.round(systolic.value)
  diastolic.value = Math.round(diastolic.value)
}

function start() {
  if (intervalId) return
  systolic.value = 110 + Math.random() * 20
  diastolic.value = 70 + Math.random() * 15
  
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
  systolic: computed(() => systolic.value),
  diastolic: computed(() => diastolic.value),
  setValues: (sys, dia) => {
    if (sys !== undefined) systolic.value = Math.min(250, Math.max(60, sys))
    if (dia !== undefined) diastolic.value = Math.min(150, Math.max(40, dia))
  }
})
</script>

<style scoped>
.bp-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 1rem;
  gap: 0.75rem;
}

.bp-header {
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
  font-size: 0.75rem;
  font-weight: 700;
  color: rgba(156, 163, 175, 1);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.bp-display {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: rgba(31, 41, 55, 0.3);
  border-radius: 0.75rem;
  padding: 1rem;
}

.bp-values {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.bp-value {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.value-number {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif;
  letter-spacing: -0.02em;
  transition: color 0.3s ease;
}

.value-label {
  font-size: 0.65rem;
  font-weight: 600;
  color: rgba(156, 163, 175, 1);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.bp-separator {
  font-size: 2rem;
  font-weight: 300;
  color: rgba(156, 163, 175, 0.5);
  margin: 0 0.25rem;
}

.pulse-pressure {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.125rem;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(75, 85, 99, 0.3);
  width: 100%;
}

.pp-label {
  font-size: 0.65rem;
  font-weight: 600;
  color: rgba(156, 163, 175, 1);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.pp-value {
  font-size: 0.875rem;
  font-weight: 700;
  color: rgba(209, 213, 219, 1);
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif;
}

.status-bar {
  padding: 0.5rem;
  border-radius: 0.5rem;
  text-align: center;
  transition: background 0.3s ease;
}

.status-text {
  font-size: 0.7rem;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.bars-container {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.bar-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.bar-label {
  font-size: 0.65rem;
  font-weight: 700;
  color: rgba(156, 163, 175, 1);
  width: 2rem;
}

.bar-bg {
  flex: 1;
  height: 6px;
  background: rgba(75, 85, 99, 0.3);
  border-radius: 3px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.8s ease, background 0.3s ease;
}

@media (max-width: 640px) {
  .bp-wrapper {
    padding: 0.75rem;
  }
  
  .value-number {
    font-size: 2rem;
  }
  
  .bp-separator {
    font-size: 1.5rem;
  }
  
  .header-icon {
    font-size: 1.25rem;
  }
}
</style>

