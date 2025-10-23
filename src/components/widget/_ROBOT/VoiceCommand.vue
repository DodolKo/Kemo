<template>
  <AppWidget variant="compact" size="lg" :width="2" :height="1">
    <div class="voice-wrapper">
      <!-- Indicateur d'écoute -->
      <div class="voice-indicator" :class="{ listening: isListening }">
        <div class="mic-icon">🎤</div>
        <div class="sound-waves" v-if="isListening">
          <span class="wave"></span>
          <span class="wave"></span>
          <span class="wave"></span>
        </div>
      </div>
      
      <!-- Dernière commande -->
      <div class="command-display">
        <div class="command-label">Last Command</div>
        <div class="command-text">{{ lastCommand || 'Waiting...' }}</div>
        <div class="command-time" v-if="lastCommandTime">{{ formatTime(lastCommandTime) }}</div>
      </div>
    </div>
  </AppWidget>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AppWidget from '@/components/ui/AppWidget.vue'

const isListening = ref(false)
const lastCommand = ref('')
const lastCommandTime = ref(null)

const sampleCommands = [
  'Hello Kemo',
  'Dance for me',
  'What time is it?',
  'Follow me',
  'Stop',
  'Turn around',
  'Take a photo',
  'Good night'
]

function formatTime(timestamp) {
  const now = Date.now()
  const diff = Math.floor((now - timestamp) / 1000)
  if (diff < 60) return `${diff}s ago`
  const minutes = Math.floor(diff / 60)
  if (minutes < 60) return `${minutes}m ago`
  return 'Earlier'
}

// Simulation
onMounted(() => {
  setInterval(() => {
    if (Math.random() < 0.2) { // 20% chance
      isListening.value = true
      setTimeout(() => {
        isListening.value = false
        lastCommand.value = sampleCommands[Math.floor(Math.random() * sampleCommands.length)]
        lastCommandTime.value = Date.now()
      }, 2000)
    }
  }, 5000)
})

defineExpose({ 
  setCommand: (command) => {
    lastCommand.value = command
    lastCommandTime.value = Date.now()
  },
  startListening: () => { isListening.value = true },
  stopListening: () => { isListening.value = false }
})
</script>

<style scoped>
.voice-wrapper { position: relative; width: 100%; height: 100%; display: flex; align-items: center; gap: 1rem; padding: 1rem; }
.voice-indicator { position: relative; display: flex; align-items: center; justify-content: center; width: 4rem; height: 4rem; flex-shrink: 0; }
.mic-icon { font-size: 2rem; filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.2)); transition: all 0.3s ease; }
.voice-indicator.listening .mic-icon { animation: pulse 1s ease-in-out infinite; filter: drop-shadow(0 0 20px rgba(239, 68, 68, 0.8)); }
.sound-waves { position: absolute; display: flex; gap: 0.25rem; }
.wave { width: 4px; height: 20px; background: rgba(239, 68, 68, 0.6); border-radius: 2px; animation: waveAnimation 0.8s ease-in-out infinite; }
.wave:nth-child(1) { animation-delay: 0s; }
.wave:nth-child(2) { animation-delay: 0.2s; }
.wave:nth-child(3) { animation-delay: 0.4s; }
@keyframes waveAnimation { 0%, 100% { height: 10px; } 50% { height: 30px; } }
.command-display { flex: 1; display: flex; flex-direction: column; gap: 0.25rem; }
.command-label { font-size: 0.75rem; font-weight: 600; color: rgba(156, 163, 175, 1); text-transform: uppercase; letter-spacing: 0.05em; }
.command-text { font-size: 1.125rem; font-weight: 600; color: rgba(229, 231, 235, 1); }
.command-time { font-size: 0.65rem; color: rgba(107, 114, 128, 1); margin-top: 0.125rem; }
</style>

