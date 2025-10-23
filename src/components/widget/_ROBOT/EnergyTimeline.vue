<template>
  <AppWidget variant="compact" size="lg" :width="2" :height="1">
    <div class="timeline-wrapper">
      <div class="timeline-header">
        <div class="timeline-title">⚡ Energy & Mood</div>
        <div class="current-time">{{ currentTime }}</div>
      </div>
      
      <div class="timeline-content">
        <!-- Dual line chart -->
        <div class="chart-area">
          <svg class="timeline-svg" viewBox="0 0 480 140">
            <!-- Grid -->
            <line v-for="i in 7" :key="'h-' + i" 
              :x1="0" 
              :y1="i * 20" 
              :x2="480" 
              :y2="i * 20" 
              stroke="rgba(156, 163, 175, 0.08)" 
              stroke-width="1"
            />
            
            <!-- Time labels -->
            <text v-for="(hour, idx) in hours" :key="'t-' + idx"
              :x="idx * 80"
              y="135"
              class="time-label"
            >{{ hour }}</text>
            
            <!-- Energy area -->
            <path
              :d="energyArea"
              fill="url(#energyGradient)"
              opacity="0.3"
            />
            
            <!-- Energy line -->
            <path
              :d="energyLine"
              fill="none"
              stroke="#f59e0b"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="energy-line"
            />
            
            <!-- Mood area -->
            <path
              :d="moodArea"
              fill="url(#moodGradient)"
              opacity="0.3"
            />
            
            <!-- Mood line -->
            <path
              :d="moodLine"
              fill="none"
              stroke="#3b82f6"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="mood-line"
            />
            
            <!-- Gradients -->
            <defs>
              <linearGradient id="energyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#f59e0b;stop-opacity:0.6" />
                <stop offset="100%" style="stop-color:#f59e0b;stop-opacity:0" />
              </linearGradient>
              <linearGradient id="moodGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:0.6" />
                <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        <!-- Legend -->
        <div class="timeline-legend">
          <div class="legend-item">
            <div class="legend-dot" style="background: #f59e0b;"></div>
            <span class="legend-label">Energy</span>
            <span class="legend-value">{{ currentEnergy }}%</span>
          </div>
          <div class="legend-item">
            <div class="legend-dot" style="background: #3b82f6;"></div>
            <span class="legend-label">Mood</span>
            <span class="legend-value">{{ currentMood }}%</span>
          </div>
        </div>
      </div>
    </div>
  </AppWidget>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import AppWidget from '@/components/ui/AppWidget.vue'

const props = defineProps({
  updateInterval: { type: Number, default: 2000 },
  simulation: { type: Boolean, default: true },
  autoStart: { type: Boolean, default: true },
  hours: { type: Number, default: 6 }
})

const energyData = ref([])
const moodData = ref([])
const currentTime = ref('14:32')

let intervalId = null

const hours = computed(() => {
  const result = []
  const now = new Date()
  for (let i = 0; i <= props.hours; i++) {
    const time = new Date(now.getTime() - (props.hours - i) * 3600000)
    result.push(time.getHours().toString().padStart(2, '0') + 'h')
  }
  return result
})

const currentEnergy = computed(() => 
  energyData.value.length > 0 ? energyData.value[energyData.value.length - 1] : 0
)

const currentMood = computed(() => 
  moodData.value.length > 0 ? moodData.value[moodData.value.length - 1] : 0
)

function createPath(data, close = false) {
  if (data.length < 2) return ''
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 480
    const y = 120 - (value / 100) * 120
    return `${x},${y}`
  })
  
  let path = `M ${points.join(' L ')}`
  
  if (close) {
    const lastX = ((data.length - 1) / (data.length - 1)) * 480
    path += ` L ${lastX},120 L 0,120 Z`
  }
  
  return path
}

const energyLine = computed(() => createPath(energyData.value))
const energyArea = computed(() => createPath(energyData.value, true))
const moodLine = computed(() => createPath(moodData.value))
const moodArea = computed(() => createPath(moodData.value, true))

function simulateData() {
  const points = 30
  
  // Shift and add new points
  if (energyData.value.length >= points) {
    energyData.value.shift()
    moodData.value.shift()
  }
  
  const lastEnergy = energyData.value.length > 0 ? energyData.value[energyData.value.length - 1] : 70
  const lastMood = moodData.value.length > 0 ? moodData.value[moodData.value.length - 1] : 65
  
  const newEnergy = Math.min(100, Math.max(20, lastEnergy + (Math.random() - 0.5) * 15))
  const newMood = Math.min(100, Math.max(20, lastMood + (Math.random() - 0.5) * 12))
  
  energyData.value.push(Math.round(newEnergy))
  moodData.value.push(Math.round(newMood))
  
  // Update time
  const now = new Date()
  currentTime.value = now.getHours().toString().padStart(2, '0') + ':' + 
                      now.getMinutes().toString().padStart(2, '0')
}

function start() {
  if (intervalId) return
  
  // Initialize with data
  if (energyData.value.length === 0) {
    const points = 30
    for (let i = 0; i < points; i++) {
      energyData.value.push(Math.round(50 + Math.random() * 40))
      moodData.value.push(Math.round(45 + Math.random() * 40))
    }
  }
  
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
  energy: computed(() => currentEnergy.value),
  mood: computed(() => currentMood.value),
  addData: (energy, mood) => {
    energyData.value.push(Math.min(100, Math.max(0, energy)))
    moodData.value.push(Math.min(100, Math.max(0, mood)))
    if (energyData.value.length > 30) {
      energyData.value.shift()
      moodData.value.shift()
    }
  }
})
</script>

<style scoped>
.timeline-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 1rem;
  gap: 0.75rem;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timeline-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: rgba(156, 163, 175, 1);
  letter-spacing: 0.05em;
}

.current-time {
  font-size: 0.75rem;
  font-weight: 700;
  color: rgba(209, 213, 219, 1);
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif;
  padding: 0.2rem 0.6rem;
  background: rgba(75, 85, 99, 0.2);
  border-radius: 0.5rem;
}

.timeline-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-height: 0;
}

.chart-area {
  flex: 1;
  background: rgba(75, 85, 99, 0.1);
  border-radius: 0.5rem;
  padding: 0.75rem;
  min-height: 0;
}

.timeline-svg {
  width: 100%;
  height: 100%;
}

.time-label {
  font-size: 10px;
  font-weight: 600;
  fill: rgba(156, 163, 175, 0.7);
  text-anchor: middle;
}

.energy-line, .mood-line {
  transition: all 0.5s ease;
  filter: drop-shadow(0 0 4px currentColor);
}

.timeline-legend {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  padding: 0.5rem;
  background: rgba(75, 85, 99, 0.1);
  border-radius: 0.5rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legend-dot {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(156, 163, 175, 1);
}

.legend-value {
  font-size: 0.75rem;
  font-weight: 700;
  color: rgba(209, 213, 219, 1);
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif;
}

@media (max-width: 640px) {
  .timeline-wrapper {
    padding: 0.75rem;
  }
  
  .timeline-legend {
    gap: 1rem;
  }
}
</style>

