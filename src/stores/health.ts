import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useHealthStore = defineStore('health', () => {
  // Heart Rate (BPM)
  const heartRate = ref(72)
  
  // Oximeter (SpO2 %)
  const spo2 = ref(98)
  
  // Simulation intervals
  let heartRateInterval: number | null = null
  let spo2Interval: number | null = null
  
  // Heart Rate functions
  function updateHeartRate(value: number) {
    heartRate.value = Math.min(200, Math.max(30, Math.round(value)))
  }
  
  function simulateHeartRate() {
    // Normal resting heart rate 60-100 BPM - CALME
    const variation = (Math.random() - 0.5) * 2 // Réduit de 4 à 2
    heartRate.value = Math.min(180, Math.max(45, heartRate.value + variation))
    heartRate.value = Math.round(heartRate.value)
  }
  
  function startHeartRateSimulation(interval: number = 1000) {
    if (heartRateInterval) return
    heartRate.value = 65 + Math.random() * 20
    heartRateInterval = window.setInterval(simulateHeartRate, interval)
  }
  
  function stopHeartRateSimulation() {
    if (heartRateInterval) {
      clearInterval(heartRateInterval)
      heartRateInterval = null
    }
  }
  
  // SpO2 functions
  function updateSpO2(value: number) {
    spo2.value = Math.min(100, Math.max(0, Math.round(value)))
  }
  
  function simulateSpO2() {
    // SpO2 normally between 95-100% - CALME
    const variation = (Math.random() - 0.5) * 1 // Réduit de 2 à 1
    spo2.value = Math.min(100, Math.max(85, spo2.value + variation))
    spo2.value = Math.round(spo2.value)
  }
  
  function startSpO2Simulation(interval: number = 2000) {
    if (spo2Interval) return
    spo2.value = 95 + Math.random() * 4
    spo2Interval = window.setInterval(simulateSpO2, interval)
  }
  
  function stopSpO2Simulation() {
    if (spo2Interval) {
      clearInterval(spo2Interval)
      spo2Interval = null
    }
  }
  
  // Stop all simulations
  function stopAllSimulations() {
    stopHeartRateSimulation()
    stopSpO2Simulation()
  }
  
  return {
    // State
    heartRate,
    spo2,
    
    // Heart Rate
    updateHeartRate,
    startHeartRateSimulation,
    stopHeartRateSimulation,
    
    // SpO2
    updateSpO2,
    startSpO2Simulation,
    stopSpO2Simulation,
    
    // General
    stopAllSimulations
  }
})

