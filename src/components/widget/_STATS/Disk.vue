<template>
  <AppWidget variant="compact" size="lg" :width="1" :height="1">
    <div class="gauge-wrapper">
      <svg class="gauge-svg" viewBox="0 0 200 200">
        <circle class="gauge-bg" cx="100" cy="100" r="85" fill="none" stroke="rgba(75, 85, 99, 0.2)" stroke-width="12" />
        <circle class="gauge-progress" cx="100" cy="100" r="85" fill="none" :stroke="getColor(diskUsage)" stroke-width="12" stroke-linecap="round" :stroke-dasharray="circumference" :stroke-dashoffset="dashOffset" transform="rotate(-90 100 100)" :style="{ filter: getCircleGlow(diskUsage) }" />
      </svg>
      <div class="gauge-content">
        <div class="gauge-icon">💿</div>
        <div class="gauge-value" :style="{ color: getColor(diskUsage), textShadow: getGlow(diskUsage) }">{{ diskUsage }}%</div>
        <div class="gauge-label">DISK</div>
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

const diskUsage = ref(0)
const radius = 85
const circumference = 2 * Math.PI * radius
let intervalId = null

const dashOffset = computed(() => circumference * (1 - diskUsage.value / 100))

function getColor(value) {
  if (value < 70) return '#8b5cf6'
  if (value < 85) return '#f59e0b'
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
  diskUsage.value = Math.min(100, Math.max(0, diskUsage.value + (Math.random() - 0.5) * 2))
  diskUsage.value = Math.round(diskUsage.value)
}

function start() {
  if (intervalId) return
  diskUsage.value = Math.random() * 20 + 50
  if (props.simulation) intervalId = setInterval(simulateData, props.updateInterval)
}

function stop() { if (intervalId) { clearInterval(intervalId); intervalId = null } }

onMounted(() => { if (props.autoStart) start() })
onBeforeUnmount(() => stop())

defineExpose({ start, stop, value: computed(() => diskUsage.value) })
</script>

<style scoped>
.gauge-wrapper { position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; padding: 1rem; }
.gauge-svg { position: absolute; width: 100%; height: 100%; max-width: 180px; max-height: 180px; }
.gauge-progress { transition: stroke-dashoffset 0.5s ease, stroke 0.3s ease, filter 0.3s ease; }
.gauge-content { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.25rem; z-index: 1; }
.gauge-icon { font-size: 2rem; filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3)); }
.gauge-value { font-size: 2.5rem; font-weight: 700; line-height: 1; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif; letter-spacing: -0.02em; transition: color 0.3s ease, text-shadow 0.3s ease; }
.gauge-label { font-size: 0.875rem; font-weight: 600; color: rgba(156, 163, 175, 1); text-transform: uppercase; letter-spacing: 0.1em; margin-top: 0.25rem; }
@media (max-width: 640px) { .gauge-value { font-size: 2rem; } .gauge-icon { font-size: 1.5rem; } }
</style>

