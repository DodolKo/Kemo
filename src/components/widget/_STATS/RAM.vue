<template>
  <AppWidget variant="compact" size="lg" :width="1" :height="1">
    <div class="gauge-wrapper">
      <svg class="gauge-svg" viewBox="0 0 200 200">
        <circle class="gauge-bg" cx="100" cy="100" r="85" fill="none" stroke="rgba(75, 85, 99, 0.2)" stroke-width="12" />
        <circle class="gauge-progress" cx="100" cy="100" r="85" fill="none" :stroke="getColor(ramUsage)" stroke-width="12" stroke-linecap="round" :stroke-dasharray="circumference" :stroke-dashoffset="dashOffset" transform="rotate(-90 100 100)" />
      </svg>
      <div class="gauge-content">
        <div class="gauge-icon">💾</div>
        <div class="gauge-value">{{ ramUsage }}%</div>
        <div class="gauge-label">RAM</div>
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

const ramUsage = ref(0)
const radius = 85
const circumference = 2 * Math.PI * radius
let intervalId = null

const dashOffset = computed(() => circumference * (1 - ramUsage.value / 100))

function getColor(value) {
  if (value < 60) return '#3b82f6'
  if (value < 80) return '#f59e0b'
  return '#ef4444'
}

function simulateData() {
  ramUsage.value = Math.min(100, Math.max(0, ramUsage.value + (Math.random() - 0.5) * 5))
  ramUsage.value = Math.round(ramUsage.value)
}

function start() {
  if (intervalId) return
  ramUsage.value = Math.random() * 30 + 40
  if (props.simulation) intervalId = setInterval(simulateData, props.updateInterval)
}

function stop() { if (intervalId) { clearInterval(intervalId); intervalId = null } }

onMounted(() => { if (props.autoStart) start() })
onBeforeUnmount(() => stop())

defineExpose({ start, stop, value: computed(() => ramUsage.value) })
</script>

<style scoped>
.gauge-wrapper { position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; padding: 1rem; }
.gauge-svg { position: absolute; width: 100%; height: 100%; max-width: 180px; max-height: 180px; }
.gauge-progress { transition: stroke-dashoffset 0.5s ease, stroke 0.3s ease; filter: drop-shadow(0 0 8px currentColor); }
.gauge-content { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.25rem; z-index: 1; }
.gauge-icon { font-size: 2rem; filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3)); }
.gauge-value { font-size: 2.5rem; font-weight: 700; line-height: 1; color: rgba(229, 231, 235, 1); font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif; letter-spacing: -0.02em; }
.gauge-label { font-size: 0.875rem; font-weight: 600; color: rgba(156, 163, 175, 1); text-transform: uppercase; letter-spacing: 0.1em; margin-top: 0.25rem; }
@media (max-width: 640px) { .gauge-value { font-size: 2rem; } .gauge-icon { font-size: 1.5rem; } }
</style>

