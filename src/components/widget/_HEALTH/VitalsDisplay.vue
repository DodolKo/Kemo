<template>
  <AppWidget variant="compact" size="lg" :width="1" :height="1">
    <div class="vitals-wrapper" @click="openBluetoothModal">
      <!-- Status de connexion -->
      <div class="connection-badge" :class="{ connected: vitals.connected }">
        <span class="badge-icon">{{ vitals.connected ? '🔗' : '⚠️' }}</span>
        <span class="badge-text">{{ vitals.connected ? 'Connected' : 'Not Connected' }}</span>
      </div>
      
      <!-- Valeurs des vitals -->
      <div class="vitals-content">
        <!-- BPM (Battements par minute) -->
        <div class="vital-item">
          <div class="vital-icon">❤️</div>
          <div class="vital-value" :class="{ inactive: !vitals.bpm }">
            {{ vitals.bpm ?? '--' }}
          </div>
          <div class="vital-label">BPM</div>
        </div>
        
        <!-- SpO2 (Oxygène dans le sang) -->
        <div class="vital-item">
          <div class="vital-icon">💧</div>
          <div class="vital-value" :class="{ inactive: !vitals.spo2 }">
            {{ vitals.spo2 ?? '--' }}
          </div>
          <div class="vital-label">SpO₂ %</div>
        </div>
      </div>
      
      <!-- Indication pour cliquer -->
      <div class="tap-hint" v-if="!vitals.connected">
        <span>Tap to connect</span>
      </div>
    </div>
  </AppWidget>
</template>

<script setup>
import { inject } from 'vue'
import { useVitals } from '@/stores/useVitals'
import AppWidget from '@/components/ui/AppWidget.vue'

const vitals = useVitals()

// Fonction pour ouvrir le modal (injectée depuis App.vue ou parent)
const openModal = inject('openModal', null)

function openBluetoothModal() {
  if (openModal) {
    openModal('BluetoothConnect')
  } else {
    console.warn('Modal system not available')
  }
}
</script>

<style scoped>
.vitals-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.vitals-wrapper:active {
  transform: scale(0.98);
}

.connection-badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.625rem;
  border-radius: 1rem;
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.3);
  transition: all 0.3s ease;
}

.connection-badge.connected {
  background: rgba(16, 185, 129, 0.2);
  border-color: rgba(16, 185, 129, 0.3);
}

.badge-icon {
  font-size: 0.875rem;
  line-height: 1;
}

.badge-text {
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(243, 244, 246, 0.9);
}

.vitals-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  flex: 1;
}

.vital-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.vital-icon {
  font-size: 2rem;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
  animation: pulse 2s ease-in-out infinite;
}

.vital-value {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif;
  letter-spacing: -0.02em;
  color: rgba(243, 244, 246, 1);
  transition: color 0.3s ease;
}

.vital-value.inactive {
  color: rgba(107, 114, 128, 0.5);
}

.vital-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(156, 163, 175, 1);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.tap-hint {
  position: absolute;
  bottom: 0.75rem;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.625rem;
  font-weight: 600;
  color: rgba(156, 163, 175, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  animation: fadeInOut 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes fadeInOut {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

@media (max-width: 640px) {
  .vitals-content {
    gap: 1.5rem;
  }
  
  .vital-icon {
    font-size: 1.5rem;
  }
  
  .vital-value {
    font-size: 2rem;
  }
  
  .vital-label {
    font-size: 0.65rem;
  }
}
</style>

