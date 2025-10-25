<script setup>
import { ref, provide } from 'vue'
import AppHeader from "@/components/layout/AppHeader.vue"
import AppFooter from "@/components/layout/AppFooter.vue"
import BluetoothConnect from "@/components/modals/BluetoothConnect.vue"
import { RouterView } from 'vue-router'

// System de modal simple
const activeModal = ref(null)

function openModal(modalName) {
  activeModal.value = modalName
}

function closeModal() {
  activeModal.value = null
}

// Fournir la fonction openModal à tous les composants enfants
provide('openModal', openModal)
</script>

<template>
  <div class="min-h-screen flex flex-col items-center bg-gray-200 dark:bg-gray-800">
    <AppHeader />
    
    <RouterView />

    <AppFooter />
    
    <!-- Modals -->
    <BluetoothConnect v-if="activeModal === 'BluetoothConnect'" @close="closeModal" />
  </div>
</template>

