<template>
  <AppWidget variant="compact" size="lg" :width="1" :height="2">
    <div class="face-wrapper">
      <div class="face-header">
        <div class="face-title">🎭 Face Recognition</div>
      </div>
      
      <!-- Total faces detected -->
      <div class="total-faces">
        <div class="total-number">{{ totalFaces }}</div>
        <div class="total-label">Faces Detected</div>
      </div>
      
      <!-- Pie chart -->
      <div class="chart-container">
        <svg class="pie-svg" viewBox="0 0 200 200">
          <!-- Background circle -->
          <circle cx="100" cy="100" r="80" fill="rgba(75, 85, 99, 0.1)" />
          
          <!-- Familiar faces slice -->
          <path
            :d="familiarPath"
            :fill="familiarColor"
            class="pie-slice"
            :style="{ filter: familiarGlow }"
          />
          
          <!-- Unknown faces slice -->
          <path
            :d="unknownPath"
            :fill="unknownColor"
            class="pie-slice"
            :style="{ filter: unknownGlow }"
          />
          
          <!-- Center circle -->
          <circle cx="100" cy="100" r="50" fill="rgba(17, 24, 39, 0.95)" />
          
          <!-- Center icon -->
          <text x="100" y="110" text-anchor="middle" class="center-icon">👥</text>
        </svg>
      </div>
      
      <!-- Statistics -->
      <div class="face-stats">
        <div class="stat-item">
          <div class="stat-color" style="background: #10b981;"></div>
          <div class="stat-info">
            <div class="stat-label">Familiar</div>
            <div class="stat-value">{{ familiarFaces }}</div>
          </div>
          <div class="stat-percent">{{ familiarPercent }}%</div>
        </div>
        
        <div class="stat-item">
          <div class="stat-color" style="background: #f59e0b;"></div>
          <div class="stat-info">
            <div class="stat-label">Unknown</div>
            <div class="stat-value">{{ unknownFaces }}</div>
          </div>
          <div class="stat-percent">{{ unknownPercent }}%</div>
        </div>
      </div>
      
      <!-- Recent faces list -->
      <div class="recent-faces">
        <div class="recent-title">Recent</div>
        <div class="face-list">
          <div v-for="face in recentFaces" :key="face.id" class="face-item">
            <div class="face-avatar">{{ face.emoji }}</div>
            <div class="face-name">{{ face.name }}</div>
            <div class="face-time">{{ face.time }}</div>
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
  updateInterval: { type: Number, default: 4000 },
  simulation: { type: Boolean, default: true },
  autoStart: { type: Boolean, default: true }
})

const familiarFaces = ref(3)
const unknownFaces = ref(1)
const recentFaces = ref([
  { id: 1, name: 'Alice', emoji: '👩', time: '2m ago' },
  { id: 2, name: 'Bob', emoji: '👨', time: '5m ago' },
  { id: 3, name: 'Unknown', emoji: '❓', time: '8m ago' }
])

let intervalId = null

const totalFaces = computed(() => familiarFaces.value + unknownFaces.value)
const familiarPercent = computed(() => totalFaces.value > 0 ? Math.round((familiarFaces.value / totalFaces.value) * 100) : 0)
const unknownPercent = computed(() => totalFaces.value > 0 ? Math.round((unknownFaces.value / totalFaces.value) * 100) : 0)

const familiarColor = '#10b981'
const unknownColor = '#f59e0b'

const familiarGlow = computed(() => `drop-shadow(0 0 6px ${familiarColor}) drop-shadow(0 0 10px ${familiarColor}60)`)
const unknownGlow = computed(() => `drop-shadow(0 0 6px ${unknownColor}) drop-shadow(0 0 10px ${unknownColor}60)`)

function getSlicePath(startAngle, endAngle, radius = 80) {
  const startX = 100 + radius * Math.cos(startAngle)
  const startY = 100 + radius * Math.sin(startAngle)
  const endX = 100 + radius * Math.cos(endAngle)
  const endY = 100 + radius * Math.sin(endAngle)
  
  const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0
  
  return `M 100 100 L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`
}

const familiarPath = computed(() => {
  const angle = (familiarPercent.value / 100) * 2 * Math.PI
  return getSlicePath(-Math.PI / 2, -Math.PI / 2 + angle)
})

const unknownPath = computed(() => {
  const familiarAngle = (familiarPercent.value / 100) * 2 * Math.PI
  const startAngle = -Math.PI / 2 + familiarAngle
  const endAngle = startAngle + (unknownPercent.value / 100) * 2 * Math.PI
  return getSlicePath(startAngle, endAngle)
})

function simulateData() {
  // Subtle changes
  const change = Math.random() > 0.5 ? 1 : -1
  if (Math.random() > 0.5) {
    familiarFaces.value = Math.max(0, familiarFaces.value + change)
  } else {
    unknownFaces.value = Math.max(0, unknownFaces.value + change)
  }
}

function start() {
  if (intervalId) return
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
  familiar: computed(() => familiarFaces.value),
  unknown: computed(() => unknownFaces.value),
  total: totalFaces,
  addFace: (name, isFamiliar = true) => {
    if (isFamiliar) familiarFaces.value++
    else unknownFaces.value++
    
    recentFaces.value.unshift({
      id: Date.now(),
      name: name || 'Unknown',
      emoji: isFamiliar ? ['👨', '👩', '👴', '👵'][Math.floor(Math.random() * 4)] : '❓',
      time: 'now'
    })
    if (recentFaces.value.length > 3) recentFaces.value.pop()
  }
})
</script>

<style scoped>
.face-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 1rem;
  gap: 0.75rem;
}

.face-header {
  display: flex;
  justify-content: center;
}

.face-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: rgba(156, 163, 175, 1);
  letter-spacing: 0.05em;
}

.total-faces {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem;
  background: rgba(75, 85, 99, 0.1);
  border-radius: 0.5rem;
}

.total-number {
  font-size: 3rem;
  font-weight: 700;
  color: rgba(209, 213, 219, 1);
  line-height: 1;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif;
}

.total-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(156, 163, 175, 1);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-top: 0.25rem;
}

.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
}

.pie-svg {
  width: 140px;
  height: 140px;
}

.pie-slice {
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.center-icon {
  font-size: 2rem;
  dominant-baseline: middle;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.3));
}

.face-stats {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: rgba(75, 85, 99, 0.1);
  border-radius: 0.5rem;
}

.stat-color {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  flex-shrink: 0;
}

.stat-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.stat-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: rgba(156, 163, 175, 1);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-value {
  font-size: 0.875rem;
  font-weight: 700;
  color: rgba(209, 213, 219, 1);
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif;
}

.stat-percent {
  font-size: 0.875rem;
  font-weight: 700;
  color: rgba(209, 213, 219, 1);
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif;
}

.recent-faces {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.recent-title {
  font-size: 0.7rem;
  font-weight: 700;
  color: rgba(156, 163, 175, 1);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.face-list {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.face-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.5rem;
  background: rgba(75, 85, 99, 0.1);
  border-radius: 0.375rem;
}

.face-avatar {
  font-size: 1.25rem;
  width: 1.75rem;
  text-align: center;
}

.face-name {
  flex: 1;
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(209, 213, 219, 1);
}

.face-time {
  font-size: 0.65rem;
  font-weight: 500;
  color: rgba(156, 163, 175, 1);
}

@media (max-width: 640px) {
  .face-wrapper {
    padding: 0.75rem;
  }
  
  .total-number {
    font-size: 2.5rem;
  }
}
</style>

