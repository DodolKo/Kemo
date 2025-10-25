/**
 * Composable pour le rendu Canvas optimisé
 * Gère le rendu haute performance d'un signal ECG
 */

import { RENDER_CONFIG } from '../config/ecg.config'

export interface RendererConfig {
  lineWidth?: number
  lineColor?: string
  glowIntensity?: number
  amplitude?: number
}

export interface CanvasRenderer {
  initialize: () => boolean
  resize: (dpr: number) => boolean
  render: (data: Float32Array | number[]) => void
  clear: () => void
}

export function useCanvasRenderer(
  canvas: HTMLCanvasElement | null,
  config: RendererConfig = {}
): CanvasRenderer {
  const {
    lineWidth = RENDER_CONFIG.LINE.width,
    lineColor = RENDER_CONFIG.LINE.color,
    glowIntensity = RENDER_CONFIG.GLOW.intensity,
    amplitude = RENDER_CONFIG.AMPLITUDE
  } = config

  let ctx: CanvasRenderingContext2D | null = null
  let width = 0
  let height = 0
  let currentDpr = 1

  // Détecter si on est sur mobile/touch pour réduire le glow
  const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)
  const effectiveGlow = isTouch ? Math.min(glowIntensity * 0.5, 6) : glowIntensity

  function initialize(): boolean {
    if (!canvas) return false

    // Alpha true pour permettre un fond transparent (user request)
    // On garde "desynchronized: true" pour les performances
    // Les autres protections (resetTransform / clearing sur backing buffer)
    // empêchent l'accumulation de transforms et réduisent les artefacts.
    ctx = canvas.getContext('2d', {
      alpha: true,
      desynchronized: true
    })

    return ctx !== null
  }

  function resize(dpr: number): boolean {
    if (!canvas || !ctx) return false
    
    const rect = canvas.getBoundingClientRect()
    const newWidth = Math.floor(rect.width)
    const newHeight = Math.floor(rect.height)
    
    // Only resize if dimensions changed
    if (canvas.width !== newWidth * dpr || canvas.height !== newHeight * dpr) {
      // Reset transform avant de redimensionner pour éviter l'accumulation de scale
      if (typeof ctx.resetTransform === 'function') {
        ctx.resetTransform()
      } else {
        ctx.setTransform(1, 0, 0, 1, 0, 0)
      }
      
      canvas.width = newWidth * dpr
      canvas.height = newHeight * dpr
      
      // Appliquer le scaling avec setTransform pour éviter l'accumulation
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      
      width = newWidth
      height = newHeight
      currentDpr = dpr
      return true
    }
    
    width = newWidth
    height = newHeight
    return false
  }

  function clear(): void {
    if (!ctx || !canvas) return
    
    // Sauvegarder la transform actuelle
    ctx.save()
    
    // Reset transform pour clear tout le backing buffer (pixels physiques)
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Restaurer la transform
    ctx.restore()
  }

  function drawSignal(normalizedData: Float32Array | number[]): void {
    if (!ctx || normalizedData.length < 2) return
    
    // Configuration du style
    ctx.lineWidth = lineWidth
    ctx.lineJoin = RENDER_CONFIG.LINE.join as CanvasLineJoin
    ctx.lineCap = RENDER_CONFIG.LINE.cap as CanvasLineCap
    ctx.strokeStyle = lineColor
    ctx.shadowBlur = effectiveGlow
    ctx.shadowColor = lineColor
    
    // Paramètres du tracé
    const stepX = width / (normalizedData.length - 1)
    const centerY = height * 0.5
    const amp = height * amplitude
    
    // Tracer le signal
    ctx.beginPath()
    
    for (let i = 0; i < normalizedData.length; i++) {
      const x = i * stepX
      const y = centerY - normalizedData[i] * amp
      
      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    
    ctx.stroke()
  }

  function render(data: Float32Array | number[]): void {
    clear()
    
    if (data.length < 2) return
    
    drawSignal(data)
  }

  return {
    initialize,
    resize,
    render,
    clear
  }
}

