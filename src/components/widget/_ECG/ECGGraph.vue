<template>
  <div class="ecg-graph-wrapper">
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
  sampleRate: {
    type: Number,
    default: ECG_CONFIG.DEFAULT_SAMPLE_RATE
  },
  running: {
    type: Boolean,
    default: false
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

// Canvas renderer
let renderer = null
let animationFrameId = null

// Mode par passes supprimé: le rendu utilise uniquement le temps réel

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
  const samplesNeeded = Math.floor(props.seconds * props.sampleRate)
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
  if (props.running) {
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

watch(() => props.running, (isRunning) => {
  if (isRunning) {
    startRendering()
  } else {
    stopRendering()
  }
})

// ============================================================================
// LIFECYCLE HOOKS
// ============================================================================

onMounted(() => {
  if (props.running) {
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
  min-height: 450px;
  background: transparent;
  overflow: hidden;
}

.ecg-canvas {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 450px;
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
  font-size: 5rem;
  font-weight: 700;
  line-height: 0.9;
  color: #10b981;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif;
  letter-spacing: -0.03em;
  text-shadow: 
    0 0 30px rgba(16, 185, 129, 0.7),
    0 0 60px rgba(16, 185, 129, 0.4),
    0 2px 4px rgba(0, 0, 0, 0.3);
}

.bpm-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(156, 163, 175, 1);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  opacity: 0.9;
}

/* Responsive - Beaucoup plus grand sur mobile */
@media (max-width: 768px) {
  .ecg-graph-wrapper {
    min-height: 550px;
  }
  
  .ecg-canvas {
    min-height: 550px;
  }
  
  .bpm-value {
    font-size: 6rem;
  }
  
  .bpm-label {
    font-size: 1rem;
  }
}

/* Énorme sur petits écrans pour visibilité maximale */
@media (max-width: 640px) {
  .ecg-graph-wrapper {
    min-height: 600px;
  }
  
  .ecg-canvas {
    min-height: 600px;
  }
  
  .bpm-value {
    font-size: 7rem;
  }
  
  .bpm-label {
    font-size: 1.125rem;
  }
}
</style>

