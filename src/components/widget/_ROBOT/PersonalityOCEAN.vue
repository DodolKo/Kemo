<template>
  <AppWidget variant="compact" size="lg" :width="2" :height="2">
    <div class="ocean-wrapper">
      <div class="ocean-header">
        <div class="ocean-title">🧠 OCEAN Personality</div>
      </div>
      
      <!-- Radar Chart -->
      <div class="radar-container">
        <svg class="radar-svg" viewBox="0 0 400 400">
          <!-- Grid circles -->
          <circle v-for="i in 5" :key="i" 
            :cx="200" :cy="200" 
            :r="i * 30" 
            fill="none" 
            stroke="rgba(156, 163, 175, 0.15)" 
            stroke-width="1"
          />
          
          <!-- Axis lines -->
          <g v-for="(trait, index) in traits" :key="trait.name">
            <line
              :x1="200"
              :y1="200"
              :x2="200 + Math.cos(getAngle(index)) * 150"
              :y2="200 + Math.sin(getAngle(index)) * 150"
              stroke="rgba(156, 163, 175, 0.3)"
              stroke-width="1"
            />
            
            <!-- Labels -->
            <text
              :x="200 + Math.cos(getAngle(index)) * 170"
              :y="200 + Math.sin(getAngle(index)) * 170"
              text-anchor="middle"
              dominant-baseline="middle"
              class="trait-label"
              :class="{ 'label-top': index <= 1, 'label-bottom': index > 1 }"
            >
              {{ trait.short }}
            </text>
          </g>
          
          <!-- Data polygon with glow -->
          <polygon
            :points="polygonPoints"
            :fill="polygonFill"
            :stroke="polygonStroke"
            stroke-width="3"
            stroke-linejoin="round"
            class="data-polygon"
            :style="{ filter: polygonGlow }"
          />
          
          <!-- Data points -->
          <circle
            v-for="(trait, index) in traits"
            :key="'point-' + trait.name"
            :cx="200 + Math.cos(getAngle(index)) * (trait.value * 1.5)"
            :cy="200 + Math.sin(getAngle(index)) * (trait.value * 1.5)"
            r="5"
            :fill="polygonStroke"
            class="data-point"
          />
        </svg>
      </div>
      
      <!-- Legend -->
      <div class="ocean-legend">
        <div v-for="trait in traits" :key="trait.name" class="legend-item">
          <span class="legend-label">{{ trait.short }}</span>
          <div class="legend-bar-bg">
            <div 
              class="legend-bar" 
              :style="{ 
                width: trait.value + '%',
                background: getTraitColor(trait.value)
              }"
            />
          </div>
          <span class="legend-value">{{ trait.value }}</span>
        </div>
      </div>
    </div>
  </AppWidget>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import AppWidget from '@/components/ui/AppWidget.vue'

const props = defineProps({
  updateInterval: { type: Number, default: 5000 }, // Slow update
  simulation: { type: Boolean, default: true },
  autoStart: { type: Boolean, default: true }
})

const traits = ref([
  { name: 'Openness', short: 'O', value: 75 },
  { name: 'Conscientiousness', short: 'C', value: 65 },
  { name: 'Extraversion', short: 'E', value: 80 },
  { name: 'Agreeableness', short: 'A', value: 70 },
  { name: 'Neuroticism', short: 'N', value: 45 }
])

let intervalId = null

function getAngle(index) {
  // Start from top and go clockwise
  return (index * (2 * Math.PI / 5)) - (Math.PI / 2)
}

const polygonPoints = computed(() => {
  return traits.value.map((trait, index) => {
    const x = 200 + Math.cos(getAngle(index)) * (trait.value * 1.5)
    const y = 200 + Math.sin(getAngle(index)) * (trait.value * 1.5)
    return `${x},${y}`
  }).join(' ')
})

const polygonFill = computed(() => 'rgba(99, 102, 241, 0.15)')
const polygonStroke = computed(() => '#6366f1')
const polygonGlow = computed(() => 'drop-shadow(0 0 8px #6366f1) drop-shadow(0 0 12px #6366f160)')

function getTraitColor(value) {
  if (value >= 75) return '#10b981'
  if (value >= 50) return '#3b82f6'
  if (value >= 25) return '#f59e0b'
  return '#ef4444'
}

function simulateData() {
  // Slow, subtle changes
  traits.value.forEach(trait => {
    trait.value = Math.min(100, Math.max(0, trait.value + (Math.random() - 0.5) * 3))
    trait.value = Math.round(trait.value)
  })
}

function start() {
  if (intervalId) return
  if (props.simulation) {
    intervalId = setInterval(simulateData, props.updateInterval)
  }
}

function stop() {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

onMounted(() => {
  if (props.autoStart) start()
})

onBeforeUnmount(() => stop())

defineExpose({ 
  start, 
  stop, 
  traits: computed(() => traits.value),
  setTrait: (name, value) => {
    const trait = traits.value.find(t => t.name === name || t.short === name)
    if (trait) trait.value = Math.min(100, Math.max(0, value))
  }
})
</script>

<style scoped>
.ocean-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 1rem;
  gap: 0.75rem;
}

.ocean-header {
  display: flex;
  justify-content: center;
  align-items: center;
}

.ocean-title {
  font-size: 1rem;
  font-weight: 700;
  color: rgba(156, 163, 175, 1);
  letter-spacing: 0.05em;
}

.radar-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 0;
}

.radar-svg {
  width: 100%;
  height: 100%;
  max-width: 280px;
  max-height: 280px;
}

.trait-label {
  font-size: 14px;
  font-weight: 600;
  fill: rgba(156, 163, 175, 1);
  user-select: none;
}

.label-top {
  transform: translateY(-4px);
}

.label-bottom {
  transform: translateY(4px);
}

.data-polygon {
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.data-point {
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  filter: drop-shadow(0 0 4px currentColor);
}

.ocean-legend {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: 0.5rem;
  background: rgba(75, 85, 99, 0.1);
  border-radius: 0.5rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
}

.legend-label {
  font-weight: 600;
  color: rgba(156, 163, 175, 1);
  width: 1.5rem;
  text-align: center;
}

.legend-bar-bg {
  flex: 1;
  height: 6px;
  background: rgba(75, 85, 99, 0.2);
  border-radius: 3px;
  overflow: hidden;
}

.legend-bar {
  height: 100%;
  border-radius: 3px;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s ease;
}

.legend-value {
  font-weight: 700;
  color: rgba(209, 213, 219, 1);
  width: 2rem;
  text-align: right;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif;
}

@media (max-width: 640px) {
  .ocean-wrapper {
    padding: 0.75rem;
    gap: 0.5rem;
  }
  
  .ocean-title {
    font-size: 0.875rem;
  }
  
  .trait-label {
    font-size: 12px;
  }
  
  .legend-item {
    font-size: 0.7rem;
  }
}
</style>

