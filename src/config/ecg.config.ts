/**
 * Configuration centralisée pour le système ECG
 */

// ============================================================================
// SIGNAL CONFIGURATION
// ============================================================================

export const ECG_CONFIG = {
  // Fréquence d'échantillonnage par défaut (Hz)
  DEFAULT_SAMPLE_RATE: 250,
  
  // Durée d'affichage par défaut (secondes) - Pour 3 battements clairs à 95 BPM
  DEFAULT_DISPLAY_DURATION: 2.5,
  
  // Lissage par défaut (1 = pas de lissage)
  DEFAULT_SMOOTHING: 1,
  
  // Plage de normalisation du signal - Pas de compression, juste clipping
  NORMALIZATION_RANGE: {
    min: -1.5,
    max: 1.5
  }
} as const

// ============================================================================
// HEARTBEAT DETECTION
// ============================================================================

export const HEARTBEAT_CONFIG = {
  // Seuil de détection des pics R (0-1)
  PEAK_THRESHOLD: 0.7,
  
  // Intervalle minimum entre battements (ms)
  MIN_INTERVAL_MS: 200,
  
  // Taille maximale de l'historique
  MAX_HISTORY_SIZE: 5,
  
  // Plage de BPM valide
  BPM_RANGE: {
    min: 60,
    max: 140
  },
  
  // BPM cible pour le générateur mock
  TARGET_BPM: 95
} as const

// ============================================================================
// RENDERING CONFIGURATION
// ============================================================================

export const RENDER_CONFIG = {
  // Style de ligne
  LINE: {
    width: 2.5,
    color: '#10b981',
    cap: 'round',
    join: 'round'
  },
  
  // Effet de lueur
  GLOW: {
    intensity: 12,
    color: '#10b981'
  },
  
  // Amplitude du signal (pourcentage de la hauteur) - Grande pour visibilité
  AMPLITUDE: 0.35,
  
  // Couleur de fond - Transparent
  BACKGROUND_COLOR: 'transparent',
  
  // Hauteurs minimales - Augmentées pour mobile
  MIN_HEIGHT: {
    desktop: 450,
    tablet: 550,
    mobile: 600
  }
} as const

// ============================================================================
// BPM DISPLAY
// ============================================================================

export const BPM_DISPLAY_CONFIG = {
  // Position
  POSITION: {
    top: '1rem',
    right: '1rem'
  },
  
  // Style - Typographie professionnelle
  STYLE: {
    valueColor: '#10b981',
    labelColor: 'rgba(156, 163, 175, 1)',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif",
    fontWeight: '700',
    letterSpacing: '-0.03em'
  },
  
  // Tailles de police - Plus grandes pour mobile
  FONT_SIZE: {
    desktop: {
      value: '5rem',
      label: '0.875rem'
    },
    tablet: {
      value: '6rem',
      label: '1rem'
    },
    mobile: {
      value: '7rem',
      label: '1.125rem'
    }
  },
  
  // Effets de texte
  TEXT_SHADOW: [
    '0 0 30px rgba(16, 185, 129, 0.7)',
    '0 0 60px rgba(16, 185, 129, 0.4)',
    '0 2px 4px rgba(0, 0, 0, 0.3)'
  ]
} as const

// ============================================================================
// PERFORMANCE
// ============================================================================

export const PERFORMANCE_CONFIG = {
  // Options du contexte Canvas
  CANVAS_CONTEXT_OPTIONS: {
    alpha: false,
    desynchronized: true
  },
  
  // Frame rate cible (0 = utiliser requestAnimationFrame)
  TARGET_FPS: 0,
  
  // Device pixel ratio max (pour limiter sur écrans haute résolution)
  MAX_DEVICE_PIXEL_RATIO: 2
} as const

// ============================================================================
// MOCK GENERATOR
// ============================================================================

export const MOCK_CONFIG = {
  // BPM du générateur
  BPM: HEARTBEAT_CONFIG.TARGET_BPM,
  
  // Fréquence d'échantillonnage
  SAMPLE_RATE: ECG_CONFIG.DEFAULT_SAMPLE_RATE,
  
  // Taille des chunks
  CHUNK_SIZE: 20,
  
  // Amplitude des composants de l'onde
  WAVE_AMPLITUDES: {
    p: 0.08,    // Onde P (contraction atriale)
    q: -0.3,    // Onde Q
    r: 1.2,     // Onde R (pic principal)
    s: -0.4,    // Onde S
    t: 0.3      // Onde T (repolarisation ventriculaire)
  },
  
  // Phases temporelles (pourcentage du cycle)
  WAVE_PHASES: {
    p: { start: 0, end: 0.08 },
    q: { start: 0.12, end: 0.15 },
    r: { start: 0.15, end: 0.18 },
    s: { start: 0.18, end: 0.21 },
    t: { start: 0.28, end: 0.45 }
  },
  
  // Bruit du signal
  NOISE_LEVEL: 0.008
} as const

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Obtient le device pixel ratio avec limite
 */
export function getOptimalDevicePixelRatio(): number {
  const dpr = window.devicePixelRatio || 1
  return Math.min(dpr, PERFORMANCE_CONFIG.MAX_DEVICE_PIXEL_RATIO)
}

/**
 * Calcule la période en secondes à partir du BPM
 */
export function bpmToPeriod(bpm: number): number {
  return 60 / bpm
}

/**
 * Calcule le BPM à partir de l'intervalle en millisecondes
 */
export function intervalToBpm(intervalMs: number): number {
  return Math.round(60000 / intervalMs)
}

/**
 * Valide si un BPM est dans la plage acceptable
 */
export function isValidBpm(bpm: number): boolean {
  return bpm >= HEARTBEAT_CONFIG.BPM_RANGE.min && 
         bpm <= HEARTBEAT_CONFIG.BPM_RANGE.max
}

