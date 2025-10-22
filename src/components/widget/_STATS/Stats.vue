<template>
  <AppWidget variant="compact" size="lg" :width="2" :height="2">
    <!-- Header -->
    <template #header>
      <div class="flex items-center gap-2">
        <div v-if="isRunning" class="status-indicator" />
        <h3 class="text-primary font-semibold text-sm">System Monitor</h3>
        <span class="text-muted text-xs">Live</span>
      </div>
      
      <div class="flex items-center gap-2">
        <button 
          class="control-btn"
          :class="{ active: isRunning }"
          @click="toggleMonitoring"
          :title="isRunning ? 'Pause' : 'Start'"
        >
          {{ isRunning ? '⏸' : '▶' }}
        </button>
      </div>
    </template>

    <!-- Stats Display Inline -->
    <div class="stats-graph-wrapper">
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-icon">⚡</span>
            <span class="metric-label">CPU</span>
          </div>
          <div class="metric-value" :style="{ color: getCpuColor(cpuUsage) }">{{ cpuUsage }}%</div>
          <div class="metric-bar"><div class="metric-fill cpu-fill" :style="{ width: cpuUsage + '%' }" /></div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-icon">💾</span>
            <span class="metric-label">RAM</span>
          </div>
          <div class="metric-value" :style="{ color: getRamColor(ramUsage) }">{{ ramUsage }}%</div>
          <div class="metric-bar"><div class="metric-fill ram-fill" :style="{ width: ramUsage + '%' }" /></div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-icon">💿</span>
            <span class="metric-label">DISK</span>
          </div>
          <div class="metric-value" :style="{ color: getDiskColor(diskUsage) }">{{ diskUsage }}%</div>
          <div class="metric-bar"><div class="metric-fill disk-fill" :style="{ width: diskUsage + '%' }" /></div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-icon">🌡️</span>
            <span class="metric-label">TEMP</span>
          </div>
          <div class="metric-value" :style="{ color: getTempColor(temperature) }">{{ temperature }}°C</div>
          <div class="metric-bar"><div class="metric-fill temp-fill" :style="{ width: (temperature / 100) * 100 + '%' }" /></div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <template #footer>
      <div class="stats-footer">
        <div class="footer-stat">
          <span class="footer-label">Uptime</span>
          <span class="footer-value">{{ uptime }}</span>
        </div>
        <div class="footer-stat">
          <span class="footer-label">Updates</span>
          <span class="footer-value">{{ updateCount }}</span>
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
  updateInterval: { type: Number, default: 1000 },
  simulation: { type: Boolean, default: true },
  autoStart: { type: Boolean, default: true }
})

const isRunning = ref(false)
const updateCount = ref(0)
const startTime = ref(null)
const currentTime = ref(Date.now())
const cpuUsage = ref(0)
const ramUsage = ref(0)
const diskUsage = ref(0)
const temperature = ref(0)

let updateTimeInterval = null
let statsInterval = null

const uptime = computed(() => {
  if (!startTime.value) return '00:00'
  const diff = Math.floor((currentTime.value - startTime.value) / 1000)
  const minutes = Math.floor(diff / 60)
  const seconds = diff % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})

function simulateStats() {
  cpuUsage.value = Math.min(100, Math.max(0, cpuUsage.value + (Math.random() - 0.5) * 15))
  ramUsage.value = Math.min(100, Math.max(0, ramUsage.value + (Math.random() - 0.5) * 5))
  diskUsage.value = Math.min(100, Math.max(0, diskUsage.value + (Math.random() - 0.5) * 2))
  temperature.value = Math.min(100, Math.max(30, 40 + (cpuUsage.value / 100) * 40 + (Math.random() - 0.5) * 5))
  
  cpuUsage.value = Math.round(cpuUsage.value)
  ramUsage.value = Math.round(ramUsage.value)
  diskUsage.value = Math.round(diskUsage.value)
  temperature.value = Math.round(temperature.value)
  
  updateCount.value++
}

function getCpuColor(value) { if (value < 50) return '#10b981'; if (value < 75) return '#f59e0b'; return '#ef4444' }
function getRamColor(value) { if (value < 60) return '#3b82f6'; if (value < 80) return '#f59e0b'; return '#ef4444' }
function getDiskColor(value) { if (value < 70) return '#8b5cf6'; if (value < 85) return '#f59e0b'; return '#ef4444' }
function getTempColor(value) { if (value < 50) return '#10b981'; if (value < 70) return '#f59e0b'; return '#ef4444' }

function start() {
  if (isRunning.value) return
  
  isRunning.value = true
  startTime.value = Date.now()
  
  cpuUsage.value = Math.random() * 40 + 10
  ramUsage.value = Math.random() * 30 + 40
  diskUsage.value = Math.random() * 20 + 50
  temperature.value = Math.random() * 20 + 40
  
  if (props.simulation) {
    statsInterval = setInterval(simulateStats, props.updateInterval)
  }
  
  updateTimeInterval = setInterval(() => {
    currentTime.value = Date.now()
  }, 1000)
}

function stop() {
  if (!isRunning.value) return
  isRunning.value = false
  if (statsInterval) { clearInterval(statsInterval); statsInterval = null }
  if (updateTimeInterval) { clearInterval(updateTimeInterval); updateTimeInterval = null }
}

function toggleMonitoring() { isRunning.value ? stop() : start() }

onMounted(() => { if (props.autoStart) start() })
onBeforeUnmount(() => stop())

defineExpose({ start, stop, toggle: toggleMonitoring, isRunning: () => isRunning.value })
</script>

<style scoped>
.status-indicator { width: 0.5rem; height: 0.5rem; border-radius: 9999px; background-color: rgb(34, 197, 94); animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
.control-btn { display: flex; align-items: center; justify-content: center; width: 1.75rem; height: 1.75rem; font-size: 0.75rem; border-radius: 0.375rem; background: rgba(75, 85, 99, 0.3); border: 1px solid rgba(75, 85, 99, 0.5); color: rgba(156, 163, 175, 1); cursor: pointer; transition: all 0.2s ease; }
.control-btn:hover { background: rgba(75, 85, 99, 0.5); border-color: rgba(156, 163, 175, 0.5); color: white; }
.control-btn.active { background: rgba(34, 197, 94, 0.2); border-color: rgba(34, 197, 94, 0.5); color: rgb(34, 197, 94); }
.stats-footer { display: flex; align-items: center; gap: 1.5rem; }
.footer-stat { display: flex; flex-direction: column; gap: 0.125rem; }
.footer-label { font-size: 0.75rem; line-height: 1rem; color: rgb(156, 163, 175); }
.footer-value { font-size: 0.875rem; line-height: 1.25rem; font-weight: 500; color: rgb(229, 231, 235); }
.stats-graph-wrapper { position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; padding: 1rem; box-sizing: border-box; }
.metrics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; width: 100%; height: 100%; }
.metric-card { display: flex; flex-direction: column; gap: 0.5rem; padding: 0.75rem; background: rgba(31, 41, 55, 0.3); border-radius: 0.5rem; border: 1px solid rgba(75, 85, 99, 0.3); transition: all 0.3s ease; }
.metric-card:hover { background: rgba(31, 41, 55, 0.5); border-color: rgba(75, 85, 99, 0.5); transform: translateY(-2px); }
.metric-header { display: flex; align-items: center; gap: 0.5rem; }
.metric-icon { font-size: 1.25rem; filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.3)); }
.metric-label { font-size: 0.75rem; font-weight: 600; color: rgba(156, 163, 175, 1); text-transform: uppercase; letter-spacing: 0.1em; }
.metric-value { font-size: 2rem; font-weight: 700; line-height: 1; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif; letter-spacing: -0.02em; filter: drop-shadow(0 0 10px currentColor) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3)); transition: color 0.3s ease; }
.metric-bar { width: 100%; height: 4px; background: rgba(75, 85, 99, 0.3); border-radius: 9999px; overflow: hidden; position: relative; }
.metric-fill { height: 100%; border-radius: 9999px; transition: width 0.5s ease, background-color 0.3s ease; position: relative; }
.cpu-fill { background: linear-gradient(90deg, #10b981, #059669); box-shadow: 0 0 8px rgba(16, 185, 129, 0.5); }
.ram-fill { background: linear-gradient(90deg, #3b82f6, #2563eb); box-shadow: 0 0 8px rgba(59, 130, 246, 0.5); }
.disk-fill { background: linear-gradient(90deg, #8b5cf6, #7c3aed); box-shadow: 0 0 8px rgba(139, 92, 246, 0.5); }
.temp-fill { background: linear-gradient(90deg, #10b981, #f59e0b, #ef4444); box-shadow: 0 0 8px rgba(245, 158, 11, 0.5); }
.flex { display: flex; }
.items-center { align-items: center; }
.gap-2 { gap: 0.5rem; }
.text-primary { color: rgb(229, 231, 235); }
.text-muted { color: rgb(156, 163, 175); }
.font-semibold { font-weight: 600; }
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }
.text-xs { font-size: 0.75rem; line-height: 1rem; }
.ml-auto { margin-left: auto; }
@media (max-width: 640px) { .metrics-grid { grid-template-columns: 1fr; gap: 0.75rem; } .metric-value { font-size: 1.75rem; } }
</style>
