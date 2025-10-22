<template>
  <AppWidget variant="compact" size="lg" :width="1" :height="2">
    <!-- Header -->
    <template #header>
      <div class="flex items-center gap-2">
        <h3 class="text-primary font-semibold text-sm">Weather</h3>
        <span class="text-muted text-xs">{{ location }}</span>
      </div>
      
      <div class="flex items-center gap-2">
        <button 
          class="refresh-btn"
          @click="refreshWeather"
          title="Refresh"
        >
          🔄
        </button>
      </div>
    </template>

    <!-- Weather Display -->
    <WeatherDisplay
      ref="weatherDisplayRef"
      :update-interval="updateInterval"
      :simulation="simulation"
      :location="location"
      @update:weather="handleWeatherUpdate"
    />

    <!-- Footer -->
    <template #footer>
      <div class="weather-footer">
        <div class="footer-info">
          <span class="footer-label">Last Update</span>
          <span class="footer-value">{{ lastUpdate }}</span>
        </div>
        <span class="text-muted text-xs ml-auto">Demo</span>
      </div>
    </template>
  </AppWidget>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppWidget from '@/components/ui/AppWidget.vue'
import WeatherDisplay from './WeatherDisplay.vue'

// ============================================================================
// PROPS
// ============================================================================

const props = defineProps({
  location: {
    type: String,
    default: 'Paris, FR'
  },
  updateInterval: {
    type: Number,
    default: 300000 // 5 minutes
  },
  simulation: {
    type: Boolean,
    default: true
  }
})

// ============================================================================
// STATE
// ============================================================================

const weatherDisplayRef = ref(null)
const lastUpdateTime = ref(new Date())
const currentWeather = ref(null)

// ============================================================================
// COMPUTED
// ============================================================================

const lastUpdate = computed(() => {
  return lastUpdateTime.value.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
})

// ============================================================================
// METHODS
// ============================================================================

function refreshWeather() {
  if (weatherDisplayRef.value) {
    weatherDisplayRef.value.refresh()
    lastUpdateTime.value = new Date()
  }
}

function handleWeatherUpdate(weather) {
  currentWeather.value = weather
  lastUpdateTime.value = new Date()
}

// ============================================================================
// EXPOSE
// ============================================================================

defineExpose({
  refresh: refreshWeather,
  getCurrentWeather: () => currentWeather.value
})
</script>

<style scoped>
/* Bouton refresh */
.refresh-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  font-size: 0.875rem;
  border-radius: 0.375rem;
  background: rgba(75, 85, 99, 0.3);
  border: 1px solid rgba(75, 85, 99, 0.5);
  cursor: pointer;
  transition: all 0.2s ease;
}

.refresh-btn:hover {
  background: rgba(75, 85, 99, 0.5);
  border-color: rgba(156, 163, 175, 0.5);
  transform: rotate(180deg);
}

.refresh-btn:active {
  transform: rotate(180deg) scale(0.95);
}

/* Footer */
.weather-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.footer-info {
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
  font-weight: 500;
  color: rgb(229, 231, 235);
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

