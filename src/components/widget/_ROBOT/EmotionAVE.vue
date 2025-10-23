<template>
  <AppWidget variant="compact" size="lg" :width="2" :height="2">
    <div class="ave-wrapper">
      <!-- Header -->
      <div class="ave-header">
        <div class="header-left">
          <div class="emotion-icon">{{ emotionIcon }}</div>
          <div class="emotion-text">
            <div class="emotion-name">{{ currentEmotion }}</div>
            <div class="emotion-subtitle">Emotional State</div>
          </div>
        </div>
        <div class="emotion-badge" :style="{ background: emotionGradient }">
          {{ emotionIntensity }}%
        </div>
      </div>
      
      <!-- Main visualization: Circumplex Model -->
      <div class="emotion-circumplex">
        <svg class="circumplex-svg" viewBox="0 0 300 300">
          <defs>
            <!-- Gradient backgrounds for quadrants -->
            <radialGradient id="positiveHighGrad" cx="75%" cy="25%">
              <stop offset="0%" style="stop-color:#fbbf24;stop-opacity:0.3" />
              <stop offset="100%" style="stop-color:#fbbf24;stop-opacity:0" />
            </radialGradient>
            <radialGradient id="positiveLowGrad" cx="75%" cy="75%">
              <stop offset="0%" style="stop-color:#10b981;stop-opacity:0.3" />
              <stop offset="100%" style="stop-color:#10b981;stop-opacity:0" />
            </radialGradient>
            <radialGradient id="negativeLowGrad" cx="25%" cy="75%">
              <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:0.3" />
              <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:0" />
            </radialGradient>
            <radialGradient id="negativeHighGrad" cx="25%" cy="25%">
              <stop offset="0%" style="stop-color:#ef4444;stop-opacity:0.3" />
              <stop offset="100%" style="stop-color:#ef4444;stop-opacity:0" />
            </radialGradient>
          </defs>
          
          <!-- Background circle -->
          <circle cx="150" cy="150" r="130" fill="rgba(31, 41, 55, 0.4)" />
          
          <!-- Quadrant fills -->
          <circle cx="150" cy="150" r="130" fill="url(#positiveHighGrad)" opacity="0.6" />
          
          <!-- Concentric circles -->
          <circle v-for="i in 3" :key="i" 
            cx="150" cy="150" 
            :r="i * 40" 
            fill="none" 
            stroke="rgba(107, 114, 128, 0.2)" 
            stroke-width="1"
          />
          
          <!-- Axis lines -->
          <line x1="20" y1="150" x2="280" y2="150" stroke="rgba(156, 163, 175, 0.4)" stroke-width="2" />
          <line x1="150" y1="20" x2="150" y2="280" stroke="rgba(156, 163, 175, 0.4)" stroke-width="2" />
          
          <!-- Axis labels -->
          <text x="150" y="15" class="axis-label-main">High Arousal</text>
          <text x="150" y="290" class="axis-label-main">Low Arousal</text>
          <text x="15" y="155" class="axis-label-main">-</text>
          <text x="280" y="155" class="axis-label-main">+</text>
          <text x="150" y="305" class="axis-label-sub">Valence</text>
          
          <!-- Endurance ring (thickness represents endurance) -->
          <circle 
            :cx="emotionX" 
            :cy="emotionY" 
            :r="enduranceSize" 
            fill="none"
            :stroke="emotionColor"
            :stroke-width="enduranceStroke"
            opacity="0.3"
            class="endurance-ring"
          />
          
          <!-- Glow effect -->
          <circle 
            :cx="emotionX" 
            :cy="emotionY" 
            :r="20" 
            :fill="emotionColor"
            opacity="0.2"
            class="emotion-glow"
            :style="{ filter: `blur(15px)` }"
          />
          
          <!-- Main emotion point -->
          <circle 
            :cx="emotionX" 
            :cy="emotionY" 
            r="12" 
            :fill="emotionColor"
            class="emotion-point"
            :style="{ filter: emotionShadow }"
          />
          
          <!-- Inner point -->
          <circle 
            :cx="emotionX" 
            :cy="emotionY" 
            r="6" 
            fill="white"
            opacity="0.9"
          />
        </svg>
      </div>
      
      <!-- Metrics cards -->
      <div class="metrics-grid">
        <div class="metric-card" :style="{ borderColor: getArousalColor(arousal) }">
          <div class="metric-header">
            <span class="metric-icon">🔥</span>
            <span class="metric-label">Arousal</span>
          </div>
          <div class="metric-value" :style="{ color: getArousalColor(arousal) }">{{ arousal }}</div>
          <div class="metric-bar">
            <div class="metric-fill" :style="{ width: arousal + '%', background: getArousalColor(arousal) }"></div>
          </div>
        </div>
        
        <div class="metric-card" :style="{ borderColor: getValenceColor(valence) }">
          <div class="metric-header">
            <span class="metric-icon">{{ valence >= 50 ? '😊' : '😔' }}</span>
            <span class="metric-label">Valence</span>
          </div>
          <div class="metric-value" :style="{ color: getValenceColor(valence) }">{{ valence }}</div>
          <div class="metric-bar">
            <div class="metric-fill" :style="{ width: valence + '%', background: getValenceColor(valence) }"></div>
          </div>
        </div>
        
        <div class="metric-card" :style="{ borderColor: getEnduranceColor(endurance) }">
          <div class="metric-header">
            <span class="metric-icon">⚡</span>
            <span class="metric-label">Endurance</span>
          </div>
          <div class="metric-value" :style="{ color: getEnduranceColor(endurance) }">{{ endurance }}</div>
          <div class="metric-bar">
            <div class="metric-fill" :style="{ width: endurance + '%', background: getEnduranceColor(endurance) }"></div>
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
  updateInterval: { type: Number, default: 3000 },
  simulation: { type: Boolean, default: true },
  autoStart: { type: Boolean, default: true }
})

const arousal = ref(65)
const valence = ref(70)
const endurance = ref(75)

let intervalId = null

// Map to circumplex coordinates (center is 150,150, radius is 130)
const emotionX = computed(() => {
  const normalizedValence = (valence.value - 50) / 50 // -1 to 1
  return 150 + (normalizedValence * 110)
})

const emotionY = computed(() => {
  const normalizedArousal = (arousal.value - 50) / 50 // -1 to 1
  return 150 - (normalizedArousal * 110) // Inverted Y
})

const enduranceSize = computed(() => 25 + (endurance.value / 100) * 25) // 25-50px
const enduranceStroke = computed(() => 3 + (endurance.value / 100) * 5) // 3-8px

const currentEmotion = computed(() => {
  const a = arousal.value
  const v = valence.value
  
  if (v >= 60) {
    if (a >= 70) return 'Excited'
    if (a >= 50) return 'Happy'
    if (a >= 30) return 'Content'
    return 'Calm'
  } else if (v >= 40) {
    if (a >= 70) return 'Alert'
    if (a >= 50) return 'Neutral'
    if (a >= 30) return 'Relaxed'
    return 'Peaceful'
  } else {
    if (a >= 70) return 'Stressed'
    if (a >= 50) return 'Anxious'
    if (a >= 30) return 'Sad'
    return 'Tired'
  }
})

const emotionIcon = computed(() => {
  const emotions = {
    'Excited': '🤩',
    'Happy': '😊',
    'Content': '🙂',
    'Calm': '😌',
    'Alert': '👀',
    'Neutral': '😐',
    'Relaxed': '😴',
    'Peaceful': '☮️',
    'Stressed': '😰',
    'Anxious': '😟',
    'Sad': '😢',
    'Tired': '😴'
  }
  return emotions[currentEmotion.value] || '😐'
})

const emotionColor = computed(() => {
  const emotions = {
    'Excited': '#fbbf24',
    'Happy': '#10b981',
    'Content': '#34d399',
    'Calm': '#3b82f6',
    'Alert': '#f59e0b',
    'Neutral': '#9ca3af',
    'Relaxed': '#6366f1',
    'Peaceful': '#8b5cf6',
    'Stressed': '#ef4444',
    'Anxious': '#f97316',
    'Sad': '#6b7280',
    'Tired': '#4b5563'
  }
  return emotions[currentEmotion.value] || '#9ca3af'
})

const emotionGradient = computed(() => {
  const color = emotionColor.value
  return `linear-gradient(135deg, ${color}40, ${color}20)`
})

const emotionShadow = computed(() => {
  const color = emotionColor.value
  return `drop-shadow(0 0 10px ${color}) drop-shadow(0 0 20px ${color}60)`
})

const emotionIntensity = computed(() => {
  // Calculate distance from center
  const dx = (valence.value - 50) / 50
  const dy = (arousal.value - 50) / 50
  const distance = Math.sqrt(dx * dx + dy * dy)
  return Math.round(Math.min(100, distance * 100))
})

function getArousalColor(value) {
  if (value >= 70) return '#f59e0b'
  if (value >= 40) return '#3b82f6'
  return '#6b7280'
}

function getValenceColor(value) {
  if (value >= 60) return '#10b981'
  if (value >= 40) return '#9ca3af'
  return '#ef4444'
}

function getEnduranceColor(value) {
  if (value >= 70) return '#10b981'
  if (value >= 40) return '#f59e0b'
  return '#ef4444'
}

function simulateData() {
  arousal.value = Math.min(100, Math.max(0, arousal.value + (Math.random() - 0.5) * 8))
  valence.value = Math.min(100, Math.max(0, valence.value + (Math.random() - 0.5) * 6))
  endurance.value = Math.min(100, Math.max(0, endurance.value + (Math.random() - 0.5) * 4))
  
  arousal.value = Math.round(arousal.value)
  valence.value = Math.round(valence.value)
  endurance.value = Math.round(endurance.value)
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
  arousal: computed(() => arousal.value),
  valence: computed(() => valence.value),
  endurance: computed(() => endurance.value),
  emotion: currentEmotion,
  setValues: (a, v, e) => {
    if (a !== undefined) arousal.value = Math.min(100, Math.max(0, a))
    if (v !== undefined) valence.value = Math.min(100, Math.max(0, v))
    if (e !== undefined) endurance.value = Math.min(100, Math.max(0, e))
  }
})
</script>

<style scoped>
.ave-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 1rem;
  gap: 1rem;
}

/* Header */
.ave-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.emotion-icon {
  font-size: 2.5rem;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
}

.emotion-text {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.emotion-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: rgba(243, 244, 246, 1);
  letter-spacing: -0.01em;
}

.emotion-subtitle {
  font-size: 0.75rem;
  font-weight: 500;
  color: rgba(156, 163, 175, 1);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.emotion-badge {
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-size: 1rem;
  font-weight: 700;
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif;
  backdrop-filter: blur(10px);
}

/* Circumplex */
.emotion-circumplex {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 0;
  padding: 0.5rem;
}

.circumplex-svg {
  width: 100%;
  height: 100%;
  max-width: 300px;
  max-height: 300px;
}

.axis-label-main {
  font-size: 11px;
  font-weight: 700;
  fill: rgba(156, 163, 175, 1);
  text-anchor: middle;
  dominant-baseline: middle;
  letter-spacing: 0.05em;
}

.axis-label-sub {
  font-size: 10px;
  font-weight: 600;
  fill: rgba(107, 114, 128, 1);
  text-anchor: middle;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.endurance-ring,
.emotion-glow,
.emotion-point {
  transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Metrics Grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.metric-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(31, 41, 55, 0.5);
  border-radius: 0.75rem;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.metric-header {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.metric-icon {
  font-size: 1.25rem;
  filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.2));
}

.metric-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: rgba(156, 163, 175, 1);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.metric-value {
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif;
  transition: color 0.3s ease;
}

.metric-bar {
  height: 4px;
  background: rgba(75, 85, 99, 0.3);
  border-radius: 2px;
  overflow: hidden;
}

.metric-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s ease;
}

/* Mobile responsive */
@media (max-width: 640px) {
  .ave-wrapper {
    padding: 0.75rem;
    gap: 0.75rem;
  }
  
  .emotion-icon {
    font-size: 2rem;
  }
  
  .emotion-name {
    font-size: 1rem;
  }
  
  .emotion-badge {
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
  }
  
  .metrics-grid {
    gap: 0.5rem;
  }
  
  .metric-card {
    padding: 0.5rem;
    gap: 0.375rem;
  }
  
  .metric-icon {
    font-size: 1rem;
  }
  
  .metric-label {
    font-size: 0.65rem;
  }
  
  .metric-value {
    font-size: 1.5rem;
  }
}

/* Tablet */
@media (max-width: 768px) and (min-width: 641px) {
  .metrics-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
