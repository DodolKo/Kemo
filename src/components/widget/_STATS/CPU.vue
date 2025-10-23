<template>
  <AppWidget variant="compact" size="lg" :width="1" :height="1">
    <!-- Circular Gauge -->
    <div class="gauge-wrapper">
      <svg class="gauge-svg" viewBox="0 0 200 200">
        <!-- Background circle -->
        <circle
          class="gauge-bg"
          cx="100"
          cy="100"
          r="85"
          fill="none"
          stroke="rgba(75, 85, 99, 0.2)"
          stroke-width="12"
        />
        
        <!-- Progress circle with dynamic glow -->
        <circle
          class="gauge-progress"
          cx="100"
          cy="100"
          r="85"
          fill="none"
          :stroke="getColor(cpuUsage)"
          stroke-width="12"
          stroke-linecap="round"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="dashOffset"
          transform="rotate(-90 100 100)"
          :style="{ filter: getCircleGlow(cpuUsage) }"
        />
      </svg>
      
      <!-- Center content -->
      <div class="gauge-content">
        <div class="gauge-icon">⚡</div>
        <div class="gauge-value" :style="{ color: getColor(cpuUsage), textShadow: getGlow(cpuUsage) }">{{ cpuUsage }}%</div>
        <div class="gauge-label">CPU</div>
      </div>
    </div>
  </AppWidget>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import AppWidget from '@/components/ui/AppWidget.vue'

const props = defineProps({
  updateInterval: { type: Number, default: 1000 },
  simulation: { type: Boolean, default: true },
  autoStart: { type: Boolean, default: true }
})

const cpuUsage = ref(0)
const radius = 85
const circumference = 2 * Math.PI * radius

let intervalId = null

const dashOffset = computed(() => {
  const progress = cpuUsage.value / 100
  return circumference * (1 - progress)
})

function getColor(value) {
  if (value < 50) return '#10b981'
  if (value < 75) return '#f59e0b'
  return '#ef4444'
}

function getGlow(value) {
  const color = getColor(value)
  return `0 0 8px ${color}, 0 0 12px ${color}60`
}

function getCircleGlow(value) {
  const color = getColor(value)
  return `drop-shadow(0 0 6px ${color}) drop-shadow(0 0 10px ${color}60)`
}

function simulateData() {
  cpuUsage.value = Math.min(100, Math.max(0, cpuUsage.value + (Math.random() - 0.5) * 15))
  cpuUsage.value = Math.round(cpuUsage.value)
}

function start() {
  if (intervalId) return
  cpuUsage.value = Math.random() * 40 + 10
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

defineExpose({ start, stop, value: computed(() => cpuUsage.value) })
</script>

<style scoped>
.gauge-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.gauge-svg {
  position: absolute;
  width: 100%;
  height: 100%;
  max-width: 180px;
  max-height: 180px;
}

.gauge-progress {
  transition: stroke-dashoffset 0.5s ease, stroke 0.3s ease, filter 0.3s ease;
}

.gauge-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  z-index: 1;
}

.gauge-icon {
  font-size: 2rem;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
}

.gauge-value {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif;
  letter-spacing: -0.02em;
  transition: color 0.3s ease, text-shadow 0.3s ease;
}

.gauge-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(156, 163, 175, 1);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-top: 0.25rem;
}

@media (max-width: 640px) {
  .gauge-value {
    font-size: 2rem;
  }
  .gauge-icon {
    font-size: 1.5rem;
  }
}
</style>
