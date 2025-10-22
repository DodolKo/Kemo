<template>
  <AppWidget variant="compact" size="lg" :width="2" :height="2">
    <!-- Header -->
    <template #header>
      <div class="flex items-center gap-2">
        <span class="mode-icon">{{ modeIcon }}</span>
        <h3 class="text-primary font-semibold text-sm">{{ modeTitle }}</h3>
      </div>
    </template>

    <!-- Timer Display -->
    <TimerDisplay
      ref="timerDisplayRef"
      :mode="initialMode"
      @update:time="handleTimeUpdate"
      @timer:complete="handleTimerComplete"
      @mode:changed="handleModeChange"
    />

    <!-- Footer -->
    <template #footer>
      <div class="timer-footer">
        <div class="footer-stat">
          <span class="footer-label">Status</span>
          <span class="footer-value" :class="statusClass">{{ status }}</span>
        </div>
        <span class="text-muted text-xs ml-auto">{{ currentMode }}</span>
      </div>
    </template>
  </AppWidget>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppWidget from '@/components/ui/AppWidget.vue'
import TimerDisplay from './TimerDisplay.vue'

// ============================================================================
// PROPS
// ============================================================================

const props = defineProps({
  initialMode: {
    type: String,
    default: 'stopwatch',
    validator: (value) => ['stopwatch', 'countdown'].includes(value)
  }
})

// ============================================================================
// STATE
// ============================================================================

const timerDisplayRef = ref(null)
const currentMode = ref(props.initialMode)
const status = ref('Ready')
const lastTime = ref(null)
const isComplete = ref(false)

// ============================================================================
// COMPUTED
// ============================================================================

const modeIcon = computed(() => {
  return currentMode.value === 'stopwatch' ? '⏱️' : '⏲️'
})

const modeTitle = computed(() => {
  return currentMode.value === 'stopwatch' ? 'Stopwatch' : 'Countdown Timer'
})

const statusClass = computed(() => {
  if (isComplete.value) return 'status-complete'
  if (status.value === 'Running') return 'status-running'
  return 'status-ready'
})

// ============================================================================
// METHODS
// ============================================================================

function handleTimeUpdate(data) {
  lastTime.value = data
  status.value = 'Running'
  isComplete.value = false
}

function handleTimerComplete(data) {
  status.value = 'Complete!'
  isComplete.value = true
  
  // Notification sonore (optionnelle)
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Timer Complete!', {
      body: `Your ${data.mode} has finished.`
    })
  }
}

function handleModeChange(newMode) {
  currentMode.value = newMode
  status.value = 'Ready'
  isComplete.value = false
}

// ============================================================================
// EXPOSE
// ============================================================================

defineExpose({
  start: () => timerDisplayRef.value?.start(),
  pause: () => timerDisplayRef.value?.pause(),
  reset: () => timerDisplayRef.value?.reset(),
  getTimerRef: () => timerDisplayRef.value
})
</script>

<style scoped>
/* Footer */
.timer-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.footer-stat {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.footer-label {
  font-size: 0.75rem;
  line-height: 1rem;
  color: rgb(156, 163, 175);
}

.footer-value {
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 600;
}

.status-ready {
  color: rgb(156, 163, 175);
}

.status-running {
  color: rgb(16, 185, 129);
  animation: pulse-status 2s ease-in-out infinite;
}

.status-complete {
  color: rgb(59, 130, 246);
}

@keyframes pulse-status {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.mode-icon {
  font-size: 1rem;
}

/* Utility classes */
.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.gap-2 {
  gap: 0.5rem;
}

.text-primary {
  color: rgb(229, 231, 235);
}

.text-muted {
  color: rgb(156, 163, 175);
}

.font-semibold {
  font-weight: 600;
}

.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.text-xs {
  font-size: 0.75rem;
  line-height: 1rem;
}

.ml-auto {
  margin-left: auto;
}
</style>

