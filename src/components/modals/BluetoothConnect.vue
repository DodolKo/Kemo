<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-container">
      <!-- Header -->
      <div class="modal-header">
        <div class="header-content">
          <div class="header-icon">📡</div>
          <div class="header-text">
            <h2 class="header-title">Bluetooth Connection</h2>
            <p class="header-subtitle">Connect to your Kemo device</p>
          </div>
        </div>
        <button class="close-btn" @click="close">✕</button>
      </div>
      
      <!-- Body -->
      <div class="modal-body">
        <!-- Status de connexion -->
        <div class="status-card" :class="statusClass">
          <div class="status-icon">{{ statusIcon }}</div>
          <div class="status-text">
            <div class="status-label">{{ statusLabel }}</div>
            <div class="status-description">{{ statusDescription }}</div>
          </div>
        </div>
        
        <!-- Valeurs actuelles -->
        <div class="values-grid" v-if="vitals.connected">
          <div class="value-card">
            <div class="value-icon">❤️</div>
            <div class="value-data">
              <div class="value-number">{{ vitals.bpm ?? '--' }}</div>
              <div class="value-label">BPM</div>
            </div>
          </div>
          
          <div class="value-card">
            <div class="value-icon">💧</div>
            <div class="value-data">
              <div class="value-number">{{ vitals.spo2 ?? '--' }}</div>
              <div class="value-label">SpO₂ %</div>
            </div>
          </div>
        </div>
        
        <!-- Informations -->
        <div class="info-card" v-if="!vitals.connected">
          <div class="info-title">📱 Compatibility</div>
          <ul class="info-list">
            <li>✅ Chrome / Edge (Desktop & Android)</li>
            <li>⚠️ Limited or no support on iOS Safari</li>
            <li>🔒 Secure context required (HTTPS or localhost)</li>
          </ul>
          
          <div class="info-note">
            <strong>Note:</strong> Your Kemo device name should start with "Kemo-"
          </div>
        </div>
        
        <!-- Message d'erreur -->
        <div class="error-card" v-if="error">
          <div class="error-icon">⚠️</div>
          <div class="error-text">{{ error }}</div>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="modal-footer">
        <button 
          v-if="!vitals.connected" 
          class="btn btn-primary" 
          @click="connect"
          :disabled="connecting"
        >
          <span v-if="connecting">Connecting...</span>
          <span v-else>🔗 Connect Device</span>
        </button>
        
        <button 
          v-else 
          class="btn btn-danger" 
          @click="disconnect"
        >
          🔌 Disconnect
        </button>
        
        <button class="btn btn-secondary" @click="close">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useVitals } from '@/stores/useVitals'
import { useECGStore } from '@/stores/ecg'
import * as ble from '@/utils/bleKemo.js'

const emit = defineEmits(['close'])

const vitals = useVitals()
const ecg = useECGStore()
const connecting = ref(false)
const error = ref(null)

// Status computed
const statusClass = computed(() => {
  if (vitals.connected) return 'status-connected'
  if (connecting.value) return 'status-connecting'
  return 'status-disconnected'
})

const statusIcon = computed(() => {
  if (vitals.connected) return '✅'
  if (connecting.value) return '🔄'
  return '📡'
})

const statusLabel = computed(() => {
  if (vitals.connected) return 'Connected'
  if (connecting.value) return 'Connecting...'
  return 'Disconnected'
})

const statusDescription = computed(() => {
  if (vitals.connected) return 'Receiving data from your Kemo device'
  if (connecting.value) return 'Please select your device from the browser popup'
  return 'Click the button below to connect your device'
})

// Fonctions de connexion
async function connect() {
  error.value = null
  connecting.value = true
  
  try {
    // Vérifier le support
    if (!('bluetooth' in navigator)) {
      throw new Error('Web Bluetooth is not supported on this browser/device')
    }
    
    await ble.connectKemo()
    error.value = null
  } catch (err) {
    console.error('Bluetooth connection error:', err)
    
    // Messages d'erreur plus clairs
    if (err.message.includes('not supported')) {
      error.value = 'Web Bluetooth is not supported on this device'
    } else if (err.name === 'NotFoundError') {
      error.value = 'No device selected or device not found'
    } else if (err.name === 'SecurityError') {
      error.value = 'Connection must be initiated by user interaction (HTTPS required)'
    } else {
      error.value = err.message || 'Failed to connect to device'
    }
  } finally {
    connecting.value = false
  }
}

function disconnect() {
  ble.disconnectKemo()
  error.value = null
}

function close() {
  emit('close')
}

// Setup du handler au montage
onMounted(() => {
  ble.setUpdateHandler((state) => {
    vitals.update(state)
  })
  // Stream ECG chunks into the ECG store when available (real mode)
  try {
    ble.setECGHandler((chunk) => {
      if (chunk) {
        ecg.setRunning(true)
        ecg.push(chunk)
      } else {
        ecg.setRunning(false)
      }
    })
  } catch (e) {
    console.error('[BluetoothConnect] Failed to register ECG handler:', e)
  }
})

// Cleanup
onUnmounted(() => {
  // On ne déconnecte pas ici pour garder la connexion active
  // même si le modal est fermé
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-container {
  background: linear-gradient(135deg, rgba(31, 41, 55, 0.95), rgba(17, 24, 39, 0.95));
  border: 1px solid rgba(75, 85, 99, 0.3);
  border-radius: 1rem;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(75, 85, 99, 0.2);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  font-size: 2.5rem;
  filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.5));
}

.header-text {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.header-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: rgba(243, 244, 246, 1);
  margin: 0;
}

.header-subtitle {
  font-size: 0.875rem;
  color: rgba(156, 163, 175, 1);
  margin: 0;
}

.close-btn {
  width: 2rem;
  height: 2rem;
  border: none;
  background: rgba(75, 85, 99, 0.3);
  color: rgba(156, 163, 175, 1);
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(75, 85, 99, 0.5);
  color: rgba(243, 244, 246, 1);
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.status-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 0.75rem;
  background: rgba(31, 41, 55, 0.5);
  border: 1px solid rgba(75, 85, 99, 0.3);
  transition: all 0.3s ease;
}

.status-card.status-connected {
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.3);
}

.status-card.status-connecting {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.3);
}

.status-card.status-disconnected {
  background: rgba(107, 114, 128, 0.1);
  border-color: rgba(107, 114, 128, 0.3);
}

.status-icon {
  font-size: 2rem;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.3));
}

.status-card.status-connecting .status-icon {
  animation: rotate 2s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.status-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.status-label {
  font-size: 1rem;
  font-weight: 700;
  color: rgba(243, 244, 246, 1);
}

.status-description {
  font-size: 0.875rem;
  color: rgba(156, 163, 175, 1);
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.value-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 0.75rem;
  background: rgba(31, 41, 55, 0.5);
  border: 1px solid rgba(75, 85, 99, 0.3);
}

.value-icon {
  font-size: 1.5rem;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.3));
}

.value-data {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.value-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: rgba(243, 244, 246, 1);
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif;
}

.value-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(156, 163, 175, 1);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-card {
  padding: 1rem;
  border-radius: 0.75rem;
  background: rgba(59, 130, 246, 0.05);
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.info-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: rgba(147, 197, 253, 1);
  margin-bottom: 0.75rem;
}

.info-list {
  list-style: none;
  padding: 0;
  margin: 0 0 0.75rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-list li {
  font-size: 0.875rem;
  color: rgba(209, 213, 219, 1);
  padding-left: 0.25rem;
}

.info-note {
  font-size: 0.75rem;
  color: rgba(156, 163, 175, 1);
  padding: 0.75rem;
  background: rgba(31, 41, 55, 0.5);
  border-radius: 0.5rem;
  border-left: 3px solid rgba(59, 130, 246, 0.5);
}

.info-note strong {
  color: rgba(243, 244, 246, 1);
}

.error-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 0.75rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.error-icon {
  font-size: 1.5rem;
}

.error-text {
  flex: 1;
  font-size: 0.875rem;
  color: rgba(252, 165, 165, 1);
  font-weight: 500;
}

.modal-footer {
  display: flex;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid rgba(75, 85, 99, 0.2);
}

.btn {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

.btn-danger {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.btn-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4);
}

.btn-secondary {
  background: rgba(75, 85, 99, 0.3);
  color: rgba(209, 213, 219, 1);
}

.btn-secondary:hover {
  background: rgba(75, 85, 99, 0.5);
  color: rgba(243, 244, 246, 1);
}

@media (max-width: 640px) {
  .modal-container {
    max-width: 100%;
    border-radius: 1rem 1rem 0 0;
    max-height: 95vh;
  }
  
  .values-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-footer {
    flex-direction: column;
  }
}
</style>

