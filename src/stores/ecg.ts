// ECG Store - Optimized
import { defineStore } from 'pinia'
import { useRingBuffer } from '../composables/useRingBuffer'

export const useECGStore = defineStore('ecg', () => {
  const ring = useRingBuffer(10_000)
  let running = false

  return {
    push: (chunk: Float32Array) => ring.push(chunk),
    snapshot: (n: number) => ring.snapshot(n),
    clear: () => ring.clear(),
    setRunning: (v: boolean) => { running = v },
    isRunning: () => running
  }
})
