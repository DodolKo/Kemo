/**
 * Composable pour la détection de battements cardiaques
 * Analyse les données ECG pour détecter les pics R et calculer le BPM
 */

import { HEARTBEAT_CONFIG, isValidBpm, intervalToBpm } from '../config/ecg.config'

export interface HeartbeatDetectorConfig {
  peakThreshold?: number
  minInterval?: number
  maxHistorySize?: number
  bpmRange?: {
    min: number
    max: number
  }
}

export function useHeartbeatDetection(config: HeartbeatDetectorConfig = {}) {
  const {
    peakThreshold = HEARTBEAT_CONFIG.PEAK_THRESHOLD,
    minInterval = HEARTBEAT_CONFIG.MIN_INTERVAL_MS,
    maxHistorySize = HEARTBEAT_CONFIG.MAX_HISTORY_SIZE,
    bpmRange = HEARTBEAT_CONFIG.BPM_RANGE
  } = config

  let lastPeakTime = 0
  let history: number[] = []

  /**
   * Détecte un battement cardiaque dans les données ECG
   * @param data - Tableau de données ECG normalisées
   * @returns BPM calculé ou null si aucun battement détecté
   */
  function detect(data: number[]): number | null {
    const now = Date.now()
    
    for (let i = 1; i < data.length - 1; i++) {
      const isPeak = data[i] > peakThreshold
      const isLocalMaximum = data[i] > data[i - 1] && data[i] > data[i + 1]
      const isValidInterval = now - lastPeakTime > minInterval
      
      if (isPeak && isLocalMaximum && isValidInterval) {
        lastPeakTime = now
        
        if (history.length > 0) {
          const interval = now - history[history.length - 1]
          const calculatedBpm = intervalToBpm(interval)
          
          // Validation du BPM dans une plage réaliste
          if (isValidBpm(calculatedBpm)) {
            history.push(now)
            
            // Maintenir l'historique à une taille raisonnable
            if (history.length > maxHistorySize) {
              history.shift()
            }
            
            return calculatedBpm
          }
        } else {
          history.push(now)
        }
        
        break
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
  }

  return {
    detect,
    getAverageBpm,
    reset
  }
}

