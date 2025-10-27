<template>
  <div class="ecg-graph-wrapper" :style="{ alignItems: verticalAlignClass }">
<canvas ref="canvasRef" :class="['ecg-canvas', `canvas-align-${props.verticalAlign}`]" :style="{ transform: `translateY(${props.offset}px)` }" />
    
    <!-- BPM Display - Style Apple Watch -->
    <div class="bpm-overlay">
      <div class="bpm-value" :class="{ 'bpm-danger': bpm >= 200 }">{{ bpm }}</div>
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
import * as ble from '@/utils/bleKemo.js'
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
    default: false
  },
  // Position verticale du graphique dans le widget
  verticalAlign: {
    type: String,
    default: 'center',
    validator: (value) => ['top', 'center', 'bottom'].includes(value)
  }
  ,
  // Vertical offset in px to nudge the canvas downwards (positive => down)
  offset: {
    type: Number,
    default: 0
  },
  // Raw mode: skip smoothing and normalization to show direct ADC values
  rawMode: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:sampleCount', 'update:bpm'])

// ============================================================================
// STATE
// ============================================================================

const canvasRef = ref(null)
const bpm = ref(0)  // Initialisé à 0, sera mis à jour par la détection
const sampleCount = ref(0)
const devicePixelRatio = getOptimalDevicePixelRatio()

// Track if we're receiving data
let lastDataTime = Date.now() // Init to now to give time for first data
const NO_DATA_TIMEOUT = 3000 // 3 secondes sans données = pas de signal
let hasReceivedDataOnce = false // Track if we ever received data

// Track last BPM detection time
let lastBpmDetectionTime = 0
const BPM_TIMEOUT = 5000 // 5 secondes sans détection de BPM = remettre à 0

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

// Align-self pour empêcher le canvas de s'étirer et permettre un positionnement bas
const verticalAlignSelf = computed(() => {
  const selfMap = {
    'top': 'flex-start',
    'center': 'center',
    'bottom': 'flex-end'
  }
  return selfMap[props.verticalAlign] || 'center'
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
  
  // Check if we have data
  const hasData = rawData.length >= 2
  
  // We have data - update last data time and mark as received
  if (hasData) {
    lastDataTime = Date.now()
    if (!hasReceivedDataOnce) {
      hasReceivedDataOnce = true
    }
  }
  
  // Only show "no data" if we're in real mode AND either:
  // - Never received data and enough time has passed (3s grace period)
  // - Received data before but timeout exceeded
  const timeSinceStart = Date.now() - lastDataTime
  const noDataDetected = !props.simulation && (
    (!hasReceivedDataOnce && timeSinceStart > NO_DATA_TIMEOUT) ||
    (hasReceivedDataOnce && !hasData && timeSinceStart > NO_DATA_TIMEOUT)
  )
  
  // Handle no data: show flat line + 0 BPM
  if (noDataDetected) {
    // Generate flat line (baseline at 0)
    const flatLine = new Float32Array(samplesNeeded)
    flatLine.fill(0)
    renderer.render(flatLine)
    
    // Display 0 BPM
    if (bpm.value !== 0) {
      bpm.value = 0
      emit('update:bpm', 0)
    }
    sampleCount.value = 0
    emit('update:sampleCount', 0)
    return
  }
  
  // Handle empty data (simulation mode)
  if (rawData.length < 2) {
    renderer.clear()
    return
  }
  
  // Update sample count
  sampleCount.value = rawData.length
  emit('update:sampleCount', rawData.length)
  
  // Prepare data for detection: apply moderate pre-filter in rawMode to reduce false positives
  let detectionData = rawData
  if (props.rawMode) {
    // Apply moderate smoothing for detection only (preserve visual raw display)
    // Window of 3 samples to reduce noise without over-smoothing
    detectionData = movingAverage(new Float32Array(rawData), 3)
  }

  // Detect heartbeat and update BPM (pass sample rate)
  const detectedBpm = heartbeat.detect(Array.from(detectionData), ECG_CONFIG.DEFAULT_SAMPLE_RATE)
  if (detectedBpm) {
    // Prefer averaged BPM if available for stability
    const avg = heartbeat.getAverageBpm()
    const displayBpm = avg || detectedBpm
    bpm.value = displayBpm
    emit('update:bpm', displayBpm)
    lastBpmDetectionTime = Date.now()
  } else {
    // Si pas de détection depuis BPM_TIMEOUT, remettre à 0
    const timeSinceLastBpm = Date.now() - lastBpmDetectionTime
    if (timeSinceLastBpm > BPM_TIMEOUT && bpm.value !== 0) {
      bpm.value = 0
      emit('update:bpm', 0)
    }
  }
  
  // Process signal
  let processedData = rawData
  
  if (props.rawMode) {
    // Mode RAW: pas de lissage, pas de normalisation
    // Conversion directe en Float32Array pour le rendu
    processedData = new Float32Array(rawData)
  } else {
    // Mode FILTERED: lissage + normalisation
    if (props.smoothing > 1) {
      processedData = movingAverage(new Float32Array(rawData), props.smoothing)
    }
    
    // Normalize data
    processedData = normalize(
      new Float32Array(processedData), 
      ECG_CONFIG.NORMALIZATION_RANGE.min, 
      ECG_CONFIG.NORMALIZATION_RANGE.max
    )
  }
  
  // Validate and render
  if (!processedData || processedData.length < 2) {
    renderer.clear()
    return
  }
  
  renderer.render(processedData)
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
    hasReceivedDataOnce = true
    lastDataTime = Date.now() // Mark as receiving data in simulation
  } else {
    // Real mode: give grace period for BLE connection
    lastDataTime = Date.now()
    hasReceivedDataOnce = false
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
  bpm.value = 0
  lastBpmDetectionTime = 0
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
  height: auto; /* let canvas size be intrinsic and not fill parent */
  max-height: 100%;
  flex: 0 0 auto; /* prevent automatic stretching */
  align-self: center; /* default center */
}

/* Helper classes for vertical alignment using margins so canvas can be pushed down */
.canvas-align-top { margin-bottom: auto; }
.canvas-align-center { margin: auto 0; }
.canvas-align-bottom { margin-top: auto; }

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

