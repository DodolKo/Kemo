<template>
  <AppWidget variant="compact" size="lg" :width="1" :height="1">
    <div class="distance-wrapper">
      <!-- Radar visuel -->
      <div class="radar-display">
        <div class="radar-circle outer"></div>
        <div class="radar-circle middle"></div>
        <div class="radar-circle inner"></div>
        <div class="radar-sweep"></div>
        <div class="obstacle-dot" v-if="distance < 100" :style="{ transform: `scale(${1 - distance/100})` }"></div>
      </div>
      
      <!-- Distance -->
      <div class="distance-value" :class="{ warning: distance < 30 }">{{ distance }} cm</div>
      <div class="distance-label">Distance</div>
    </div>
  </AppWidget>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import AppWidget from '@/components/ui/AppWidget.vue'

const distance = ref(150)
let intervalId = null

function simulateData() {
  distance.value = Math.max(5, Math.min(200, distance.value + (Math.random() - 0.5) * 20))
  distance.value = Math.round(distance.value)
}

onMounted(() => {
  intervalId = setInterval(simulateData, 500)
})

onBeforeUnmount(() => { if (intervalId) clearInterval(intervalId) })

defineExpose({ setDistance: (d) => { distance.value = d } })
</script>

<style scoped>
.distance-wrapper { position: relative; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.5rem; padding: 1rem; }
.radar-display { position: relative; width: 100px; height: 100px; }
.radar-circle { position: absolute; border: 2px solid rgba(59, 130, 246, 0.3); border-radius: 50%; }
.outer { width: 100%; height: 100%; }
.middle { width: 66%; height: 66%; top: 17%; left: 17%; }
.inner { width: 33%; height: 33%; top: 33.5%; left: 33.5%; }
.radar-sweep { position: absolute; width: 2px; height: 50%; background: linear-gradient(to top, rgba(59, 130, 246, 0.8), transparent); transform-origin: bottom center; bottom: 50%; left: 50%; animation: sweep 2s linear infinite; }
@keyframes sweep { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.obstacle-dot { position: absolute; width: 12px; height: 12px; background: #ef4444; border-radius: 50%; top: 50%; left: 50%; transform: translate(-50%, -50%); box-shadow: 0 0 15px rgba(239, 68, 68, 0.8); animation: pulse 1s ease-in-out infinite; }
.distance-value { font-size: 2rem; font-weight: 700; color: #3b82f6; font-family: 'SF Mono', monospace; transition: color 0.3s; }
.distance-value.warning { color: #ef4444; animation: pulse 1s ease-in-out infinite; }
.distance-label { font-size: 0.875rem; font-weight: 600; color: rgba(156, 163, 175, 1); text-transform: uppercase; }
</style>

