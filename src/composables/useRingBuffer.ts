// Ring Buffer Composable - Optimized
export function useRingBuffer(capacity = 4096) {
  const buf = new Float32Array(capacity)
  let head = 0
  let len = 0

  return {
    push: (values: Float32Array | number[]) => {
      for (let i = 0; i < values.length; i++) {
        buf[head] = values[i]
        head = (head + 1) % capacity
        if (len < capacity) len++
      }
    },
    
    snapshot: (count: number) => {
      const n = Math.min(count, len)
      const out = new Float32Array(n)
      const start = (head - n + capacity) % capacity
      
      for (let i = 0; i < n; i++) {
        out[i] = buf[(start + i) % capacity]
      }
      
      return out
    },
    
    clear: () => {
      head = 0
      len = 0
    },
    
    capacity: () => capacity,
    length: () => len
  }
}
