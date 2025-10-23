<template>
  <AppWidget variant="compact" size="lg" :width="2" :height="2">
    <template #header>
      <div class="flex items-center gap-2">
        <span class="mode-icon">{{ modeIcon }}</span>
        <h3 class="text-primary font-semibold text-sm">{{ modeTitle }}</h3>
      </div>
    </template>

    <!-- Timer Display Inline -->
    <div class="timer-display-wrapper">
      <div class="time-display">
        <div class="time-segment"><span class="time-value">{{ displayHours }}</span><span class="time-label">Hours</span></div>
        <span class="time-separator">:</span>
        <div class="time-segment"><span class="time-value">{{ displayMinutes }}</span><span class="time-label">Minutes</span></div>
        <span class="time-separator">:</span>
        <div class="time-segment"><span class="time-value">{{ displaySeconds }}</span><span class="time-label">Seconds</span></div>
      </div>
      <div class="timer-controls">
        <button class="control-button primary-btn" @click="handleStartPause" :disabled="mode === 'countdown' && !countdownDuration">{{ isRunning ? '⏸ Pause' : '▶ Start' }}</button>
        <button class="control-button secondary-btn" @click="handleReset">🔄 Reset</button>
        <button class="control-button mode-btn" @click="toggleMode">{{ mode === 'stopwatch' ? '⏱️ Stopwatch' : '⏲️ Countdown' }}</button>
      </div>
      <div v-if="mode === 'countdown' && !isRunning" class="countdown-input"><input type="number" v-model.number="inputMinutes" min="0" max="999" placeholder="Minutes" class="time-input" /><span class="input-label">minutes</span></div>
      <div v-if="mode === 'countdown' && countdownDuration > 0" class="progress-bar"><div class="progress-fill" :style="{ width: progressPercentage + '%' }" /></div>
    </div>

    <template #footer>
      <div class="timer-footer">
        <div class="footer-stat"><span class="footer-label">Status</span><span class="footer-value" :class="statusClass">{{ status }}</span></div>
        <span class="text-muted text-xs ml-auto">{{ mode }}</span>
      </div>
    </template>
  </AppWidget>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import AppWidget from '@/components/ui/AppWidget.vue'

const props = defineProps({ initialMode: { type: String, default: 'stopwatch', validator: (v) => ['stopwatch','countdown'].includes(v) } })

const mode = ref(props.initialMode)
const isRunning = ref(false)
const elapsedTime = ref(0)
const countdownDuration = ref(0)
const inputMinutes = ref(5)
const startTime = ref(0)
const pausedTime = ref(0)
const status = ref('Ready')
const isComplete = ref(false)

let intervalId = null

const modeIcon = computed(() => mode.value === 'stopwatch' ? '⏱️' : '⏲️')
const modeTitle = computed(() => mode.value === 'stopwatch' ? 'Stopwatch' : 'Countdown Timer')
const statusClass = computed(() => { if (isComplete.value) return 'status-complete'; if (status.value === 'Running') return 'status-running'; return 'status-ready' })
const totalSeconds = computed(() => mode.value === 'stopwatch' ? Math.floor(elapsedTime.value/1000) : Math.floor(Math.max(0,countdownDuration.value - elapsedTime.value)/1000))
const displayHours = computed(()=>String(Math.floor(totalSeconds.value/3600)).padStart(2,'0'))
const displayMinutes = computed(()=>String(Math.floor((totalSeconds.value%3600)/60)).padStart(2,'0'))
const displaySeconds = computed(()=>String(totalSeconds.value%60).padStart(2,'0'))
const progressPercentage = computed(()=> mode.value!=='countdown' || countdownDuration.value===0 ? 0 : (Math.max(0,countdownDuration.value - elapsedTime.value)/countdownDuration.value)*100)

function start(){ if(isRunning.value) return; if(mode.value==='countdown' && countdownDuration.value===0){ countdownDuration.value = inputMinutes.value*60*1000; elapsedTime.value=0 } isRunning.value=true; startTime.value=Date.now()-pausedTime.value; status.value='Running'; isComplete.value=false; intervalId=setInterval(()=>{ elapsedTime.value = Date.now()-startTime.value; if(mode.value==='countdown' && elapsedTime.value>=countdownDuration.value){ complete() } },10) }
function pause(){ if(!isRunning.value) return; isRunning.value=false; pausedTime.value=elapsedTime.value; if(intervalId){ clearInterval(intervalId); intervalId=null } }
function reset(){ pause(); elapsedTime.value=0; pausedTime.value=0; startTime.value=0; status.value='Ready'; isComplete.value=false; if(mode.value==='countdown') countdownDuration.value=0 }
function complete(){ pause(); status.value='Complete!'; isComplete.value=true }
function handleStartPause(){ isRunning.value ? pause() : start() }
function handleReset(){ reset() }
function toggleMode(){ reset(); mode.value = mode.value==='stopwatch'?'countdown':'stopwatch' }

onBeforeUnmount(()=>{ if(intervalId) clearInterval(intervalId) })
defineExpose({ start, pause, reset })
</script>

<style scoped>
.timer-footer { display: flex; align-items: center; justify-content: space-between; }
.footer-stat { display: flex; flex-direction: column; gap: 0.125rem; }
.footer-label { font-size: 0.75rem; line-height: 1rem; color: rgb(156, 163, 175); }
.footer-value { font-size: 0.875rem; line-height: 1.25rem; font-weight: 600; }
.status-ready { color: rgb(156, 163, 175); }
.status-running { color: rgb(16, 185, 129); animation: pulse-status 2s ease-in-out infinite; }
.status-complete { color: rgb(59, 130, 246); }
@keyframes pulse-status { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
.mode-icon { font-size: 1rem; }
.timer-display-wrapper { position: relative; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2rem; padding: 1.5rem; box-sizing: border-box; }
.time-display { display: flex; align-items: center; gap: 0.5rem; }
.time-segment { display: flex; flex-direction: column; align-items: center; gap: 0.25rem; }
.time-value { font-size: 3.5rem; font-weight: 700; line-height: 1; color: #10b981; font-family: 'SF Mono', 'Monaco', 'Courier New', monospace; filter: drop-shadow(0 0 15px rgba(16, 185, 129, 0.6)); }
.time-separator { font-size: 3rem; font-weight: 700; color: rgba(156, 163, 175, 0.5); margin: 0 0.25rem; animation: blink 1s ease-in-out infinite; }
@keyframes blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0.3; } }
.time-label { font-size: 0.65rem; font-weight: 600; color: rgba(156, 163, 175, 1); text-transform: uppercase; }
.timer-controls { display: flex; gap: 0.75rem; flex-wrap: wrap; justify-content: center; }
.control-button { padding: 0.75rem 1.5rem; font-size: 0.875rem; font-weight: 600; border-radius: 0.5rem; border: none; cursor: pointer; transition: all 0.2s; }
.primary-btn { background: linear-gradient(135deg, #10b981, #059669); color: white; }
.primary-btn:hover:not(:disabled) { transform: translateY(-2px); }
.primary-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.secondary-btn { background: rgba(75, 85, 99, 0.4); color: rgba(229, 231, 235, 1); border: 1px solid rgba(75, 85, 99, 0.5); }
.secondary-btn:hover { background: rgba(75, 85, 99, 0.6); transform: translateY(-2px); }
.mode-btn { background: rgba(59, 130, 246, 0.2); color: rgba(59, 130, 246, 1); border: 1px solid rgba(59, 130, 246, 0.5); }
.mode-btn:hover { background: rgba(59, 130, 246, 0.3); transform: translateY(-2px); }
.countdown-input { display: flex; align-items: center; gap: 0.5rem; }
.time-input { width: 5rem; padding: 0.5rem; font-size: 1rem; font-weight: 600; text-align: center; background: rgba(31, 41, 55, 0.5); border: 1px solid rgba(75, 85, 99, 0.5); border-radius: 0.375rem; color: rgba(229, 231, 235, 1); }
.input-label { font-size: 0.875rem; color: rgba(156, 163, 175, 1); }
.progress-bar { width: 100%; height: 6px; background: rgba(75, 85, 99, 0.3); border-radius: 9999px; overflow: hidden; }
.progress-fill { height: 100%; background: linear-gradient(90deg, #10b981, #3b82f6); border-radius: 9999px; transition: width 0.1s linear; }
.flex { display: flex; }
.items-center { align-items: center; }
.gap-2 { gap: 0.5rem; }
.text-primary { color: rgb(229, 231, 235); }
.text-muted { color: rgb(156, 163, 175); }
.font-semibold { font-weight: 600; }
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }
.text-xs { font-size: 0.75rem; line-height: 1rem; }
.ml-auto { margin-left: auto; }
@media (max-width: 640px) { .time-value { font-size: 2.5rem; } .time-separator { font-size: 2rem; } .control-button { padding: 0.5rem 1rem; font-size: 0.75rem; } }
</style>
