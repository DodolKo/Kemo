<template>
  <AppWidget variant="compact" size="lg" :width="1" :height="1">
    <div class="emotion-wrapper">
      <!-- Émotion actuelle avec animation -->
      <div class="emotion-face" :class="`emotion-${currentEmotion}`">
        {{ emotionIcon }}
      </div>
      
      <!-- Nom de l'émotion -->
      <div class="emotion-label">{{ emotionName }}</div>
      
      <!-- Niveau d'intensité -->
      <div class="emotion-intensity">
        <div class="intensity-bar">
          <div class="intensity-fill" :style="{ width: intensity + '%' }" />
        </div>
      </div>
    </div>
  </AppWidget>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AppWidget from '@/components/ui/AppWidget.vue'

const emotions = [
  { id: 'happy', icon: '😊', name: 'Happy' },
  { id: 'excited', icon: '🤩', name: 'Excited' },
  { id: 'curious', icon: '🤔', name: 'Curious' },
  { id: 'sleepy', icon: '😴', name: 'Sleepy' },
  { id: 'confused', icon: '😕', name: 'Confused' },
  { id: 'neutral', icon: '😐', name: 'Neutral' }
]

const currentEmotion = ref('happy')
const intensity = ref(75)

const emotionIcon = computed(() => emotions.find(e => e.id === currentEmotion.value)?.icon || '😊')
const emotionName = computed(() => emotions.find(e => e.id === currentEmotion.value)?.name || 'Happy')

// Simulation: change d'émotion aléatoirement
onMounted(() => {
  setInterval(() => {
    if (Math.random() < 0.1) { // 10% chance de changer
      currentEmotion.value = emotions[Math.floor(Math.random() * emotions.length)].id
      intensity.value = Math.round(Math.random() * 40 + 50) // 50-90%
    }
  }, 3000)
})

defineExpose({ 
  setEmotion: (emotion, level = 75) => {
    currentEmotion.value = emotion
    intensity.value = level
  },
  currentEmotion: computed(() => currentEmotion.value)
})
</script>

<style scoped>
.emotion-wrapper { position: relative; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.5rem; padding: 1rem; }
.emotion-face { font-size: 4rem; animation: emotionPulse 2s ease-in-out infinite; filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.3)); }
.emotion-happy { animation: emotionPulse 2s ease-in-out infinite, bounce 1s ease-in-out infinite; }
.emotion-excited { animation: emotionPulse 2s ease-in-out infinite, shake 0.5s ease-in-out infinite; }
.emotion-sleepy { animation: emotionPulse 3s ease-in-out infinite; opacity: 0.8; }
@keyframes emotionPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes shake { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(-5deg); } 75% { transform: rotate(5deg); } }
.emotion-label { font-size: 1rem; font-weight: 700; color: rgba(229, 231, 235, 1); text-transform: uppercase; letter-spacing: 0.05em; }
.emotion-intensity { width: 100%; max-width: 120px; }
.intensity-bar { width: 100%; height: 4px; background: rgba(75, 85, 99, 0.3); border-radius: 9999px; overflow: hidden; }
.intensity-fill { height: 100%; background: linear-gradient(90deg, #10b981, #3b82f6); border-radius: 9999px; transition: width 0.5s ease; box-shadow: 0 0 8px rgba(16, 185, 129, 0.5); }
</style>

