/**
 * Composable pour la détection de battements cardiaques
 * Analyse les données ECG pour détecter les pics R et calculer le BPM
 * Version simplifiée et robuste avec seuil adaptatif
 */

import { HEARTBEAT_CONFIG, isValidBpm, intervalToBpm, ECG_CONFIG } from '../config/ecg.config'

export interface HeartbeatDetectorConfig {
  minInterval?: number
  maxHistorySize?: number
}

export function useHeartbeatDetection(config: HeartbeatDetectorConfig = {}) {
  const {
    minInterval = HEARTBEAT_CONFIG.MIN_INTERVAL_MS,
    maxHistorySize = HEARTBEAT_CONFIG.MAX_HISTORY_SIZE
  } = config

  let lastPeakTime = 0
  let history: number[] = []
  
  // Seuil adaptatif
  let adaptiveThreshold = 0.5
  let signalMax = -Infinity
  let signalMin = Infinity

  /**
   * Détecte un battement cardiaque dans les données ECG
   * Version simple et robuste
   */
  function detect(data: number[], sampleRate: number = ECG_CONFIG.DEFAULT_SAMPLE_RATE): number | null {
    if (data.length < 10) return null
    
    const now = Date.now()
    
    // Mise à jour rapide du min/max pour seuil adaptatif
    const currentMax = Math.max(...data)
    const currentMin = Math.min(...data)
    
    signalMax = signalMax === -Infinity ? currentMax : (currentMax * 0.2 + signalMax * 0.8)
    signalMin = signalMin === Infinity ? currentMin : (currentMin * 0.2 + signalMin * 0.8)
    
    const amplitude = signalMax - signalMin
    adaptiveThreshold = signalMin + amplitude * 0.60  // STRICT: 60% de l'amplitude
    
    // Recherche de pics R dans la fenêtre récente
    const startIdx = Math.max(3, data.length - 100)  // Derniers ~0.4s @ 250Hz
    
    for (let i = startIdx; i < data.length - 3; i++) {
      // Critères STRICTS pour ne détecter QUE le pic R
      const isPeak = data[i] > adaptiveThreshold
      
      // Maximum local (3 points de chaque côté)
      const isLocalMax = 
        data[i] > data[i - 1] && data[i] > data[i + 1] &&
        data[i] > data[i - 2] && data[i] > data[i + 2] &&
        data[i] > data[i - 3] && data[i] > data[i + 3]
      
      // Amplitude significative STRICTE (50% du range pour pic R dominant)
      const hasAmplitude = (data[i] - signalMin) > (amplitude * 0.50)
      
      // Période réfractaire STRICTE (600ms = max 100 BPM détectable, mais évite doubles détections)
      const validTime = (now - lastPeakTime) > 600
      
      if (isPeak && isLocalMax && hasAmplitude && validTime) {
        lastPeakTime = now
        
        if (history.length > 0) {
          const interval = now - history[history.length - 1]
          const calculatedBpm = intervalToBpm(interval)
          
          // Rejet uniquement des valeurs physiquement impossibles
          if (calculatedBpm >= 30 && calculatedBpm <= 250) {
            history.push(now)
            
            if (history.length > maxHistorySize) {
              history.shift()
            }
            
            console.log(`[BPM] ✓ ${calculatedBpm}`)
            return calculatedBpm
          } else {
            // Valeur aberrante (< 30 ou > 250 = physiquement impossible)
            console.log(`[BPM] ✗ ${calculatedBpm} (impossible)`)
          }
        } else {
          // Premier pic détecté
          history.push(now)
          console.log('[BPM] First peak detected')
        }
        
        break  // Un seul pic par frame
      }
    }
    
    return null
  }

  /**
   * Calcule la moyenne du BPM sur l'historique
   */
  function getAverageBpm(): number | null {
    if (history.length < 2) return null
    
    let totalInterval = 0
    for (let i = 1; i < history.length; i++) {
      totalInterval += history[i] - history[i - 1]
    }
    
    const avgInterval = totalInterval / (history.length - 1)
    return intervalToBpm(avgInterval)
  }

  /**
   * Réinitialise le détecteur
   */
  function reset() {
    history = []
    lastPeakTime = 0
    signalMax = -Infinity
    signalMin = Infinity
    adaptiveThreshold = 0.5
  }

  return {
    detect,
    getAverageBpm,
    reset,
    getStats: () => ({ min: signalMin, max: signalMax, threshold: adaptiveThreshold, history: history.length })
  }
}
