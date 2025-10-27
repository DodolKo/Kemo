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
  // Clip values to preserve amplitude without compression
  // Use the min/max parameters to allow signals beyond [-1,1] for better visibility
  const out = new Float32Array(input.length)
  
  for (let i = 0; i < input.length; i++) {
    // Clip to the specified range (default [-1.5, 1.5] for ECG)
    out[i] = Math.max(min, Math.min(max, input[i]))
  }
  
  return out
}
