<template>
  <AppWidget variant="compact" size="lg" :width="2" :height="2">
    <template #header>
      <div class="flex items-center gap-2">
        <span class="calendar-icon">📅</span>
        <h3 class="text-primary font-semibold text-sm">Calendar</h3>
      </div>
      <div class="flex items-center gap-2">
        <button class="today-btn" @click="goToToday" title="Go to today">Today</button>
      </div>
    </template>

    <!-- Calendar View Inline -->
    <div class="calendar-view-wrapper">
      <div class="calendar-header">
        <button class="nav-btn" @click="previousMonth">‹</button>
        <div class="month-year">
          <span class="month-name">{{ currentMonthName }}</span>
          <span class="year-name">{{ currentYear }}</span>
        </div>
        <button class="nav-btn" @click="nextMonth">›</button>
      </div>
      <div class="weekdays">
        <div v-for="day in weekdayNames" :key="day" class="weekday">{{ day }}</div>
      </div>
      <div class="calendar-grid">
        <div v-for="day in calendarDays" :key="day.id" class="calendar-day" :class="{ 'other-month': !day.isCurrentMonth, 'today': day.isToday, 'has-event': day.hasEvent, 'selected': day.isSelected }" @click="selectDay(day)">
          <span class="day-number">{{ day.number }}</span>
          <div v-if="day.hasEvent" class="event-dot" />
        </div>
      </div>
      <div v-if="selectedDay && eventsForSelectedDay.length > 0" class="events-section">
        <div class="events-title">Events</div>
        <div class="events-list">
          <div v-for="event in eventsForSelectedDay" :key="event.id" class="event-item" :style="{ borderLeftColor: event.color }">
            <span class="event-time">{{ event.time }}</span>
            <span class="event-name">{{ event.title }}</span>
          </div>
        </div>
      </div>
    </div>

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
import { ref, computed, onMounted } from 'vue'
import AppWidget from '@/components/ui/AppWidget.vue'

const props = defineProps({ initialEvents: { type: Array, default: () => [] } })

const currentDate = ref(new Date())
const selectedDay = ref(null)
const events = ref([])

const weekdayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const currentMonth = computed(() => currentDate.value.getMonth())
const currentYear = computed(() => currentDate.value.getFullYear())
const currentMonthName = computed(() => monthNames[currentMonth.value])
const eventCount = computed(() => events.value.length)
const selectedDateFormatted = computed(() => {
  if (!selectedDay.value) return 'None'
  const date = selectedDay.value.date
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
})

const calendarDays = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value
  const firstDay = new Date(year, month, 1)
  const firstDayWeekday = firstDay.getDay()
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  const days = []
  let dayId = 0
  
  for (let i = firstDayWeekday - 1; i >= 0; i--) {
    const dayNum = prevMonthLastDay - i
    days.push({ id: dayId++, number: dayNum, date: new Date(year, month - 1, dayNum), isCurrentMonth: false, isToday: false, hasEvent: false, isSelected: false })
  }
  
  const today = new Date()
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i)
    const isToday = date.toDateString() === today.toDateString()
    const hasEvent = hasEventOnDate(date)
    const isSelected = selectedDay.value && date.toDateString() === selectedDay.value.date.toDateString()
    days.push({ id: dayId++, number: i, date, isCurrentMonth: true, isToday, hasEvent, isSelected })
  }
  
  const remainingDays = 42 - days.length
  for (let i = 1; i <= remainingDays; i++) {
    days.push({ id: dayId++, number: i, date: new Date(year, month + 1, i), isCurrentMonth: false, isToday: false, hasEvent: false, isSelected: false })
  }
  
  return days
})

const eventsForSelectedDay = computed(() => {
  if (!selectedDay.value) return []
  return events.value.filter(event => {
    const eventDate = new Date(event.date)
    return eventDate.toDateString() === selectedDay.value.date.toDateString()
  })
})

function hasEventOnDate(date) {
  return events.value.some(event => {
    const eventDate = new Date(event.date)
    return eventDate.toDateString() === date.toDateString()
  })
}

function selectDay(day) { selectedDay.value = day }

function previousMonth() { currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1) }

function nextMonth() { currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1) }

function goToToday() {
  currentDate.value = new Date()
  const today = calendarDays.value.find(day => day.isToday)
  if (today) selectDay(today)
}

function generateSampleEvents() {
  const today = new Date()
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
  events.value = [
    { id: 1, title: 'Team Meeting', date: new Date(today.getFullYear(), today.getMonth(), today.getDate()), time: '10:00', color: colors[0] },
    { id: 2, title: 'Lunch Break', date: new Date(today.getFullYear(), today.getMonth(), today.getDate()), time: '12:30', color: colors[1] },
    { id: 3, title: 'Project Review', date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2), time: '14:00', color: colors[2] },
    { id: 4, title: 'Workout', date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5), time: '18:00', color: colors[3] },
    { id: 5, title: 'Doctor Appointment', date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7), time: '09:30', color: colors[4] }
  ]
}

onMounted(() => {
  if (props.initialEvents.length > 0) {
    events.value = props.initialEvents
  } else {
    generateSampleEvents()
  }
  const today = calendarDays.value.find(day => day.isToday)
  if (today) selectDay(today)
})

defineExpose({ events, selectedDay, goToToday })
</script>

<style scoped>
.calendar-icon { font-size: 1rem; }
.today-btn { padding: 0.375rem 0.75rem; font-size: 0.75rem; font-weight: 600; border-radius: 0.375rem; background: rgba(59, 130, 246, 0.2); color: rgba(59, 130, 246, 1); border: 1px solid rgba(59, 130, 246, 0.5); cursor: pointer; transition: all 0.2s ease; font-family: inherit; }
.today-btn:hover { background: rgba(59, 130, 246, 0.3); transform: translateY(-1px); }
.calendar-footer { display: flex; align-items: center; justify-content: space-between; }
.footer-stat { display: flex; flex-direction: column; gap: 0.125rem; }
.footer-label { font-size: 0.75rem; line-height: 1rem; color: rgb(156, 163, 175); }
.footer-value { font-size: 0.875rem; line-height: 1.25rem; font-weight: 600; color: rgb(229, 231, 235); }
.calendar-view-wrapper { position: relative; width: 100%; height: 100%; display: flex; flex-direction: column; padding: 1rem; box-sizing: border-box; gap: 0.75rem; }
.calendar-header { display: flex; align-items: center; justify-content: space-between; padding-bottom: 0.5rem; }
.nav-btn { width: 2rem; height: 2rem; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; background: rgba(75, 85, 99, 0.3); border: 1px solid rgba(75, 85, 99, 0.5); border-radius: 0.375rem; color: rgba(229, 231, 235, 1); cursor: pointer; transition: all 0.2s ease; }
.nav-btn:hover { background: rgba(75, 85, 99, 0.5); transform: scale(1.1); }
.month-year { display: flex; flex-direction: column; align-items: center; gap: 0.125rem; }
.month-name { font-size: 1rem; font-weight: 700; color: rgba(229, 231, 235, 1); }
.year-name { font-size: 0.75rem; color: rgba(156, 163, 175, 1); }
.weekdays { display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.25rem; }
.weekday { text-align: center; font-size: 0.7rem; font-weight: 600; color: rgba(156, 163, 175, 1); text-transform: uppercase; padding: 0.25rem; }
.calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.25rem; flex: 1; }
.calendar-day { position: relative; aspect-ratio: 1; display: flex; align-items: center; justify-content: center; background: rgba(31, 41, 55, 0.3); border-radius: 0.375rem; cursor: pointer; transition: all 0.2s ease; border: 1px solid transparent; }
.calendar-day:hover { background: rgba(31, 41, 55, 0.5); transform: scale(1.05); }
.calendar-day.other-month { opacity: 0.3; }
.calendar-day.today { background: rgba(16, 185, 129, 0.2); border-color: rgba(16, 185, 129, 0.5); }
.calendar-day.selected { background: rgba(59, 130, 246, 0.3); border-color: rgba(59, 130, 246, 0.6); }
.day-number { font-size: 0.875rem; font-weight: 500; color: rgba(229, 231, 235, 1); }
.event-dot { position: absolute; bottom: 0.25rem; width: 4px; height: 4px; background: #3b82f6; border-radius: 50%; box-shadow: 0 0 6px rgba(59, 130, 246, 0.8); }
.events-section { display: flex; flex-direction: column; gap: 0.5rem; padding-top: 0.75rem; border-top: 1px solid rgba(75, 85, 99, 0.3); }
.events-title { font-size: 0.75rem; font-weight: 700; color: rgba(156, 163, 175, 1); text-transform: uppercase; letter-spacing: 0.05em; }
.events-list { display: flex; flex-direction: column; gap: 0.375rem; max-height: 6rem; overflow-y: auto; }
.events-list::-webkit-scrollbar { width: 3px; }
.events-list::-webkit-scrollbar-track { background: rgba(75, 85, 99, 0.2); }
.events-list::-webkit-scrollbar-thumb { background: rgba(75, 85, 99, 0.5); border-radius: 2px; }
.event-item { display: flex; align-items: center; gap: 0.5rem; padding: 0.375rem 0.5rem; background: rgba(31, 41, 55, 0.4); border-left: 3px solid; border-radius: 0.25rem; font-size: 0.75rem; }
.event-time { font-weight: 600; color: rgba(156, 163, 175, 1); flex-shrink: 0; }
.event-name { color: rgba(229, 231, 235, 1); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.flex { display: flex; }
.items-center { align-items: center; }
.gap-2 { gap: 0.5rem; }
.text-primary { color: rgb(229, 231, 235); }
.text-muted { color: rgb(156, 163, 175); }
.font-semibold { font-weight: 600; }
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }
.text-xs { font-size: 0.75rem; line-height: 1rem; }
.ml-auto { margin-left: auto; }
@media (max-width: 640px) { .day-number { font-size: 0.75rem; } .weekday { font-size: 0.65rem; } }
</style>
