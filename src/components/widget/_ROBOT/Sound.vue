<template>
  <AppWidget variant="compact" size="lg" :width="1" :height="1">
    <div class="sound-wrapper">
      <!-- Indicateur sonore animé -->
      <div class="sound-bars">
        <div class="bar" :style="{ height: bar1 + '%' }"></div>
        <div class="bar" :style="{ height: bar2 + '%' }"></div>
        <div class="bar" :style="{ height: bar3 + '%' }"></div>
        <div class="bar" :style="{ height: bar4 + '%' }"></div>
        <div class="bar" :style="{ height: bar5 + '%' }"></div>
      </div>
      
      <!-- Niveau sonore -->
      <div class="sound-value" :class="{ loud: soundLevel > 70 }">{{ soundLevel }} dB</div>
      <div class="sound-label">Sound</div>
    </div>
  </AppWidget>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import AppWidget from '@/components/ui/AppWidget.vue'

const soundLevel = ref(35)
const bar1 = ref(20)
const bar2 = ref(40)
const bar3 = ref(60)
const bar4 = ref(40)
const bar5 = ref(20)

let intervalId = null

function simulateData() {
  soundLevel.value = Math.max(0, Math.min(100, soundLevel.value + (Math.random() - 0.5) * 15))
  soundLevel.value = Math.round(soundLevel.value)
  
  // Animer les barres
  bar1.value = Math.random() * soundLevel.value
  bar2.value = Math.random() * soundLevel.value
  bar3.value = Math.random() * soundLevel.value
  bar4.value = Math.random() * soundLevel.value
  bar5.value = Math.random() * soundLevel.value
}

onMounted(() => {
  intervalId = setInterval(simulateData, 150)
})

onBeforeUnmount(() => { if (intervalId) clearInterval(intervalId) })

defineExpose({ setSoundLevel: (level) => { soundLevel.value = level } })
</script>

<style scoped>
.sound-wrapper { position: relative; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.75rem; padding: 1rem; }
.sound-bars { display: flex; align-items: flex-end; gap: 0.25rem; height: 60px; }
.bar { width: 10px; background: linear-gradient(to top, #10b981, #3b82f6); border-radius: 2px; transition: height 0.1s ease; box-shadow: 0 0 8px rgba(16, 185, 129, 0.5); }
.sound-value { font-size: 1.5rem; font-weight: 700; color: rgba(229, 231, 235, 1); font-family: 'SF Mono', monospace; transition: color 0.3s; }
.sound-value.loud { color: #ef4444; animation: pulse 0.5s ease-in-out infinite; }
.sound-label { font-size: 0.875rem; font-weight: 600; color: rgba(156, 163, 175, 1); text-transform: uppercase; }
@keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
</style>

