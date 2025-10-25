# 📘 Exemples de code - Bluetooth Kemo

## 🎯 Exemples d'utilisation

### 1. Ouvrir le modal Bluetooth depuis n'importe quel composant

```vue
<template>
  <button @click="openBluetoothSettings">
    ⚙️ Paramètres Bluetooth
  </button>
</template>

<script setup>
import { inject } from 'vue'

const openModal = inject('openModal')

function openBluetoothSettings() {
  openModal('BluetoothConnect')
}
</script>
```

### 2. Afficher les vitals dans un composant custom

```vue
<template>
  <div class="my-vitals">
    <div v-if="vitals.connected">
      <p>❤️ Battements: {{ vitals.bpm ?? 'N/A' }} BPM</p>
      <p>💧 Oxygène: {{ vitals.spo2 ?? 'N/A' }} %</p>
    </div>
    <div v-else>
      <p>Non connecté</p>
    </div>
  </div>
</template>

<script setup>
import { useVitals } from '@/stores/useVitals'

const vitals = useVitals()
</script>
```

### 3. Réagir aux changements de connexion

```vue
<script setup>
import { watch } from 'vue'
import { useVitals } from '@/stores/useVitals'

const vitals = useVitals()

// Observer les changements de connexion
watch(() => vitals.connected, (isConnected) => {
  if (isConnected) {
    console.log('✅ ESP32 connecté !')
    // Faire quelque chose quand connecté
  } else {
    console.log('❌ ESP32 déconnecté')
    // Faire quelque chose quand déconnecté
  }
})

// Observer les changements de BPM
watch(() => vitals.bpm, (newBpm) => {
  if (newBpm > 100) {
    console.warn('⚠️ Rythme cardiaque élevé:', newBpm)
  }
})

// Observer les changements de SpO2
watch(() => vitals.spo2, (newSpo2) => {
  if (newSpo2 && newSpo2 < 95) {
    console.warn('⚠️ Oxygène bas:', newSpo2)
  }
})
</script>
```

### 4. Connexion automatique au montage (si déjà connecté avant)

```vue
<script setup>
import { onMounted } from 'vue'
import { useVitals } from '@/stores/useVitals'
import * as ble from '@/utils/bleKemo.js'

const vitals = useVitals()

onMounted(() => {
  // Setup du handler
  ble.setUpdateHandler((state) => {
    vitals.update(state)
  })
  
  // Note: La reconnexion automatique n'est pas possible avec Web Bluetooth
  // L'utilisateur doit toujours initier la connexion manuellement
})
</script>
```

### 5. Créer un indicateur de connexion simple

```vue
<template>
  <div class="connection-indicator" :class="{ connected: vitals.connected }">
    <span class="dot"></span>
    <span class="text">{{ vitals.connected ? 'Connecté' : 'Déconnecté' }}</span>
  </div>
</template>

<script setup>
import { useVitals } from '@/stores/useVitals'
const vitals = useVitals()
</script>

<style scoped>
.connection-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  transition: all 0.3s ease;
}

.connection-indicator.connected {
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.3);
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ef4444;
  animation: pulse 2s ease-in-out infinite;
}

.connection-indicator.connected .dot {
  background: #10b981;
}

.text {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(243, 244, 246, 0.9);
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>
```

### 6. Bouton de connexion/déconnexion simple

```vue
<template>
  <button @click="toggleConnection" class="ble-button">
    {{ vitals.connected ? '🔌 Déconnecter' : '🔗 Connecter' }}
  </button>
</template>

<script setup>
import { inject } from 'vue'
import { useVitals } from '@/stores/useVitals'
import * as ble from '@/utils/bleKemo.js'

const vitals = useVitals()
const openModal = inject('openModal')

function toggleConnection() {
  if (vitals.connected) {
    ble.disconnectKemo()
  } else {
    openModal('BluetoothConnect')
  }
}
</script>

<style scoped>
.ble-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.ble-button:hover {
  transform: translateY(-2px);
}
</style>
```

### 7. Graph en temps réel avec les données BPM

```vue
<template>
  <div class="bpm-graph">
    <canvas ref="canvasRef" width="400" height="100"></canvas>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useVitals } from '@/stores/useVitals'

const vitals = useVitals()
const canvasRef = ref(null)
const bpmHistory = ref([])
const maxHistory = 50

onMounted(() => {
  // Initialiser le canvas
  const ctx = canvasRef.value?.getContext('2d')
  if (ctx) {
    drawGraph(ctx, [])
  }
})

watch(() => vitals.bpm, (newBpm) => {
  if (newBpm !== null) {
    bpmHistory.value.push(newBpm)
    if (bpmHistory.value.length > maxHistory) {
      bpmHistory.value.shift()
    }
    
    const ctx = canvasRef.value?.getContext('2d')
    if (ctx) {
      drawGraph(ctx, bpmHistory.value)
    }
  }
})

function drawGraph(ctx, data) {
  const width = ctx.canvas.width
  const height = ctx.canvas.height
  
  // Effacer
  ctx.clearRect(0, 0, width, height)
  
  if (data.length < 2) return
  
  // Normaliser les données
  const min = Math.min(...data, 60)
  const max = Math.max(...data, 100)
  const range = max - min || 1
  
  ctx.strokeStyle = '#3b82f6'
  ctx.lineWidth = 2
  ctx.beginPath()
  
  data.forEach((value, index) => {
    const x = (index / (maxHistory - 1)) * width
    const y = height - ((value - min) / range) * height * 0.8 - height * 0.1
    
    if (index === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })
  
  ctx.stroke()
}
</script>

<style scoped>
.bpm-graph {
  width: 100%;
  padding: 1rem;
  background: rgba(31, 41, 55, 0.5);
  border-radius: 0.5rem;
}

canvas {
  width: 100%;
  height: auto;
}
</style>
```

### 8. Alertes basées sur les seuils

```vue
<script setup>
import { watch } from 'vue'
import { useVitals } from '@/stores/useVitals'

const vitals = useVitals()

// Alertes BPM
watch(() => vitals.bpm, (bpm) => {
  if (!bpm) return
  
  if (bpm < 60) {
    showAlert('⚠️ Bradycardie', `BPM bas: ${bpm}`, 'warning')
  } else if (bpm > 100) {
    showAlert('⚠️ Tachycardie', `BPM élevé: ${bpm}`, 'warning')
  }
})

// Alertes SpO2
watch(() => vitals.spo2, (spo2) => {
  if (!spo2) return
  
  if (spo2 < 90) {
    showAlert('🚨 Alerte Oxygène', `SpO2 très bas: ${spo2}%`, 'error')
  } else if (spo2 < 95) {
    showAlert('⚠️ Oxygène bas', `SpO2: ${spo2}%`, 'warning')
  }
})

function showAlert(title, message, type) {
  // Implémenter votre système d'alerte
  console.log(`[${type.toUpperCase()}] ${title}: ${message}`)
  
  // Exemple avec notification native
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body: message })
  }
}
</script>
```

### 9. Logging des données pour analyse

```vue
<script setup>
import { watch } from 'vue'
import { useVitals } from '@/stores/useVitals'

const vitals = useVitals()
const dataLog = []

// Logger toutes les données reçues
watch([() => vitals.bpm, () => vitals.spo2], ([bpm, spo2]) => {
  if (vitals.connected) {
    const entry = {
      timestamp: new Date().toISOString(),
      bpm: bpm,
      spo2: spo2
    }
    
    dataLog.push(entry)
    console.log('📊 Nouvelle donnée:', entry)
    
    // Optionnel: sauvegarder dans localStorage
    localStorage.setItem('vitals_log', JSON.stringify(dataLog.slice(-100)))
  }
})

// Fonction pour exporter les données
function exportData() {
  const blob = new Blob([JSON.stringify(dataLog, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `vitals_${Date.now()}.json`
  a.click()
}

defineExpose({ exportData })
</script>
```

### 10. Intégration avec un composant de statistiques

```vue
<template>
  <div class="vitals-stats">
    <div class="stat-card">
      <h3>BPM Moyen</h3>
      <p class="stat-value">{{ avgBpm }}</p>
    </div>
    
    <div class="stat-card">
      <h3>SpO2 Moyen</h3>
      <p class="stat-value">{{ avgSpo2 }}%</p>
    </div>
    
    <div class="stat-card">
      <h3>Durée session</h3>
      <p class="stat-value">{{ sessionDuration }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useVitals } from '@/stores/useVitals'

const vitals = useVitals()
const bpmHistory = ref([])
const spo2History = ref([])
const sessionStart = ref(null)

// Quand connecté, démarrer la session
watch(() => vitals.connected, (connected) => {
  if (connected) {
    sessionStart.value = Date.now()
    bpmHistory.value = []
    spo2History.value = []
  }
})

// Enregistrer les valeurs
watch(() => vitals.bpm, (bpm) => {
  if (bpm !== null) bpmHistory.value.push(bpm)
})

watch(() => vitals.spo2, (spo2) => {
  if (spo2 !== null) spo2History.value.push(spo2)
})

const avgBpm = computed(() => {
  if (bpmHistory.value.length === 0) return '--'
  const sum = bpmHistory.value.reduce((a, b) => a + b, 0)
  return Math.round(sum / bpmHistory.value.length)
})

const avgSpo2 = computed(() => {
  if (spo2History.value.length === 0) return '--'
  const sum = spo2History.value.reduce((a, b) => a + b, 0)
  return Math.round(sum / spo2History.value.length)
})

const sessionDuration = computed(() => {
  if (!sessionStart.value) return '--'
  const seconds = Math.floor((Date.now() - sessionStart.value) / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
})
</script>

<style scoped>
.vitals-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.stat-card {
  padding: 1rem;
  background: rgba(31, 41, 55, 0.5);
  border-radius: 0.5rem;
  text-align: center;
}

.stat-card h3 {
  font-size: 0.875rem;
  color: rgba(156, 163, 175, 1);
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: rgba(243, 244, 246, 1);
}
</style>
```

## 🔧 Modification avancée de bleKemo.js

### Ajouter une nouvelle caractéristique (ex: Température)

```javascript
// Dans bleKemo.js

// Ajouter l'UUID
const CH_TEMP = '5b3a0004-8c3a-4b1c-9a5e-8b8d9a0f0001'

// Dans connectKemo(), après la connexion des autres caractéristiques
let chTemp = null

// ... code existant ...

// Ajouter la lecture de température
chTemp = await kemo.getCharacteristic(CH_TEMP)
await chTemp.startNotifications()

chTemp.addEventListener('characteristicvaluechanged', (ev) => {
  const temp = ev.target.value.getFloat32(0, true) // Lecture float32
  onUpdate({ temperature: temp })
})
```

### Puis mettre à jour le store useVitals.ts

```typescript
// useVitals.ts
export const useVitals = defineStore('vitals', {
  state: () => ({ 
    connected: false, 
    bpm: null as number|null, 
    spo2: null as number|null,
    temperature: null as number|null // Ajouter ici
  }),
  actions: {
    update(p: Partial<{
      connected:boolean,
      bpm:number|null,
      spo2:number|null,
      temperature:number|null // Et ici
    }>) {
      Object.assign(this.$state, p);
    }
  }
});
```

---

**💡 Ces exemples vous permettent de personnaliser complètement l'intégration Bluetooth selon vos besoins !**

