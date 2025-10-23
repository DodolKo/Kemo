<template>
  <AppWidget variant="compact" size="lg" :width="2" :height="1">
    <div class="motion-wrapper">
      <div class="motion-header">
        <div class="motion-title">🏃 Motion Activity</div>
        <div class="motion-status" :style="{ color: statusColor }">{{ status }}</div>
      </div>
      
      <div class="motion-content">
        <!-- Activity graph -->
        <div class="activity-graph">
          <svg class="graph-svg" viewBox="0 0 400 120" preserveAspectRatio="none">
            <!-- Grid lines -->
            <line v-for="i in 5" :key="'h-' + i" 
              :x1="0" 
              :y1="i * 24" 
              :x2="400" 
              :y2="i * 24" 
              stroke="rgba(156, 163, 175, 0.1)" 
              stroke-width="1"
            />
            
            <!-- Activity area -->
            <path
              :d="activityPath"
              fill="url(#activityGradient)"
              class="activity-area"
            />
            
            <!-- Activity line -->
            <path
              :d="activityLine"
              fill="none"
              :stroke="lineColor"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="activity-line"
              :style="{ filter: lineGlow }"
            />
            
            <!-- Gradient definition -->
            <defs>
              <linearGradient id="activityGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" :style="{ stopColor: lineColor, stopOpacity: 0.4 }" />
                <stop offset="100%" :style="{ stopColor: lineColor, stopOpacity: 0 }" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        <!-- Stats -->
        <div class="motion-stats">
          <div class="stat-box">
            <div class="stat-icon">📍</div>
            <div class="stat-details">
              <div class="stat-value">{{ distance }}m</div>
              <div class="stat-label">Distance</div>
            </div>
          </div>
          
          <div class="stat-box">
            <div class="stat-icon">⚡</div>
            <div class="stat-details">
              <div class="stat-value">{{ speed }}</div>
              <div class="stat-label">Speed</div>
            </div>
          </div>
          
          <div class="stat-box">
            <div class="stat-icon">🔄</div>
            <div class="stat-details">
              <div class="stat-value">{{ turns }}</div>
              <div class="stat-label">Turns</div>
            </div>
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
  updateInterval: { type: Number, default: 1500 },
  simulation: { type: Boolean, default: true },
  autoStart: { type: Boolean, default: true },
  maxPoints: { type: Number, default: 40 }
})

const activityData = ref([])
const distance = ref(12)
const speed = ref('0.5 m/s')
const turns = ref(7)

let intervalId = null

const status = computed(() => {
  if (activityData.value.length === 0) return 'Idle'
  const lastValue = activityData.value[activityData.value.length - 1]
  if (lastValue > 80) return 'Running'
  if (lastValue > 50) return 'Walking'
  if (lastValue > 20) return 'Moving'
  return 'Idle'
})

const statusColor = computed(() => {
  switch (status.value) {
    case 'Running': return '#ef4444'
    case 'Walking': return '#f59e0b'
    case 'Moving': return '#3b82f6'
    default: return '#9ca3af'
  }
})

const lineColor = computed(() => statusColor.value)
const lineGlow = computed(() => `drop-shadow(0 0 4px ${lineColor.value}) drop-shadow(0 0 8px ${lineColor.value}60)`)

const activityLine = computed(() => {
  if (activityData.value.length < 2) return ''
  
  const points = activityData.value.map((value, index) => {
    const x = (index / (props.maxPoints - 1)) * 400
    const y = 120 - (value / 100) * 120
    return `${x},${y}`
  })
  
  return `M ${points.join(' L ')}`
})

const activityPath = computed(() => {
  if (activityData.value.length < 2) return ''
  
  const linePath = activityLine.value
  const lastX = ((activityData.value.length - 1) / (props.maxPoints - 1)) * 400
  
  return `${linePath} L ${lastX},120 L 0,120 Z`
})

function simulateData() {
  // Add new data point with smooth transitions
  const lastValue = activityData.value.length > 0 ? activityData.value[activityData.value.length - 1] : 30
  const change = (Math.random() - 0.5) * 30
  const newValue = Math.min(100, Math.max(0, lastValue + change))
  
  activityData.value.push(Math.round(newValue))
  
  if (activityData.value.length > props.maxPoints) {
    activityData.value.shift()
  }
  
  // Update stats
  distance.value += Math.random() * 0.5
  distance.value = Math.round(distance.value * 10) / 10
  
  const currentSpeed = newValue / 100 * 1.5
  speed.value = currentSpeed.toFixed(1) + ' m/s'
  
  if (Math.random() > 0.7) {
    turns.value += Math.random() > 0.5 ? 1 : 0
  }
}

function start() {
  if (intervalId) return
  
  // Initialize with some data
  if (activityData.value.length === 0) {
    for (let i = 0; i < props.maxPoints; i++) {
      activityData.value.push(Math.random() * 40 + 10)
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
  status,
  distance: computed(() => distance.value),
  addActivity: (value) => {
    activityData.value.push(Math.min(100, Math.max(0, value)))
    if (activityData.value.length > props.maxPoints) {
      activityData.value.shift()
    }
  }
})
</script>

<style scoped>
.motion-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 1rem;
  gap: 0.75rem;
}

.motion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.motion-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: rgba(156, 163, 175, 1);
  letter-spacing: 0.05em;
}

.motion-status {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  background: rgba(156, 163, 175, 0.15);
  border-radius: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: color 0.3s ease;
}

.motion-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-height: 0;
}

.activity-graph {
  flex: 1;
  background: rgba(75, 85, 99, 0.1);
  border-radius: 0.5rem;
  padding: 0.5rem;
  min-height: 0;
}

.graph-svg {
  width: 100%;
  height: 100%;
}

.activity-area {
  transition: all 0.5s ease;
}

.activity-line {
  transition: all 0.5s ease;
}

.motion-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

.stat-box {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: rgba(75, 85, 99, 0.1);
  border-radius: 0.5rem;
}

.stat-icon {
  font-size: 1.5rem;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.3));
}

.stat-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.stat-value {
  font-size: 0.875rem;
  font-weight: 700;
  color: rgba(209, 213, 219, 1);
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif;
  line-height: 1;
}

.stat-label {
  font-size: 0.65rem;
  font-weight: 600;
  color: rgba(156, 163, 175, 1);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

@media (max-width: 640px) {
  .motion-wrapper {
    padding: 0.75rem;
  }
  
  .stat-icon {
    font-size: 1.25rem;
  }
}
</style>

