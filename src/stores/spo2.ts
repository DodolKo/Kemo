/**
 * SpO2 Store - Gestion centralisée des données oxymètre
 * Architecture optimisée avec ring buffer pour performance
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRingBuffer } from '../composables/useRingBuffer'

export const useSpO2Store = defineStore('spo2', () => {
  // Ring buffer pour le signal PPG
  const ring = useRingBuffer(5_000)  // 50 secondes à 100 Hz
  
  // État du système
  const running = ref(false)
  const spo2Value = ref(98)  // Valeur SpO2 actuelle (%)
  const pulseRate = ref(72)   // Fréquence de pouls (BPM)
  
  /**
   * Ajoute un chunk de données PPG au buffer
   */
  function pushPPG(chunk: Float32Array): void {
    ring.push(chunk)
  }
  
  /**
   * Récupère les N derniers samples du signal PPG
   */
  function snapshotPPG(n: number): Float32Array {
    return ring.snapshot(n)
  }
  
  /**
   * Efface toutes les données
   */
  function clear(): void {
    ring.clear()
  }
  
  /**
   * Définit l'état de fonctionnement
   */
  function setRunning(value: boolean): void {
    running.value = value
  }
  
  /**
   * Met à jour la valeur SpO2
   */
  function updateSpO2(value: number): void {
    spo2Value.value = Math.round(value * 10) / 10
  }
  
  /**
   * Met à jour la fréquence de pouls
   */
  function updatePulseRate(bpm: number): void {
    pulseRate.value = Math.round(bpm)
  }
  
  /**
   * Obtient l'état de fonctionnement
   */
  function isRunning(): boolean {
    return running.value
  }
  
  /**
   * Obtient la capacité du buffer
   */
  function getCapacity(): number {
    return ring.capacity()
  }
  
  /**
   * Obtient la longueur actuelle des données
   */
  function getLength(): number {
    return ring.length()
  }
  
  return {
    // Actions
    pushPPG,
    snapshotPPG,
    clear,
    setRunning,
    updateSpO2,
    updatePulseRate,
    
    // Getters
    isRunning,
    getCapacity,
    getLength,
    
    // State (refs)
    running,
    spo2Value,
    pulseRate
  }
})

