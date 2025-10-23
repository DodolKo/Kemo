<template>
  <AppWidget variant="compact" size="lg" :width="1" :height="1">
    <div class="light-wrapper">
      <!-- Soleil/Lune avec luminosité -->
      <div class="light-icon" :style="{ opacity: brightness / 100 }">
        {{ lightIcon }}
      </div>
      
      <!-- Valeur luminosité -->
      <div class="light-value">{{ brightness }}%</div>
      <div class="light-label">Light</div>
      
      <!-- Barre de luminosité -->
      <div class="light-bar">
        <div class="light-fill" :style="{ width: brightness + '%' }"></div>
      </div>
    </div>
  </AppWidget>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import AppWidget from '@/components/ui/AppWidget.vue'

const brightness = ref(65)
let intervalId = null

const lightIcon = computed(() => brightness.value > 50 ? '☀️' : '🌙')

function simulateData() {
  brightness.value = Math.max(0, Math.min(100, brightness.value + (Math.random() - 0.5) * 5))
  brightness.value = Math.round(brightness.value)
}

onMounted(() => {
  intervalId = setInterval(simulateData, 2000)
})

onBeforeUnmount(() => { if (intervalId) clearInterval(intervalId) })

defineExpose({ setBrightness: (b) => { brightness.value = b } })
</script>

<style scoped>
.light-wrapper { position: relative; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.5rem; padding: 1rem; }
.light-icon { font-size: 3rem; transition: opacity 0.5s ease; filter: drop-shadow(0 0 15px rgba(255, 200, 0, 0.5)); }
.light-value { font-size: 2rem; font-weight: 700; color: rgba(229, 231, 235, 1); font-family: 'SF Mono', monospace; }
.light-label { font-size: 0.875rem; font-weight: 600; color: rgba(156, 163, 175, 1); text-transform: uppercase; }
.light-bar { width: 100%; max-width: 120px; height: 6px; background: rgba(75, 85, 99, 0.3); border-radius: 9999px; overflow: hidden; }
.light-fill { height: 100%; background: linear-gradient(90deg, #f59e0b, #fbbf24); border-radius: 9999px; transition: width 0.5s ease; box-shadow: 0 0 10px rgba(251, 191, 36, 0.5); }
</style>

