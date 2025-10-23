<template>
  <AppWidget variant="compact" size="lg" :width="2" :height="1">
    <div class="gaze-wrapper">
      <div class="gaze-header">
        <div class="gaze-title">👁️ Gaze Direction</div>
        <div class="gaze-confidence">{{ confidence }}%</div>
      </div>
      
      <div class="gaze-content">
        <!-- Gaze Grid -->
        <div class="gaze-grid">
          <svg class="grid-svg" viewBox="0 0 200 200">
            <!-- Grid background -->
            <rect x="10" y="10" width="180" height="180" 
              fill="rgba(75, 85, 99, 0.1)" 
              stroke="rgba(156, 163, 175, 0.3)" 
              stroke-width="2" 
              rx="8"
            />
            
            <!-- Grid lines -->
            <line x1="100" y1="10" x2="100" y2="190" stroke="rgba(156, 163, 175, 0.2)" stroke-width="1" />
            <line x1="10" y1="100" x2="190" y2="100" stroke="rgba(156, 163, 175, 0.2)" stroke-width="1" />
            
            <!-- Center point -->
            <circle cx="100" cy="100" r="8" fill="rgba(156, 163, 175, 0.3)" />
            
            <!-- Gaze point with trail -->
            <circle 
              :cx="gazeX" 
              :cy="gazeY" 
              r="25" 
              :fill="gazeColor" 
              opacity="0.15" 
              class="gaze-trail"
            />
            <circle 
              :cx="gazeX" 
              :cy="gazeY" 
              r="15" 
              :fill="gazeColor" 
              opacity="0.3" 
              class="gaze-ring"
            />
            <circle 
              :cx="gazeX" 
              :cy="gazeY" 
              r="8" 
              :fill="gazeColor" 
              class="gaze-point"
              :style="{ filter: gazeGlow }"
            />
            
            <!-- Direction arrow -->
            <line 
              x1="100" 
              y1="100" 
              :x2="gazeX" 
              :y2="gazeY" 
              :stroke="gazeColor" 
              stroke-width="2" 
              opacity="0.5"
              class="direction-line"
            />
          </svg>
        </div>
        
        <!-- Direction info -->
        <div class="direction-info">
          <div class="direction-label">{{ direction }}</div>
          <div class="coordinates">
            <span>X: {{ normalizedX }}</span>
            <span>Y: {{ normalizedY }}</span>
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
  autoStart: { type: Boolean, default: true }
})

const gazeX = ref(100) // 10-190
const gazeY = ref(100) // 10-190
const confidence = ref(95)

let intervalId = null

const normalizedX = computed(() => Math.round(((gazeX.value - 10) / 180) * 100))
const normalizedY = computed(() => Math.round(((gazeY.value - 10) / 180) * 100))

const direction = computed(() => {
  const x = normalizedX.value
  const y = normalizedY.value
  
  if (x > 60 && y < 40) return 'Top Right'
  if (x < 40 && y < 40) return 'Top Left'
  if (x > 60 && y > 60) return 'Bottom Right'
  if (x < 40 && y > 60) return 'Bottom Left'
  if (y < 40) return 'Up'
  if (y > 60) return 'Down'
  if (x > 60) return 'Right'
  if (x < 40) return 'Left'
  return 'Center'
})

const gazeColor = computed(() => {
  if (direction.value === 'Center') return '#6366f1'
  if (direction.value.includes('Up')) return '#3b82f6'
  if (direction.value.includes('Down')) return '#8b5cf6'
  if (direction.value.includes('Right')) return '#10b981'
  if (direction.value.includes('Left')) return '#f59e0b'
  return '#9ca3af'
})

const gazeGlow = computed(() => {
  const color = gazeColor.value
  return `drop-shadow(0 0 6px ${color}) drop-shadow(0 0 10px ${color}60)`
})

function simulateData() {
  // Smooth movement
  const targetX = 10 + Math.random() * 180
  const targetY = 10 + Math.random() * 180
  
  gazeX.value += (targetX - gazeX.value) * 0.3
  gazeY.value += (targetY - gazeY.value) * 0.3
  
  confidence.value = Math.round(85 + Math.random() * 15)
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
  x: computed(() => normalizedX.value),
  y: computed(() => normalizedY.value),
  direction,
  setGaze: (x, y) => {
    gazeX.value = 10 + (x / 100) * 180
    gazeY.value = 10 + (y / 100) * 180
  }
})
</script>

<style scoped>
.gaze-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 1rem;
  gap: 0.75rem;
}

.gaze-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.gaze-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: rgba(156, 163, 175, 1);
  letter-spacing: 0.05em;
}

.gaze-confidence {
  font-size: 0.75rem;
  font-weight: 700;
  color: rgba(16, 185, 129, 1);
  padding: 0.2rem 0.6rem;
  background: rgba(16, 185, 129, 0.15);
  border-radius: 0.5rem;
}

.gaze-content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.gaze-grid {
  flex: 0 0 auto;
  width: 180px;
  height: 180px;
}

.grid-svg {
  width: 100%;
  height: 100%;
}

.gaze-trail, .gaze-ring, .gaze-point, .direction-line {
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.direction-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(75, 85, 99, 0.1);
  border-radius: 0.5rem;
  align-items: center;
  justify-content: center;
}

.direction-label {
  font-size: 1.5rem;
  font-weight: 700;
  color: rgba(209, 213, 219, 1);
  text-align: center;
}

.coordinates {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(156, 163, 175, 1);
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif;
}

@media (max-width: 640px) {
  .gaze-wrapper {
    padding: 0.75rem;
  }
  
  .gaze-grid {
    width: 140px;
    height: 140px;
  }
  
  .direction-label {
    font-size: 1.25rem;
  }
}
</style>

