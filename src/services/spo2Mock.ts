/**
 * SpO2 Mock Generator - Génération réaliste de signal PPG (Photoplethysmogram)
 * Signal médical fidèle pour oxymètre de pouls
 * 
 * Le signal PPG représente les variations de volume sanguin dans les capillaires,
 * mesuré par absorption de lumière rouge et infrarouge.
 */

import { SPO2_MOCK_CONFIG, bpmToPeriod } from '../config/spo2.config'

export interface SpO2Data {
  ppgSignal: Float32Array  // Signal PPG (onde de pulsation)
  spo2Value: number        // Valeur SpO2 actuelle (%)
}

export function createSpO2Mock(sampleRate = SPO2_MOCK_CONFIG.SAMPLE_RATE) {
  let t = 0
  const dt = 1 / sampleRate
  const bpm = SPO2_MOCK_CONFIG.BPM
  const period = bpmToPeriod(bpm)
  
  // État du SpO2 (varie lentement avec la respiration)
  let currentSpO2 = SPO2_MOCK_CONFIG.BASE_SPO2
  let spo2Phase = 0

  /**
   * Génère un sample de signal PPG (Photoplethysmogram)
   * Forme caractéristique : montée rapide, descente lente avec encoche dicrote
   */
  function samplePPG(): number {
    const phase = (t % period) / period
    const config = SPO2_MOCK_CONFIG.WAVE_SHAPE
    let v = 0
    
    // Baseline (ligne de base)
    const baseline = 0
    
    // ========================================================================
    // SYSTOLE - Montée rapide (contraction cardiaque)
    // ========================================================================
    if (phase < config.rise_duration) {
      const risePhase = phase / config.rise_duration
      // Montée exponentielle rapide (characteristic du PPG)
      v = Math.pow(risePhase, 1 / config.rise_sharpness)
    }
    
    // ========================================================================
    // DIASTOLE - Descente avec encoche dicrote
    // ========================================================================
    else {
      const fallPhase = (phase - config.rise_duration) / config.fall_duration
      
      // Descente exponentielle de base
      v = Math.pow(1 - fallPhase, config.fall_curve)
      
      // ENCOCHE DICROTE (fermeture de la valve aortique)
      // C'est une caractéristique importante du signal PPG médical
      const notchCenter = (config.dicrotic_notch.position - config.rise_duration) / config.fall_duration
      const notchWidth = config.dicrotic_notch.width / config.fall_duration
      
      if (Math.abs(fallPhase - notchCenter) < notchWidth) {
        // Fonction gaussienne pour l'encoche
        const notchPhase = (fallPhase - notchCenter) / notchWidth
        const notchDepth = config.dicrotic_notch.depth * Math.exp(-notchPhase * notchPhase * 4)
        v -= notchDepth
      }
    }
    
    // ========================================================================
    // BRUIT RÉALISTE
    // ========================================================================
    
    // Bruit de base (électronique, lumière ambiante)
    v += (Math.random() - 0.5) * SPO2_MOCK_CONFIG.NOISE.baseline
    
    // Bruit de mouvement occasionnel (patient bouge)
    if (Math.random() < SPO2_MOCK_CONFIG.NOISE.motion_probability) {
      v += (Math.random() - 0.5) * SPO2_MOCK_CONFIG.NOISE.motion
    }
    
    // Clamp pour éviter les valeurs aberrantes
    v = Math.max(-0.2, Math.min(1.2, v))
    
    t += dt
    return v
  }

  /**
   * Simule la variation naturelle du SpO2
   * Le SpO2 varie légèrement avec la respiration et le mouvement
   */
  function updateSpO2(): void {
    const config = SPO2_MOCK_CONFIG.SPO2_VARIATION
    
    // Variation sinusoïdale lente (respiration)
    spo2Phase += dt * config.frequency
    const variation = Math.sin(spo2Phase * 2 * Math.PI) * config.amplitude
    
    // Petites variations aléatoires
    const randomVariation = (Math.random() - 0.5) * 0.3
    
    // Calcul du SpO2 avec variations
    currentSpO2 = SPO2_MOCK_CONFIG.BASE_SPO2 + variation + randomVariation
    
    // Clamp dans la plage réaliste
    currentSpO2 = Math.max(94, Math.min(100, currentSpO2))
    
    // Arrondir à 1 décimale
    currentSpO2 = Math.round(currentSpO2 * 10) / 10
  }

  let timer: number | null = null
  let spo2UpdateTimer: number | null = null
  
  return {
    sampleRate,
    bpm,
    
    /**
     * Démarre la génération de signal PPG
     */
    start: (onChunk: (data: SpO2Data) => void) => {
      if (timer) return
      
      const chunkSize = SPO2_MOCK_CONFIG.CHUNK_SIZE
      
      // Génération du signal PPG
      timer = window.setInterval(() => {
        const ppgSignal = new Float32Array(chunkSize)
        for (let i = 0; i < chunkSize; i++) {
          ppgSignal[i] = samplePPG()
        }
        
        onChunk({
          ppgSignal,
          spo2Value: currentSpO2
        })
      }, (chunkSize / sampleRate) * 1000)
      
      // Mise à jour du SpO2 (moins fréquent que le signal)
      spo2UpdateTimer = window.setInterval(() => {
        updateSpO2()
      }, 200) // Update SpO2 toutes les 200ms
    },
    
    /**
     * Arrête la génération
     */
    stop: () => {
      if (timer) {
        clearInterval(timer)
        timer = null
      }
      if (spo2UpdateTimer) {
        clearInterval(spo2UpdateTimer)
        spo2UpdateTimer = null
      }
    },
    
    /**
     * Reset le générateur
     */
    reset: () => {
      t = 0
      spo2Phase = 0
      currentSpO2 = SPO2_MOCK_CONFIG.BASE_SPO2
    },
    
    /**
     * Obtient la valeur SpO2 actuelle
     */
    getCurrentSpO2: () => currentSpO2,
    
    /**
     * Définit une nouvelle valeur SpO2 de base
     */
    setBaseSpO2: (value: number) => {
      SPO2_MOCK_CONFIG.BASE_SPO2 = Math.max(70, Math.min(100, value))
      currentSpO2 = SPO2_MOCK_CONFIG.BASE_SPO2
    }
  }
}

