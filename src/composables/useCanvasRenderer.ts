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

  function initialize(): boolean {
    if (!canvas) return false
    
    // Alpha true pour transparence
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
      canvas.width = newWidth * dpr
      canvas.height = newHeight * dpr
      ctx.scale(dpr, dpr)
      width = newWidth
      height = newHeight
      return true
    }
    
    width = newWidth
    height = newHeight
    return false
  }

  function clear(): void {
    if (!ctx) return
    // Fond transparent
    ctx.clearRect(0, 0, width, height)
  }

  function drawSignal(normalizedData: Float32Array | number[]): void {
    if (!ctx || normalizedData.length < 2) return
    
    // Configuration du style
    ctx.lineWidth = lineWidth
    ctx.lineJoin = RENDER_CONFIG.LINE.join as CanvasLineJoin
    ctx.lineCap = RENDER_CONFIG.LINE.cap as CanvasLineCap
    ctx.strokeStyle = lineColor
    ctx.shadowBlur = glowIntensity
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

