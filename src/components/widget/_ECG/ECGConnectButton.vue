<template>
  <!-- Invisible full-area button placed by parent inside AppWidget -->
  <button
    class="ecg-connect-btn"
    @click.stop.prevent="handleClick"
    aria-label="Connect ECG"
  />
</template>

<script setup>
import { inject } from 'vue'
import { useECGStore } from '@/stores/ecg'

const openModal = inject('openModal', null)
const ecg = useECGStore()

function handleClick() {
  try {
    // If ECG store exposes isRunning() use it; otherwise rely on falsy check
    const running = typeof ecg.isRunning === 'function' ? ecg.isRunning() : false
    if (!running && openModal) {
      openModal('BluetoothConnect')
    }
  } catch (e) {
    // noop
  }
}
</script>

<style scoped>
.ecg-connect-btn {
  position: absolute;
  inset: 0; /* top:0; right:0; bottom:0; left:0 */
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  z-index: 999;
}
</style>


