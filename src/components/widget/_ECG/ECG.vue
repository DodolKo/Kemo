<template>
  <AppWidget variant="compact" size="xl">
    <!-- Header avec contrôles -->
    <template #header>
      <div class="flex items-center gap-2">
        <div v-if="running" class="status-indicator" />
        <h3 class="text-primary font-semibold text-sm">ECG Lead I</h3>
        <span class="text-muted text-xs">{{ sampleRate }}Hz</span>
      </div>
      
      <div class="flex items-center gap-2">
        <AppButton 
          :variant="running ? 'outline' : 'primary'" 
          size="xs"
          :text="running ? 'Pause' : 'Start'" 
          @click="toggleRunning"
        />
        <AppButton 
          variant="ghost" 
          size="xs"
          icon-only="XMarkIcon"
          @click="clearData"
          aria-label="Clear"
        />
      </div>
    </template>

    <!-- ECG Graph - Affichage centralisé -->
    <ECGGraph
      :seconds="seconds"
      :smoothing="smoothing"
      :amplitude="amplitude"
      :sample-rate="sampleRate"
      :running="running"
      @update:sample-count="handleSampleUpdate"
      @update:bpm="handleBpmUpdate"
    />

    <!-- Footer avec statistiques -->
    <template #footer>
      <div class="stat-item">
        <span class="stat-label">BPM</span>
        <span class="stat-value">{{ bpm }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Samples</span>
        <span class="stat-value">{{ sampleCount }}</span>
      </div>
      <span class="text-muted text-xs ml-auto">Demo</span>
    </template>
  </AppWidget>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import AppWidget from '@/components/ui/AppWidget.vue'
import AppButton from '@/components/ui/AppButton.vue'
import ECGGraph from '@/components/widget/_ECG/ECGGraph.vue'
import { useECGStore } from '@/stores/ecg'
import { createECGMock } from '@/services/ecgMock'
import { ECG_CONFIG, HEARTBEAT_CONFIG } from '@/config/ecg.config'

// ============================================================================
// PROPS
// ============================================================================

const props = defineProps({
  seconds: { 
    type: Number, 
    default: ECG_CONFIG.DEFAULT_DISPLAY_DURATION 
  },
  smoothing: { 
    type: Number, 
    default: ECG_CONFIG.DEFAULT_SMOOTHING 
  },
  amplitude: { 
    type: Number, 
    default: 0.35 
  },
  autoStart: {
    type: Boolean,
    default: false
  },
  
})

// ============================================================================
// STATE
// ============================================================================

const running = ref(false)
const bpm = ref(HEARTBEAT_CONFIG.TARGET_BPM)
const sampleCount = ref(0)

// ============================================================================
// ECG SYSTEM - Store & Mock
// ============================================================================

const store = useECGStore()
const mock = createECGMock(ECG_CONFIG.DEFAULT_SAMPLE_RATE)
const sampleRate = mock.sampleRate

// ============================================================================
// METHODS
// ============================================================================

/**
 * Démarre l'enregistrement ECG
 */
function start() {
  if (running.value) return
  
  running.value = true
  store.setRunning(true)
  mock.start((chunk) => store.push(chunk))
}

/**
 * Met en pause l'enregistrement ECG
 */
function pause() {
  running.value = false
  store.setRunning(false)
  mock.stop()
}

/**
 * Toggle entre start et pause
 */
function toggleRunning() {
  running.value ? pause() : start()
}

/**
 * Efface les données
 */
function clearData() {
  store.clear()
  sampleCount.value = 0
}

/**
 * Gestion de la mise à jour du nombre d'échantillons
 */
function handleSampleUpdate(count) {
  sampleCount.value = count
}

/**
 * Gestion de la mise à jour du BPM
 */
function handleBpmUpdate(newBpm) {
  bpm.value = newBpm
}

// ============================================================================
// LIFECYCLE
// ============================================================================

onMounted(() => {
  if (props.autoStart) {
    start()
  }
})

onBeforeUnmount(() => {
  pause()
})

// ============================================================================
// EXPOSE - API publique du composant
// ============================================================================

defineExpose({
  start,
  pause,
  toggle: toggleRunning,
  clear: clearData,
  isRunning: () => running.value,
  getCurrentBpm: () => bpm.value
})
</script>

<style scoped>
/* Indicateur de statut animé */
.status-indicator {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  background-color: rgb(34, 197, 94);
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Stats du footer */
.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.stat-label {
  font-size: 0.75rem;
  line-height: 1rem;
  color: rgb(156, 163, 175);
}

.stat-value {
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  color: rgb(17, 24, 39);
}
</style>

