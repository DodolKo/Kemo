<template>
  <AppWidget variant="compact" size="lg" :width="1" :height="2">
    <template #header>
      <div class="flex items-center gap-2">
        <h3 class="text-primary font-semibold text-sm">Goals Progress</h3>
        <span class="completion-badge">{{ completedCount }}/{{ totalCount }}</span>
      </div>
    </template>

    <!-- Progress Display Inline -->
    <div class="progress-display-wrapper">
      <div class="goals-list">
        <div v-for="goal in goals" :key="goal.id" class="goal-item" :class="{ completed: goal.progress >= 100 }">
          <div class="goal-header">
            <div class="goal-info">
              <span class="goal-icon">{{ goal.icon }}</span>
              <div class="goal-text">
                <span class="goal-title">{{ goal.title }}</span>
                <span class="goal-subtitle">{{ goal.current }} / {{ goal.target }} {{ goal.unit }}</span>
              </div>
            </div>
            <div class="goal-percentage">
              <span class="percentage-value" :style="{ color: getProgressColor(goal.progress) }">{{ Math.round(goal.progress) }}%</span>
            </div>
          </div>
          <div class="progress-bar-container">
            <div class="progress-bar-fill" :style="{ width: goal.progress + '%', background: getProgressGradient(goal.progress) }">
              <div class="progress-glow" />
            </div>
          </div>
        </div>
      </div>
      <button v-if="allowAdd" class="add-goal-btn" @click="addRandomGoal">➕ Add Goal</button>
    </div>

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
import { ref, computed, onMounted } from 'vue'
import AppWidget from '@/components/ui/AppWidget.vue'

const props = defineProps({
  initialGoals: { type: Array, default: () => [] },
  allowAdd: { type: Boolean, default: true },
  autoProgress: { type: Boolean, default: true }
})

const goals = ref([])
const goalTemplates = [
  { icon: '💪', title: 'Workout', unit: 'sessions', target: 10 },
  { icon: '📚', title: 'Read Books', unit: 'books', target: 5 },
  { icon: '💧', title: 'Water Intake', unit: 'liters', target: 8 },
  { icon: '🏃', title: 'Running', unit: 'km', target: 50 },
  { icon: '🎯', title: 'Tasks', unit: 'tasks', target: 20 },
  { icon: '⏰', title: 'Focus Time', unit: 'hours', target: 40 },
  { icon: '🧘', title: 'Meditation', unit: 'days', target: 30 },
  { icon: '💻', title: 'Code', unit: 'commits', target: 100 }
]

let progressInterval = null

const totalCount = computed(() => goals.value.length)
const completedCount = computed(() => goals.value.filter(g => g.progress >= 100).length)
const overallProgress = computed(() => {
  if (goals.value.length === 0) return 0
  const totalProgress = goals.value.reduce((sum, goal) => sum + goal.progress, 0)
  return Math.round(totalProgress / goals.value.length)
})

function createGoal(template, current = 0) {
  return {
    id: Date.now() + Math.random(),
    icon: template.icon,
    title: template.title,
    unit: template.unit,
    target: template.target,
    current: current,
    progress: (current / template.target) * 100
  }
}

function initializeGoals() {
  if (props.initialGoals.length > 0) {
    goals.value = [...props.initialGoals]
  } else {
    goals.value = [
      createGoal(goalTemplates[0], 7),
      createGoal(goalTemplates[1], 3),
      createGoal(goalTemplates[2], 6)
    ]
  }
}

function addRandomGoal() {
  const unusedTemplates = goalTemplates.filter(t => !goals.value.some(g => g.title === t.title))
  if (unusedTemplates.length > 0) {
    const template = unusedTemplates[Math.floor(Math.random() * unusedTemplates.length)]
    const current = Math.floor(Math.random() * template.target * 0.6)
    goals.value.push(createGoal(template, current))
  }
}

function updateProgress() {
  goals.value.forEach(goal => {
    if (goal.progress < 100) {
      const increment = Math.random() * (goal.target * 0.05)
      goal.current = Math.min(goal.target, goal.current + increment)
      goal.progress = (goal.current / goal.target) * 100
    }
  })
}

function getProgressColor(progress) {
  if (progress < 30) return '#ef4444'
  if (progress < 60) return '#f59e0b'
  if (progress < 100) return '#3b82f6'
  return '#10b981'
}

function getProgressGradient(progress) {
  if (progress < 30) return 'linear-gradient(90deg, #ef4444, #dc2626)'
  if (progress < 60) return 'linear-gradient(90deg, #f59e0b, #d97706)'
  if (progress < 100) return 'linear-gradient(90deg, #3b82f6, #2563eb)'
  return 'linear-gradient(90deg, #10b981, #059669)'
}

onMounted(() => {
  initializeGoals()
  if (props.autoProgress) {
    progressInterval = setInterval(updateProgress, 3000)
  }
})

defineExpose({ addGoal: addRandomGoal, updateProgress, goals })
</script>

<style scoped>
.completion-badge { display: inline-flex; align-items: center; padding: 0.125rem 0.5rem; font-size: 0.75rem; font-weight: 600; color: #10b981; background: rgba(16, 185, 129, 0.2); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 9999px; font-family: 'SF Mono', 'Monaco', 'Courier New', monospace; }
.progress-footer { display: flex; align-items: center; justify-content: space-between; }
.footer-stat { display: flex; flex-direction: column; gap: 0.125rem; }
.footer-label { font-size: 0.75rem; line-height: 1rem; color: rgb(156, 163, 175); }
.footer-value { font-size: 0.875rem; line-height: 1.25rem; font-weight: 600; color: rgb(16, 185, 129); }
.progress-display-wrapper { position: relative; width: 100%; height: 100%; display: flex; flex-direction: column; padding: 1rem; box-sizing: border-box; gap: 1rem; }
.goals-list { display: flex; flex-direction: column; gap: 1rem; flex: 1; overflow-y: auto; padding-right: 0.5rem; }
.goals-list::-webkit-scrollbar { width: 4px; }
.goals-list::-webkit-scrollbar-track { background: rgba(75, 85, 99, 0.2); border-radius: 2px; }
.goals-list::-webkit-scrollbar-thumb { background: rgba(75, 85, 99, 0.5); border-radius: 2px; }
.goal-item { display: flex; flex-direction: column; gap: 0.5rem; padding: 0.75rem; background: rgba(31, 41, 55, 0.3); border-radius: 0.5rem; border: 1px solid rgba(75, 85, 99, 0.3); transition: all 0.3s ease; }
.goal-item:hover { background: rgba(31, 41, 55, 0.5); border-color: rgba(75, 85, 99, 0.5); transform: translateX(4px); }
.goal-item.completed { background: rgba(16, 185, 129, 0.1); border-color: rgba(16, 185, 129, 0.3); }
.goal-header { display: flex; justify-content: space-between; align-items: center; }
.goal-info { display: flex; align-items: center; gap: 0.75rem; flex: 1; }
.goal-icon { font-size: 1.5rem; filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.2)); }
.goal-text { display: flex; flex-direction: column; gap: 0.125rem; }
.goal-title { font-size: 0.875rem; font-weight: 600; color: rgba(229, 231, 235, 1); }
.goal-subtitle { font-size: 0.75rem; color: rgba(156, 163, 175, 1); }
.goal-percentage { flex-shrink: 0; }
.percentage-value { font-size: 1.125rem; font-weight: 700; font-family: 'SF Mono', 'Monaco', 'Courier New', monospace; filter: drop-shadow(0 0 8px currentColor); transition: color 0.3s ease; }
.progress-bar-container { width: 100%; height: 8px; background: rgba(75, 85, 99, 0.3); border-radius: 9999px; overflow: hidden; position: relative; }
.progress-bar-fill { height: 100%; border-radius: 9999px; transition: width 0.5s ease, background 0.3s ease; position: relative; overflow: hidden; }
.progress-glow { position: absolute; top: 0; right: 0; width: 30px; height: 100%; background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3)); animation: slide 2s ease-in-out infinite; }
@keyframes slide { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
.add-goal-btn { padding: 0.75rem; font-size: 0.875rem; font-weight: 600; border-radius: 0.5rem; background: rgba(59, 130, 246, 0.2); color: rgba(59, 130, 246, 1); border: 1px dashed rgba(59, 130, 246, 0.5); cursor: pointer; transition: all 0.2s ease; font-family: inherit; }
.add-goal-btn:hover { background: rgba(59, 130, 246, 0.3); border-style: solid; transform: translateY(-2px); }
.flex { display: flex; }
.items-center { align-items: center; }
.gap-2 { gap: 0.5rem; }
.text-primary { color: rgb(229, 231, 235); }
.text-muted { color: rgb(156, 163, 175); }
.font-semibold { font-weight: 600; }
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }
.text-xs { font-size: 0.75rem; line-height: 1rem; }
.ml-auto { margin-left: auto; }
@media (max-width: 640px) { .goal-icon { font-size: 1.25rem; } .percentage-value { font-size: 1rem; } }
</style>
