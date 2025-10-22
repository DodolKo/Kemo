<script setup>
import AppHeader from "@/components/layout/AppHeader.vue"
import AppContent from "@/components/layout/AppContent.vue"
import AppFooter from "@/components/layout/AppFooter.vue"

import AppWidget from "@/components/ui/AppWidget.vue"
import ECGGraph from "@/components/widget/_ECG/ECGGraph.vue"

</script>

<template>
  <div class="min-h-screen flex flex-col items-center bg-gray-200 dark:bg-gray-800">
    <AppHeader  />
    
    <AppContent>

      <AppWidget 
        variant="compact" 
        size="xs"
        rounded="full"
        :width="1"
        :height="2"
      >
        <ECGGraph 
          :seconds="0.75" 
          :smoothing="3" 
          :amplitude="0.28"
          vertical-align="bottom"
          auto-start 
          simulation
        />
      </AppWidget>

      <AppWidget 
        variant="compact" 
        size="xs"
        rounded="full"
        :width="2"
        :height="1"
      />

      <AppWidget 
        variant="compact" 
        size="xs"
        rounded="full"
        :width="2"
        :height="2"
      />


    </AppContent>

    <AppFooter />
  </div>
</template>

