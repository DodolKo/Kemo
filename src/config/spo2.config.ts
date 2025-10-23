/**
 * Configuration centralisée pour le système SpO2 (Oxymètre de pouls)
 * Architecture médicale professionnelle
 */

// ============================================================================
// SIGNAL CONFIGURATION - PPG (Photoplethysmogram)
// ============================================================================

export const SPO2_CONFIG = {
  // Fréquence d'échantillonnage (Hz) - Typique pour PPG
  DEFAULT_SAMPLE_RATE: 100,
  
  // Durée d'affichage par défaut (secondes) - Pour voir ~3 battements
  DEFAULT_DISPLAY_DURATION: 3.0,
  
  // Lissage par défaut (1 = pas de lissage)
  DEFAULT_SMOOTHING: 2,
  
  // Plage de normalisation du signal PPG
  NORMALIZATION_RANGE: {
    min: -0.5,
    max: 1.5
  },
  
  // Plage normale de SpO2 (%)
  SPO2_RANGE: {
    min: 70,
    max: 100,
    normal_min: 95,
    normal_max: 100
  }
} as const

// ============================================================================
// PULSE DETECTION
// ============================================================================

export const PULSE_CONFIG = {
  // Seuil de détection des pics (0-1)
  PEAK_THRESHOLD: 0.6,
  
  // Intervalle minimum entre battements (ms)
  MIN_INTERVAL_MS: 400,
  
  // Taille maximale de l'historique
  MAX_HISTORY_SIZE: 5,
  
  // Plage de BPM valide (via pulse)
  BPM_RANGE: {
    min: 50,
    max: 150
  },
  
  // BPM cible pour le générateur mock
  TARGET_BPM: 72
} as const

// ============================================================================
// RENDERING CONFIGURATION
// ============================================================================

export const SPO2_RENDER_CONFIG = {
  // Style de ligne PPG
  LINE: {
    width: 2.5,
    color: '#3b82f6', // Bleu pour SpO2
    cap: 'round',
    join: 'round'
  },
  
  // Effet de lueur
  GLOW: {
    intensity: 12,
    color: '#3b82f6'
  },
  
  // Amplitude du signal (pourcentage de la hauteur)
  AMPLITUDE: 0.4,
  
  // Couleur de fond
  BACKGROUND_COLOR: 'transparent',
  
  // Hauteurs minimales
  MIN_HEIGHT: {
    desktop: 400,
    tablet: 500,
    mobile: 550
  }
} as const

// ============================================================================
// SPO2 DISPLAY
// ============================================================================

export const SPO2_DISPLAY_CONFIG = {
  // Position
  POSITION: {
    top: '1rem',
    right: '1rem'
  },
  
  // Style - Typographie professionnelle
  STYLE: {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif",
    fontWeight: '700',
    letterSpacing: '-0.03em'
  },
  
  // Couleurs selon valeur SpO2
  COLORS: {
    excellent: '#10b981',  // >= 97%
    normal: '#3b82f6',     // 95-96%
    warning: '#f59e0b',    // 90-94%
    critical: '#ef4444'    // < 90%
  },
  
  // Tailles de police
  FONT_SIZE: {
    desktop: {
      value: '2.5rem',
      label: '0.875rem'
    },
    tablet: {
      value: '3rem',
      label: '1rem'
    },
    mobile: {
      value: '3.5rem',
      label: '1.125rem'
    }
  }
} as const

// ============================================================================
// PERFORMANCE
// ============================================================================

export const SPO2_PERFORMANCE_CONFIG = {
  // Options du contexte Canvas
  CANVAS_CONTEXT_OPTIONS: {
    alpha: true,
    desynchronized: true
  },
  
  // Frame rate cible (0 = utiliser requestAnimationFrame)
  TARGET_FPS: 0,
  
  // Device pixel ratio max
  MAX_DEVICE_PIXEL_RATIO: 2
} as const

// ============================================================================
// MOCK GENERATOR - PPG Signal
// ============================================================================

export const SPO2_MOCK_CONFIG = {
  // BPM du générateur (synchronisé avec le cœur)
  BPM: PULSE_CONFIG.TARGET_BPM,
  
  // Fréquence d'échantillonnage
  SAMPLE_RATE: SPO2_CONFIG.DEFAULT_SAMPLE_RATE,
  
  // Taille des chunks
  CHUNK_SIZE: 10,
  
  // SpO2 de base (%)
  BASE_SPO2: 98,
  
  // Variation naturelle de SpO2
  SPO2_VARIATION: {
    amplitude: 1.5,  // ±1.5%
    frequency: 0.05  // Variation lente (respiration)
  },
  
  // Forme de l'onde PPG (Photoplethysmogram)
  WAVE_SHAPE: {
    // Montée rapide (systole)
    rise_duration: 0.25,    // 25% du cycle
    rise_sharpness: 2.5,    // Exponentielle
    
    // Descente lente (diastole)
    fall_duration: 0.75,    // 75% du cycle
    fall_curve: 1.8,        // Courbure de la descente
    
    // Encoche dicrote (fermeture valve aortique)
    dicrotic_notch: {
      position: 0.35,       // 35% du cycle
      depth: 0.08,          // 8% de l'amplitude
      width: 0.05           // Largeur de l'encoche
    }
  },
  
  // Bruit du signal (mouvement, lumière ambiante)
  NOISE: {
    baseline: 0.003,        // Bruit de fond
    motion: 0.008,          // Bruit de mouvement occasionnel
    motion_probability: 0.02 // 2% chance de mouvement par sample
  }
} as const

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Obtient la couleur selon la valeur SpO2
 */
export function getSpO2Color(spo2: number): string {
  if (spo2 >= 97) return SPO2_DISPLAY_CONFIG.COLORS.excellent
  if (spo2 >= 95) return SPO2_DISPLAY_CONFIG.COLORS.normal
  if (spo2 >= 90) return SPO2_DISPLAY_CONFIG.COLORS.warning
  return SPO2_DISPLAY_CONFIG.COLORS.critical
}

/**
 * Obtient le statut selon la valeur SpO2
 */
export function getSpO2Status(spo2: number): string {
  if (spo2 >= 97) return 'Excellent'
  if (spo2 >= 95) return 'Normal'
  if (spo2 >= 90) return 'Low'
  return 'Critical'
}

/**
 * Obtient le device pixel ratio optimal
 */
export function getOptimalDevicePixelRatio(): number {
  const dpr = window.devicePixelRatio || 1
  return Math.min(dpr, SPO2_PERFORMANCE_CONFIG.MAX_DEVICE_PIXEL_RATIO)
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
 * Valide si un SpO2 est dans la plage acceptable
 */
export function isValidSpO2(spo2: number): boolean {
  return spo2 >= SPO2_CONFIG.SPO2_RANGE.min && 
         spo2 <= SPO2_CONFIG.SPO2_RANGE.max
}

/**
 * Valide si un BPM (pulse) est dans la plage acceptable
 */
export function isValidPulse(bpm: number): boolean {
  return bpm >= PULSE_CONFIG.BPM_RANGE.min && 
         bpm <= PULSE_CONFIG.BPM_RANGE.max
}

