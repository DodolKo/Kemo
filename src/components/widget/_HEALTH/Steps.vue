<template>
  <AppWidget variant="compact" size="lg" :width="2" :height="1">
    <div class="steps-wrapper">
      <div class="steps-header">
        <div class="header-left">
          <div class="header-icon">👣</div>
          <div class="header-text">
            <div class="header-title">Steps</div>
            <div class="header-subtitle">Daily Activity</div>
          </div>
        </div>
        <div class="goal-badge" :style="{ background: getGoalGradient() }">
          {{ progressPercent }}%
        </div>
      </div>
      
      <div class="steps-content">
        <!-- Main step count -->
        <div class="steps-main">
          <div class="steps-value" :style="{ color: getColor(steps) }">
            {{ steps.toLocaleString() }}
          </div>
          <div class="steps-goal">/ {{ goal.toLocaleString() }} goal</div>
        </div>
        
        <!-- Progress ring -->
        <div class="progress-ring-container">
          <svg class="progress-ring-svg" viewBox="0 0 120 120">
            <!-- Background circle -->
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="rgba(75, 85, 99, 0.2)"
              stroke-width="8"
            />
            
            <!-- Progress circle -->
            <circle
              class="progress-circle"
              cx="60"
              cy="60"
              r="52"
              fill="none"
              :stroke="getColor(steps)"
              stroke-width="8"
              stroke-linecap="round"
              :stroke-dasharray="ringCircumference"
              :stroke-dashoffset="ringDashOffset"
              transform="rotate(-90 60 60)"
              :style="{ filter: getRingGlow() }"
            />
            
            <!-- Center icon -->
            <text x="60" y="70" class="ring-icon">🎯</text>
          </svg>
        </div>
      </div>
      
      <!-- Stats grid -->
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-icon">📏</div>
          <div class="stat-info">
            <div class="stat-value">{{ distance }} km</div>
            <div class="stat-label">Distance</div>
          </div>
        </div>
        
        <div class="stat-item">
          <div class="stat-icon">🔥</div>
          <div class="stat-info">
            <div class="stat-value">{{ calories }} kcal</div>
            <div class="stat-label">Calories</div>
          </div>
        </div>
        
        <div class="stat-item">
          <div class="stat-icon">⏱️</div>
          <div class="stat-info">
            <div class="stat-value">{{ activeMinutes }} min</div>
            <div class="stat-label">Active</div>
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
  autoStart: { type: Boolean, default: true },
  dailyGoal: { type: Number, default: 10000 }
})

const steps = ref(6543)
const goal = ref(props.dailyGoal)
const ringRadius = 52
const ringCircumference = 2 * Math.PI * ringRadius

let intervalId = null

const progressPercent = computed(() => Math.min(100, Math.round((steps.value / goal.value) * 100)))

const distance = computed(() => {
  // Average step length ~0.76m
  return ((steps.value * 0.76) / 1000).toFixed(2)
})

const calories = computed(() => {
  // Approximate: 0.04 kcal per step
  return Math.round(steps.value * 0.04)
})

const activeMinutes = computed(() => {
  // Average 100 steps per minute
  return Math.round(steps.value / 100)
})

const ringDashOffset = computed(() => {
  const progress = Math.min(1, steps.value / goal.value)
  return ringCircumference * (1 - progress)
})

function getColor(value) {
  const percent = (value / goal.value) * 100
  if (percent >= 100) return '#10b981' // Goal reached
  if (percent >= 75) return '#34d399' // Almost there
  if (percent >= 50) return '#3b82f6' // Halfway
  if (percent >= 25) return '#f59e0b' // Getting started
  return '#ef4444' // Just starting
}

function getGoalGradient() {
  const color = getColor(steps.value)
  return `linear-gradient(135deg, ${color}60, ${color}30)`
}

function getRingGlow() {
  const color = getColor(steps.value)
  return `drop-shadow(0 0 6px ${color}) drop-shadow(0 0 10px ${color}60)`
}

function simulateData() {
  // Add steps gradually
  steps.value = Math.min(goal.value + 2000, steps.value + Math.round(Math.random() * 50))
}

function start() {
  if (intervalId) return
  steps.value = Math.round(Math.random() * 8000)
  
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
  steps: computed(() => steps.value),
  addSteps: (count) => steps.value = Math.min(50000, steps.value + count),
  reset: () => steps.value = 0
})
</script>

<style scoped>
.steps-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 1rem;
  gap: 0.75rem;
}

.steps-header {
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

.header-icon {
  font-size: 2rem;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.3));
}

.header-text {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.header-title {
  font-size: 1rem;
  font-weight: 700;
  color: rgba(243, 244, 246, 1);
  letter-spacing: -0.01em;
}

.header-subtitle {
  font-size: 0.7rem;
  font-weight: 500;
  color: rgba(156, 163, 175, 1);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.goal-badge {
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 700;
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif;
  backdrop-filter: blur(10px);
  transition: background 0.3s ease;
}

.steps-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 0;
}

.steps-main {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.steps-value {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif;
  letter-spacing: -0.02em;
  transition: color 0.3s ease;
}

.steps-goal {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(156, 163, 175, 1);
}

.progress-ring-container {
  flex-shrink: 0;
}

.progress-ring-svg {
  width: 120px;
  height: 120px;
}

.progress-circle {
  transition: stroke-dashoffset 0.8s ease, stroke 0.3s ease, filter 0.3s ease;
}

.ring-icon {
  font-size: 32px;
  text-anchor: middle;
  dominant-baseline: middle;
  filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.3));
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: rgba(31, 41, 55, 0.5);
  border-radius: 0.5rem;
}

.stat-icon {
  font-size: 1.25rem;
  filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.2));
}

.stat-info {
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
  .steps-wrapper {
    padding: 0.75rem;
    gap: 0.5rem;
  }
  
  .header-icon {
    font-size: 1.5rem;
  }
  
  .header-title {
    font-size: 0.875rem;
  }
  
  .goal-badge {
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
  }
  
  .steps-value {
    font-size: 2rem;
  }
  
  .progress-ring-svg {
    width: 100px;
    height: 100px;
  }
  
  .stats-grid {
    gap: 0.375rem;
  }
  
  .stat-item {
    padding: 0.375rem;
  }
  
  .stat-icon {
    font-size: 1rem;
  }
}
</style>

