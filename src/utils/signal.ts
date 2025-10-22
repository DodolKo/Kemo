// Signal Processing Utilities - Optimized

export function movingAverage(input: Float32Array, window = 3) {
  if (window <= 1) return input
  
  const half = Math.floor(window / 2)
  const out = new Float32Array(input.length)
  
  for (let i = 0; i < input.length; i++) {
    let sum = 0, count = 0
    const start = Math.max(0, i - half)
    const end = Math.min(input.length, i + half + 1)
    
    for (let k = start; k < end; k++) {
      sum += input[k]
      count++
    }
    out[i] = sum / count
  }
  
  return out
}

export function normalize(input: Float32Array, min = -1.5, max = 1.5) {
  // Pas de compression - juste clipper les valeurs extrêmes
  const out = new Float32Array(input.length)
  
  for (let i = 0; i < input.length; i++) {
    // Garder la valeur telle quelle, juste limiter entre -1 et 1
    out[i] = Math.max(-1, Math.min(1, input[i]))
  }
  
  return out
}
