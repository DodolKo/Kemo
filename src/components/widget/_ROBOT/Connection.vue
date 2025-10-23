<template>
  <AppWidget variant="compact" size="lg" :width="1" :height="1">
    <div class="connection-wrapper">
      <!-- Status global -->
      <div class="connection-status" :class="statusClass">
        <div class="status-icon">{{ statusIcon }}</div>
        <div class="status-label">{{ statusText }}</div>
      </div>
      
      <!-- Détails connexions -->
      <div class="connection-details">
        <div class="detail-item">
          <span class="detail-icon" :class="{ active: wifiConnected }">📶</span>
          <span class="detail-value">{{ wifiStrength }}%</span>
        </div>
        <div class="detail-item">
          <span class="detail-icon" :class="{ active: bluetoothConnected }">📲</span>
          <span class="detail-value">{{ bluetoothDevices }}</span>
        </div>
      </div>
    </div>
  </AppWidget>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AppWidget from '@/components/ui/AppWidget.vue'

const wifiConnected = ref(true)
const wifiStrength = ref(85)
const bluetoothConnected = ref(false)
const bluetoothDevices = ref(0)

const statusClass = computed(() => {
  if (wifiConnected.value && wifiStrength.value > 50) return 'status-good'
  if (wifiConnected.value) return 'status-ok'
  return 'status-bad'
})

const statusIcon = computed(() => {
  if (wifiConnected.value && wifiStrength.value > 50) return '✅'
  if (wifiConnected.value) return '⚠️'
  return '❌'
})

const statusText = computed(() => {
  if (wifiConnected.value && wifiStrength.value > 50) return 'Online'
  if (wifiConnected.value) return 'Weak'
  return 'Offline'
})

// Simulation
onMounted(() => {
  setInterval(() => {
    wifiStrength.value = Math.min(100, Math.max(0, wifiStrength.value + (Math.random() - 0.5) * 10))
    wifiStrength.value = Math.round(wifiStrength.value)
    if (Math.random() < 0.1) {
      bluetoothConnected.value = !bluetoothConnected.value
      bluetoothDevices.value = bluetoothConnected.value ? Math.floor(Math.random() * 3) + 1 : 0
    }
  }, 3000)
})

defineExpose({ 
  setWifi: (connected, strength) => { wifiConnected.value = connected; wifiStrength.value = strength },
  setBluetooth: (connected, devices) => { bluetoothConnected.value = connected; bluetoothDevices.value = devices }
})
</script>

<style scoped>
.connection-wrapper { position: relative; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.75rem; padding: 1rem; }
.connection-status { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
.status-icon { font-size: 2.5rem; filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3)); }
.status-good .status-icon { animation: pulse 2s ease-in-out infinite; }
.status-label { font-size: 1rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
.status-good .status-label { color: #10b981; }
.status-ok .status-label { color: #f59e0b; }
.status-bad .status-label { color: #ef4444; }
.connection-details { display: flex; gap: 1rem; }
.detail-item { display: flex; align-items: center; gap: 0.25rem; }
.detail-icon { font-size: 1.25rem; opacity: 0.3; transition: opacity 0.3s; }
.detail-icon.active { opacity: 1; filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.5)); }
.detail-value { font-size: 0.75rem; font-weight: 600; color: rgba(156, 163, 175, 1); }
</style>

