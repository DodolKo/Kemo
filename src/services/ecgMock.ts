// ECG Mock Generator - Optimized for 90-100 BPM
import { MOCK_CONFIG, bpmToPeriod } from '../config/ecg.config'

export function createECGMock(sampleRate = MOCK_CONFIG.SAMPLE_RATE) {
  let t = 0
  const dt = 1 / sampleRate
  const bpm = MOCK_CONFIG.BPM
  const period = bpmToPeriod(bpm)

  function sample() {
    const phase = (t % period) / period
    let v = 0
    
    // Ligne de base (repos)
    const baseline = 0
    
    // P wave - Contraction atriale (petit bump)
    if (phase >= 0 && phase < 0.09) {
      const p = phase / 0.09
      v = 0.12 * Math.sin(p * Math.PI)
    }
    
    // Segment PR - Ligne plate
    else if (phase >= 0.09 && phase < 0.16) {
      v = 0
    }
    
    // QRS Complex - Le pic principal (battement visible)
    else if (phase >= 0.16 && phase < 0.24) {
      const qrs = (phase - 0.16) / 0.08
      
      // Q wave - petite descente
      if (qrs < 0.2) {
        v = -0.15 * (qrs / 0.2)
      }
      // R wave - GRAND PIC vers le haut (réduit un peu)
      else if (qrs < 0.5) {
        const r = (qrs - 0.2) / 0.3
        v = -0.15 + (0.85 + 0.15) * Math.pow(Math.sin(r * Math.PI * 0.5), 2)
      }
      // S wave - descente rapide
      else {
        const s = (qrs - 0.5) / 0.5
        v = 1.0 - (1.0 + 0.25) * Math.pow(s, 2)
      }
    }
    
    // Segment ST - Retour à la ligne de base
    else if (phase >= 0.24 && phase < 0.36) {
      const st = (phase - 0.24) / 0.12
      v = -0.25 * (1 - st)
    }
    
    // T wave - Repolarisation (bump moyen)
    else if (phase >= 0.36 && phase < 0.52) {
      const tw = (phase - 0.36) / 0.16
      v = 0.25 * Math.sin(tw * Math.PI)
    }
    
    // Fin du cycle - retour au baseline
    else {
      v = 0
    }
    
    // Bruit minimal
    v += (Math.random() - 0.5) * 0.005
    
    t += dt
    return v
  }

  let timer: number | null = null
  
  return {
    sampleRate,
    bpm,
    start: (onChunk: (chunk: Float32Array) => void) => {
      if (timer) return
      const chunkSize = MOCK_CONFIG.CHUNK_SIZE
      timer = window.setInterval(() => {
        const arr = new Float32Array(chunkSize)
        for (let i = 0; i < chunkSize; i++) arr[i] = sample()
        onChunk(arr)
      }, (chunkSize / sampleRate) * 1000)
    },
    stop: () => {
      if (timer) clearInterval(timer)
      timer = null
    },
    reset: () => {
      t = 0
    }
  }
}
