<template>
  <div class="ecg-graph-wrapper" :style="{ alignItems: verticalAlignClass }">
    <canvas ref="canvasRef" class="ecg-canvas" />
    
    <!-- BPM Display - Style Apple Watch -->
    <div class="bpm-overlay">
      <div class="bpm-value">{{ bpm }}</div>
      <div class="bpm-label">BPM</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useECGStore } from '@/stores/ecg'
import { createECGMock } from '@/services/ecgMock'
import { useHeartbeatDetection } from '@/composables/useHeartbeatDetection'
import { useCanvasRenderer } from '@/composables/useCanvasRenderer'
import { movingAverage, normalize } from '@/utils/signal'
import { 
  ECG_CONFIG, 
  HEARTBEAT_CONFIG, 
  RENDER_CONFIG,
  getOptimalDevicePixelRatio 
} from '@/config/ecg.config'

// ============================================================================
// PROPS & EMITS
// ============================================================================

const props = defineProps({
  // Props alignées sur ECG.vue
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
    default: RENDER_CONFIG.AMPLITUDE
  },
  autoStart: {
    type: Boolean,
    default: false
  },
  // Active la simulation interne (mock). Si false, on attend des données externes.
  simulation: {
    type: Boolean,
    default: true
  },
  // Position verticale du graphique dans le widget
  verticalAlign: {
    type: String,
    default: 'center',
    validator: (value) => ['top', 'center', 'bottom'].includes(value)
  }
})

const emit = defineEmits(['update:sampleCount', 'update:bpm'])

// ============================================================================
// STATE
// ============================================================================

const canvasRef = ref(null)
const bpm = ref(HEARTBEAT_CONFIG.TARGET_BPM)
const sampleCount = ref(0)
const devicePixelRatio = getOptimalDevicePixelRatio()

// ============================================================================
// COMPOSABLES
// ============================================================================

const store = useECGStore()

// Heartbeat detection with config from central config
const heartbeat = useHeartbeatDetection()

// Computed pour l'alignement vertical
const verticalAlignClass = computed(() => {
  const alignMap = {
    'top': 'flex-start',
    'center': 'center', 
    'bottom': 'flex-end'
  }
  return alignMap[props.verticalAlign] || 'center'
})

// Canvas renderer
let renderer = null
let animationFrameId = null
let isActive = false // contrôle interne du RAF
let mock = null // générateur mock si simulation

// ============================================================================
// RENDERING LOGIC
// ============================================================================

/**
 * Main rendering loop
 */
function renderFrame() {
  if (!renderer || !canvasRef.value) return
  
  // Resize canvas if needed
  renderer.resize(devicePixelRatio)
  
  // Rendu uniquement en mode temps réel
  renderRealtimeMode()
  
  // Schedule next frame
  scheduleNextFrame()
}

/**
 * Mode temps réel - Défilement continu (mode actuel)
 */
function renderRealtimeMode() {
  // Get ECG data from store
  const samplesNeeded = Math.floor(props.seconds * ECG_CONFIG.DEFAULT_SAMPLE_RATE)
  let rawData = store.snapshot(samplesNeeded)
  
  // Handle empty data
  if (rawData.length < 2) {
    renderer.clear()
    return
  }
  
  // Update sample count
  sampleCount.value = rawData.length
  emit('update:sampleCount', rawData.length)
  
  // Detect heartbeat and update BPM
  const detectedBpm = heartbeat.detect(rawData)
  if (detectedBpm) {
    bpm.value = detectedBpm
    emit('update:bpm', detectedBpm)
  }
  
  // Process signal
  if (props.smoothing > 1) {
    rawData = movingAverage(rawData, props.smoothing)
  }
  
  // Normalize data
  const normalizedData = normalize(
    new Float32Array(rawData), 
    ECG_CONFIG.NORMALIZATION_RANGE.min, 
    ECG_CONFIG.NORMALIZATION_RANGE.max
  )
  
  // Validate and render
  if (!normalizedData || normalizedData.length < 2) {
    renderer.clear()
    return
  }
  
  renderer.render(normalizedData)
}

// Mode médical supprimé

/**
 * Schedule next animation frame
 */
function scheduleNextFrame() {
  if (isActive) {
    animationFrameId = requestAnimationFrame(renderFrame)
  }
}

// ============================================================================
// LIFECYCLE MANAGEMENT
// ============================================================================

/**
 * Start rendering loop
 */
function startRendering() {
  if (!renderer && canvasRef.value) {
    renderer = useCanvasRenderer(canvasRef.value, {
      amplitude: props.amplitude
    })
    renderer.initialize()
  }
  
  // Démarrer la simulation si demandée
  if (props.simulation) {
    if (!mock) mock = createECGMock(ECG_CONFIG.DEFAULT_SAMPLE_RATE)
    // Indiquer que le stream est actif
    store.setRunning(true)
    mock.start((chunk) => store.push(chunk))
  }
  
  isActive = true
  scheduleNextFrame()
}

/**
 * Stop rendering loop
 */
function stopRendering() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
  // Stopper la simulation si active
  if (mock) {
    mock.stop()
  }
  store.setRunning(false)
  isActive = false
}

/**
 * Reset heartbeat detector
 */
function resetDetector() {
  heartbeat.reset()
  bpm.value = HEARTBEAT_CONFIG.TARGET_BPM
}

// ============================================================================
// WATCHERS
// ============================================================================

// Plus de watcher "running" ici; le parent peut appeler start/stop via expose

// ============================================================================
// LIFECYCLE HOOKS
// ============================================================================

onMounted(() => {
  if (props.autoStart) {
    startRendering()
  }
})

onBeforeUnmount(() => {
  stopRendering()
  renderer = null
})

// ============================================================================
// EXPOSE PUBLIC API
// ============================================================================

defineExpose({
  start: startRendering,
  stop: stopRendering,
  reset: resetDetector,
  sampleCount: computed(() => sampleCount.value),
  bpm: computed(() => bpm.value)
})
</script>

<style scoped>
.ecg-graph-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 0; /* allow parent/grid cell to control size */
  max-height: 100%;
  box-sizing: border-box;
  background: transparent;
  overflow: visible; /* allow BPM blur glow to extend outside */
  padding: 0.5rem; /* internal padding so graph doesn't touch edges */
  display: flex;
  justify-content: center;
  /* align-items sera défini dynamiquement via :style */
}

/* Canvas fills the wrapper; keep it non-absolute so renderer.resize reads correct dimensions */
.ecg-canvas {
  display: block;
  width: 100%;
  height: 100%;
  flex: 1 1 auto; /* allow canvas to fill flex container */
}

/* BPM Display - Typographie professionnelle */
.bpm-overlay {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.375rem;
  z-index: 10;
  pointer-events: none;
}

.bpm-value {
  font-size: 2.5rem; /* reduced size */
  font-weight: 700;
  line-height: 0.9;
  color: #10b981;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif;
  letter-spacing: -0.03em;
  /* Reduced bloom to prevent clipping - use filter instead of text-shadow for better overflow */
  filter: drop-shadow(0 0 12px rgba(16, 185, 129, 0.8))
          drop-shadow(0 0 24px rgba(16, 185, 129, 0.5))
          drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.bpm-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(156, 163, 175, 1);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  opacity: 0.9;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .bpm-value {
    font-size: 3rem;
  }
  .bpm-label {
    font-size: 0.875rem;
  }
}

@media (max-width: 640px) {
  .bpm-value {
    font-size: 3.5rem;
  }
  .bpm-label {
    font-size: 1.05rem;
  }
}
</style>

