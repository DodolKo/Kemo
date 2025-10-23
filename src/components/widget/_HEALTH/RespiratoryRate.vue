<template>
  <div class="respiratory-wrapper">
    <div class="respiratory-header">
      <div class="header-icon" :class="{ 'breathing': isBreathing }">💨</div>
      <div class="header-label">Breathing</div>
    </div>
    
    <!-- Breathing visualization -->
    <div class="breathing-visual">
      <svg class="breathing-svg" viewBox="0 0 200 200">
        <!-- Lung outline -->
        <path
          class="lung-shape"
          d="M 100 40 Q 120 50, 125 70 Q 130 90, 130 110 Q 130 130, 125 150 Q 120 170, 100 180 Q 80 170, 75 150 Q 70 130, 70 110 Q 70 90, 75 70 Q 80 50, 100 40"
          fill="none"
          :stroke="getColor(rate)"
          stroke-width="3"
          :style="{ filter: getGlow(rate) }"
        />
        
        <!-- Breathing animation circle -->
        <circle
          class="breath-indicator"
          cx="100"
          cy="110"
          :r="breathRadius"
          :fill="getColor(rate)"
          opacity="0.3"
        />
        
        <!-- Center value -->
        <text x="100" y="115" class="rate-text" :fill="getColor(rate)">
          {{ rate }}
        </text>
      </svg>
    </div>
    
    <!-- Rate display -->
    <div class="rate-display">
      <div class="rate-value" :style="{ color: getColor(rate), textShadow: getTextGlow(rate) }">
        {{ rate }}
      </div>
      <div class="rate-unit">breaths/min</div>
    </div>
    
    <!-- Status bar -->
    <div class="status-bar" :style="{ background: getStatusGradient(rate) }">
      <span class="status-text">{{ getStatus(rate) }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  updateInterval: { type: Number, default: 2000 },
  simulation: { type: Boolean, default: true },
  autoStart: { type: Boolean, default: true }
})

const rate = ref(16) // breaths per minute
const isBreathing = ref(false)
const breathRadius = ref(30)

let intervalId = null
let breathInterval = null

function getColor(value) {
  if (value < 12) return '#3b82f6' // Bradypnea
  if (value <= 20) return '#10b981' // Normal
  if (value <= 25) return '#f59e0b' // Mildly elevated
  return '#ef4444' // Tachypnea
}

function getStatus(value) {
  if (value < 12) return 'Bradypnea'
  if (value <= 20) return 'Normal'
  if (value <= 25) return 'Elevated'
  return 'Tachypnea'
}

function getStatusGradient(value) {
  const color = getColor(value)
  return `linear-gradient(135deg, ${color}40, ${color}20)`
}

function getGlow(value) {
  const color = getColor(value)
  return `drop-shadow(0 0 6px ${color}) drop-shadow(0 0 10px ${color}60)`
}

function getTextGlow(value) {
  const color = getColor(value)
  return `0 0 8px ${color}, 0 0 12px ${color}60`
}

function breathe() {
  // Inhale
  isBreathing.value = true
  breathRadius.value = 45
  
  setTimeout(() => {
    // Exhale
    breathRadius.value = 30
    isBreathing.value = false
  }, (60000 / rate.value) / 2) // Half breath cycle
}

function simulateData() {
  // Normal resting rate: 12-20 breaths/min
  rate.value = Math.min(30, Math.max(8, rate.value + (Math.random() - 0.5) * 2))
  rate.value = Math.round(rate.value)
}

function start() {
  if (intervalId) return
  rate.value = 14 + Math.random() * 4
  
  if (props.simulation) {
    intervalId = setInterval(simulateData, props.updateInterval)
    
    // Breathing animation
    const breathCycle = () => {
      breathe()
      breathInterval = setTimeout(breathCycle, 60000 / rate.value)
    }
    breathCycle()
  }
}

function stop() {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
  if (breathInterval) {
    clearTimeout(breathInterval)
    breathInterval = null
  }
}

onMounted(() => {
  if (props.autoStart) start()
})

onBeforeUnmount(() => stop())

defineExpose({ 
  start, 
  stop, 
  value: computed(() => rate.value),
  setValue: (val) => rate.value = Math.min(40, Math.max(5, val))
})
</script>

<style scoped>
.respiratory-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 1rem;
  gap: 0.75rem;
}

.respiratory-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.header-icon {
  font-size: 1.5rem;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.3));
  transition: transform 0.3s ease;
}

.header-icon.breathing {
  animation: breathing 2s ease-in-out;
}

@keyframes breathing {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.header-label {
  font-size: 0.875rem;
  font-weight: 700;
  color: rgba(156, 163, 175, 1);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.breathing-visual {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 0;
}

.breathing-svg {
  width: 100%;
  height: 100%;
  max-width: 160px;
  max-height: 160px;
}

.lung-shape {
  transition: stroke 0.3s ease, filter 0.3s ease;
}

.breath-indicator {
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.rate-text {
  font-size: 28px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: middle;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif;
  transition: fill 0.3s ease;
}

.rate-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.rate-value {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif;
  letter-spacing: -0.02em;
  transition: color 0.3s ease, text-shadow 0.3s ease;
}

.rate-unit {
  font-size: 0.75rem;
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
  .respiratory-wrapper {
    padding: 0.75rem;
  }
  
  .rate-value {
    font-size: 1.75rem;
  }
  
  .header-icon {
    font-size: 1.25rem;
  }
}
</style>

