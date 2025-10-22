<script setup>
import AppHeader from "@/components/layout/AppHeader.vue"
import AppContent from "@/components/layout/AppContent.vue"
import AppFooter from "@/components/layout/AppFooter.vue"

import ECG from "@/components/widget/_ECG/ECG.vue"

</script>

<template>
  <div class="min-h-screen flex flex-col items-center bg-branding">
    <AppHeader />


    <AppContent>

      <ECG 
        :seconds="0.75" 
        :smoothing="3" 
        :amplitude="0.28" 
        auto-start 
      />

      <router-view />
    </AppContent>


    <AppFooter />
  </div>
</template>

<style scoped>
</style>
