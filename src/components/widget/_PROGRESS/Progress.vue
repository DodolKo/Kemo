<template>
  <AppWidget variant="compact" size="lg" :width="1" :height="2">
    <!-- Header -->
    <template #header>
      <div class="flex items-center gap-2">
        <h3 class="text-primary font-semibold text-sm">Goals Progress</h3>
        <span class="completion-badge">{{ completedCount }}/{{ totalCount }}</span>
      </div>
    </template>

    <!-- Progress Display -->
    <ProgressDisplay
      ref="progressDisplayRef"
      :initial-goals="initialGoals"
      :allow-add="allowAdd"
      :auto-progress="autoProgress"
      @update:goals="handleGoalsUpdate"
      @goal:completed="handleGoalCompleted"
    />

    <!-- Footer -->
    <template #footer>
      <div class="progress-footer">
        <div class="footer-stat">
          <span class="footer-label">Overall</span>
          <span class="footer-value">{{ overallProgress }}%</span>
        </div>
        <span class="text-muted text-xs ml-auto">{{ completedCount }} completed</span>
      </div>
    </template>
  </AppWidget>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppWidget from '@/components/ui/AppWidget.vue'
import ProgressDisplay from './ProgressDisplay.vue'

// ============================================================================
// PROPS
// ============================================================================

const props = defineProps({
  initialGoals: {
    type: Array,
    default: () => []
  },
  allowAdd: {
    type: Boolean,
    default: true
  },
  autoProgress: {
    type: Boolean,
    default: true
  }
})

// ============================================================================
// STATE
// ============================================================================

const progressDisplayRef = ref(null)
const currentGoals = ref([])

// ============================================================================
// COMPUTED
// ============================================================================

const totalCount = computed(() => currentGoals.value.length)

const completedCount = computed(() => {
  return currentGoals.value.filter(goal => goal.progress >= 100).length
})

const overallProgress = computed(() => {
  if (currentGoals.value.length === 0) return 0
  
  const totalProgress = currentGoals.value.reduce((sum, goal) => sum + goal.progress, 0)
  return Math.round(totalProgress / currentGoals.value.length)
})

// ============================================================================
// METHODS
// ============================================================================

function handleGoalsUpdate(goals) {
  currentGoals.value = goals
}

function handleGoalCompleted(goal) {
  console.log('Goal completed:', goal.title)
  // Ici on pourrait ajouter une notification ou un effet visuel
}

function addGoal() {
  if (progressDisplayRef.value) {
    progressDisplayRef.value.addGoal()
  }
}

// ============================================================================
// EXPOSE
// ============================================================================

defineExpose({
  addGoal,
  getGoals: () => currentGoals.value,
  getProgress: () => overallProgress.value
})
</script>

<style scoped>
/* Badge de completion */
.completion-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #10b981;
  background: rgba(16, 185, 129, 0.2);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 9999px;
  font-family: 'SF Mono', 'Monaco', 'Courier New', monospace;
}

/* Footer */
.progress-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
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

