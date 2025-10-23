<template>
  <div class="spo2-graph-wrapper" :style="{ alignItems: verticalAlignClass }">
  <canvas ref="canvasRef" :class="['spo2-canvas', `canvas-align-${props.verticalAlign}`]" :style="{ transform: `translateY(${props.offset}px)` }" />
    
    <!-- SpO2 Display - Style Apple Watch médical -->
    <div class="spo2-overlay">
      <div class="spo2-value" :style="{ color: spo2Color, filter: spo2Glow }">
        {{ displaySpO2 }}
      </div>
      <div class="spo2-label">SpO₂ %</div>
      
      <!-- Pulse Rate intentionally removed: ECG handles BPM -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useSpO2Store } from '@/stores/spo2'
import { createSpO2Mock } from '@/services/spo2Mock'
import { useCanvasRenderer } from '@/composables/useCanvasRenderer'
import { movingAverage, normalize } from '@/utils/signal'
import { 
  SPO2_CONFIG,
  SPO2_RENDER_CONFIG,
  getSpO2Color,
  getOptimalDevicePixelRatio
} from '@/config/spo2.config'

// ============================================================================
// PROPS & EMITS
// ============================================================================

const props = defineProps({
  // Durée d'affichage (secondes)
  seconds: { 
    type: Number, 
    default: SPO2_CONFIG.DEFAULT_DISPLAY_DURATION
  },
  // Lissage du signal
  smoothing: { 
    type: Number, 
    default: SPO2_CONFIG.DEFAULT_SMOOTHING
  },
  // Amplitude du graphique
  amplitude: {
    type: Number,
    default: SPO2_RENDER_CONFIG.AMPLITUDE
  },
  // Démarrage automatique
  autoStart: {
    type: Boolean,
    default: false
  },
  // Mode simulation
  simulation: {
    type: Boolean,
    default: true
  },
  // Position verticale
  verticalAlign: {
    type: String,
    default: 'center',
    validator: (value: string) => ['top', 'center', 'bottom'].includes(value)
  },
  // showPulse removed - ECG handles BPM
  // Vertical offset in px to nudge the canvas downwards (positive => down)
  offset: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update:sampleCount', 'update:spo2'])

// ============================================================================
// STATE
// ============================================================================

const canvasRef = ref<HTMLCanvasElement | null>(null)
const displaySpO2 = ref(98)
// pulseRate removed - ECG will provide BPM
const sampleCount = ref(0)
const devicePixelRatio = getOptimalDevicePixelRatio()

// ============================================================================
// COMPOSABLES & STORES
// ============================================================================

const store = useSpO2Store()

// Pulse detection removed; ECG handles BPM

// Couleur dynamique selon SpO2
const spo2Color = computed(() => getSpO2Color(displaySpO2.value))

// Effet de lueur
const spo2Glow = computed(() => {
  const color = spo2Color.value
  return `drop-shadow(0 0 12px ${color}) drop-shadow(0 0 24px ${color}80) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))`
})

// Alignement vertical
const verticalAlignClass = computed(() => {
  const alignMap = {
    'top': 'flex-start',
    'center': 'center', 
    'bottom': 'flex-end'
  }
  return alignMap[props.verticalAlign] || 'center'
})

// Canvas renderer
let renderer: any = null
let animationFrameId: number | null = null
let isActive = false
let mock: any = null

// ============================================================================
// RENDERING LOGIC
// ============================================================================

/**
 * Boucle de rendu principale
 */
function renderFrame() {
  if (!renderer || !canvasRef.value) return
  
  // Resize si nécessaire
  renderer.resize(devicePixelRatio)
  
  // Rendu du signal PPG
  renderPPGSignal()
  
  // Frame suivante
  scheduleNextFrame()
}

/**
 * Rendu du signal PPG en temps réel
 */
function renderPPGSignal() {
  // Récupère les données PPG du store
  const samplesNeeded = Math.floor(props.seconds * SPO2_CONFIG.DEFAULT_SAMPLE_RATE)
  let rawData = store.snapshotPPG(samplesNeeded)
  
  // Gestion données vides
  if (rawData.length < 2) {
    renderer.clear()
    return
  }
  
  // Mise à jour du compteur
  sampleCount.value = rawData.length
  emit('update:sampleCount', rawData.length)
  
  // BPM detection removed: ECG handles heart rate detection
  
  // Traitement du signal
  if (props.smoothing > 1) {
    rawData = movingAverage(rawData, props.smoothing)
  }
  
  // Normalisation
  const normalizedData = normalize(
    new Float32Array(rawData), 
    SPO2_CONFIG.NORMALIZATION_RANGE.min, 
    SPO2_CONFIG.NORMALIZATION_RANGE.max
  )
  
  // Validation et rendu
  if (!normalizedData || normalizedData.length < 2) {
    renderer.clear()
    return
  }
  
  renderer.render(normalizedData)
}

/**
 * Planifie la prochaine frame
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
 * Démarre le rendu
 */
function startRendering() {
  if (!renderer && canvasRef.value) {
    renderer = useCanvasRenderer(canvasRef.value, {
      amplitude: props.amplitude,
      lineColor: SPO2_RENDER_CONFIG.LINE.color,
      lineWidth: SPO2_RENDER_CONFIG.LINE.width,
      glowIntensity: SPO2_RENDER_CONFIG.GLOW.intensity
    })
    renderer.initialize()
  }
  
  // Démarrer la simulation si demandée
  if (props.simulation) {
    if (!mock) mock = createSpO2Mock(SPO2_CONFIG.DEFAULT_SAMPLE_RATE)
    
    store.setRunning(true)
    
    mock.start((data: any) => {
      // Pousse le signal PPG dans le store
      store.pushPPG(data.ppgSignal)
      
      // Met à jour la valeur SpO2
      displaySpO2.value = Math.round(data.spo2Value)
      store.updateSpO2(data.spo2Value)
      emit('update:spo2', data.spo2Value)
    })
  }
  
  isActive = true
  scheduleNextFrame()
}

/**
 * Arrête le rendu
 */
function stopRendering() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
  
  if (mock) {
    mock.stop()
  }
  
  store.setRunning(false)
  isActive = false
}

/**
 * Reset le détecteur
 */
function resetDetector() {
  // Pulse detection removed; ECG is responsible for BPM
}

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
  spo2: computed(() => displaySpO2.value),
  // pulse removed from expose; ECG provides BPM
})
</script>

<style scoped>
.spo2-graph-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 0;
  max-height: 100%;
  box-sizing: border-box;
  background: transparent;
  overflow: visible;
  padding: 0.5rem;
  display: flex;
  justify-content: center;
}

.spo2-canvas {
  display: block;
  width: 100%;
  height: auto; /* let canvas size be intrinsic and not fill parent */
  max-height: 100%;
  flex: 0 0 auto;
}

.canvas-align-top { margin-bottom: auto; }
.canvas-align-center { margin: auto 0; }
.canvas-align-bottom { margin-top: auto; }

/* SpO2 Display - Typographie professionnelle médicale */
.spo2-overlay {
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

.spo2-value {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 0.9;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif;
  letter-spacing: -0.03em;
  transition: color 0.3s ease;
}

.spo2-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(156, 163, 175, 1);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  opacity: 0.9;
}

/* Pulse Display */
.pulse-display {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(75, 85, 99, 0.3);
}

.pulse-icon {
  font-size: 1rem;
  animation: heartbeat 1.2s ease-in-out infinite;
}

@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  10% { transform: scale(1.2); }
  20% { transform: scale(1); }
}

.pulse-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ef4444;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif;
}

.pulse-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: rgba(156, 163, 175, 1);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .spo2-value {
    font-size: 3rem;
  }
  .spo2-label {
    font-size: 0.875rem;
  }
  .pulse-value {
    font-size: 1.5rem;
  }
}

@media (max-width: 640px) {
  .spo2-value {
    font-size: 3.5rem;
  }
  .spo2-label {
    font-size: 1.05rem;
  }
  .pulse-value {
    font-size: 1.75rem;
  }
}
</style>
