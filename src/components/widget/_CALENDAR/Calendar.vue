<template>
  <AppWidget variant="compact" size="lg" :width="2" :height="2">
    <!-- Header -->
    <template #header>
      <div class="flex items-center gap-2">
        <span class="calendar-icon">📅</span>
        <h3 class="text-primary font-semibold text-sm">Calendar</h3>
      </div>
      
      <div class="flex items-center gap-2">
        <button 
          class="today-btn"
          @click="goToToday"
          title="Go to today"
        >
          Today
        </button>
      </div>
    </template>

    <!-- Calendar View -->
    <CalendarView
      ref="calendarViewRef"
      :initial-events="initialEvents"
      @date:selected="handleDateSelected"
      @month:changed="handleMonthChanged"
    />

    <!-- Footer -->
    <template #footer>
      <div class="calendar-footer">
        <div class="footer-stat">
          <span class="footer-label">Selected</span>
          <span class="footer-value">{{ selectedDateFormatted }}</span>
        </div>
        <span class="text-muted text-xs ml-auto">{{ eventCount }} events</span>
      </div>
    </template>
  </AppWidget>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppWidget from '@/components/ui/AppWidget.vue'
import CalendarView from './CalendarView.vue'

// ============================================================================
// PROPS
// ============================================================================

const props = defineProps({
  initialEvents: {
    type: Array,
    default: () => []
  }
})

// ============================================================================
// STATE
// ============================================================================

const calendarViewRef = ref(null)
const selectedDate = ref(null)
const currentMonth = ref(null)

// ============================================================================
// COMPUTED
// ============================================================================

const selectedDateFormatted = computed(() => {
  if (!selectedDate.value) return 'None'
  
  const date = selectedDate.value.date
  const options = { month: 'short', day: 'numeric' }
  return date.toLocaleDateString('en-US', options)
})

const eventCount = computed(() => {
  if (!calendarViewRef.value) return 0
  return calendarViewRef.value.events?.length || 0
})

// ============================================================================
// METHODS
// ============================================================================

function handleDateSelected(day) {
  selectedDate.value = day
}

function handleMonthChanged(data) {
  currentMonth.value = data
}

function goToToday() {
  if (calendarViewRef.value) {
    calendarViewRef.value.goToToday()
  }
}

// ============================================================================
// EXPOSE
// ============================================================================

defineExpose({
  goToToday,
  getSelectedDate: () => selectedDate.value,
  getCalendarRef: () => calendarViewRef.value
})
</script>

<style scoped>
.calendar-icon {
  font-size: 1rem;
}

/* Bouton Today */
.today-btn {
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 0.375rem;
  background: rgba(59, 130, 246, 0.2);
  color: rgba(59, 130, 246, 1);
  border: 1px solid rgba(59, 130, 246, 0.5);
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.today-btn:hover {
  background: rgba(59, 130, 246, 0.3);
  transform: translateY(-1px);
}

/* Footer */
.calendar-footer {
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
  color: rgb(229, 231, 235);
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

