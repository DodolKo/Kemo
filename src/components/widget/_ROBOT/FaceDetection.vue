<template>
  <AppWidget variant="compact" size="lg" :width="1" :height="1">
    <div class="face-detection-wrapper">
      <!-- Icône avec pulse si faces détectées -->
      <div class="face-icon" :class="{ 'has-faces': facesDetected > 0 }">
        👤
      </div>
      
      <!-- Nombre de visages -->
      <div class="face-count">{{ facesDetected }}</div>
      
      <!-- Label -->
      <div class="face-label">{{ facesDetected === 1 ? 'Face' : 'Faces' }}</div>
      
      <!-- Indicateur de reconnaissance -->
      <div v-if="recognizedName" class="recognized-name">
        {{ recognizedName }}
      </div>
    </div>
  </AppWidget>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppWidget from '@/components/ui/AppWidget.vue'

const facesDetected = ref(0)
const recognizedName = ref('')

const knownFaces = ['Alice', 'Bob', 'Charlie', 'Unknown']

// Simulation
onMounted(() => {
  setInterval(() => {
    // Changer aléatoirement le nombre de visages
    if (Math.random() < 0.3) {
      facesDetected.value = Math.floor(Math.random() * 4) // 0-3 faces
      if (facesDetected.value > 0 && Math.random() < 0.6) {
        recognizedName.value = knownFaces[Math.floor(Math.random() * knownFaces.length)]
      } else {
        recognizedName.value = ''
      }
    }
  }, 3000)
})

defineExpose({ 
  setFaces: (count, name = '') => {
    facesDetected.value = count
    recognizedName.value = name
  }
})
</script>

<style scoped>
.face-detection-wrapper { position: relative; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.25rem; padding: 1rem; }
.face-icon { font-size: 3rem; filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.2)); transition: all 0.3s ease; }
.face-icon.has-faces { animation: pulse 1.5s ease-in-out infinite; filter: drop-shadow(0 0 15px rgba(59, 130, 246, 0.6)); }
@keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
.face-count { font-size: 2.5rem; font-weight: 700; line-height: 1; color: #3b82f6; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif; filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.4)); }
.face-label { font-size: 0.875rem; font-weight: 600; color: rgba(156, 163, 175, 1); text-transform: uppercase; letter-spacing: 0.1em; }
.recognized-name { margin-top: 0.5rem; padding: 0.25rem 0.75rem; font-size: 0.75rem; font-weight: 600; color: rgba(16, 185, 129, 1); background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 9999px; animation: fadeIn 0.3s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
</style>

