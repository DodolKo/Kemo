<template>
  <AppWidget variant="compact" size="lg" :width="2" :height="2">
    <!-- Header -->
    <template #header>
      <div class="flex items-center gap-2">
        <span class="activity-icon">📊</span>
        <h3 class="text-primary font-semibold text-sm">Activity Heatmap</h3>
        <span class="text-muted text-xs">Last 12 weeks</span>
      </div>
    </template>

    <!-- Activity Heatmap -->
    <div class="activity-wrapper">
      <!-- Légende des jours -->
      <div class="day-labels">
        <span class="day-label">Mon</span>
        <span class="day-label">Wed</span>
        <span class="day-label">Fri</span>
      </div>

      <!-- Grille d'activité -->
      <div class="activity-grid-container">
        <!-- Labels des mois -->
        <div class="month-labels">
          <span 
            v-for="(month, index) in visibleMonths" 
            :key="index"
            class="month-label"
            :style="{ gridColumn: `span ${month.weeks}` }"
          >
            {{ month.name }}
          </span>
        </div>

        <!-- Grille des cellules -->
        <div class="activity-grid">
          <div
            v-for="day in activityDays"
            :key="day.id"
            class="activity-cell"
            :class="`level-${day.level}`"
            :title="`${day.count} contributions on ${day.dateStr}`"
            @click="selectDay(day)"
          />
        </div>
      </div>

      <!-- Légende d'intensité -->
      <div class="intensity-legend">
        <span class="legend-label">Less</span>
        <div class="legend-cell level-0" />
        <div class="legend-cell level-1" />
        <div class="legend-cell level-2" />
        <div class="legend-cell level-3" />
        <div class="legend-cell level-4" />
        <span class="legend-label">More</span>
      </div>
    </div>

    <!-- Footer -->
    <template #footer>
      <div class="activity-footer">
        <div class="footer-stat">
          <span class="footer-label">Total</span>
          <span class="footer-value">{{ totalContributions }}</span>
        </div>
        <div class="footer-stat">
          <span class="footer-label">Average/day</span>
          <span class="footer-value">{{ averagePerDay }}</span>
        </div>
        <span class="text-muted text-xs ml-auto">Demo</span>
      </div>
    </template>
  </AppWidget>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AppWidget from '@/components/ui/AppWidget.vue'

// ============================================================================
// PROPS
// ============================================================================

const props = defineProps({
  weeksToShow: {
    type: Number,
    default: 12
  }
})

// ============================================================================
// STATE
// ============================================================================

const activityDays = ref([])
const selectedDay = ref(null)

// ============================================================================
// COMPUTED
// ============================================================================

const totalContributions = computed(() => {
  return activityDays.value.reduce((sum, day) => sum + day.count, 0)
})

const averagePerDay = computed(() => {
  if (activityDays.value.length === 0) return 0
  return Math.round(totalContributions.value / activityDays.value.length)
})

const visibleMonths = computed(() => {
  const months = []
  const now = new Date()
  
  for (let i = props.weeksToShow - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000)
    const monthName = date.toLocaleDateString('en-US', { month: 'short' })
    
    // Vérifier si c'est un nouveau mois
    if (months.length === 0 || months[months.length - 1].name !== monthName) {
      months.push({
        name: monthName,
        weeks: 1
      })
    } else {
      months[months.length - 1].weeks++
    }
  }
  
  return months
})

// ============================================================================
// METHODS
// ============================================================================

/**
 * Génère les données d'activité pour les dernières semaines
 */
function generateActivityData() {
  const days = []
  const now = new Date()
  const totalDays = props.weeksToShow * 7
  
  // Commencer à un lundi
  const startDate = new Date(now)
  startDate.setDate(startDate.getDate() - totalDays)
  const dayOfWeek = startDate.getDay()
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  startDate.setDate(startDate.getDate() - daysToMonday)
  
  for (let i = 0; i < totalDays; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    
    // Générer un nombre aléatoire de contributions (simulé)
    const count = Math.floor(Math.random() * 20)
    
    // Déterminer le niveau (0-4) basé sur le nombre
    let level = 0
    if (count > 0) level = 1
    if (count > 5) level = 2
    if (count > 10) level = 3
    if (count > 15) level = 4
    
    days.push({
      id: i,
      date,
      dateStr: date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      count,
      level
    })
  }
  
  activityDays.value = days
}

/**
 * Sélectionne un jour
 */
function selectDay(day) {
  selectedDay.value = day
  console.log(`Selected day: ${day.dateStr} with ${day.count} contributions`)
}

// ============================================================================
// LIFECYCLE
// ============================================================================

onMounted(() => {
  generateActivityData()
})

// ============================================================================
// EXPOSE
// ============================================================================

defineExpose({
  refresh: generateActivityData,
  getTotalContributions: () => totalContributions.value
})
</script>

<style scoped>
.activity-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  box-sizing: border-box;
  gap: 0.75rem;
}

/* Container principal */
.activity-grid-container {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
}

/* Labels des mois */
.month-labels {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 12px;
  gap: 3px;
  padding-left: 2rem;
  margin-bottom: 0.25rem;
}

.month-label {
  font-size: 0.65rem;
  color: rgba(156, 163, 175, 1);
  text-align: left;
}

/* Grille d'activité */
.activity-grid {
  display: grid;
  grid-template-rows: repeat(7, 12px);
  grid-auto-flow: column;
  grid-auto-columns: 12px;
  gap: 3px;
  padding-left: 2rem;
  position: relative;
}

/* Labels des jours */
.day-labels {
  position: absolute;
  left: 1rem;
  top: 3.5rem;
  display: flex;
  flex-direction: column;
  gap: 3px;
  justify-content: space-between;
  height: calc(7 * 12px + 6 * 3px);
}

.day-label {
  font-size: 0.65rem;
  color: rgba(156, 163, 175, 1);
  height: 12px;
  display: flex;
  align-items: center;
}

.day-label:nth-child(1) {
  margin-top: calc(0 * 12px + 0 * 3px); /* Lundi (ligne 0) */
}

.day-label:nth-child(2) {
  margin-top: calc(2 * 12px + 2 * 3px); /* Mercredi (ligne 2) */
}

.day-label:nth-child(3) {
  margin-top: calc(4 * 12px + 4 * 3px); /* Vendredi (ligne 4) */
}

/* Cellules d'activité */
.activity-cell {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.activity-cell:hover {
  transform: scale(1.2);
  border-color: rgba(255, 255, 255, 0.3);
  z-index: 10;
}

/* Niveaux d'intensité - Style GitHub */
.activity-cell.level-0 {
  background: rgba(75, 85, 99, 0.2);
}

.activity-cell.level-1 {
  background: rgba(16, 185, 129, 0.3);
  box-shadow: 0 0 4px rgba(16, 185, 129, 0.2);
}

.activity-cell.level-2 {
  background: rgba(16, 185, 129, 0.5);
  box-shadow: 0 0 6px rgba(16, 185, 129, 0.3);
}

.activity-cell.level-3 {
  background: rgba(16, 185, 129, 0.7);
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
}

.activity-cell.level-4 {
  background: rgba(16, 185, 129, 1);
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.6);
}

/* Légende d'intensité */
.intensity-legend {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  justify-content: flex-end;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(75, 85, 99, 0.3);
}

.legend-label {
  font-size: 0.65rem;
  color: rgba(156, 163, 175, 1);
}

.legend-cell {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

/* Scrollbar personnalisée */
.activity-grid-container::-webkit-scrollbar {
  height: 4px;
}

.activity-grid-container::-webkit-scrollbar-track {
  background: rgba(75, 85, 99, 0.2);
}

.activity-grid-container::-webkit-scrollbar-thumb {
  background: rgba(75, 85, 99, 0.5);
  border-radius: 2px;
}

/* Footer */
.activity-footer {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.footer-stat {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.footer-label {
  font-size: 0.75rem;
  line-height: 1rem;
  color: rgb(156, 163, 175);
}

.footer-value {
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 600;
  color: rgb(16, 185, 129);
}

.activity-icon {
  font-size: 1rem;
}

/* Utility classes */
.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.gap-2 {
  gap: 0.5rem;
}

.text-primary {
  color: rgb(229, 231, 235);
}

.text-muted {
  color: rgb(156, 163, 175);
}

.font-semibold {
  font-weight: 600;
}

.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.text-xs {
  font-size: 0.75rem;
  line-height: 1rem;
}

.ml-auto {
  margin-left: auto;
}
</style>

