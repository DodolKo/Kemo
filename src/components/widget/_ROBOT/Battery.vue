<template>
  <AppWidget variant="compact" size="lg" :width="1" :height="1">
    <div class="gauge-wrapper">
      <svg class="gauge-svg" viewBox="0 0 200 200">
        <circle class="gauge-bg" cx="100" cy="100" r="85" fill="none" stroke="rgba(75, 85, 99, 0.2)" stroke-width="12" />
        <circle class="gauge-progress" cx="100" cy="100" r="85" fill="none" :stroke="getBatteryColor(batteryLevel)" stroke-width="12" stroke-linecap="round" :stroke-dasharray="circumference" :stroke-dashoffset="dashOffset" transform="rotate(-90 100 100)" />
      </svg>
      <div class="gauge-content">
        <div class="gauge-icon">{{ batteryIcon }}</div>
        <div class="gauge-value">{{ batteryLevel }}%</div>
        <div class="gauge-label">Battery</div>
      </div>
    </div>
  </AppWidget>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import AppWidget from '@/components/ui/AppWidget.vue'

const props = defineProps({
  updateInterval: { type: Number, default: 5000 },
  simulation: { type: Boolean, default: true }
})

const batteryLevel = ref(85)
const isCharging = ref(false)
const radius = 85
const circumference = 2 * Math.PI * radius
let intervalId = null

const dashOffset = computed(() => circumference * (1 - batteryLevel.value / 100))

const batteryIcon = computed(() => {
  if (isCharging.value) return '⚡'
  if (batteryLevel.value > 75) return '🔋'
  if (batteryLevel.value > 25) return '🔋'
  return '🪫'
})

function getBatteryColor(value) {
  if (value > 50) return '#10b981'
  if (value > 20) return '#f59e0b'
  return '#ef4444'
}

function simulateData() {
  if (isCharging.value) {
    batteryLevel.value = Math.min(100, batteryLevel.value + Math.random() * 2)
    if (batteryLevel.value >= 100) isCharging.value = false
  } else {
    batteryLevel.value = Math.max(0, batteryLevel.value - Math.random() * 0.5)
    if (batteryLevel.value < 20 && Math.random() < 0.1) isCharging.value = true
  }
  batteryLevel.value = Math.round(batteryLevel.value)
}

onMounted(() => {
  if (props.simulation) intervalId = setInterval(simulateData, props.updateInterval)
})

onBeforeUnmount(() => { if (intervalId) clearInterval(intervalId) })

defineExpose({ setBattery: (level, charging = false) => { batteryLevel.value = level; isCharging.value = charging } })
</script>

<style scoped>
.gauge-wrapper { position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; padding: 1rem; }
.gauge-svg { position: absolute; width: 100%; height: 100%; max-width: 180px; max-height: 180px; }
.gauge-progress { transition: stroke-dashoffset 0.5s ease, stroke 0.3s ease; filter: drop-shadow(0 0 8px currentColor); }
.gauge-content { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.25rem; z-index: 1; }
.gauge-icon { font-size: 2rem; filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3)); }
.gauge-value { font-size: 2.5rem; font-weight: 700; line-height: 1; color: rgba(229, 231, 235, 1); font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif; }
.gauge-label { font-size: 0.875rem; font-weight: 600; color: rgba(156, 163, 175, 1); text-transform: uppercase; letter-spacing: 0.1em; margin-top: 0.25rem; }
</style>

