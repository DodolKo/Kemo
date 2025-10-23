<template>
  <AppWidget variant="compact" size="lg" :width="1" :height="1">
    <div class="uptime-wrapper">
      <!-- Icône horloge -->
      <div class="uptime-icon">⏱️</div>
      
      <!-- Temps écoulé -->
      <div class="uptime-display">
        <div class="time-part">
          <span class="time-value">{{ days }}</span>
          <span class="time-unit">d</span>
        </div>
        <span class="time-separator">:</span>
        <div class="time-part">
          <span class="time-value">{{ hours }}</span>
          <span class="time-unit">h</span>
        </div>
        <span class="time-separator">:</span>
        <div class="time-part">
          <span class="time-value">{{ minutes }}</span>
          <span class="time-unit">m</span>
        </div>
      </div>
      
      <div class="uptime-label">Uptime</div>
    </div>
  </AppWidget>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import AppWidget from '@/components/ui/AppWidget.vue'

const startTime = ref(Date.now() - Math.random() * 86400000 * 3) // 0-3 jours aléatoires
const currentTime = ref(Date.now())

let intervalId = null

const elapsed = computed(() => Math.floor((currentTime.value - startTime.value) / 1000))
const days = computed(() => Math.floor(elapsed.value / 86400))
const hours = computed(() => Math.floor((elapsed.value % 86400) / 3600))
const minutes = computed(() => Math.floor((elapsed.value % 3600) / 60))

onMounted(() => {
  intervalId = setInterval(() => {
    currentTime.value = Date.now()
  }, 1000)
})

onBeforeUnmount(() => { if (intervalId) clearInterval(intervalId) })

defineExpose({ reset: () => { startTime.value = Date.now() } })
</script>

<style scoped>
.uptime-wrapper { position: relative; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.5rem; padding: 1rem; }
.uptime-icon { font-size: 2rem; filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.2)); }
.uptime-display { display: flex; align-items: baseline; gap: 0.25rem; }
.time-part { display: flex; align-items: baseline; gap: 0.125rem; }
.time-value { font-size: 1.5rem; font-weight: 700; color: rgba(229, 231, 235, 1); font-family: 'SF Mono', monospace; }
.time-unit { font-size: 0.75rem; font-weight: 600; color: rgba(156, 163, 175, 1); }
.time-separator { font-size: 1.25rem; color: rgba(156, 163, 175, 0.5); margin: 0 0.125rem; }
.uptime-label { font-size: 0.875rem; font-weight: 600; color: rgba(156, 163, 175, 1); text-transform: uppercase; margin-top: 0.25rem; }
</style>

